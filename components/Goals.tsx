"use client";

import { useState } from "react";
import { FERMOR_URL, GOALS, type ToolLink } from "@/lib/content";
import { useCalculator } from "./CalculatorContext";

export function Goals() {
  const [index, setIndex] = useState(0);
  const goal = GOALS[index];

  return (
    <section id="goals" aria-labelledby="goals-title" className="scroll-mt-16 border-t border-ink/14">
      <div className="wrap py-[clamp(56px,8vw,104px)]">
        <div className="mb-[clamp(32px,5vw,56px)] flex max-w-[640px] flex-col gap-3.5">
          <h2 id="goals-title" className="m-0 font-serif text-[clamp(34px,4.4vw,56px)] font-normal leading-[1.05] tracking-[-0.02em]">
            What are you planning?
          </h2>
          <p className="m-0 text-pretty text-[17px] leading-[1.55] text-body">
            Pick a goal and Fermor runs the math, compares your options, and shows you the clear next step.
          </p>
        </div>

        {/* Mobile: horizontally scrolling chips */}
        <div
          role="tablist"
          aria-label="Goals"
          className="no-scrollbar -mx-[clamp(20px,4vw,48px)] mb-6 flex gap-2 overflow-x-auto px-[clamp(20px,4vw,48px)] nav:hidden"
        >
          {GOALS.map((g, i) => (
            <button
              key={g.name}
              type="button"
              role="tab"
              aria-selected={i === index}
              onClick={() => setIndex(i)}
              className={`h-11 flex-none whitespace-nowrap rounded-full border px-4 text-sm font-medium ${
                i === index ? "border-ink bg-ink text-paper" : "border-ink/22 bg-card"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-start gap-[clamp(32px,5vw,72px)]">
          {/* Desktop: numbered vertical list */}
          <ul role="tablist" aria-orientation="vertical" aria-label="Goals" className="m-0 hidden max-w-[340px] flex-[1_1_260px] list-none border-t border-ink p-0 nav:block">
            {GOALS.map((g, i) => {
              const active = i === index;
              return (
                <li key={g.name} className="border-b border-ink/12">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setIndex(i)}
                    className={`flex h-14 w-full cursor-pointer items-center gap-3.5 px-3 text-left ${active ? "bg-tint" : "hover:bg-hover"}`}
                  >
                    <span className={`w-[18px] font-mono text-[11px] ${active ? "text-green" : "text-faint"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={`flex-1 text-base ${active ? "font-semibold text-ink" : "font-medium text-[#3b3930]"}`}>{g.name}</span>
                    {active && (
                      <span aria-hidden className="text-green">
                        →
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div role="tabpanel" aria-label={goal.name} className="flex min-w-0 flex-[3_1_420px] flex-col">
            <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-4">
              <h3 className="m-0 font-serif text-[clamp(26px,3vw,34px)] font-normal tracking-[-0.01em]">{goal.name}</h3>
              <a href={FERMOR_URL} className="whitespace-nowrap text-sm font-medium">
                All {goal.short} tools →
              </a>
            </div>
            {goal.tools.map((tool) => (
              <ToolRow key={tool.name} tool={tool} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolRow({ tool }: { tool: ToolLink }) {
  const { openCalculator } = useCalculator();
  const body = (
    <>
      <span className="flex flex-col gap-1 text-left">
        <span className="text-lg font-medium text-ink">{tool.name}</span>
        <span className="text-pretty text-[15px] leading-[1.45] text-muted">{tool.desc}</span>
      </span>
      <span aria-hidden className="flex size-10 items-center justify-center rounded-full border border-ink/18 text-green transition-colors group-hover:border-green group-hover:bg-green group-hover:text-paper">
        →
      </span>
    </>
  );
  const cls = "group grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1.5 border-b border-ink/12 py-[22px] hover:bg-hover";

  return tool.calc ? (
    <button type="button" onClick={() => openCalculator(tool.calc!)} className={`${cls} cursor-pointer`}>
      {body}
    </button>
  ) : (
    <a href={FERMOR_URL} target="_blank" rel="noopener" className={cls}>
      {body}
    </a>
  );
}
