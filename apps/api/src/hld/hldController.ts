import { Request, Response } from "express";
import { z } from "zod";
import { generateStructured } from "../services/llm.js";
import { getHLDSystemPrompt, getHLDUserPrompt } from "../services/hldPrompts.js";
import { Design } from "../models/Design.js";
import { diagramResponseSchema } from "../validators/diagram.js";
import type { DiagramResponseValidated } from "../validators/diagram.js";

const generateBodySchema = z.object({
  topic: z.string().min(1),
  type: z.string().optional().default("HLD"),
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
  const { topic, type: designType } = parsed.data;
  try {
    const raw = await generateStructured(
      getHLDSystemPrompt(),
      getHLDUserPrompt(topic, designType)
    );
    const parsedJson = JSON.parse(raw) as unknown;
    const validated = diagramResponseSchema.safeParse(parsedJson);
    if (!validated.success) {
      res.status(502).json({
        message: "LLM response did not match expected schema",
        details: validated.error.flatten(),
      });
      return;
    }
    const result = normalizeDiagramResponse(validated.data, topic, designType);
    res.json(result);
  } catch (err) {
    console.error("HLD generate error:", err);
    res.status(500).json({
      message: err instanceof Error ? err.message : "Failed to generate HLD",
    });
  }
}

export function normalizeDiagramResponse(
  data: DiagramResponseValidated,
  topic: string,
  designType: string
): DiagramResponseValidated {
  return {
    ...data,
    id: data.id || `hld-${Date.now()}`,
    topic,
    type: designType,
    title: data.title || `${topic} – ${designType}`,
    description: data.description || `Generated for "${topic}"`,
    createdAt: data.createdAt || new Date().toISOString(),
    nodes: data.nodes ?? [],
    edges: data.edges ?? [],
    layout: data.layout ?? {
      algorithm: "dagre",
      direction: "TB",
      nodeSpacing: 120,
      levelSpacing: 100,
      autoLayout: true,
    },
    layers: data.layers ?? [],
    viewport: data.viewport ?? { x: 0, y: 0, zoom: 1 },
    metadata: data.metadata ?? {
      successfulScrapes: 0,
      sourceUrlCount: 0,
      componentCount: data.nodes?.length ?? 0,
      layerCount: data.layers?.length ?? 0,
      failedScrapes: 0,
      totalContentChars: 0,
      generatedBy: "llm",
      diagramType: designType,
      relationshipCount: data.edges?.length ?? 0,
      modelUsed: "openai",
    },
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
  const validated = diagramResponseSchema.safeParse(parsed.data.payload);
  if (!validated.success) {
    res.status(400).json({ message: "Payload is not a valid DiagramResponse", errors: validated.error.flatten() });
    return;
  }
  const doc = await Design.create({
    type: "hld",
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
  const docs = await Design.find({ userId: req.userId, type: "hld" })
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
  const doc = await Design.findOne({ _id: id, userId: req.userId, type: "hld" }).lean();
  if (!doc) {
    res.status(404).json({ message: "Design not found" });
    return;
  }
  res.json(doc.payload);
}
