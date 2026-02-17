import { motion } from "framer-motion";
import DiagramCanvas from "@/components/DiagramCanvas";
import LayerLegend from "@/components/LayerLegend";
import type { DiagramResponse } from "@/types/diagram";

interface HLDCanvasProps {
  data: DiagramResponse;
}

/**
 * HLD phase: system architecture diagram (React Flow).
 * Reuses existing DiagramCanvas + LayerLegend.
 */
export default function HLDCanvas({ data }: HLDCanvasProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full flex flex-col min-h-0 relative"
    >
      <div className="flex-1 glass-panel relative overflow-hidden min-h-0">
        <DiagramCanvas data={data} />
        <LayerLegend layers={data.layers} />
      </div>
    </motion.div>
  );
}
