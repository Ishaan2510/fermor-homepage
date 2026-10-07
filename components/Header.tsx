"use client";

import { useEffect, useRef, useState } from "react";
import { CALC_GROUPS, CONTACT_EMAIL, FERMOR_URL, type ToolLink } from "@/lib/content";
import { useCalculator } from "./CalculatorContext";
import { Logo, SearchGlyph } from "./Logo";
import { SearchBox } from "./SearchBox";

const NAV_LINKS = [
  { label: "Guides", href: FERMOR_URL },
  { label: "Tools", href: FERMOR_URL },
  { label: "About", href: `${FERMOR_URL}/about` },
];

export function Header() {
  const { openCalculator } = useCalculator();
  const [dropOpen, setDropOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const dropButtonRef = useRef<HTMLButtonElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const [focusSearchOnOpen, setFocusSearchOnOpen] = useState(false);
  // When hover just opened the menu, the click that follows must not close it again.
  const hoverOpenedAt = useRef(0);

  // Escape closes whichever layer is open; clicks outside close the dropdown.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (dropOpen) {
        setDropOpen(false);
        dropButtonRef.current?.focus();
      }
      setMenuOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (dropOpen && headerRef.current && !headerRef.current.contains(e.target as Node)) setDropOpen(false);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [dropOpen]);

  // Lock page scroll behind the mobile menu.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen && focusSearchOnOpen) {
      mobileSearchRef.current?.focus();
      setFocusSearchOnOpen(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, focusSearchOnOpen]);

  // The mobile menu only exists below the nav breakpoint; close it if the window grows.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 820px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function pickTool(tool: ToolLink) {
    setDropOpen(false);
    setMenuOpen(false);
    if (tool.calc) openCalculator(tool.calc);
    else window.open(FERMOR_URL, "_blank", "noopener");
  }

  return (
    <>
      <header
        ref={headerRef}
        onMouseLeave={() => setDropOpen(false)}
        className="sticky top-0 z-30 border-b border-ink/12 bg-paper"
      >
        <div className="wrap flex h-16 items-center gap-8">
          <a href="#top" aria-label="Fermor home" className="hover:text-ink">
            <Logo />
          </a>

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden h-16 items-center gap-7 text-[15px] nav:flex">
            <button
              ref={dropButtonRef}
              type="button"
              aria-expanded={dropOpen}
              aria-controls="calc-menu"
              onClick={() => {
                if (Date.now() - hoverOpenedAt.current < 500) return setDropOpen(true);
                setDropOpen((o) => !o);
              }}
              // Hover opens for mouse users only; on touch, the tap's click handles it.
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse" || dropOpen) return;
                hoverOpenedAt.current = Date.now();
                setDropOpen(true);
              }}
              className={`-mb-px flex h-16 cursor-pointer items-center gap-1.5 border-b-2 ${
                dropOpen ? "border-green font-medium text-green" : "border-transparent text-ink"
              }`}
            >
              Calculators
              <span aria-hidden className={`text-[10px] transition-transform ${dropOpen ? "rotate-180 text-green" : "text-muted"}`}>
                ▼
              </span>
            </button>
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} onMouseEnter={() => setDropOpen(false)} className="text-ink hover:text-green">
                {l.label}
              </a>
            ))}
          </nav>

          <div onMouseEnter={() => setDropOpen(false)} className="ml-auto hidden items-center gap-5 nav:flex">
            <div className="w-[280px]">
              <SearchBox variant="desktop" />
            </div>
            <a
              href={FERMOR_URL}
              className="text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:text-green"
            >
              Sign in
            </a>
          </div>

          {/* Mobile controls */}
          <div className="ml-auto flex items-center gap-1 nav:hidden">
            <button
              type="button"
              aria-label="Search"
              onClick={() => {
                setFocusSearchOnOpen(true);
                setMenuOpen(true);
              }}
              className="flex size-12 items-center justify-center text-ink"
            >
              <SearchGlyph size={15} />
            </button>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
              className="h-10 rounded border border-ink/20 px-3.5 text-sm font-medium"
            >
              Menu
            </button>
          </div>
        </div>

        {/* Calculators mega-dropdown */}
        {dropOpen && (
          <div id="calc-menu" className="absolute inset-x-0 top-16 hidden border-y border-ink/12 bg-card nav:block">
            <div className="wrap grid grid-cols-4 gap-8 pt-7">
              {CALC_GROUPS.map((group) => (
                <div key={group.name} className="flex flex-col">
                  <span className="eyebrow border-b border-ink pb-2.5 text-[11px]">{group.name}</span>
                  {group.items.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => pickTool(item)}
                      className="flex flex-col gap-0.5 border-b border-ink/10 py-3 pr-2 text-left text-ink hover:bg-mist focus-visible:bg-mist"
                    >
                      <span className="text-[15px] font-medium">{item.name}</span>
                      <span className="text-[13px] leading-snug text-muted">{item.desc}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <div className="wrap flex items-center justify-between gap-6 pb-[22px] pt-[18px] text-[13px] text-muted">
              <span>No login wall on any calculator: an account is optional, only to save your results.</span>
              <a href={FERMOR_URL} className="text-sm font-semibold">
                All calculators →
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-paper nav:hidden">
          <div className="flex h-16 flex-none items-center justify-between border-b border-ink/12 px-5">
            <Logo />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="h-10 rounded bg-ink px-3.5 text-sm font-medium text-paper"
            >
              Close
            </button>
          </div>

          <div className="px-5 pt-5">
            <SearchBox ref={mobileSearchRef} variant="mobile" onPicked={() => setMenuOpen(false)} />
          </div>

          <nav aria-label="Mobile" className="flex flex-col px-5 pt-3">
            <div className="border-b border-ink/12 pb-5 pt-4">
              <span className="font-serif text-[34px] tracking-[-0.015em]">Calculators</span>
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">
                {CALC_GROUPS.map((group) => (
                  <div key={group.name} className="flex flex-col">
                    <span className="eyebrow mb-1 text-[11px]">{group.name}</span>
                    {group.items.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => pickTool(item)}
                        className="flex min-h-11 items-center border-b border-ink/8 text-left text-[15px] text-ink"
                      >
                        {item.short}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="flex min-h-16 items-center justify-between border-b border-ink/12 font-serif text-[34px] tracking-[-0.015em] text-ink"
              >
                {l.label}
                <span aria-hidden className="font-sans text-lg text-green">
                  →
                </span>
              </a>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-4 px-5 pb-8 pt-7">
            <a
              href={FERMOR_URL}
              className="flex h-[52px] items-center justify-center rounded border border-green text-base font-semibold text-green"
            >
              Sign in
            </a>
            <span className="text-[13px] leading-normal text-muted">An account is optional, only to save your results.</span>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-[13px]">
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
