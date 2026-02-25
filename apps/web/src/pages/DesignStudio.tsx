import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Boxes } from "lucide-react";
import DesignPhaseNav from "@/components/design-studio/DesignPhaseNav";
import HLDCanvas from "@/components/design-studio/HLDCanvas";
import DBDesigner from "@/components/design-studio/DBDesigner";
import LLDDesigner from "@/components/design-studio/LLDDesigner";
import HLDPanel from "@/components/design-studio/HLDPanel";
import DBPanel from "@/components/design-studio/DBPanel";
import LLDPanel from "@/components/design-studio/LLDPanel";
import ExportManager from "@/components/design-studio/ExportManager";
import LoadingState from "@/components/LoadingState";
import { useDesignContext } from "@/store/designContext";
import { useDiagramGenerator } from "@/hooks/useDiagramGenerator";
import { sampleDBSchema } from "@/data/sampleDbSchema";
import { sampleLLDDesign } from "@/data/sampleLldDesign";

export default function DesignStudio() {
  const {
    currentPhase,
    hldResult,
    dbResult,
    lldResult,
    setHLDResult,
    setDBResult,
    setLLDResult,
  } = useDesignContext();

  const {
    data: hldHookData,
    isLoading: hldLoading,
    error: hldError,
    generate: generateHLD,
  } = useDiagramGenerator({ useMockData: true });

  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [lldLoading, setLldLoading] = useState(false);
  const [lldError, setLldError] = useState<string | null>(null);

  // Sync hook result into design context so navigation/export see it
  useEffect(() => {
    if (hldHookData) {
      setHLDResult(hldHookData);
    }
  }, [hldHookData, setHLDResult]);

  const onHLDGenerate = useCallback(
    (topic: string, designType: string) => {
      setDbError(null);
      setLldError(null);
      generateHLD(topic, designType);
    },
    [generateHLD]
  );

  const effectiveHldResult = hldHookData ?? hldResult;

  const onDBGenerate = useCallback(async (prompt: string) => {
    setDbError(null);
    setDbLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      setDBResult({
        ...sampleDBSchema,
        name: `Schema for: ${prompt.slice(0, 40)}…`,
        description: `Generated from: "${prompt}"`,
      });
    } catch {
      setDbError("Failed to generate DB design");
    } finally {
      setDbLoading(false);
    }
  }, [setDBResult]);

  const onLLDGenerate = useCallback(async (prompt: string) => {
    setLldError(null);
    setLldLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      setLLDResult({
        ...sampleLLDDesign,
        name: `LLD: ${prompt.slice(0, 30)}…`,
        description: `Generated from: "${prompt}"`,
      });
    } catch {
      setLldError("Failed to generate LLD");
    } finally {
      setLldLoading(false);
    }
  }, [setLLDResult]);

  const renderPhaseContent = () => {
    switch (currentPhase) {
      case "hld":
        if (hldLoading) return <LoadingState />;
        if (effectiveHldResult) return <HLDCanvas data={effectiveHldResult} />;
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground p-8">
            <Boxes className="w-14 h-14 mb-4 opacity-50" />
            <p className="text-sm font-medium">No HLD diagram yet</p>
            <p className="text-xs mt-1">Enter a topic and generate HLD in the left panel.</p>
          </div>
        );
      case "db":
        if (dbLoading) return <LoadingState />;
        if (dbResult) return <DBDesigner data={dbResult} />;
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground p-8">
            <p className="text-sm font-medium">No DB schema yet</p>
            <p className="text-xs mt-1">Complete HLD first, then add DB requirements and generate.</p>
          </div>
        );
      case "lld":
        if (lldLoading) return <LoadingState />;
        if (lldResult) return <LLDDesigner data={lldResult} />;
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground p-8">
            <p className="text-sm font-medium">No LLD yet</p>
            <p className="text-xs mt-1">Complete HLD and DB Design first, then generate LLD.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const renderPhasePanel = () => {
    switch (currentPhase) {
      case "hld":
        return (
          <HLDPanel
            onGenerate={onHLDGenerate}
            isLoading={hldLoading}
            error={hldError ?? null}
          />
        );
      case "db":
        return (
          <DBPanel
            onGenerate={onDBGenerate}
            isLoading={dbLoading}
            error={dbError}
          />
        );
      case "lld":
        return (
          <LLDPanel
            onGenerate={onLLDGenerate}
            isLoading={lldLoading}
            error={lldError}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with logo + Export */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Boxes className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">HLDForge</h1>
              <p className="text-xs text-muted-foreground">HLD → DB Design → LLD</p>
            </div>
          </div>
          <ExportManager onExport={(fmt) => console.log("Export", fmt)} />
        </div>
      </header>

      <DesignPhaseNav />

      <main className="flex-1 flex flex-row min-h-0 px-4 py-6 gap-6">
        <aside className="w-full min-w-0 max-w-[380px] shrink-0 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto">{renderPhasePanel()}</div>
        </aside>

        <div className="flex-1 min-w-0 flex flex-col min-h-0 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 glass-panel relative overflow-hidden min-h-[400px]"
            >
              {renderPhaseContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="border-t border-border py-3 mt-auto">
        <p className="text-center text-xs text-muted-foreground">
          HLD context → DB Design → LLD. Backend-ready structure.
        </p>
      </footer>
    </div>
  );
}
