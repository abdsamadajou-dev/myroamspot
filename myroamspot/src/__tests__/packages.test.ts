import { describe, it, expect } from "vitest";
import { getPackages } from "../lib/packages";

describe("packages", () => {
  it("returns the Saudi catalog in price order", () => {
    const sa = getPackages("arabie-saoudite");
    expect(sa.map((p) => p.priceCents)).toEqual([1299, 1999, 2999]);
  });
  it("returns exactly 11 packages across all destinations", () => {
    const slugs = ["arabie-saoudite", "maroc", "suisse", "turquie", "emirats-arabes-unis"];
    const total = slugs.reduce((n, s) => n + getPackages(s).length, 0);
    expect(total).toBe(11);
  });
  it("stores integer cents", () => {
    for (const p of getPackages("maroc")) expect(Number.isInteger(p.priceCents)).toBe(true);
  });
});
