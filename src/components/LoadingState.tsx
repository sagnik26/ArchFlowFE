import { motion } from 'framer-motion';
import { Loader2, Cpu, Network, Database, Server } from 'lucide-react';

const LoadingState = () => {
  const icons = [Cpu, Network, Database, Server];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full min-h-[400px]"
    >
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 w-32 h-32 rounded-full border-2 border-primary/20"
        >
          {icons.map((Icon, index) => (
            <motion.div
              key={index}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${index * 90}deg) translateY(-50px) rotate(-${index * 90}deg)`,
              }}
            >
              <div className="p-2 rounded-lg bg-card border border-border">
                <Icon size={16} className="text-primary" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Center loader */}
        <div className="w-32 h-32 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30"
          >
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center"
      >
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Generating System Design
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Analyzing architecture patterns and creating your diagram...
        </p>
      </motion.div>

      {/* Progress indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 flex items-center gap-3"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
            className="w-2 h-2 rounded-full bg-primary"
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default LoadingState;
