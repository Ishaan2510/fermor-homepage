// Indian number formatting helpers (lakh / crore grouping).

/** 2500000 -> "25,00,000" */
export function groupIN(n: number): string {
  return Math.round(n).toLocaleString("en-IN");
}

/** 2500000 -> "₹25,00,000" */
export function rupees(n: number): string {
  return "₹" + groupIN(n);
}

function trimDecimals(x: number): string {
  return x.toFixed(2).replace(/\.?0+$/, "");
}

/** 2500000 -> "₹25 lakh", 15000000 -> "₹1.5 crore" */
export function rupeesInWords(n: number): string {
  if (n >= 1e7) return "₹" + trimDecimals(n / 1e7) + " crore";
  if (n >= 1e5) return "₹" + trimDecimals(n / 1e5) + " lakh";
  return rupees(n);
}

export function percentOf(part: number, total: number): number {
  return total > 0 ? (part / total) * 100 : 0;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}
