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

  const visiblePhaseIds: DesignPhase[] = ["hld"];
  if (hldResult) visiblePhaseIds.push("db");
  if (dbResult) visiblePhaseIds.push("lld");
  const visiblePhases = PHASES.filter((p) => visiblePhaseIds.includes(p.id));

  return (
    <nav className="flex items-center gap-0.5 shrink-0" role="tablist">
      {visiblePhases.map((phase) => {
        const isActive = currentPhase === phase.id;
        const isComplete =
          (phase.id === "hld" && hldResult) ||
          (phase.id === "db" && dbResult) ||
          (phase.id === "lld" && lldResult);
        const canGo = canGoToPhase(phase.id);
        const Icon = phase.icon;

        return (
          <button
            key={phase.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => canGo && setCurrentPhase(phase.id)}
            disabled={!canGo}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              isActive && "bg-muted text-foreground",
              canGo && !isActive && "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              !canGo && "cursor-not-allowed opacity-50"
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
              {isComplete && !isActive ? (
                <Check className="h-3 w-3" />
              ) : (
                <Icon className="h-3 w-3" />
              )}
            </span>
            <span className="hidden sm:inline">{phase.label}</span>
            <span className="sm:hidden">{phase.shortLabel}</span>
          </button>
        );
      })}
    </nav>
  );
}
