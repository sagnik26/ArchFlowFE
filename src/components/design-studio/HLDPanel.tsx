import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDesignContext } from "@/store/designContext";

const DESIGN_TYPES = [
  { value: "HLD", label: "High-Level Design (HLD)" },
  { value: "SYSTEM", label: "System Architecture" },
];

const TOPIC_SUGGESTIONS = [
  "Food delivery applications",
  "E-commerce platform",
  "Real-time chat application",
  "Online payment system",
];

interface HLDPanelProps {
  onGenerate: (topic: string, designType: string) => void;
  isLoading: boolean;
  error: string | null;
}

export default function HLDPanel({ onGenerate, isLoading, error }: HLDPanelProps) {
  const { hldPrompt, hldDesignType, setHLDPrompt, setHLDDesignType } = useDesignContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hldPrompt.trim() && hldDesignType) {
      onGenerate(hldPrompt.trim(), hldDesignType);
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
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">HLD – Initial prompt</h2>
          <p className="text-xs text-muted-foreground">Describe the system to generate architecture diagram</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hld-topic">Design topic</Label>
        <Textarea
          id="hld-topic"
          value={hldPrompt}
          onChange={(e) => setHLDPrompt(e.target.value)}
          placeholder="e.g., Food delivery applications"
          className="bg-input border-border min-h-[120px] resize-y"
          disabled={isLoading}
          rows={4}
        />
        <div className="flex flex-wrap gap-1.5">
          {TOPIC_SUGGESTIONS.slice(0, 4).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setHLDPrompt(s)}
              className="text-xs px-2 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hld-type">Design type</Label>
        <Select value={hldDesignType} onValueChange={setHLDDesignType} disabled={isLoading}>
          <SelectTrigger id="hld-type" className="bg-input border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DESIGN_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={!hldPrompt.trim() || isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {isLoading ? "Generating HLD…" : "Generate HLD"}
      </Button>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          {error}
        </p>
      )}
    </motion.form>
  );
}
