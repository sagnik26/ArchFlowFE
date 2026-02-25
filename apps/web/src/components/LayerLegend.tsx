import { motion } from 'framer-motion';
import { Layer } from '@/types/diagram';

interface LayerLegendProps {
  layers: Layer[];
}

const LayerLegend = ({ layers }: LayerLegendProps) => {
  const sortedLayers = [...layers].sort((a, b) => a.order - b.order);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-panel p-4 absolute top-4 right-4 z-10"
    >
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Layers
      </h3>
      <div className="space-y-2">
        {sortedLayers.map((layer) => (
          <div key={layer.id} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: layer.color }}
            />
            <span className="text-sm text-foreground">{layer.displayName}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default LayerLegend;
