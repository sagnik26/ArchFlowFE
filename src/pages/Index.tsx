import { motion, AnimatePresence } from "framer-motion";
import { Boxes } from "lucide-react";
import GeneratorForm from "@/components/GeneratorForm";
import DiagramCanvas from "@/components/DiagramCanvas";
import DiagramHeader from "@/components/DiagramHeader";
import LayerLegend from "@/components/LayerLegend";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import { useDiagramGenerator } from "@/hooks/useDiagramGenerator";

const Index = () => {
  const { data, isLoading, error, generate } = useDiagramGenerator();

  const handleSubmit = (topic: string, designType: string) => {
    generate(topic, designType);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Boxes className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">ArchiGen</h1>
              <p className="text-xs text-muted-foreground">
                System Design Generator
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col">
        {/* Generator Form */}
        <GeneratorForm onSubmit={handleSubmit} isLoading={isLoading} />

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Diagram Area */}
        <div className="flex-1 mt-6 relative">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel h-[calc(100vh-320px)] min-h-[500px]"
              >
                <LoadingState />
              </motion.div>
            ) : data ? (
              <motion.div
                key="diagram"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[calc(100vh-270px)] min-h-[500px] flex flex-col"
              >
                <DiagramHeader data={data} />
                <div className="flex-1 glass-panel relative overflow-hidden">
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
                className="glass-panel h-[calc(100vh-320px)] min-h-[500px] relative overflow-hidden"
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
