"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { DEFAULT_INPUTS, type CalcId, type Inputs, type TabId } from "@/lib/calculators";

interface CalculatorState {
  tab: TabId;
  /** The calculator the "full math" section explains. Stays put while "More" is open. */
  activeCalc: CalcId;
  inputs: Inputs;
  selectTab: (tab: TabId) => void;
  setInput: (calc: CalcId, key: string, value: number | string) => void;
  /** Select a calculator and bring the hero card into view (used by nav, search, goals). */
  openCalculator: (calc: CalcId) => void;
}

const Ctx = createContext<CalculatorState | null>(null);

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [tab, setTab] = useState<TabId>("emi");
  const [activeCalc, setActiveCalc] = useState<CalcId>("emi");
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);

  const selectTab = useCallback((next: TabId) => {
    setTab(next);
    if (next !== "more") setActiveCalc(next);
  }, []);

  const setInput = useCallback((calc: CalcId, key: string, value: number | string) => {
    setInputs((prev) => ({ ...prev, [calc]: { ...prev[calc], [key]: value } }));
  }, []);

  const openCalculator = useCallback(
    (calc: CalcId) => {
      selectTab(calc);
      requestAnimationFrame(() => scrollToId("calculator"));
    },
    [selectTab],
  );

  const value = useMemo(
    () => ({ tab, activeCalc, inputs, selectTab, setInput, openCalculator }),
    [tab, activeCalc, inputs, selectTab, setInput, openCalculator],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCalculator() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCalculator must be used inside CalculatorProvider");
  return ctx;
}
