import { useState } from "react";
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

interface GeneratorFormProps {
  onSubmit: (topic: string, designType: string) => void;
  isLoading: boolean;
}

const DESIGN_TYPES = [
  { value: "HLD", label: "High-Level Design (HLD)" },
  { value: "LLD", label: "Low-Level Design (LLD)" },
  { value: "SYSTEM", label: "System Architecture" },
];

const TOPIC_SUGGESTIONS = [
  "Food delivery applications",
  "E-commerce platform",
  "Social media platform",
  "Video streaming service",
  "Real-time chat application",
  "Online payment system",
  "Ride-sharing application",
  "Hotel booking system",
];

const GeneratorForm = ({ onSubmit, isLoading }: GeneratorFormProps) => {
  const [topic, setTopic] = useState("");
  const [designType, setDesignType] = useState("HLD");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && designType) {
      onSubmit(topic.trim(), designType);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTopic(suggestion);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel p-5 min-w-0 max-w-full h-full flex flex-col min-h-0 box-border"
    >
      {/* Header - fixed at top */}
      <div className="flex items-center gap-3 mb-5 shrink-0">
        <div className="p-2 rounded-lg bg-primary/20 shrink-0">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground truncate">
            Generate System Design
          </h2>
          <p className="text-xs text-muted-foreground">
            Enter a topic to generate architecture diagram
          </p>
        </div>
      </div>

      {/* Form fields - flexible middle, scrolls if needed */}
      <div className="flex-1 min-h-0 flex flex-col gap-5 overflow-y-auto">
        <div className="space-y-2">
          <Label
            htmlFor="topic"
            className="text-sm font-medium text-foreground"
          >
            Design Topic
          </Label>
          <Textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Food delivery applications"
            className="bg-input border-border focus-visible:ring-primary w-full min-w-0 min-h-[140px] py-3 px-3 box-border resize-y"
            disabled={isLoading}
            rows={5}
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {TOPIC_SUGGESTIONS.slice(0, 4).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs px-2 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="designType"
            className="text-sm font-medium text-foreground"
          >
            Design Type
          </Label>
          <Select
            value={designType}
            onValueChange={setDesignType}
            disabled={isLoading}
          >
            <SelectTrigger className="bg-input border-border w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {DESIGN_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Generate button - fixed at bottom */}
      <div className="pt-4 shrink-0">
        <Button
          type="submit"
          disabled={!topic.trim() || isLoading}
          className="w-full px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium glow-primary"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles size={16} />
              Generate
            </span>
          )}
        </Button>
      </div>
    </motion.form>
  );
};

export default GeneratorForm;
