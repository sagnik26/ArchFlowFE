import { Request, Response } from "express";
import { z } from "zod";
import { generateStructured } from "../services/llm.js";
import { getLLDSystemPrompt, getLLDUserPrompt } from "../services/lldPrompts.js";
import { Design } from "../models/Design.js";
import { lldDesignSchema } from "../validators/lldDesign.js";
import type { LLDDesignValidated } from "../validators/lldDesign.js";

const generateBodySchema = z.object({
  prompt: z.string().min(1),
  dbContext: z.string().optional(),
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
  const { prompt, dbContext, hldContext } = parsed.data;
  const context = [hldContext, dbContext].filter(Boolean).join("\n\n");
  try {
    const raw = await generateStructured(
      getLLDSystemPrompt(context || undefined),
      getLLDUserPrompt(prompt)
    );
    const parsedJson = JSON.parse(raw) as unknown;
    const validated = lldDesignSchema.safeParse(parsedJson);
    if (!validated.success) {
      res.status(502).json({
        message: "LLM response did not match expected schema",
        details: validated.error.flatten(),
      });
      return;
    }
    const result = normalizeLLDDesign(validated.data);
    res.json(result);
  } catch (err) {
    console.error("LLD generate error:", err);
    res.status(500).json({
      message: err instanceof Error ? err.message : "Failed to generate LLD",
    });
  }
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
  const validated = lldDesignSchema.safeParse(parsed.data.payload);
  if (!validated.success) {
    res.status(400).json({ message: "Payload is not a valid LLDDesign", errors: validated.error.flatten() });
    return;
  }
  const doc = await Design.create({
    type: "lld",
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
  const docs = await Design.find({ userId: req.userId, type: "lld" })
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
  const doc = await Design.findOne({ _id: id, userId: req.userId, type: "lld" }).lean();
  if (!doc) {
    res.status(404).json({ message: "Design not found" });
    return;
  }
  res.json(doc.payload);
}
