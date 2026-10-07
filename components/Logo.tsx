export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span aria-hidden className={`size-2.5 rounded-[1px] ${inverted ? "bg-sage" : "bg-green"}`} />
      <span className={`font-serif text-[26px] font-medium tracking-[-0.01em] ${inverted ? "text-[#e9e6dc]" : "text-ink"}`}>
        Fermor
      </span>
    </span>
  );
}

export function SearchGlyph({ size = 12, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none inline-block rounded-full border-[1.5px] border-current ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
