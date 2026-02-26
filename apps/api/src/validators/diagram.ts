import { z } from "zod";

const nodeStyleSchema = z.object({
  backgroundColor: z.string(),
  borderColor: z.string(),
  borderWidth: z.number(),
  borderStyle: z.string(),
  width: z.number(),
  height: z.number(),
  borderRadius: z.number(),
  color: z.string(),
  fontSize: z.number(),
  fontWeight: z.string(),
});

const nodeDataSchema = z.object({
  label: z.string(),
  description: z.string(),
  technology: z.string().optional(),
  icon: z.string().nullable().optional(),
  instances: z.number().nullable().optional(),
  version: z.string().nullable().optional(),
  status: z.string().optional(),
});

const diagramNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({ x: z.number(), y: z.number() }),
  data: nodeDataSchema,
  style: nodeStyleSchema,
  layer: z.string(),
  draggable: z.boolean(),
  selectable: z.boolean(),
  deletable: z.boolean(),
});

const edgeStyleSchema = z.object({
  stroke: z.string(),
  strokeWidth: z.number(),
  strokeDasharray: z.string(),
  markerEnd: z.string(),
  animated: z.boolean(),
});

const edgeDataSchema = z.object({
  label: z.string(),
  description: z.string().nullable().optional(),
  protocol: z.string().optional(),
  dataFlow: z.string().optional(),
  latency: z.string().nullable().optional(),
  bandwidth: z.string().nullable().optional(),
});

const diagramEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.string(),
  data: edgeDataSchema,
  style: edgeStyleSchema,
  sourceHandle: z.string().nullable().optional(),
  targetHandle: z.string().nullable().optional(),
  animated: z.boolean(),
  deletable: z.boolean(),
  selectable: z.boolean(),
});

const layerSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string(),
  order: z.number(),
  color: z.string(),
  visible: z.boolean(),
  expanded: z.boolean(),
});

const layoutSchema = z.object({
  algorithm: z.string(),
  direction: z.string(),
  nodeSpacing: z.number(),
  levelSpacing: z.number(),
  autoLayout: z.boolean(),
});

const viewportSchema = z.object({
  x: z.number(),
  y: z.number(),
  zoom: z.number(),
});

const metadataSchema = z.object({
  successfulScrapes: z.number(),
  sourceUrlCount: z.number(),
  componentCount: z.number(),
  layerCount: z.number(),
  failedScrapes: z.number(),
  totalContentChars: z.number(),
  generatedBy: z.string(),
  diagramType: z.string(),
  relationshipCount: z.number(),
  modelUsed: z.string(),
});

export const diagramResponseSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  topic: z.string().optional(),
  createdAt: z.string().optional(),
  nodes: z.array(diagramNodeSchema).default([]),
  edges: z.array(diagramEdgeSchema).default([]),
  layout: layoutSchema.optional(),
  layers: z.array(layerSchema).default([]),
  viewport: viewportSchema.optional(),
  metadata: metadataSchema.optional(),
});

export type DiagramResponseValidated = z.infer<typeof diagramResponseSchema>;
