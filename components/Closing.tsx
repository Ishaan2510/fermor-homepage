"use client";

import { CONTACT_EMAIL, FERMOR_URL } from "@/lib/content";
import { scrollToId } from "./CalculatorContext";
import { Logo } from "./Logo";

export function ClosingCta() {
  return (
    <section className="border-t border-ink/14">
      <div className="wrap flex flex-wrap items-end justify-between gap-8 py-[clamp(64px,9vw,120px)]">
        <h2 className="m-0 max-w-[14em] text-balance font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[1.04] tracking-[-0.025em]">
          Get clarity on every rupee, free to start, no jargon.
        </h2>
        <div className="flex flex-wrap items-center gap-5">
          <button
            type="button"
            onClick={() => scrollToId("calculator")}
            className="h-[52px] cursor-pointer rounded bg-green px-6 text-base font-semibold text-paper hover:bg-green-deep"
          >
            Open a calculator
          </button>
          <a href={FERMOR_URL} className="text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:text-green">
            Sign in to save results
          </a>
        </div>
      </div>
    </section>
  );
}

const FOOTER_COLUMNS = [
  { title: "About", links: [["About Fermor", `${FERMOR_URL}/about`], ["Our principles", "#principles-title"], ["Methodology", "#full-math"]] },
  {
    title: "Calculators",
    links: [["EMI", "#calculator"], ["SIP", "#calculator"], ["FD", "#calculator"], ["Income tax", "#calculator"], ["Salary take-home", FERMOR_URL], ["PPF", FERMOR_URL]],
  },
  { title: "Guides", links: [["Loans", FERMOR_URL], ["Taxes", FERMOR_URL], ["Investing", FERMOR_URL], ["Retirement", FERMOR_URL]] },
];

export function Footer() {
  return (
    <footer className="bg-ink text-[#e9e6dc]">
      <div className="wrap flex flex-col gap-12 pb-8 pt-[clamp(48px,6vw,72px)]">
        <div className="grid gap-x-8 gap-y-9 [grid-template-columns:repeat(auto-fit,minmax(min(100%,160px),1fr))]">
          <div className="flex flex-col gap-3">
            <Logo inverted />
            <span className="text-[13px] text-[#a8a497]">Made for India</span>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3 text-sm">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#a8a497]">{col.title}</span>
              {col.links.map(([label, href]) => (
                <a key={label} href={href} className="text-[#e9e6dc] hover:text-sage">
                  {label}
                </a>
              ))}
            </div>
          ))}
          <div className="flex flex-col gap-3 text-sm">
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#a8a497]">Contact</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="break-all text-[#e9e6dc] hover:text-sage">
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-x-8 gap-y-3 border-t border-[#e9e6dc]/16 pt-6 text-[13px] text-[#a8a497]">
          <span>Ads and affiliate links are always clearly labeled.</span>
          <span>© 2026 Fermor</span>
        </div>
      </div>
    </footer>
  );
}
