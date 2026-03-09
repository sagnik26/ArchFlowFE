import { z } from "zod";

const classPropertySchema = z.object({
  name: z.string(),
  type: z.string(),
  visibility: z.enum(["public", "private", "protected"]),
  static: z.boolean().optional(),
});

const classMethodSchema = z.object({
  name: z.string(),
  returnType: z.string(),
  parameters: z.array(z.object({ name: z.string(), type: z.string() })),
  visibility: z.enum(["public", "private", "protected"]),
  static: z.boolean().optional(),
});

const classDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  package: z.string().optional(),
  properties: z.array(classPropertySchema),
  methods: z.array(classMethodSchema),
  extends: z.string().optional(),
  implements: z.array(z.string()).optional(),
});

const apiEndpointSchema = z.object({
  id: z.string(),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  path: z.string(),
  summary: z.union([z.string(), z.record(z.any())]).optional(),
  requestBody: z.union([z.string(), z.record(z.any())]).optional(),
  responseType: z.union([z.string(), z.record(z.any())]).optional(),
  statusCodes: z.union([z.string(), z.record(z.string())]).optional(),
});

const apiSpecSchema = z.object({
  id: z.string(),
  name: z.string(),
  basePath: z.string().optional(),
  endpoints: z.array(apiEndpointSchema),
});

export const lldDesignSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  classes: z.array(classDefinitionSchema).default([]),
  apis: z.array(apiSpecSchema).default([]),
  createdAt: z.string().optional(),
});

export type LLDDesignValidated = z.infer<typeof lldDesignSchema>;
