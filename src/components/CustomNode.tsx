import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Globe, 
  Server, 
  Database, 
  Cloud, 
  Shield, 
  Zap, 
  Users, 
  ShoppingCart,
  CreditCard,
  Bell,
  MapPin,
  MessageSquare,
  BarChart3,
  Lock,
  Boxes,
  HardDrive
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  MOBILE_APP: Smartphone,
  WEB_APP: Globe,
  API_GATEWAY: Shield,
  SERVICE: Server,
  DATABASE: Database,
  CACHE: Zap,
  MESSAGE_QUEUE: MessageSquare,
  CDN: Cloud,
  LOAD_BALANCER: Boxes,
  USER_SERVICE: Users,
  ORDER_SERVICE: ShoppingCart,
  PAYMENT_SERVICE: CreditCard,
  NOTIFICATION_SERVICE: Bell,
  LOCATION_SERVICE: MapPin,
  ANALYTICS_SERVICE: BarChart3,
  AUTH_SERVICE: Lock,
  STORAGE: HardDrive,
};

interface CustomNodeData {
  label: string;
  description: string;
  technology?: string;
  status?: string;
  nodeType?: string;
  style?: {
    backgroundColor: string;
    borderColor: string;
    color: string;
    width: number;
    height: number;
    borderRadius: number;
    borderWidth: number;
  };
}

const CustomNode = ({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as CustomNodeData;
  const IconComponent = iconMap[nodeData.nodeType || ''] || Server;
  const style = nodeData.style;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative group"
      style={{
        width: style?.width || 120,
        minHeight: style?.height || 80,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-primary !border-2 !border-background opacity-0 group-hover:opacity-100 transition-opacity"
      />
      
      <div
        className={`
          flex flex-col items-center justify-center p-3 
          rounded-xl transition-all duration-200
          ${selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
        `}
        style={{
          backgroundColor: style?.backgroundColor || '#1ABC9C',
          borderColor: style?.borderColor || '#1ABC9C',
          borderWidth: style?.borderWidth || 2,
          borderStyle: 'solid',
          borderRadius: style?.borderRadius || 12,
          minHeight: style?.height || 80,
        }}
      >
        <div 
          className="p-2 rounded-lg mb-2"
          style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
        >
          <IconComponent 
            size={24} 
            style={{ color: style?.color || '#FFFFFF' }}
          />
        </div>
        
        <span 
          className="text-xs font-semibold text-center leading-tight"
          style={{ color: style?.color || '#FFFFFF' }}
        >
          {nodeData.label}
        </span>
        
        {nodeData.technology && (
          <span 
            className="text-[10px] mt-1 opacity-80 text-center"
            style={{ color: style?.color || '#FFFFFF' }}
          >
            {nodeData.technology}
          </span>
        )}
      </div>

      {/* Tooltip on hover */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
        <div className="glass-panel p-3 min-w-[200px] max-w-[280px]">
          <p className="text-sm font-medium text-foreground">{nodeData.label}</p>
          <p className="text-xs text-muted-foreground mt-1">{nodeData.description}</p>
          {nodeData.technology && (
            <p className="text-xs text-primary mt-2 font-mono">{nodeData.technology}</p>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-primary !border-2 !border-background opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </motion.div>
  );
};

export default memo(CustomNode);
