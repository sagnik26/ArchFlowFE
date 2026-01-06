import { motion } from 'framer-motion';
import { Boxes, ArrowRight } from 'lucide-react';

const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 blur-3xl bg-primary/10 rounded-full" />
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-card to-secondary border border-border">
          <Boxes className="w-12 h-12 text-primary" />
        </div>
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-semibold text-foreground mb-2"
      >
        No Diagram Generated Yet
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-muted-foreground max-w-md mb-6"
      >
        Enter a topic above and select the design type to generate a beautiful
        system architecture diagram.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-2 text-sm text-primary"
      >
        <span>Get started by filling the form above</span>
        <ArrowRight size={16} />
      </motion.div>

      {/* Decorative grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>
    </motion.div>
  );
};

export default EmptyState;
