import { Request, Response } from "express";
import { z } from "zod";
import { generateStructured } from "../services/llm.js";
import { getDBSystemPrompt, getDBUserPrompt } from "../services/dbPrompts.js";
import { Design } from "../models/Design.js";
import { dbSchemaSchema } from "../validators/dbDesign.js";
import type { DBSchemaValidated } from "../validators/dbDesign.js";

const generateBodySchema = z.object({
  prompt: z.string().min(1),
  hldContext: z.string().optional(),
});

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
  const { prompt, hldContext } = parsed.data;
  try {
    const raw = await generateStructured(
      getDBSystemPrompt(hldContext),
      getDBUserPrompt(prompt)
    );
    const parsedJson = JSON.parse(raw) as unknown;
    const validated = dbSchemaSchema.safeParse(parsedJson);
    if (!validated.success) {
      res.status(502).json({
        message: "LLM response did not match expected schema",
        details: validated.error.flatten(),
      });
      return;
    }
    const result = normalizeDBSchema(validated.data);
    res.json(result);
  } catch (err) {
    console.error("DB generate error:", err);
    res.status(500).json({
      message: err instanceof Error ? err.message : "Failed to generate DB schema",
    });
  }
}

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

const saveBodySchema = z.object({
  payload: z.record(z.unknown()),
  prompt: z.string().optional(),
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
  const validated = dbSchemaSchema.safeParse(parsed.data.payload);
  if (!validated.success) {
    res.status(400).json({ message: "Payload is not a valid DBSchema", errors: validated.error.flatten() });
    return;
  }
  const doc = await Design.create({
    type: "db",
    userId: req.userId,
    payload: validated.data,
    prompt: parsed.data.prompt,
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
  const docs = await Design.find({ userId: req.userId, type: "db" })
    .sort({ createdAt: -1 })
    .limit(50)
    .select("_id payload prompt createdAt")
    .lean();
  res.json({
    designs: docs.map((d) => ({
      id: (d._id as import("mongoose").Types.ObjectId).toString(),
      payload: d.payload,
      prompt: d.prompt,
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
  const doc = await Design.findOne({ _id: id, userId: req.userId, type: "db" }).lean();
  if (!doc) {
    res.status(404).json({ message: "Design not found" });
    return;
  }
  res.json(doc.payload);
}
