import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Code2, LayoutDashboard, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LLDDesigner from "@/components/design-studio/LLDDesigner";
import LoadingState from "@/components/LoadingState";
import { sampleLLDDesign } from "@/data/sampleLldDesign";
import type { LLDDesign } from "@/types/lldDesign";

export default function LLDGen() {
  const [prompt, setPrompt] = useState("");
  const [data, setData] = useState<LLDDesign | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setError(null);
    setIsLoading(true);
    // Mock: replace with API call when backend is ready
    setTimeout(() => {
      setData({
        ...sampleLLDDesign,
        name: `LLD: ${prompt.slice(0, 30)}${prompt.length > 30 ? "…" : ""}`,
        description: `Generated from: "${prompt}"`,
      });
      setIsLoading(false);
    }, 700);
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm z-50 shrink-0">
        <div className="w-full px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Code2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">HLDForge</h1>
              <p className="text-xs text-muted-foreground">LLD Generation</p>
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

      <main className="flex-1 flex flex-row items-stretch min-h-0 overflow-hidden px-4 py-4 gap-4">
        <aside className="w-full min-w-0 max-w-[380px] shrink-0 flex flex-col min-h-0 h-full overflow-hidden">
          <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden glass-panel rounded-xl p-5">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-5"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20 shrink-0">
                  <Code2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">LLD Generation</h2>
                  <p className="text-xs text-muted-foreground">Describe classes and APIs to generate class diagrams and API spec.</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lld-prompt">LLD requirements</Label>
                <Textarea
                  id="lld-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., REST APIs for User and Order; DDD-style services; include DTOs"
                  className="bg-input border-border min-h-[120px] resize-y"
                  disabled={isLoading}
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? "Generating…" : "Generate LLD"}
              </Button>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  {error}
                </p>
              )}
            </motion.form>
          </div>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm shrink-0"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

        <div className="flex-1 min-w-0 min-h-0 flex flex-col h-full overflow-hidden">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full min-h-0 w-full glass-panel rounded-xl relative overflow-hidden">
                <LoadingState />
              </motion.div>
            ) : data ? (
              <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full min-h-0 w-full flex flex-col overflow-hidden">
                <div className="h-full min-h-0 w-full glass-panel rounded-xl relative overflow-hidden">
                  <LLDDesigner data={data} />
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full min-h-0 w-full glass-panel rounded-xl relative overflow-hidden flex flex-col items-center justify-center text-muted-foreground p-8">
                <Code2 className="w-14 h-14 mb-4 opacity-50" />
                <p className="text-sm font-medium">No LLD yet</p>
                <p className="text-xs mt-1">Enter requirements and generate in the left panel.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="border-t border-border py-3 shrink-0">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs text-muted-foreground">
            LLD Generation • Class diagrams and API design
          </p>
        </div>
      </footer>
    </div>
  );
}
