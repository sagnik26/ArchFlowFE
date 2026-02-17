import { motion } from "framer-motion";
import { Layers, Database, Code2, Check } from "lucide-react";
import { useDesignContext, type DesignPhase } from "@/store/designContext";
import { cn } from "@/lib/utils";

const PHASES: { id: DesignPhase; label: string; shortLabel: string; icon: React.ElementType }[] = [
  { id: "hld", label: "High-Level Design", shortLabel: "HLD", icon: Layers },
  { id: "db", label: "Database Design", shortLabel: "DB", icon: Database },
  { id: "lld", label: "Low-Level Design", shortLabel: "LLD", icon: Code2 },
];

export default function DesignPhaseNav() {
  const { currentPhase, setCurrentPhase, canGoToPhase, hldResult, dbResult, lldResult } = useDesignContext();

  return (
    <nav className="border-b border-border/80 bg-card/60 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-0 px-4 py-3">
        {PHASES.map((phase, index) => {
          const isActive = currentPhase === phase.id;
          const isComplete =
            (phase.id === "hld" && hldResult) ||
            (phase.id === "db" && dbResult) ||
            (phase.id === "lld" && lldResult);
          const canGo = canGoToPhase(phase.id);
          const Icon = phase.icon;

          return (
            <div key={phase.id} className="flex items-center">
              <button
                type="button"
                onClick={() => canGo && setCurrentPhase(phase.id)}
                disabled={!canGo}
                className={cn(
                  "relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                  isActive && "bg-primary/15 text-primary",
                  canGo && !isActive && "text-muted-foreground hover:bg-muted hover:text-foreground",
                  !canGo && "cursor-not-allowed opacity-50"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border transition-colors",
                    isActive && "border-primary bg-primary/20 text-primary",
                    isComplete && !isActive && "border-accent bg-accent/20 text-accent",
                    !isActive && !isComplete && "border-border bg-muted/50"
                  )}
                >
                  {isComplete && !isActive ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </span>
                <span className="hidden sm:inline">{phase.label}</span>
                <span className="sm:hidden">{phase.shortLabel}</span>
              </button>
              {index < PHASES.length - 1 && (
                <div
                  className={cn(
                    "mx-1 h-px w-6 sm:w-10 rounded",
                    canGoToPhase(PHASES[index + 1].id) ? "bg-primary/40" : "bg-border"
                  )}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Progress bar */}
      <div className="h-0.5 w-full bg-border overflow-hidden">
        <motion.div
          className="h-full min-w-0 bg-gradient-to-r from-primary to-accent"
          initial={false}
          animate={{
            width: `${((PHASES.findIndex((p) => p.id === currentPhase) + 1) / PHASES.length) * 100}%`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    </nav>
  );
}
