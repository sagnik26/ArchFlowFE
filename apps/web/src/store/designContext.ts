import { create } from "zustand";
import type { DiagramResponse } from "@/types/diagram";
import type { DBSchema } from "@/types/dbDesign";
import type { LLDDesign } from "@/types/lldDesign";

export type DesignPhase = "hld" | "db" | "lld";

export interface DesignContextState {
  // Phase navigation
  currentPhase: DesignPhase;
  setCurrentPhase: (phase: DesignPhase) => void;

  // HLD (initial prompt + result)
  hldPrompt: string;
  hldDesignType: string;
  hldResult: DiagramResponse | null;
  setHLDPrompt: (prompt: string) => void;
  setHLDDesignType: (type: string) => void;
  setHLDResult: (data: DiagramResponse | null) => void;

  // DB Design (HLD context + DB-specific prompt + result)
  dbPrompt: string;
  dbResult: DBSchema | null;
  setDBPrompt: (prompt: string) => void;
  setDBResult: (data: DBSchema | null) => void;

  // LLD (HLD + DB context + LLD-specific prompt + result)
  lldPrompt: string;
  lldResult: LLDDesign | null;
  setLLDPrompt: (prompt: string) => void;
  setLLDResult: (data: LLDDesign | null) => void;

  // Helpers
  canGoToPhase: (phase: DesignPhase) => boolean;
  resetAll: () => void;
}

const initialPhase: DesignPhase = "hld";
const initialPrompts = {
  hldPrompt: "",
  hldDesignType: "HLD",
  dbPrompt: "",
  lldPrompt: "",
};
const initialResults = {
  hldResult: null as DiagramResponse | null,
  dbResult: null as DBSchema | null,
  lldResult: null as LLDDesign | null,
};

export const useDesignContext = create<DesignContextState>((set, get) => ({
  currentPhase: initialPhase,
  setCurrentPhase: (phase) => set({ currentPhase: phase }),

  ...initialPrompts,
  ...initialResults,

  setHLDPrompt: (hldPrompt) => set({ hldPrompt }),
  setHLDDesignType: (hldDesignType) => set({ hldDesignType }),
  setHLDResult: (hldResult) => set({ hldResult }),

  setDBPrompt: (dbPrompt) => set({ dbPrompt }),
  setDBResult: (dbResult) => set({ dbResult }),

  setLLDPrompt: (lldPrompt) => set({ lldPrompt }),
  setLLDResult: (lldResult) => set({ lldResult }),

  canGoToPhase: (phase: DesignPhase) => {
    const state = get();
    switch (phase) {
      case "hld":
        return true;
      case "db":
        return !!state.hldResult;
      case "lld":
        return !!state.hldResult && !!state.dbResult;
      default:
        return false;
    }
  },

  resetAll: () =>
    set({
      currentPhase: initialPhase,
      ...initialPrompts,
      ...initialResults,
    }),
}));
