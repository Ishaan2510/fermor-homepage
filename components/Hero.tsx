"use client";

import { FERMOR_URL } from "@/lib/content";
import { CalculatorCard } from "./CalculatorCard";
import { scrollToId } from "./CalculatorContext";

export function Hero() {
  return (
    <section
      id="top"
      className="wrap grid items-center gap-[clamp(40px,6vw,88px)] pb-[clamp(56px,8vw,104px)] pt-[clamp(36px,7vw,88px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr))]"
    >
      <div className="flex flex-col gap-7">
        <a
          href={FERMOR_URL}
          className="inline-flex items-center gap-2.5 self-start rounded-[3px] border border-green/30 bg-card py-1.5 pl-1.5 pr-3 text-[13px] text-green hover:text-green"
        >
          <span className="rounded-[2px] bg-green px-1.5 py-[3px] font-mono text-[11px] font-medium tracking-[0.06em] text-paper">NEW</span>
          <span>Financial Health Score, now in the app</span>
        </a>

        <h1 className="m-0 text-pretty font-serif text-[clamp(42px,5.4vw,76px)] font-normal leading-[1.02] tracking-[-0.025em]">
          Smart financial decisions start with <em className="text-green">Fermor</em>
        </h1>

        <p className="m-0 max-w-[30em] text-pretty text-[clamp(17px,1.5vw,19px)] leading-[1.55] text-body">
          Clarity for every financial decision. Tools, insights and products that help you understand, plan and grow your money, all in
          one place, built for India.
        </p>

        <div className="flex flex-col gap-4 border-t border-ink/12 pt-5">
          <ul className="flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium">
            <li className="flex items-center gap-2.5">
              <span aria-hidden className="size-1.5 bg-green" />
              Independent &amp; unbiased
            </li>
            <li className="flex items-center gap-2.5">
              <span aria-hidden className="size-1.5 bg-green" />
              Made for India
            </li>
          </ul>
          <p className="m-0 flex max-w-[34em] gap-2.5 text-[13px] leading-normal text-body">
            <span aria-hidden className="mt-[3px] h-3 w-2.5 flex-none rounded-[2px] border-[1.5px] border-green" />
            <span>Every calculator&apos;s math runs entirely in your browser. The numbers you type in are never sent to our servers.</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => scrollToId("goals")}
          className="flex h-12 cursor-pointer items-center gap-2 self-start text-[15px] font-medium text-green hover:text-ink"
        >
          Explore tools by life goal <span aria-hidden>↓</span>
        </button>
      </div>

      <CalculatorCard />
    </section>
  );
}
