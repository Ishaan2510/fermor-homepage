// Pure calculator functions. No React, no I/O, so every formula is unit-tested
// in isolation (see calc.test.ts) and runs entirely in the browser.

export interface EmiYear {
  year: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface EmiResult {
  monthlyRate: number; // r
  months: number; // n
  growth: number; // (1 + r)^n
  emi: number; // exact, unrounded
  totalPaid: number;
  totalInterest: number;
  schedule: EmiYear[];
}

/**
 * Reducing-balance EMI: EMI = P·r·(1+r)^n / ((1+r)^n − 1)
 * r = annual rate / 12 / 100, n = tenure in months.
 */
export function calcEmi(principal: number, annualRate: number, years: number): EmiResult {
  const r = annualRate / 12 / 100;
  const n = Math.round(years * 12);
  const growth = Math.pow(1 + r, n);
  const emi = r === 0 ? principal / n : (principal * r * growth) / (growth - 1);

  const schedule: EmiYear[] = [];
  let balance = principal;
  for (let y = 0; y < Math.ceil(n / 12); y++) {
    let principalPaid = 0;
    let interestPaid = 0;
    for (let m = 0; m < 12 && y * 12 + m < n; m++) {
      const interest = balance * r;
      const towardsPrincipal = emi - interest;
      interestPaid += interest;
      principalPaid += towardsPrincipal;
      balance -= towardsPrincipal;
    }
    schedule.push({ year: y + 1, principal: principalPaid, interest: interestPaid, balance: Math.max(0, balance) });
  }

  const totalPaid = emi * n;
  return { monthlyRate: r, months: n, growth, emi, totalPaid, totalInterest: totalPaid - principal, schedule };
}

export interface SipResult {
  monthlyRate: number; // i
  months: number; // n
  growth: number; // (1 + i)^n
  futureValue: number;
  invested: number;
  returns: number;
  yearly: { year: number; invested: number; value: number }[];
}

/**
 * SIP future value, instalment at the start of each month (annuity due):
 * FV = P · ((1+i)^n − 1) / i · (1+i)
 */
export function calcSip(monthly: number, annualReturn: number, years: number): SipResult {
  const i = annualReturn / 12 / 100;
  const n = Math.round(years * 12);
  const fvAfter = (m: number) =>
    i === 0 ? monthly * m : monthly * ((Math.pow(1 + i, m) - 1) / i) * (1 + i);

  const yearly = [];
  for (let y = 1; y <= Math.ceil(n / 12); y++) {
    const m = Math.min(12 * y, n);
    yearly.push({ year: y, invested: monthly * m, value: fvAfter(m) });
  }

  const futureValue = fvAfter(n);
  const invested = monthly * n;
  return { monthlyRate: i, months: n, growth: Math.pow(1 + i, n), futureValue, invested, returns: futureValue - invested, yearly };
}

export interface FdResult {
  quarterlyRate: number; // r / 400
  quarters: number; // 4t
  growth: number; // (1 + r/400)^(4t)
  maturity: number;
  interest: number;
  effectiveYield: number; // % p.a.
  yearly: { year: number; interestThatYear: number; value: number }[];
}

/** FD with quarterly compounding: A = P · (1 + r/400)^(4t) */
export function calcFd(principal: number, annualRate: number, years: number): FdResult {
  const q = annualRate / 400;
  const quarters = Math.round(years * 4);
  const growth = Math.pow(1 + q, quarters);
  const maturity = principal * growth;

  const yearly = [];
  let prev = principal;
  for (let y = 1; y <= Math.ceil(years); y++) {
    const value = principal * Math.pow(1 + q, Math.min(4 * y, quarters));
    yearly.push({ year: y, interestThatYear: value - prev, value });
    prev = value;
  }

  return {
    quarterlyRate: q,
    quarters,
    growth,
    maturity,
    interest: maturity - principal,
    effectiveYield: (Math.pow(1 + q, 4) - 1) * 100,
    yearly,
  };
}

// ---------------------------------------------------------------------------
// Income tax, new regime, FY 2026-27 (AY 2027-28).
// Budget 2026 left the FY 2025-26 slabs, ₹75,000 standard deduction and the
// ₹12 lakh Section 87A threshold unchanged.
// ---------------------------------------------------------------------------

export const STANDARD_DEDUCTION = 75_000;
export const REBATE_LIMIT = 12_00_000;
export const CESS_RATE = 0.04;

export const NEW_REGIME_SLABS: [number, number, number][] = [
  [0, 4_00_000, 0],
  [4_00_000, 8_00_000, 5],
  [8_00_000, 12_00_000, 10],
  [12_00_000, 16_00_000, 15],
  [16_00_000, 20_00_000, 20],
  [20_00_000, 24_00_000, 25],
  [24_00_000, Infinity, 30],
];

export interface TaxSlabRow {
  from: number;
  to: number;
  rate: number;
  incomeInSlab: number;
  tax: number;
}

export interface TaxResult {
  gross: number;
  taxable: number;
  slabs: TaxSlabRow[];
  slabTax: number;
  rebate: number; // 87A rebate including marginal relief
  marginalRelief: boolean;
  taxAfterRebate: number;
  cess: number;
  totalTax: number;
  effectiveRate: number; // % of gross
}

/**
 * Salaried individual, new regime. Surcharge (taxable income above ₹50 lakh)
 * is deliberately out of scope and flagged in the UI.
 *
 * Section 87A: taxable income ≤ ₹12L gets a full rebate. Just above ₹12L,
 * marginal relief caps the tax at (taxable − ₹12L), so earning ₹1 more
 * never costs more than ₹1 in tax.
 */
export function calcTax(grossIncome: number): TaxResult {
  const taxable = Math.max(0, grossIncome - STANDARD_DEDUCTION);

  const slabs = NEW_REGIME_SLABS.map(([from, to, rate]) => {
    const incomeInSlab = Math.max(0, Math.min(taxable, to) - from);
    return { from, to, rate, incomeInSlab, tax: (incomeInSlab * rate) / 100 };
  });
  const slabTax = slabs.reduce((sum, s) => sum + s.tax, 0);

  let taxAfterRebate: number;
  let marginalRelief = false;
  if (taxable <= REBATE_LIMIT) {
    taxAfterRebate = 0;
  } else {
    const excess = taxable - REBATE_LIMIT;
    marginalRelief = slabTax > excess;
    taxAfterRebate = Math.min(slabTax, excess);
  }

  const cess = taxAfterRebate * CESS_RATE;
  const totalTax = taxAfterRebate + cess;

  return {
    gross: grossIncome,
    taxable,
    slabs,
    slabTax,
    rebate: slabTax - taxAfterRebate,
    marginalRelief,
    taxAfterRebate,
    cess,
    totalTax,
    effectiveRate: grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0,
  };
}
