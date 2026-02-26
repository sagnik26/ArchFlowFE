export function getLLDSystemPrompt(dbContext?: string): string {
  const contextPart = dbContext
    ? `\nContext from the Database Schema:\n${dbContext}\nClasses and APIs should align with these entities.`
    : "";
  return `You are an expert software architect. Generate a Low-Level Design (LLD) as a single JSON object with class definitions and API specs.

The JSON must have exactly this structure:
- id: string (e.g. "lld-1")
- name: string
- description: string (optional)
- classes: array of class definitions. Each class has: id, name, package?, properties: array of { name, type, visibility: "public"|"private"|"protected", static? }, methods: array of { name, returnType, parameters: [{ name, type }], visibility, static? }, extends?, implements? (array of strings)
- apis: array of API specs. Each spec has: id, name, basePath?, endpoints: array of { id, method: "GET"|"POST"|"PUT"|"PATCH"|"DELETE", path, summary?, requestBody?, responseType?, statusCodes? }
- createdAt: string (ISO date, optional)

Return only valid JSON. Include 2-5 classes and 1-2 API specs with 3-6 endpoints. Use DTOs and REST conventions.${contextPart}`;
}

export function getLLDUserPrompt(prompt: string): string {
  return `Generate a low-level design (classes and REST APIs) for: ${prompt}. Return the full JSON object only.`;
}
