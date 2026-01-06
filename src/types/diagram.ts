export interface NodeStyle {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderStyle: string;
  width: number;
  height: number;
  borderRadius: number;
  color: string;
  fontSize: number;
  fontWeight: string;
}

export interface NodeData {
  label: string;
  description: string;
  technology?: string;
  icon?: string | null;
  instances?: number | null;
  version?: string | null;
  status?: string;
}

export interface DiagramNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
  style: NodeStyle;
  layer: string;
  draggable: boolean;
  selectable: boolean;
  deletable: boolean;
}

export interface EdgeStyle {
  stroke: string;
  strokeWidth: number;
  strokeDasharray: string;
  markerEnd: string;
  animated: boolean;
}

export interface EdgeData {
  label: string;
  description?: string | null;
  protocol?: string;
  dataFlow?: string;
  latency?: string | null;
  bandwidth?: string | null;
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  data: EdgeData;
  style: EdgeStyle;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  animated: boolean;
  deletable: boolean;
  selectable: boolean;
}

export interface Layer {
  id: string;
  name: string;
  displayName: string;
  order: number;
  color: string;
  visible: boolean;
  expanded: boolean;
}

export interface Layout {
  algorithm: string;
  direction: string;
  nodeSpacing: number;
  levelSpacing: number;
  autoLayout: boolean;
}

export interface Viewport {
  x: number;
  y: number;
  zoom: number;
}

export interface Metadata {
  successfulScrapes: number;
  sourceUrlCount: number;
  componentCount: number;
  layerCount: number;
  failedScrapes: number;
  totalContentChars: number;
  generatedBy: string;
  diagramType: string;
  relationshipCount: number;
  modelUsed: string;
}

export interface DiagramResponse {
  id: string;
  title: string;
  description: string;
  type: string;
  topic: string;
  createdAt: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  layout: Layout;
  layers: Layer[];
  viewport: Viewport;
  metadata: Metadata;
}
