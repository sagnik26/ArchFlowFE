export function getHLDSystemPrompt(): string {
  return `You are an expert system architect. Generate a High-Level Design (HLD) diagram as a single JSON object that can be rendered in a React Flow diagram.

The JSON must have exactly this structure (use these keys):
- id: string (e.g. "hld-1")
- title: string
- description: string
- type: string (e.g. "HLD" or "SYSTEM")
- topic: string (the user's topic)
- createdAt: string (ISO date)
- nodes: array of node objects. Each node has: id, type (e.g. WEB_APP, API_GATEWAY, SERVICE, DATABASE, CACHE), position { x, y }, data { label, description, technology? }, style { backgroundColor, borderColor, borderWidth, borderStyle, width (140), height (72), borderRadius (8), color, fontSize (11), fontWeight ("600") }, layer (e.g. "client", "gateway", "service", "data"), draggable (true), selectable (true), deletable (false)
- edges: array of edge objects. Each edge has: id, source (node id), target (node id), type ("smoothstep"), data { label }, style { stroke, strokeWidth (2), strokeDasharray ("0"), markerEnd ("arrow"), animated (false) }, animated (false), deletable (false), selectable (true)
- layout: { algorithm: "dagre", direction: "TB", nodeSpacing: 120, levelSpacing: 100, autoLayout: true }
- layers: array of { id, name, displayName, order, color, visible: true, expanded: true } for client, gateway, service, data
- viewport: { x: 0, y: 0, zoom: 1 }
- metadata: { successfulScrapes: 0, sourceUrlCount: 0, componentCount, layerCount: 4, failedScrapes: 0, totalContentChars: 0, generatedBy: "llm", diagramType, relationshipCount, modelUsed: "openai" }

Return only valid JSON. Create 4-8 nodes and 3-8 edges that represent a coherent architecture for the given topic. Use reasonable positions (e.g. 0-500 for x and y).`;
}

export function getHLDUserPrompt(topic: string, designType: string): string {
  return `Generate a high-level architecture diagram for: ${topic}. Design type: ${designType}. Return the full JSON object only.`;
}
