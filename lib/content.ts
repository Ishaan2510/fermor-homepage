// Static homepage content. Copy follows fermor.in; no invented claims.

import type { CalcId } from "./calculators";

export const FERMOR_URL = "https://fermor.in";
export const CONTACT_EMAIL = "fermor.in.contact@gmail.com";

export const PRINCIPLES = [
  "Show the full math, not just the answer",
  "No login wall on any calculator: an account is optional, only to save your results",
  "Ads and affiliate links are always clearly labeled, never disguised as neutral advice",
  "Transparent methodology on every tool",
  "Mobile-first",
];

export interface ToolLink {
  name: string;
  desc: string;
  /** If set, the link opens this calculator in the hero instead of leaving the page. */
  calc?: CalcId;
}

export interface Goal {
  name: string;
  short: string;
  tools: ToolLink[];
}

export const GOALS: Goal[] = [
  {
    name: "Loans",
    short: "loan",
    tools: [
      { name: "EMI calculator", desc: "Monthly instalment, total interest and the full amortization schedule.", calc: "emi" },
      { name: "Loan comparison", desc: "Put two loan offers side by side on rate, tenure and total cost." },
      { name: "Prepayment planner", desc: "See how a part-payment changes your tenure or your EMI." },
    ],
  },
  {
    name: "Taxes",
    short: "tax",
    tools: [
      { name: "Income tax calculator", desc: "New regime for FY 2026-27, worked slab by slab.", calc: "tax" },
      { name: "HRA exemption", desc: "Work out the exempt part of your house rent allowance." },
      { name: "Capital gains tax", desc: "Tax on selling shares, mutual funds or property." },
    ],
  },
  {
    name: "Investing",
    short: "investing",
    tools: [
      { name: "SIP calculator", desc: "Future value of a monthly investment at an expected return.", calc: "sip" },
      { name: "Lumpsum calculator", desc: "Growth of a one-time investment over time." },
      { name: "Goal-based SIP", desc: "The monthly amount needed to reach a target amount." },
    ],
  },
  {
    name: "Insurance",
    short: "insurance",
    tools: [
      { name: "Term cover estimator", desc: "How much life cover your income and loans point to." },
      { name: "Health cover planner", desc: "Compare your sum insured against likely hospital costs." },
      { name: "Policy return check", desc: "Work out what an endowment plan actually returns." },
    ],
  },
  {
    name: "Credit Score & Health",
    short: "credit",
    tools: [
      { name: "Financial Health Score", desc: "Your overall money health, now in the Fermor app." },
      { name: "Credit utilisation", desc: "How much of your card limit you use, and why it matters." },
      { name: "Debt-to-income ratio", desc: "The share of your monthly income going to EMIs." },
    ],
  },
  {
    name: "Retirement",
    short: "retirement",
    tools: [
      { name: "PPF calculator", desc: "Maturity value over the 15-year lock-in with yearly deposits." },
      { name: "NPS calculator", desc: "Estimated corpus and pension at retirement." },
      { name: "Retirement corpus", desc: "How much you need to retire, adjusted for inflation." },
    ],
  },
  {
    name: "Banking",
    short: "banking",
    tools: [
      { name: "FD calculator", desc: "Maturity amount with quarterly compounding.", calc: "fd" },
      { name: "RD calculator", desc: "Maturity value of a monthly recurring deposit." },
      { name: "Savings interest", desc: "Interest earned on your savings account balance." },
    ],
  },
  {
    name: "Career & Salary",
    short: "salary",
    tools: [
      { name: "Salary take-home", desc: "Your in-hand pay after PF, professional tax and TDS." },
      { name: "CTC breakdown", desc: "What each line of your offer letter actually means." },
      { name: "Gratuity calculator", desc: "Gratuity due based on your salary and years of service." },
    ],
  },
];

export const MORE_TOOLS: ToolLink[] = [
  { name: "Salary take-home", desc: "In-hand pay after PF, professional tax and TDS." },
  { name: "PPF calculator", desc: "Maturity value with yearly deposits." },
  { name: "RD calculator", desc: "Maturity of a monthly recurring deposit." },
  { name: "Lumpsum calculator", desc: "Growth of a one-time investment." },
  { name: "HRA exemption", desc: "Exempt part of your house rent allowance." },
  { name: "Gratuity calculator", desc: "Gratuity due on salary and years served." },
];

export interface CalcGroup {
  name: string;
  items: (ToolLink & { short: string })[];
}

export const CALC_GROUPS: CalcGroup[] = [
  {
    name: "Loans",
    items: [
      { name: "EMI calculator", short: "EMI", desc: "Instalment, interest and amortization.", calc: "emi" },
      { name: "Loan comparison", short: "Loan comparison", desc: "Two offers side by side." },
      { name: "Prepayment planner", short: "Prepayment", desc: "Effect of a part-payment." },
    ],
  },
  {
    name: "Investing",
    items: [
      { name: "SIP calculator", short: "SIP", desc: "Future value of a monthly SIP.", calc: "sip" },
      { name: "Lumpsum calculator", short: "Lumpsum", desc: "Growth of a one-time investment." },
      { name: "Goal-based SIP", short: "Goal-based SIP", desc: "Monthly amount for a target." },
    ],
  },
  {
    name: "Tax",
    items: [
      { name: "Income tax calculator", short: "Income tax", desc: "Slab by slab, FY 2026-27.", calc: "tax" },
      { name: "HRA exemption", short: "HRA exemption", desc: "Exempt part of your HRA." },
      { name: "Salary take-home", short: "Salary take-home", desc: "In-hand pay after deductions." },
    ],
  },
  {
    name: "Savings",
    items: [
      { name: "FD calculator", short: "FD", desc: "Maturity with quarterly compounding.", calc: "fd" },
      { name: "RD calculator", short: "RD", desc: "Monthly recurring deposit." },
      { name: "PPF calculator", short: "PPF", desc: "Maturity over the 15-year lock-in." },
    ],
  },
];

export interface SearchItem extends ToolLink {
  kind: "Calculator" | "Guide";
}

export const SEARCH_INDEX: SearchItem[] = [
  ...CALC_GROUPS.flatMap((g) => g.items.map(({ name, desc, calc }) => ({ name, desc, calc, kind: "Calculator" as const }))),
  { name: "How EMI is calculated", desc: "The reducing-balance method, step by step.", kind: "Guide" },
  { name: "Old vs new tax regime", desc: "Which regime suits your income.", kind: "Guide" },
  { name: "Starting your first SIP", desc: "Amount, tenure and expected return.", kind: "Guide" },
];

export const POPULAR_SEARCHES = ["EMI calculator", "Income tax calculator", "SIP calculator"];
