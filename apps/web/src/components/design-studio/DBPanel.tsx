import { motion } from "framer-motion";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDesignContext } from "@/store/designContext";

interface DBPanelProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
  error: string | null;
}

export default function DBPanel({ onGenerate, isLoading, error }: DBPanelProps) {
  const { dbPrompt, setDBPrompt, hldResult } = useDesignContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dbPrompt.trim()) {
      onGenerate(dbPrompt.trim());
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
        <div className="p-2 rounded-lg bg-accent/20 shrink-0">
          <Database className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">DB Design</h2>
          <p className="text-xs text-muted-foreground">HLD context is passed. Add DB-specific requirements.</p>
        </div>
      </div>

      {hldResult && (
        <div className="rounded-lg bg-muted/50 border border-border p-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">HLD context: </span>
          {hldResult.title} — {hldResult.topic}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="db-prompt">DB requirements / entities</Label>
        <Textarea
          id="db-prompt"
          value={dbPrompt}
          onChange={(e) => setDBPrompt(e.target.value)}
          placeholder="e.g., Users, Orders, Products, Payments; normalize for OLTP; include audit fields"
          className="bg-input border-border min-h-[120px] resize-y"
          disabled={isLoading}
          rows={4}
        />
      </div>

      <Button
        type="submit"
        disabled={!dbPrompt.trim() || isLoading}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        {isLoading ? "Generating DB schema…" : "Generate DB Design"}
      </Button>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          {error}
        </p>
      )}
    </motion.form>
  );
}
