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
import type { DesignPhase } from "@/store/designContext";

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

const STEP_LABELS: Record<DesignPhase, string> = {
  hld: "HLD Design",
  db: "DB Design",
  lld: "LLD Design",
};

interface UnifiedDesignPanelProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  designType: string;
  onDesignTypeChange: (value: string) => void;
  onGenerate: (prompt: string, designType: string) => void;
  isPipelineRunning: boolean;
  currentStep: DesignPhase | null;
  loadingPhases?: DesignPhase[];
  error: string | null;
}

export default function UnifiedDesignPanel({
  prompt,
  onPromptChange,
  designType,
  onDesignTypeChange,
  onGenerate,
  isPipelineRunning,
  currentStep,
  loadingPhases = [],
  error,
}: UnifiedDesignPanelProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && designType) {
      onGenerate(prompt.trim(), designType);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-5"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">New design</h2>
          <p className="text-xs text-muted-foreground">
            One prompt → HLD, DB, LLD
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="unified-prompt"
          className="text-xs font-medium text-muted-foreground"
        >
          Describe your system
        </Label>
        <Textarea
          id="unified-prompt"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="e.g., Food delivery with orders, restaurants, payments"
          className="min-h-[100px] resize-y rounded-xl border-border/60 bg-background/50 text-sm placeholder:text-muted-foreground/60"
          disabled={isPipelineRunning}
          rows={4}
        />
        <div className="flex flex-wrap gap-1.5">
          {TOPIC_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onPromptChange(s)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-border/40 bg-background/30 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              disabled={isPipelineRunning}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="design-type"
          className="text-xs font-medium text-muted-foreground"
        >
          Design type
        </Label>
        <Select
          value={designType}
          onValueChange={onDesignTypeChange}
          disabled={isPipelineRunning}
        >
          <SelectTrigger
            id="design-type"
            className="rounded-xl border-border/60 bg-background/50"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DESIGN_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isPipelineRunning && (loadingPhases.length > 0 || currentStep) && (
        <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5 text-sm text-primary">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          {loadingPhases.length > 0
            ? `Generating ${loadingPhases.map((p) => STEP_LABELS[p]).join(", ")}…`
            : currentStep
              ? `${STEP_LABELS[currentStep]}…`
              : "Generating…"}
        </div>
      )}

      <Button
        type="submit"
        disabled={!prompt.trim() || isPipelineRunning}
        className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/20"
      >
        {isPipelineRunning ? "Generating" : "Generate full design"}
      </Button>

      {error && (
        <p className="text-sm text-destructive rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5">
          {error}
        </p>
      )}
    </motion.form>
  );
}
