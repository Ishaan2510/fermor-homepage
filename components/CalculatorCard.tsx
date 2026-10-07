"use client";

import { useId } from "react";
import { rangeLabel, resultView, SPECS, valueOf, type CalcId, type FieldSpec, type TabId } from "@/lib/calculators";
import { FERMOR_URL, MORE_TOOLS } from "@/lib/content";
import { groupIN, rupeesInWords } from "@/lib/format";
import { scrollToId, useCalculator } from "./CalculatorContext";

const TABS: [TabId, string][] = [
  ["emi", "EMI"],
  ["sip", "SIP"],
  ["fd", "FD"],
  ["tax", "Income Tax"],
  ["more", "More"],
];

export function CalculatorCard() {
  const { tab, selectTab } = useCalculator();
  const panelId = useId();

  return (
    <div id="calculator" className="scroll-mt-20">
      <div className="overflow-hidden rounded-md border border-ink/16 bg-card">
        <div role="tablist" aria-label="Calculators" className="no-scrollbar flex overflow-x-auto border-b border-ink/12 px-2">
          {TABS.map(([id, label]) => {
            const active = id === tab;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={panelId}
                onClick={() => selectTab(id)}
                className={`-mb-px h-[52px] flex-none cursor-pointer whitespace-nowrap border-b-2 px-3.5 text-[15px] ${
                  active ? "border-green font-semibold text-ink" : "border-transparent font-medium text-muted hover:text-ink"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div id={panelId} role="tabpanel">
          {tab === "more" ? <MoreTools /> : <CalculatorPanel calc={tab} />}
        </div>
      </div>
    </div>
  );
}

function CalculatorPanel({ calc }: { calc: CalcId }) {
  const { inputs } = useCalculator();
  const res = resultView(calc, inputs);

  return (
    <>
      <div className="flex flex-col gap-[22px] p-[clamp(20px,3vw,28px)]">
        {calc === "tax" && (
          <span className="self-start rounded-[3px] bg-tint px-[9px] py-[5px] font-mono text-xs tracking-[0.04em] text-green">
            FY 2026-27 · New regime
          </span>
        )}
        {SPECS[calc].map((spec) => (
          <Field key={spec.key} calc={calc} spec={spec} />
        ))}
      </div>

      <div className="flex flex-col gap-[18px] border-t border-ink/12 bg-mist p-[clamp(20px,3vw,28px)]" aria-live="polite">
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-medium tracking-[0.01em] text-green-soft">{res.label}</span>
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="num font-serif text-[clamp(44px,6vw,60px)] leading-[1.05] tracking-[-0.02em]">{res.value}</span>
            <span className="text-[15px] text-muted">{res.unit}</span>
          </div>
        </div>

        <dl className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] border-t border-ink/14">
          {res.stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-[3px] pr-3 pt-3">
              <dt className="text-xs text-muted">{s.label}</dt>
              <dd className="num text-lg font-medium">{s.value}</dd>
            </div>
          ))}
        </dl>

        <SplitBar a={res.split.aLabel} b={res.split.bLabel} aPct={res.split.aPct} />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <span className="max-w-[30em] text-xs leading-normal text-muted">{res.note}</span>
          <button
            type="button"
            onClick={() => scrollToId("full-math")}
            className="h-11 cursor-pointer text-sm font-semibold text-green underline decoration-green/35 underline-offset-4 hover:text-ink"
          >
            See how this is calculated ↓
          </button>
        </div>
      </div>
    </>
  );
}

function Field({ calc, spec }: { calc: CalcId; spec: FieldSpec }) {
  const { inputs, setInput } = useCalculator();
  const id = useId();
  const raw = inputs[calc][spec.key];
  const money = spec.kind === "money";
  const percent = spec.kind === "percent";

  const display = money ? (Number(raw) ? groupIN(Number(raw)) : "") : String(raw);

  function onText(e: React.ChangeEvent<HTMLInputElement>) {
    const s = e.target.value.replace(percent ? /[^0-9.]/g : /[^0-9]/g, "");
    if (s === "") return setInput(calc, spec.key, 0);
    if (percent) {
      // Keep a trailing "." so "8." can become "8.5" while typing.
      const n = parseFloat(s);
      return setInput(calc, spec.key, s.endsWith(".") ? s : Math.min(n, spec.max));
    }
    setInput(calc, spec.key, Math.min(parseInt(s, 10), spec.max));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-label">
          {spec.label}
        </label>
        {money && <span className="num text-xs text-muted">{rupeesInWords(Number(raw) || 0)}</span>}
      </div>
      <div className="flex h-12 items-center gap-1.5 rounded border border-ink/20 bg-white px-3.5 focus-within:border-green focus-within:shadow-[0_0_0_3px_rgba(30,77,55,.12)]">
        {money && <span className="text-base text-muted">₹</span>}
        <input
          id={id}
          inputMode={percent ? "decimal" : "numeric"}
          autoComplete="off"
          value={display}
          onChange={onText}
          className="num h-full min-w-0 flex-1 bg-transparent text-[17px] font-medium outline-none"
        />
        {!money && <span className="text-sm text-muted">{percent ? "%" : "years"}</span>}
      </div>
      <input
        type="range"
        min={spec.min}
        max={spec.max}
        step={spec.step}
        value={valueOf(inputs, calc, spec.key)}
        onChange={(e) => setInput(calc, spec.key, parseFloat(e.target.value))}
        aria-label={`${spec.label} slider`}
        className="m-0 h-7 w-full cursor-pointer"
      />
      <div className="num -mt-1 flex justify-between text-xs text-[#6b685e]">
        <span>{rangeLabel(spec, spec.min)}</span>
        <span>{rangeLabel(spec, spec.max)}</span>
      </div>
    </div>
  );
}

export function SplitBar({ a, b, aPct }: { a: string; b: string; aPct: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-2.5 overflow-hidden rounded-[2px] bg-sage-pale" role="img" aria-label={`${a} ${Math.round(aPct)}%, ${b} ${Math.round(100 - aPct)}%`}>
        <div className="bg-green transition-[width] duration-300" style={{ width: `${aPct}%` }} />
        <div className="flex-1 bg-sage" />
      </div>
      <div className="num flex justify-between gap-3 text-xs text-[#3b3930]">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-2 bg-green" />
          {a} {Math.round(aPct)}%
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-2 bg-sage" />
          {b} {Math.round(100 - aPct)}%
        </span>
      </div>
    </div>
  );
}

function MoreTools() {
  return (
    <div className="px-[clamp(20px,3vw,28px)] pb-5 pt-2">
      {MORE_TOOLS.map((t) => (
        <a
          key={t.name}
          href={FERMOR_URL}
          target="_blank"
          rel="noopener"
          className="flex min-h-[60px] items-center justify-between gap-4 border-b border-ink/10 py-2.5 text-ink hover:text-ink"
        >
          <span className="flex flex-col gap-0.5">
            <span className="text-base font-medium">{t.name}</span>
            <span className="text-[13px] text-muted">{t.desc}</span>
          </span>
          <span aria-hidden className="text-green">
            →
          </span>
        </a>
      ))}
    </div>
  );
}
