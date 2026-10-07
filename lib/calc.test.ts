import { describe, expect, it } from "vitest";
import { calcEmi, calcFd, calcSip, calcTax } from "./calc";
import { groupIN, rupeesInWords } from "./format";

const r = Math.round;

describe("EMI", () => {
  const c = calcEmi(25_00_000, 8.5, 20);

  it("matches the standard formula", () => {
    expect(c.months).toBe(240);
    expect(r(c.emi)).toBe(21_696);
    expect(r(c.totalInterest)).toBe(27_06_939);
    expect(r(c.totalPaid)).toBe(52_06_939);
  });

  it("builds a year-by-year amortization that pays off the loan", () => {
    expect(c.schedule).toHaveLength(20);
    expect(r(c.schedule[0].principal)).toBe(49_756);
    expect(r(c.schedule[0].interest)).toBe(2_10_591);
    expect(r(c.schedule[0].balance)).toBe(24_50_244);
    expect(r(c.schedule[4].balance)).toBe(22_03_180);
    expect(r(c.schedule[19].balance)).toBe(0);
    const principalSum = c.schedule.reduce((s, y) => s + y.principal, 0);
    expect(r(principalSum)).toBe(25_00_000);
  });

  it("handles a zero interest rate", () => {
    expect(calcEmi(1_20_000, 0, 1).emi).toBe(10_000);
  });
});

describe("SIP", () => {
  const c = calcSip(10_000, 12, 10);

  it("uses start-of-month instalments", () => {
    expect(r(c.futureValue)).toBe(23_23_391);
    expect(c.invested).toBe(12_00_000);
    expect(r(c.yearly[0].value)).toBe(1_28_093);
  });
});

describe("FD", () => {
  const c = calcFd(1_00_000, 7, 5);

  it("compounds quarterly", () => {
    expect(r(c.maturity)).toBe(1_41_478);
    expect(r(c.yearly[0].value)).toBe(1_07_186);
    expect(c.effectiveYield.toFixed(2)).toBe("7.19");
  });
});

describe("Income tax, new regime FY 2026-27", () => {
  it("is zero up to ₹12L taxable (₹12.75L gross) via the 87A rebate", () => {
    expect(calcTax(12_00_000).totalTax).toBe(0);
    expect(calcTax(12_75_000).totalTax).toBe(0);
  });

  it("applies marginal relief just above ₹12L taxable", () => {
    const t = calcTax(12_90_000); // taxable 12,15,000
    expect(t.marginalRelief).toBe(true);
    expect(t.taxAfterRebate).toBe(15_000);
    expect(r(t.totalTax)).toBe(15_600);
    expect(r(calcTax(13_00_000).totalTax)).toBe(26_000);
  });

  it("taxes slab by slab once relief no longer helps", () => {
    const t = calcTax(25_00_000); // taxable 24,25,000
    expect(t.marginalRelief).toBe(false);
    expect(t.slabTax).toBe(3_07_500);
    expect(r(t.totalTax)).toBe(3_19_800);
    expect(r(calcTax(50_00_000).totalTax)).toBe(10_99_800); // taxable 49,25,000
    expect(r(calcTax(60_00_000).totalTax)).toBe(14_11_800); // before surcharge
  });
});

describe("format", () => {
  it("groups in the Indian system", () => {
    expect(groupIN(2500000)).toBe("25,00,000");
    expect(rupeesInWords(2500000)).toBe("₹25 lakh");
    expect(rupeesInWords(15000000)).toBe("₹1.5 crore");
  });
});
