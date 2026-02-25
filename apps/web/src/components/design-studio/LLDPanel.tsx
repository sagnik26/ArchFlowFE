import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDesignContext } from "@/store/designContext";

interface LLDPanelProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  error: string | null;
}

export default function LLDPanel({ onGenerate, isLoading, error }: LLDPanelProps) {
  const { lldPrompt, setLLDPrompt, hldResult, dbResult } = useDesignContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lldPrompt.trim()) {
      onGenerate(lldPrompt.trim());
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel border-gradient p-5 flex flex-col gap-5"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/20 shrink-0">
          <Code2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">LLD – Class & API design</h2>
          <p className="text-xs text-muted-foreground">HLD + DB context passed. Add LLD-specific requirements.</p>
        </div>
      </div>

      {(hldResult || dbResult) && (
        <div className="rounded-lg bg-muted/50 border border-border p-3 text-xs text-muted-foreground space-y-1">
          {hldResult && <p><span className="font-medium text-foreground">HLD: </span>{hldResult.title}</p>}
          {dbResult && <p><span className="font-medium text-foreground">DB: </span>{dbResult.name}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="lld-prompt">LLD requirements</Label>
        <Textarea
          id="lld-prompt"
          value={lldPrompt}
          onChange={(e) => setLLDPrompt(e.target.value)}
          placeholder="e.g., REST APIs for User and Order; DDD-style services; include DTOs"
          className="bg-input border-border min-h-[120px] resize-y"
          disabled={isLoading}
          rows={4}
        />
      </div>

      <Button
        type="submit"
        disabled={!lldPrompt.trim() || isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {isLoading ? "Generating LLD…" : "Generate LLD"}
      </Button>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          {error}
        </p>
      )}
    </motion.form>
  );
}
