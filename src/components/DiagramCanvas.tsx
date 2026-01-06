import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  Edge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import CustomNode from './CustomNode';
import { DiagramResponse } from '@/types/diagram';

interface DiagramCanvasProps {
  data: DiagramResponse;
}

const DiagramCanvas = ({ data }: DiagramCanvasProps) => {
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  // Transform nodes for react-flow
  const initialNodes: Node[] = useMemo(() => {
    return data.nodes.map((node) => ({
      id: node.id,
      type: 'custom',
      position: node.position,
      data: {
        label: node.data.label,
        description: node.data.description,
        technology: node.data.technology,
        status: node.data.status,
        nodeType: node.type,
        style: node.style,
      },
      draggable: node.draggable,
      selectable: node.selectable,
    }));
  }, [data.nodes]);

  // Transform edges for react-flow
  const initialEdges: Edge[] = useMemo(() => {
    return data.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: 'smoothstep',
      animated: edge.animated || edge.style?.animated,
      label: edge.data?.label,
      labelStyle: { 
        fill: '#94a3b8', 
        fontSize: 10,
        fontWeight: 500,
      },
      labelBgStyle: { 
        fill: 'hsl(222 47% 8%)', 
        fillOpacity: 0.9,
      },
      labelBgPadding: [6, 4] as [number, number],
      labelBgBorderRadius: 4,
      style: {
        stroke: edge.style?.stroke || '#64748b',
        strokeWidth: edge.style?.strokeWidth || 2,
        strokeDasharray: edge.style?.strokeDasharray || '0',
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: edge.style?.stroke || '#64748b',
        width: 20,
        height: 20,
      },
    }));
  }, [data.edges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onInit = useCallback(() => {
    console.log('Flow initialized');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          minZoom: 0.3,
          maxZoom: 1.5,
        }}
        defaultViewport={data.viewport}
        minZoom={0.1}
        maxZoom={2}
        attributionPosition="bottom-left"
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="hsl(222 47% 15%)"
        />
        <Controls 
          showInteractive={false}
          className="!shadow-none"
        />
        <MiniMap
          nodeColor={(node) => {
            const style = (node.data as { style?: { backgroundColor: string } })?.style;
            return style?.backgroundColor || '#1ABC9C';
          }}
          maskColor="hsl(222 47% 6% / 0.8)"
          className="!bg-card !border-border"
        />
      </ReactFlow>
    </motion.div>
  );
};

export default DiagramCanvas;
