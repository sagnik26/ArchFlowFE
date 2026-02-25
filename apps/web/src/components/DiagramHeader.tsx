import { motion } from 'framer-motion';
import { Calendar, Layers, GitBranch, Cpu } from 'lucide-react';
import { DiagramResponse } from '@/types/diagram';
import { Badge } from '@/components/ui/badge';

interface DiagramHeaderProps {
  data: DiagramResponse;
}

const DiagramHeader = ({ data }: DiagramHeaderProps) => {
  const formattedDate = new Date(data.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel p-4 mb-4"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
              {data.type}
            </Badge>
            <Badge variant="outline" className="text-muted-foreground">
              {data.topic}
            </Badge>
          </div>
          <h1 className="text-xl font-semibold text-foreground truncate">
            {data.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {data.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Layers size={14} />
            <span>{data.metadata.componentCount} components</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <GitBranch size={14} />
            <span>{data.metadata.relationshipCount} connections</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Cpu size={14} />
            <span className="font-mono text-xs">{data.metadata.modelUsed}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DiagramHeader;
