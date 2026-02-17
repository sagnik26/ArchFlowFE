/**
 * Low-Level Design types: class diagrams and API design.
 * Backend can replace with real data from API.
 */

export interface ClassProperty {
  name: string;
  type: string;
  visibility: "public" | "private" | "protected";
  static?: boolean;
}

export interface ClassMethod {
  name: string;
  returnType: string;
  parameters: { name: string; type: string }[];
  visibility: "public" | "private" | "protected";
  static?: boolean;
}

export interface ClassDefinition {
  id: string;
  name: string;
  package?: string;
  properties: ClassProperty[];
  methods: ClassMethod[];
  extends?: string;
  implements?: string[];
}

export interface ApiEndpoint {
  id: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  summary?: string;
  requestBody?: string;
  responseType?: string;
  statusCodes?: string;
}

export interface ApiSpec {
  id: string;
  name: string;
  basePath?: string;
  endpoints: ApiEndpoint[];
}

export interface LLDDesign {
  id: string;
  name: string;
  description?: string;
  classes: ClassDefinition[];
  apis: ApiSpec[];
  createdAt?: string;
}
