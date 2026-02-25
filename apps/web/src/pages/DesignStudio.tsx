import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Boxes } from "lucide-react";
import DesignPhaseNav from "@/components/design-studio/DesignPhaseNav";
import HLDCanvas from "@/components/design-studio/HLDCanvas";
import DBDesigner from "@/components/design-studio/DBDesigner";
import LLDDesigner from "@/components/design-studio/LLDDesigner";
import UnifiedDesignPanel from "@/components/design-studio/UnifiedDesignPanel";
import ExportManager from "@/components/design-studio/ExportManager";
import LoadingState from "@/components/LoadingState";
import { useDesignContext } from "@/store/designContext";
import { useDiagramGenerator } from "@/hooks/useDiagramGenerator";
import { sampleDBSchema } from "@/data/sampleDbSchema";
import { sampleLLDDesign } from "@/data/sampleLldDesign";
import type { DesignPhase } from "@/store/designContext";

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

  const {
    data: hldHookData,
    isLoading: hldLoading,
    error: hldError,
    generate: generateHLD,
  } = useDiagramGenerator({ useMockData: true });

  const [dbLoading, setDbLoading] = useState(false);
  const [lldLoading, setLldLoading] = useState(false);
  const [pipelineError, setPipelineError] = useState<string | null>(null);
  const [pipelineStep, setPipelineStep] = useState<DesignPhase | null>(null);

  // Sync hook result into design context so navigation/export see it
  useEffect(() => {
    if (hldHookData) {
      setHLDResult(hldHookData);
    }
  }, [hldHookData, setHLDResult]);

  const effectiveHldResult = hldHookData ?? hldResult;

  const runDBStep = useCallback(
    async (prompt: string) => {
      setDbLoading(true);
      try {
        await new Promise((r) => setTimeout(r, 3500));
        setDBResult({
          ...sampleDBSchema,
          name: `Schema for: ${prompt.slice(0, 40)}…`,
          description: `Generated from: "${prompt}"`,
        });
      } catch {
        throw new Error("Failed to generate DB design");
      } finally {
        setDbLoading(false);
      }
    },
    [setDBResult],
  );

  const runLLDStep = useCallback(
    async (prompt: string) => {
      setLldLoading(true);
      try {
        await new Promise((r) => setTimeout(r, 3500));
        setLLDResult({
          ...sampleLLDDesign,
          name: `LLD: ${prompt.slice(0, 30)}…`,
          description: `Generated from: "${prompt}"`,
        });
      } catch {
        throw new Error("Failed to generate LLD");
      } finally {
        setLldLoading(false);
      }
    },
    [setLLDResult],
  );

  const onUnifiedGenerate = useCallback(
    async (prompt: string, designType: string) => {
      setPipelineError(null);
      setPipelineStep("hld");
      setCurrentPhase("hld");

      try {
        await generateHLD(prompt, designType);

        setPipelineStep("db");
        setCurrentPhase("db");
        await runDBStep(prompt);

        setPipelineStep("lld");
        setCurrentPhase("lld");
        await runLLDStep(prompt);
      } catch (err) {
        setPipelineError(
          err instanceof Error ? err.message : "Pipeline failed",
        );
      } finally {
        setPipelineStep(null);
      }
    },
    [generateHLD, runDBStep, runLLDStep, setCurrentPhase],
  );

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case "hld":
        if (hldLoading) return <LoadingState />;
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
        if (dbLoading) return <LoadingState />;
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
        if (lldLoading) return <LoadingState />;
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

  const isPipelineRunning =
    pipelineStep !== null || hldLoading || dbLoading || lldLoading;

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
      error={pipelineError ?? hldError}
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
          <ExportManager onExport={(fmt) => console.log("Export", fmt)} />
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
