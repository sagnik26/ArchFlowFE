import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Boxes, LayoutDashboard, Home } from "lucide-react";
import GeneratorForm from "@/components/GeneratorForm";
import DiagramCanvas from "@/components/DiagramCanvas";
import LayerLegend from "@/components/LayerLegend";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import { useDiagramGenerator } from "@/hooks/useDiagramGenerator";

const Index = () => {
  const { data, isLoading, error, generate } = useDiagramGenerator({
    useMockData: true,
  });

  const handleSubmit = (topic: string, designType: string) => {
    generate(topic, designType);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Boxes className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">HLDForge</h1>
              <p className="text-xs text-muted-foreground">
                System Design Generator
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link to="/" className="header-nav-link">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link to="/studio" className="header-nav-link">
              <LayoutDashboard className="w-4 h-4" />
              Design Studio
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content: Left input panel + Right output panel */}
      <main className="flex-1 flex flex-row min-h-0 px-4 py-6 gap-6">
        {/* Left panel - Input (same height as right panel) */}
        <aside className="w-full min-w-0 max-w-[380px] shrink-0 flex flex-col gap-4 overflow-hidden px-4 self-stretch">
          <div className="flex-1 min-h-0 flex flex-col">
            <GeneratorForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

        {/* Right panel - Output / Diagram */}
        <div className="flex-1 min-w-0 flex flex-col min-h-0 relative">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel flex-1 min-h-[400px]"
              >
                <LoadingState />
              </motion.div>
            ) : data ? (
              <motion.div
                key="diagram"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-h-[400px] flex flex-col min-h-0 overflow-hidden"
              >
                <div className="flex-1 glass-panel relative overflow-hidden min-h-0">
                  <DiagramCanvas data={data} />
                  <LayerLegend layers={data.layers} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel flex-1 min-h-[400px] relative overflow-hidden"
              >
                <EmptyState />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 mt-auto">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs text-muted-foreground">
            Powered by AI • Generate beautiful system architecture diagrams
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
