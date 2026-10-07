"use client";

import { useEffect, useState } from "react";
import { mathView, type Formula } from "@/lib/calculators";
import { useCalculator } from "./CalculatorContext";

const INITIAL_ROWS = 5;

export function MathSection() {
  const { activeCalc, inputs } = useCalculator();
  const m = mathView(activeCalc, inputs);
  const [showAll, setShowAll] = useState(false);

  // Collapse the table again whenever the user switches calculator.
  useEffect(() => setShowAll(false), [activeCalc]);

  const collapsible = activeCalc !== "tax" && m.table.rows.length > INITIAL_ROWS;
  const rows = collapsible && !showAll ? m.table.rows.slice(0, INITIAL_ROWS) : m.table.rows;
  const hasBar = Boolean(m.table.legend);
  const resultNum = m.steps.length + (m.formula ? 2 : 1);

  return (
    <section id="full-math" aria-labelledby="full-math-title" className="scroll-mt-16 border-t border-ink/14 bg-card">
      <div className="wrap py-[clamp(56px,8vw,104px)]">
        <div className="mb-[clamp(36px,5vw,56px)] flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
          <div className="flex max-w-[640px] flex-col gap-3.5">
            <span className="eyebrow">{m.label}</span>
            <h2 id="full-math-title" className="m-0 text-balance font-serif text-[clamp(34px,4.4vw,56px)] font-normal leading-[1.05] tracking-[-0.02em]">
              Show the full math, not just the answer
            </h2>
          </div>
          <p className="m-0 max-w-[24em] text-[15px] leading-[1.55] text-body">
            Worked live from the calculator above: <strong className="num font-semibold text-ink">{m.summary}</strong>. Change any input
            and every step updates.
          </p>
        </div>

        <div className="grid items-start gap-[clamp(40px,5vw,72px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr))]">
          <ol className="m-0 flex list-none flex-col border-t border-ink p-0">
            {m.steps.map((st, i) => (
              <Step key={st.title} num={i + 1}>
                <span className="text-[15px] font-semibold">{st.title}</span>
                <span className="text-sm leading-normal text-muted">
                  {st.symbol && <i className="font-serif text-[17px] text-ink">{st.symbol}</i>} {st.rule}
                </span>
                <span className="num text-[17px]">
                  {st.work}
                  <strong className="font-semibold">{st.result}</strong>
                </span>
              </Step>
            ))}

            {m.formula && (
              <Step num={m.steps.length + 1} gap="gap-4">
                <span className="text-[15px] font-semibold">{m.formula.title}</span>
                <div className="flex items-center gap-3.5 overflow-x-auto whitespace-nowrap rounded border border-ink/10 bg-paper px-5 py-[18px] font-serif text-[clamp(22px,2.4vw,28px)]">
                  <FormulaDisplay kind={m.formula.kind} />
                </div>
                <dl className="num m-0 grid grid-cols-[28px_1fr_auto] gap-x-2.5 gap-y-2 text-sm">
                  {m.formula.legend.map((l) => (
                    <div key={l.symbol} className="contents">
                      <dt className="font-serif text-[17px] italic">{l.symbol}</dt>
                      <dd className="m-0 text-muted">{l.desc}</dd>
                      <dd className="m-0 text-right font-medium">{l.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="num flex flex-col gap-1.5 border-t border-dashed border-ink/18 pt-2.5 text-[15px] leading-normal text-label [overflow-wrap:anywhere]">
                  <span>
                    {m.formula.substitution.base}
                    <sup className="text-[0.7em]">{m.formula.substitution.power}</sup> = <strong className="font-semibold">{m.formula.substitution.result}</strong>
                  </span>
                  <span>{m.formula.expanded}</span>
                </div>
              </Step>
            )}

            <Step num={resultNum}>
              <span className="text-[15px] font-semibold">{m.result.title}</span>
              <span className="num font-serif text-[44px] leading-[1.05] tracking-[-0.02em]">
                {m.result.value}
                <span className="font-sans text-[15px] tracking-normal text-muted"> {m.result.unit}</span>
              </span>
              <span className="num text-[15px] leading-[1.55] text-body">
                {m.result.sentence[0]}
                <strong className="font-semibold text-ink">{m.result.sentence[1]}</strong>
                {m.result.sentence[2]}
                <strong className="font-semibold text-ink">{m.result.sentence[3]}</strong>
                {m.result.sentence[4]}
              </span>
              <span className="text-[13px] leading-normal text-muted">{m.result.note}</span>
            </Step>
          </ol>

          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="m-0 text-[15px] font-semibold">{m.table.title}</h3>
              {m.table.legend && (
                <span className="flex gap-3.5 text-xs text-[#3b3930]">
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden className="size-2 bg-green" />
                    {m.table.legend[0]}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden className="size-2 bg-sage" />
                    {m.table.legend[1]}
                  </span>
                </span>
              )}
            </div>

            <div className="overflow-x-auto border-t border-ink">
              <table className="num w-full min-w-[420px] border-collapse text-sm">
                <thead>
                  <tr className="text-right text-xs text-muted">
                    <th className="py-3 pr-2 text-left font-medium">{m.table.head[0]}</th>
                    {hasBar && <th className="w-[22%] px-2 py-3 text-left font-medium">Split</th>}
                    {m.table.head.slice(1).map((h) => (
                      <th key={h} className="py-3 pl-3 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.cells[0]} className={`border-t border-ink/10 text-right ${row.dim ? "text-faint" : "text-ink"}`}>
                      <td className="whitespace-nowrap py-[13px] pr-2 text-left font-medium">{row.cells[0]}</td>
                      {hasBar && (
                        <td className="px-2 py-[13px]">
                          <div className="flex h-1.5 overflow-hidden rounded-[1px] bg-sage">
                            <div className="bg-green" style={{ width: `${row.barPct}%` }} />
                          </div>
                        </td>
                      )}
                      {row.cells.slice(1).map((c, i) => (
                        <td key={i} className="whitespace-nowrap py-[13px] pl-3">
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-ink text-right font-semibold">
                    <td className="py-[13px] pr-2 text-left">{m.table.foot[0]}</td>
                    {hasBar && <td />}
                    {m.table.foot.slice(1).map((c, i) => (
                      <td key={i} className="whitespace-nowrap py-[13px] pl-3">
                        {c}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>

            {collapsible && (
              <button
                type="button"
                aria-expanded={showAll}
                onClick={() => setShowAll((s) => !s)}
                className="h-11 cursor-pointer self-start rounded border border-ink/25 px-4 text-sm font-medium hover:bg-paper"
              >
                {showAll ? "Show fewer years" : `Show all ${m.table.rows.length} years`}
              </button>
            )}
            <p className="mb-0 mt-2 text-[13px] leading-normal text-muted">
              Every calculator&apos;s math runs entirely in your browser. The numbers you type in are never sent to our servers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({ num, gap = "gap-2", children }: { num: number; gap?: string; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[44px_1fr] gap-4 border-b border-ink/14 py-[22px]">
      <span className="font-serif text-[22px] text-green">{num}</span>
      <div className={`flex min-w-0 flex-col ${gap}`}>{children}</div>
    </li>
  );
}

function Fraction({ top, bottom, small = false }: { top: React.ReactNode; bottom: React.ReactNode; small?: boolean }) {
  return (
    <span className={`inline-flex flex-col items-center ${small ? "text-[0.72em] leading-[1.15]" : ""}`}>
      <span className={small ? "px-1 pb-[3px]" : "px-1.5 pb-1.5"}>{top}</span>
      <span aria-hidden className="h-px self-stretch bg-ink" />
      <span className={small ? "px-1 pt-[3px]" : "px-1.5 pt-1.5"}>{bottom}</span>
    </span>
  );
}

const Sup = ({ children }: { children: React.ReactNode }) => <sup className="text-[0.6em]">{children}</sup>;

function FormulaDisplay({ kind }: { kind: Formula }) {
  if (kind === "emi") {
    return (
      <span role="math" aria-label="EMI equals P times r times (1 plus r) to the power n, divided by (1 plus r) to the power n minus 1" className="flex items-center gap-3.5">
        <i>EMI</i>
        <span>=</span>
        <Fraction
          top={<><i>P</i> × <i>r</i> × (1 + <i>r</i>)<Sup><i>n</i></Sup></>}
          bottom={<>(1 + <i>r</i>)<Sup><i>n</i></Sup> − 1</>}
        />
      </span>
    );
  }
  if (kind === "sip") {
    return (
      <span role="math" aria-label="FV equals P times ((1 plus i) to the power n minus 1) divided by i, times (1 plus i)" className="flex items-center gap-3.5">
        <i>FV</i>
        <span>=</span>
        <i>P</i>
        <span>×</span>
        <Fraction top={<>(1 + <i>i</i>)<Sup><i>n</i></Sup> − 1</>} bottom={<i>i</i>} />
        <span>×</span>
        <span>(1 + <i>i</i>)</span>
      </span>
    );
  }
  return (
    <span role="math" aria-label="A equals P times (1 plus r over 400) to the power 4t" className="flex items-center gap-3.5">
      <i>A</i>
      <span>=</span>
      <i>P</i>
      <span>×</span>
      <span className="inline-flex items-center gap-1">
        (1 + <Fraction small top={<i>r</i>} bottom="400" />)
        <sup className="self-start text-[0.6em]">4<i>t</i></sup>
      </span>
    </span>
  );
}
