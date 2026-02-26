import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Boxes } from "lucide-react";
import DesignPhaseNav from "@/components/design-studio/DesignPhaseNav";
import HLDCanvas from "@/components/design-studio/HLDCanvas";
import DBDesigner from "@/components/design-studio/DBDesigner";
import LLDDesigner from "@/components/design-studio/LLDDesigner";
import UnifiedDesignPanel from "@/components/design-studio/UnifiedDesignPanel";
import ExportManager from "@/components/design-studio/ExportManager";
import LoadingState from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { useDesignContext } from "@/store/designContext";
import { useAuth } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";
import type { DesignPhase } from "@/store/designContext";
import type { DiagramResponse } from "@/types/diagram";
import type { DBSchema } from "@/types/dbDesign";
import type { LLDDesign } from "@/types/lldDesign";
import { toast } from "sonner";

export default function DesignStudio() {
  const {
    currentPhase,
    setCurrentPhase,
    hldResult,
    dbResult,
    lldResult,
    setHLDResult,
    setDBResult,
    setLLDResult,
    hldPrompt,
    hldDesignType,
    setHLDPrompt,
    setHLDDesignType,
  } = useDesignContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pipelineError, setPipelineError] = useState<string | null>(null);
  const [pipelineStep, setPipelineStep] = useState<DesignPhase | null>(null);
  const [saving, setSaving] = useState(false);

  const effectiveHldResult = hldResult;

  const onUnifiedGenerate = useCallback(
    async (prompt: string, designType: string) => {
      if (!user) {
        setPipelineError("Please log in to generate designs.");
        return;
      }
      setPipelineError(null);
      setPipelineStep("hld");
      setCurrentPhase("hld");
      try {
        const res = await fetchApi("/api/v1/design-studio/generate", {
          method: "POST",
          body: JSON.stringify({ prompt, designType }),
        });
        if (res.status === 401) {
          setPipelineError("Please log in to generate designs.");
          navigate("/login");
          return;
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Generation failed");
        }
        const data = (await res.json()) as {
          hld: DiagramResponse;
          db: DBSchema;
          lld: LLDDesign;
        };
        setHLDResult(data.hld);
        setDBResult(data.db);
        setLLDResult(data.lld);
        setCurrentPhase("lld");
      } catch (err) {
        setPipelineError(
          err instanceof Error ? err.message : "Pipeline failed",
        );
      } finally {
        setPipelineStep(null);
      }
    },
    [
      user,
      setCurrentPhase,
      setHLDResult,
      setDBResult,
      setLLDResult,
      navigate,
    ],
  );

  const onSave = useCallback(async () => {
    if (!user) {
      toast.error("Please log in to save.");
      navigate("/login");
      return;
    }
    if (!hldResult || !dbResult || !lldResult) {
      toast.error("Generate a design first.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetchApi("/api/v1/design-studio/save", {
        method: "POST",
        body: JSON.stringify({ hld: hldResult, db: dbResult, lld: lldResult }),
      });
      if (res.status === 401) {
        toast.error("Please log in to save.");
        navigate("/login");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Save failed");
      }
      toast.success("Design saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }, [user, hldResult, dbResult, lldResult, navigate]);

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case "hld":
        if (pipelineStep === "hld") return <LoadingState />;
        if (effectiveHldResult) return <HLDCanvas data={effectiveHldResult} />;
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted/40 mb-4">
              <Boxes className="w-7 h-7 opacity-70" />
            </div>
            <p className="text-sm font-medium text-foreground">
              No HLD diagram yet
            </p>
            <p className="text-xs mt-1">Generate from the sidebar.</p>
          </div>
        );
      case "db":
        if (pipelineStep === "db") return <LoadingState />;
        if (dbResult) return <DBDesigner data={dbResult} />;
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted/40 mb-4">
              <Boxes className="w-7 h-7 opacity-70" />
            </div>
            <p className="text-sm font-medium text-foreground">
              No DB schema yet
            </p>
            <p className="text-xs mt-1">Complete HLD first.</p>
          </div>
        );
      case "lld":
        if (pipelineStep === "lld") return <LoadingState />;
        if (lldResult) return <LLDDesigner data={lldResult} />;
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted/40 mb-4">
              <Boxes className="w-7 h-7 opacity-70" />
            </div>
            <p className="text-sm font-medium text-foreground">No LLD yet</p>
            <p className="text-xs mt-1">Complete HLD and DB Design first.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const isPipelineRunning = pipelineStep !== null;

  const hasGenerationStarted =
    isPipelineRunning || !!effectiveHldResult || !!dbResult || !!lldResult;

  const renderPhasePanel = () => (
    <UnifiedDesignPanel
      prompt={hldPrompt}
      onPromptChange={setHLDPrompt}
      designType={hldDesignType}
      onDesignTypeChange={setHLDDesignType}
      onGenerate={onUnifiedGenerate}
      isPipelineRunning={isPipelineRunning}
      currentStep={pipelineStep}
      error={pipelineError}
    />
  );

  return (
    <div className="min-h-screen design-studio-bg flex flex-col">
      {/* Compact header – more space for canvas */}
      <header className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="w-full px-5 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-md shadow-primary/15">
              <Boxes className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-base font-semibold text-foreground tracking-tight">
                Design Studio
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  disabled={saving || !hldResult || !dbResult || !lldResult}
                  onClick={onSave}
                >
                  {saving ? "Saving…" : "Save"}
                </Button>
                <ExportManager onExport={(fmt) => console.log("Export", fmt)} />
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => navigate("/login")}
              >
                Log in
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-row min-h-0 gap-5 px-5 py-4">
        {/* Left sidebar – single card */}
        <aside className="w-[340px] shrink-0 flex flex-col overflow-hidden">
          <div className="design-studio-sidebar-card flex-1 min-h-0 overflow-y-auto p-5">
            {renderPhasePanel()}
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 min-w-0 flex flex-col min-h-0 gap-2">
          {hasGenerationStarted && <DesignPhaseNav />}

          {!hasGenerationStarted ? (
            <div className="flex-1 design-studio-card flex flex-col items-center justify-center min-h-[420px] text-center px-10 py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 border border-border/40 mb-6">
                <Boxes className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Start by giving a prompt
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
                Describe your system in the sidebar and click Generate. We’ll
                create your High-Level Design, Database schema, and Low-Level
                Design in one go.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhase}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 design-studio-card relative overflow-hidden min-h-[420px]"
              >
                {renderPhaseContent()}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
