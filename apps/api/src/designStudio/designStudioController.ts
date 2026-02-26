import { Request, Response } from "express";
import { z } from "zod";
import { generateStructured } from "../services/llm.js";
import {
  getHLDSystemPrompt,
  getHLDUserPrompt,
} from "../services/hldPrompts.js";
import { getDBSystemPrompt, getDBUserPrompt } from "../services/dbPrompts.js";
import { getLLDSystemPrompt, getLLDUserPrompt } from "../services/lldPrompts.js";
import { Design } from "../models/Design.js";
import { diagramResponseSchema } from "../validators/diagram.js";
import type { DiagramResponseValidated } from "../validators/diagram.js";
import { dbSchemaSchema } from "../validators/dbDesign.js";
import type { DBSchemaValidated } from "../validators/dbDesign.js";
import { lldDesignSchema } from "../validators/lldDesign.js";
import type { LLDDesignValidated } from "../validators/lldDesign.js";
import { normalizeDiagramResponse } from "../hld/hldController.js";

const generateBodySchema = z.object({
  prompt: z.string().min(1),
  designType: z.string().optional().default("HLD"),
});

function normalizeDBSchema(data: DBSchemaValidated): DBSchemaValidated {
  return {
    ...data,
    id: data.id || `db-${Date.now()}`,
    name: data.name || "Generated Schema",
    createdAt: data.createdAt ?? new Date().toISOString(),
    entities: data.entities ?? [],
    relationships: data.relationships ?? [],
  };
}

function normalizeLLDDesign(data: LLDDesignValidated): LLDDesignValidated {
  return {
    ...data,
    id: data.id || `lld-${Date.now()}`,
    name: data.name || "Generated LLD",
    createdAt: data.createdAt ?? new Date().toISOString(),
    classes: data.classes ?? [],
    apis: data.apis ?? [],
  };
}

function hldToContextString(hld: DiagramResponseValidated): string {
  const parts = [`Title: ${hld.title}`, `Topic: ${hld.topic}`];
  if (hld.nodes?.length) {
    parts.push("Components: " + hld.nodes.map((n) => n.data?.label || n.id).join(", "));
  }
  return parts.join("\n");
}

function dbToContextString(db: DBSchemaValidated): string {
  const parts = [`Schema: ${db.name}`];
  if (db.entities?.length) {
    parts.push("Entities: " + db.entities.map((e) => e.displayName || e.name).join(", "));
  }
  return parts.join("\n");
}

export async function generate(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }
  const parsed = generateBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
    return;
  }
  const { prompt, designType } = parsed.data;
  const topic = prompt;
  try {
    const rawHld = await generateStructured(
      getHLDSystemPrompt(),
      getHLDUserPrompt(topic, designType)
    );
    const hldParsed = diagramResponseSchema.safeParse(JSON.parse(rawHld) as unknown);
    if (!hldParsed.success) {
      res.status(502).json({
        message: "HLD generation failed: invalid schema",
        details: hldParsed.error.flatten(),
      });
      return;
    }
    const hld = normalizeDiagramResponse(hldParsed.data, topic, designType);
    const hldContext = hldToContextString(hld);

    const rawDb = await generateStructured(
      getDBSystemPrompt(hldContext),
      getDBUserPrompt(prompt)
    );
    const dbParsed = dbSchemaSchema.safeParse(JSON.parse(rawDb) as unknown);
    if (!dbParsed.success) {
      res.status(502).json({
        message: "DB generation failed: invalid schema",
        details: dbParsed.error.flatten(),
      });
      return;
    }
    const db = normalizeDBSchema(dbParsed.data);
    const dbContext = dbToContextString(db);

    const rawLld = await generateStructured(
      getLLDSystemPrompt(dbContext),
      getLLDUserPrompt(prompt)
    );
    const lldParsed = lldDesignSchema.safeParse(JSON.parse(rawLld) as unknown);
    if (!lldParsed.success) {
      res.status(502).json({
        message: "LLD generation failed: invalid schema",
        details: lldParsed.error.flatten(),
      });
      return;
    }
    const lld = normalizeLLDDesign(lldParsed.data);

    res.json({ hld, db, lld });
  } catch (err) {
    console.error("Design Studio generate error:", err);
    res.status(500).json({
      message: err instanceof Error ? err.message : "Design Studio generation failed",
    });
  }
}

const saveBodySchema = z.object({
  hld: z.record(z.unknown()),
  db: z.record(z.unknown()),
  lld: z.record(z.unknown()),
});

export async function save(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }
  const parsed = saveBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
    return;
  }
  const hldValidated = diagramResponseSchema.safeParse(parsed.data.hld);
  const dbValidated = dbSchemaSchema.safeParse(parsed.data.db);
  const lldValidated = lldDesignSchema.safeParse(parsed.data.lld);
  if (!hldValidated.success || !dbValidated.success || !lldValidated.success) {
    res.status(400).json({
      message: "One or more payloads (hld, db, lld) are invalid",
      hld: hldValidated.success ? null : hldValidated.error.flatten(),
      db: dbValidated.success ? null : dbValidated.error.flatten(),
      lld: lldValidated.success ? null : lldValidated.error.flatten(),
    });
    return;
  }
  const doc = await Design.create({
    type: "design_studio",
    userId: req.userId,
    payload: {
      hld: hldValidated.data,
      db: dbValidated.data,
      lld: lldValidated.data,
    },
  });
  res.status(201).json({
    id: (doc._id as import("mongoose").Types.ObjectId).toString(),
    createdAt: doc.createdAt,
  });
}

export async function list(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }
  const docs = await Design.find({ userId: req.userId, type: "design_studio" })
    .sort({ createdAt: -1 })
    .limit(50)
    .select("_id payload createdAt")
    .lean();
  res.json({
    designs: docs.map((d) => ({
      id: (d._id as import("mongoose").Types.ObjectId).toString(),
      payload: d.payload,
      createdAt: d.createdAt,
    })),
  });
}

export async function getById(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }
  const { id } = req.params;
  const doc = await Design.findOne({
    _id: id,
    userId: req.userId,
    type: "design_studio",
  }).lean();
  if (!doc) {
    res.status(404).json({ message: "Design not found" });
    return;
  }
  res.json(doc.payload);
}
