import { describe, it, expect } from "vitest";
import { formatEur, centsFromEuros } from "../lib/format";

describe("format", () => {
  it("formats cents as a French EUR price (NBSP before €)", () => {
    expect(formatEur(1299)).toBe("12,99\u00a0€");
  });
  it("canonicalizes every space to NBSP (no U+202F, no plain space)", () => {
    expect(formatEur(129900)).not.toMatch(/[\u202f]/);
    expect(formatEur(129900)).not.toMatch(/ /);
    expect(formatEur(129900)).toMatch(/^\d[\d\u202f\u00a0,]*\u00a0€$/);
  });
  it("converts euros to integer cents unambiguously", () => {
    expect(centsFromEuros(12.99)).toBe(1299);
  });
});
