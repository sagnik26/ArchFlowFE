export function getDBSystemPrompt(hldContext?: string): string {
  const contextPart = hldContext
    ? `\nContext from the High-Level Design:\n${hldContext}\nThe database should support this system.`
    : "";
  return `You are an expert database architect. Generate an ER-style database schema as a single JSON object.

The JSON must have exactly this structure:
- id: string (e.g. "db-1")
- name: string
- description: string (optional)
- entities: array of entity objects. Each entity has: id (snake_case), name (table name), displayName (human name), attributes: array of { name, type (e.g. UUID, VARCHAR(255), INTEGER, TIMESTAMP, DECIMAL(10,2)), primaryKey?, nullable?, defaultValue? }
- relationships: array of { id, sourceEntityId, targetEntityId, type: "one-to-one" | "one-to-many" | "many-to-many", sourceCardinality?, targetCardinality? }
- createdAt: string (ISO date, optional)

Return only valid JSON. Normalize for OLTP; include audit fields (created_at, updated_at) where appropriate. Use 3-8 entities.${contextPart}`;
}

export function getDBUserPrompt(prompt: string): string {
  return `Generate a database schema for: ${prompt}. Return the full JSON object only.`;
}
