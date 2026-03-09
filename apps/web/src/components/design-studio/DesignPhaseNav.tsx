import { Layers, Database, Code2, Check, Loader2 } from "lucide-react";
import { useDesignContext, type DesignPhase } from "@/store/designContext";
import { cn } from "@/lib/utils";

const PHASES: { id: DesignPhase; label: string; shortLabel: string; icon: React.ElementType }[] = [
  { id: "hld", label: "High-Level Design", shortLabel: "HLD", icon: Layers },
  { id: "db", label: "Database Design", shortLabel: "DB", icon: Database },
  { id: "lld", label: "Low-Level Design", shortLabel: "LLD", icon: Code2 },
];

interface DesignPhaseNavProps {
  loadingPhases?: DesignPhase[];
}

export default function DesignPhaseNav({ loadingPhases = [] }: DesignPhaseNavProps) {
  const { currentPhase, setCurrentPhase, hldResult, dbResult, lldResult } = useDesignContext();

  return (
    <nav className="flex items-center gap-0.5 shrink-0" role="tablist">
      {PHASES.map((phase) => {
        const isActive = currentPhase === phase.id;
        const isComplete =
          (phase.id === "hld" && hldResult) ||
          (phase.id === "db" && dbResult) ||
          (phase.id === "lld" && lldResult);
        const isLoading = loadingPhases.includes(phase.id);
        const Icon = phase.icon;

        return (
          <button
            key={phase.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-busy={isLoading}
            onClick={() => setCurrentPhase(phase.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              isActive && "bg-muted text-foreground",
              !isActive && "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors",
                isActive && "bg-primary/20 text-primary",
                isComplete && !isActive && "bg-accent/20 text-accent",
                !isActive && !isComplete && "text-muted-foreground"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : isComplete && !isActive ? (
                <Check className="h-3 w-3" />
              ) : (
                <Icon className="h-3 w-3" />
              )}
            </span>
            <span className="hidden sm:inline">{phase.label}</span>
            <span className="sm:hidden">{phase.shortLabel}</span>
            {isLoading && (
              <span className="text-muted-foreground font-normal">Generating…</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
