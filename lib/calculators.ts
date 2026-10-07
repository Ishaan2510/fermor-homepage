// Input specs and view models for the hero calculators and the "full math" section.
// Components stay presentational; everything numeric is derived here from lib/calc.

import { calcEmi, calcFd, calcSip, calcTax, REBATE_LIMIT, STANDARD_DEDUCTION } from "./calc";
import { clamp, groupIN, percentOf, rupees, rupeesInWords } from "./format";

export type CalcId = "emi" | "sip" | "fd" | "tax";
export type TabId = CalcId | "more";

export interface FieldSpec {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  kind: "money" | "percent" | "years";
}

export const SPECS: Record<CalcId, FieldSpec[]> = {
  emi: [
    { key: "P", label: "Loan amount", min: 1_00_000, max: 2_00_00_000, step: 50_000, kind: "money" },
    { key: "rate", label: "Interest rate (p.a.)", min: 5, max: 20, step: 0.05, kind: "percent" },
    { key: "years", label: "Tenure", min: 1, max: 30, step: 1, kind: "years" },
  ],
  sip: [
    { key: "P", label: "Monthly investment", min: 500, max: 2_00_000, step: 500, kind: "money" },
    { key: "rate", label: "Expected return (p.a.)", min: 1, max: 30, step: 0.5, kind: "percent" },
    { key: "years", label: "Time period", min: 1, max: 40, step: 1, kind: "years" },
  ],
  fd: [
    { key: "P", label: "Deposit amount", min: 10_000, max: 1_00_00_000, step: 10_000, kind: "money" },
    { key: "rate", label: "Interest rate (p.a.)", min: 3, max: 10, step: 0.05, kind: "percent" },
    { key: "years", label: "Tenure", min: 1, max: 10, step: 1, kind: "years" },
  ],
  tax: [{ key: "income", label: "Annual gross income", min: 3_00_000, max: 50_00_000, step: 10_000, kind: "money" }],
};

/** Raw input values as typed. Strings allow an in-progress "8." while typing a decimal. */
export type Inputs = Record<CalcId, Record<string, number | string>>;

export const DEFAULT_INPUTS: Inputs = {
  emi: { P: 25_00_000, rate: 8.5, years: 20 },
  sip: { P: 10_000, rate: 12, years: 10 },
  fd: { P: 1_00_000, rate: 7, years: 5 },
  tax: { income: 12_00_000 },
};

export function specFor(calc: CalcId, key: string): FieldSpec {
  return SPECS[calc].find((s) => s.key === key)!;
}

/** Clamped numeric value used for calculation, whatever is in the text box. */
export function valueOf(inputs: Inputs, calc: CalcId, key: string): number {
  const s = specFor(calc, key);
  return clamp(parseFloat(String(inputs[calc][key])) || 0, s.min, s.max);
}

export function rangeLabel(spec: FieldSpec, v: number): string {
  if (spec.kind === "money") return rupeesInWords(v);
  if (spec.kind === "percent") return v + "%";
  return v + " yrs";
}

// ---------------------------------------------------------------------------
// Hero result panel
// ---------------------------------------------------------------------------

export interface ResultView {
  label: string;
  value: string;
  unit: string;
  stats: { label: string; value: string }[];
  split: { aLabel: string; bLabel: string; aPct: number };
  note: string;
}

export function resultView(calc: CalcId, inputs: Inputs): ResultView {
  const v = (k: string) => valueOf(inputs, calc, k);

  if (calc === "emi") {
    const P = v("P");
    const c = calcEmi(P, v("rate"), v("years"));
    return {
      label: "Monthly EMI",
      value: rupees(c.emi),
      unit: "/month",
      stats: [
        { label: "Total interest", value: rupees(c.totalInterest) },
        { label: "Total amount", value: rupees(c.totalPaid) },
      ],
      split: { aLabel: "Principal", bLabel: "Interest", aPct: percentOf(P, c.totalPaid) },
      note: "Reducing-balance method, interest computed monthly. EMI shown rounded to the nearest rupee; totals use the exact EMI.",
    };
  }

  if (calc === "sip") {
    const years = v("years");
    const c = calcSip(v("P"), v("rate"), years);
    return {
      label: "Estimated value",
      value: rupees(c.futureValue),
      unit: `in ${years} yrs`,
      stats: [
        { label: "Amount invested", value: rupees(c.invested) },
        { label: "Estimated returns", value: rupees(c.returns) },
      ],
      split: { aLabel: "Invested", bLabel: "Returns", aPct: percentOf(c.invested, c.futureValue) },
      note: "Assumes each instalment is invested at the start of the month. Returns are not guaranteed.",
    };
  }

  if (calc === "fd") {
    const P = v("P");
    const years = v("years");
    const c = calcFd(P, v("rate"), years);
    return {
      label: "Maturity amount",
      value: rupees(c.maturity),
      unit: `after ${years} yrs`,
      stats: [
        { label: "Interest earned", value: rupees(c.interest) },
        { label: "Effective yield", value: c.effectiveYield.toFixed(2) + "% p.a." },
      ],
      split: { aLabel: "Principal", bLabel: "Interest", aPct: percentOf(P, c.maturity) },
      note: "Quarterly compounding, before TDS.",
    };
  }

  const income = v("income");
  const c = calcTax(income);
  return {
    label: "Tax payable",
    value: rupees(c.totalTax),
    unit: "/year",
    stats: [
      { label: "Taxable income", value: rupees(c.taxable) },
      { label: "Income after tax", value: rupees(income - c.totalTax) },
      { label: "Effective rate", value: c.effectiveRate.toFixed(1) + "%" },
    ],
    split: { aLabel: "Income after tax", bLabel: "Tax", aPct: percentOf(income - c.totalTax, income) },
    note: "New regime slabs, ₹75,000 standard deduction, 4% cess. Excludes surcharge.",
  };
}

// ---------------------------------------------------------------------------
// "Show the full math" section
// ---------------------------------------------------------------------------

export interface MathStep {
  title: string;
  symbol?: string;
  rule: string;
  work: string;
  result: string;
}

export type Formula = "emi" | "sip" | "fd";

export interface MathTable {
  title: string;
  legend?: [string, string];
  head: string[];
  rows: { cells: string[]; barPct?: number; dim?: boolean }[];
  foot: string[];
}

export interface MathView {
  label: string;
  summary: string;
  steps: MathStep[];
  formula?: {
    kind: Formula;
    title: string;
    legend: { symbol: string; desc: string; value: string }[];
    substitution: { base: string; power: string | number; result: string };
    expanded: string;
  };
  result: { title: string; value: string; unit: string; sentence: [string, string, string, string, string]; note: string };
  table: MathTable;
}

export function mathView(calc: CalcId, inputs: Inputs): MathView {
  const v = (k: string) => valueOf(inputs, calc, k);

  if (calc === "emi") {
    const P = v("P"), rate = v("rate"), years = v("years");
    const c = calcEmi(P, rate, years);
    const rs = c.monthlyRate.toFixed(7), pw = c.growth.toFixed(4);
    return {
      label: "Method · EMI",
      summary: `${rupeesInWords(P)} at ${rate}% for ${years} years`,
      steps: [
        { title: "Monthly interest rate", symbol: "r", rule: "= annual rate ÷ 12 ÷ 100", work: `${rate} ÷ 12 ÷ 100 = `, result: rs },
        { title: "Number of monthly payments", symbol: "n", rule: "= tenure in years × 12", work: `${years} × 12 = `, result: String(c.months) },
      ],
      formula: {
        kind: "emi",
        title: "Apply the EMI formula",
        legend: [
          { symbol: "P", desc: "Loan principal", value: rupees(P) },
          { symbol: "r", desc: "Monthly interest rate", value: rs },
          { symbol: "n", desc: "Number of months", value: String(c.months) },
        ],
        substitution: { base: `(1 + ${rs})`, power: c.months, result: pw },
        expanded: `EMI = ${groupIN(P)} × ${rs} × ${pw} ÷ (${pw} − 1)`,
      },
      result: {
        title: "Result",
        value: rupees(c.emi),
        unit: "/month",
        sentence: [
          `Exact EMI ₹${c.emi.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${c.months} months = `,
          rupees(c.totalPaid),
          " paid in total, of which ",
          rupees(c.totalInterest),
          " is interest.",
        ],
        note: "EMI shown rounded to the nearest rupee; totals use the exact EMI.",
      },
      table: {
        title: "Year-by-year amortization",
        legend: ["Principal", "Interest"],
        head: ["Year", "Principal", "Interest", "Balance"],
        rows: c.schedule.map((y) => ({
          cells: [String(y.year), rupees(y.principal), rupees(y.interest), rupees(y.balance)],
          barPct: percentOf(y.principal, y.principal + y.interest),
        })),
        foot: ["Total", rupees(P), rupees(c.totalInterest), "₹0"],
      },
    };
  }

  if (calc === "sip") {
    const P = v("P"), rate = v("rate"), years = v("years");
    const c = calcSip(P, rate, years);
    const is = c.monthlyRate.toFixed(7), pw = c.growth.toFixed(4);
    return {
      label: "Method · SIP",
      summary: `${rupees(P)} a month at ${rate}% for ${years} years`,
      steps: [
        { title: "Monthly rate of return", symbol: "i", rule: "= expected annual return ÷ 12 ÷ 100", work: `${rate} ÷ 12 ÷ 100 = `, result: is },
        { title: "Number of monthly instalments", symbol: "n", rule: "= years × 12", work: `${years} × 12 = `, result: String(c.months) },
      ],
      formula: {
        kind: "sip",
        title: "Apply the SIP future value formula",
        legend: [
          { symbol: "P", desc: "Monthly investment", value: rupees(P) },
          { symbol: "i", desc: "Monthly rate of return", value: is },
          { symbol: "n", desc: "Number of months", value: String(c.months) },
        ],
        substitution: { base: `(1 + ${is})`, power: c.months, result: pw },
        expanded: `FV = ${groupIN(P)} × (${pw} − 1) ÷ ${is} × (1 + ${is})`,
      },
      result: {
        title: "Result",
        value: rupees(c.futureValue),
        unit: `in ${years} yrs`,
        sentence: ["Of this, ", rupees(c.invested), " is what you invest and ", rupees(c.returns), " is estimated returns."],
        note: "Assumes each instalment is invested at the start of the month. Returns are not guaranteed.",
      },
      table: {
        title: "Year-by-year growth",
        legend: ["Invested", "Returns"],
        head: ["Year", "Invested", "Value"],
        rows: c.yearly.map((y) => ({
          cells: [String(y.year), rupees(y.invested), rupees(y.value)],
          barPct: percentOf(y.invested, y.value),
        })),
        foot: [`After ${years} yrs`, rupees(c.invested), rupees(c.futureValue)],
      },
    };
  }

  if (calc === "fd") {
    const P = v("P"), rate = v("rate"), years = v("years");
    const c = calcFd(P, rate, years);
    const qs = c.quarterlyRate.toFixed(6), pw = c.growth.toFixed(5);
    return {
      label: "Method · FD",
      summary: `${rupeesInWords(P)} at ${rate}% for ${years} years`,
      steps: [
        { title: "Quarterly interest rate", symbol: "r/400", rule: "= annual rate ÷ 4 quarters ÷ 100", work: `${rate} ÷ 400 = `, result: qs },
        { title: "Number of quarters", symbol: "4t", rule: "= tenure in years × 4", work: `${years} × 4 = `, result: String(c.quarters) },
      ],
      formula: {
        kind: "fd",
        title: "Apply the compound interest formula",
        legend: [
          { symbol: "P", desc: "Deposit amount", value: rupees(P) },
          { symbol: "r", desc: "Annual interest rate (%)", value: String(rate) },
          { symbol: "t", desc: "Tenure in years", value: String(years) },
        ],
        substitution: { base: `(1 + ${qs})`, power: c.quarters, result: pw },
        expanded: `A = ${groupIN(P)} × ${pw}`,
      },
      result: {
        title: "Result",
        value: rupees(c.maturity),
        unit: `after ${years} yrs`,
        sentence: ["Of this, ", rupees(P), " is your deposit and ", rupees(c.interest), " is interest earned."],
        note: "Quarterly compounding, before TDS.",
      },
      table: {
        title: "Year-by-year growth",
        legend: ["Deposit", "Interest"],
        head: ["Year", "Interest that year", "Value"],
        rows: c.yearly.map((y) => ({
          cells: [String(y.year), rupees(y.interestThatYear), rupees(y.value)],
          barPct: percentOf(P, y.value),
        })),
        foot: ["Total", rupees(c.interest), rupees(c.maturity)],
      },
    };
  }

  const income = v("income");
  const c = calcTax(income);
  const rebateRule =
    c.taxable <= REBATE_LIMIT
      ? "Taxable income is ₹12,00,000 or less, so the slab tax is fully rebated."
      : c.marginalRelief
        ? "Marginal relief: tax cannot exceed taxable income above ₹12,00,000."
        : "Taxable income is above ₹12,00,000, so no rebate applies.";
  const slabLabel = (from: number, to: number) => (to === Infinity ? `Above ${rupees(from)}` : `${rupees(from)} – ${rupees(to)}`);

  return {
    label: "Method · Income tax",
    summary: `${rupeesInWords(income)} gross income, FY 2026-27 new regime`,
    steps: [
      { title: "Gross annual income", rule: "Salary before any deductions.", work: "", result: rupees(income) },
      { title: "Minus standard deduction", rule: "Flat deduction for salaried individuals.", work: "", result: "− " + rupees(STANDARD_DEDUCTION) },
      { title: "Taxable income", rule: "Gross income minus standard deduction.", work: `${rupees(income)} − ${rupees(STANDARD_DEDUCTION)} = `, result: rupees(c.taxable) },
      { title: "Tax by slab", rule: "Each slab is taxed only on the income inside it. See the slab table.", work: "Sum of slabs = ", result: rupees(c.slabTax) },
      { title: "Rebate under Section 87A", rule: rebateRule, work: `${rupees(c.slabTax)} − ${rupees(c.rebate)} = `, result: rupees(c.taxAfterRebate) },
      { title: "Health & education cess", rule: "4% on tax after rebate.", work: `${rupees(c.taxAfterRebate)} × 4% = `, result: rupees(c.cess) },
    ],
    result: {
      title: "Final tax",
      value: rupees(c.totalTax),
      unit: "/year",
      sentence: ["That leaves ", rupees(income - c.totalTax), " after tax, an effective rate of ", c.effectiveRate.toFixed(1) + "%", "."],
      note: "FY 2026-27, new regime. Excludes surcharge, which applies above ₹50 lakh taxable income.",
    },
    table: {
      title: "Slab-by-slab tax",
      head: ["Taxable income slab", "Rate", "Income in slab", "Tax"],
      rows: c.slabs.map((s) => ({
        cells: [slabLabel(s.from, s.to), s.rate + "%", rupees(s.incomeInSlab), rupees(s.tax)],
        dim: s.incomeInSlab === 0,
      })),
      foot: ["Total", "", rupees(c.taxable), rupees(c.slabTax)],
    },
  };
}
