import { z } from "zod";

const entityAttributeSchema = z.object({
  name: z.string(),
  type: z.string(),
  primaryKey: z.boolean().optional(),
  nullable: z.boolean().optional(),
  defaultValue: z.string().nullable().optional(),
});

const entitySchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string(),
  attributes: z.array(entityAttributeSchema),
  x: z.number().optional(),
  y: z.number().optional(),
});

const relationshipSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  sourceEntityId: z.string(),
  targetEntityId: z.string(),
  type: z.enum(["one-to-one", "one-to-many", "many-to-many"]),
  sourceCardinality: z.string().optional(),
  targetCardinality: z.string().optional(),
});

export const dbSchemaSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  entities: z.array(entitySchema).default([]),
  relationships: z.array(relationshipSchema).default([]),
  createdAt: z.string().optional(),
});

export type DBSchemaValidated = z.infer<typeof dbSchemaSchema>;
