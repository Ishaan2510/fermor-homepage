"use client";

import { forwardRef, useId, useMemo, useState } from "react";
import { FERMOR_URL, POPULAR_SEARCHES, SEARCH_INDEX, type SearchItem } from "@/lib/content";
import { useCalculator } from "./CalculatorContext";
import { SearchGlyph } from "./Logo";

interface Props {
  variant: "desktop" | "mobile";
  onPicked?: () => void;
}

export const SearchBox = forwardRef<HTMLInputElement, Props>(function SearchBox({ variant, onPicked }, ref) {
  const { openCalculator } = useCalculator();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();

  const query = q.trim().toLowerCase();
  const results = useMemo<SearchItem[]>(
    () =>
      query
        ? SEARCH_INDEX.filter((x) => `${x.name} ${x.desc}`.toLowerCase().includes(query)).slice(0, 4)
        : POPULAR_SEARCHES.map((n) => SEARCH_INDEX.find((x) => x.name === n)!),
    [query],
  );

  function pick(item: SearchItem) {
    setQ("");
    setFocused(false);
    (document.activeElement as HTMLElement | null)?.blur();
    onPicked?.();
    if (item.calc) openCalculator(item.calc);
    else window.open(FERMOR_URL, "_blank", "noopener");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") e.currentTarget.blur();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    }
    if (e.key === "Enter" && results[active]) pick(results[active]);
  }

  const mobile = variant === "mobile";
  const open = focused;

  return (
    <div className="relative w-full">
      <SearchGlyph
        size={mobile ? 14 : 12}
        className={`absolute text-muted ${mobile ? "left-[15px] top-[17px]" : "left-[13px] top-[14px]"}`}
      />
      <input
        ref={ref}
        type="search"
        role="combobox"
        aria-label="Search calculators and guides"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setActive(0);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={onKeyDown}
        placeholder="Search calculators & guides"
        className={`w-full rounded border outline-none transition-[box-shadow,border-color] ${
          mobile ? "h-12 pl-10 pr-3.5 text-base" : "h-10 pl-[34px] pr-3 text-sm"
        } ${
          focused
            ? "border-green bg-white shadow-[0_0_0_3px_rgba(30,77,55,.14)]"
            : `border-ink/16 ${mobile ? "bg-white" : "bg-card"}`
        }`}
      />
      {open && (
        <div
          id={listId}
          role="listbox"
          className={`overflow-hidden rounded-md border border-ink/16 bg-card ${
            mobile ? "mt-2" : "absolute inset-x-0 top-12 z-40 shadow-[0_8px_24px_rgba(23,22,15,.08)]"
          }`}
        >
          <div className="px-3.5 pb-1.5 pt-2.5 font-mono text-[11px] tracking-[0.08em] text-muted">
            {query ? "RESULTS" : "POPULAR"}
          </div>
          {results.map((item, i) => (
            <button
              key={item.name}
              type="button"
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(item)}
              className={`flex w-full items-center gap-3 border-t border-ink/8 px-3.5 py-2 text-left ${
                mobile ? "min-h-14" : "min-h-[52px]"
              } ${i === active ? "bg-mist" : ""}`}
            >
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className={`${mobile ? "text-[15px]" : "text-sm"} font-medium text-ink`}>{item.name}</span>
                <span className={`${mobile ? "text-[13px]" : "text-xs"} text-muted`}>{item.desc}</span>
              </span>
              <span className="flex-none rounded-[2px] border border-green/30 px-[5px] py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-green">
                {item.kind}
              </span>
            </button>
          ))}
          {query && results.length === 0 && (
            <div className="border-t border-ink/8 p-3.5 text-sm text-muted">No tools match “{q}”.</div>
          )}
        </div>
      )}
    </div>
  );
});
