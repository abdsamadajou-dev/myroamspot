import { describe, it, expect } from "vitest";
import { getPackages } from "../lib/packages";
import { DESTINATION_GRID_SLUGS } from "../lib/destinations";

describe("packages", () => {
  it("returns the Saudi catalog in price order", () => {
    const sa = getPackages("arabie-saoudite");
    expect(sa.map((p) => p.priceCents)).toEqual([1299, 1999, 2999]);
  });
  it("returns the five launch-destination count from the spec seed", () => {
    const slugs = ["arabie-saoudite", "maroc", "suisse", "turquie", "emirats-arabes-unis"];
    const total = slugs.reduce((n, s) => n + getPackages(s).length, 0);
    expect(total).toBe(11);
  });
  it("has at least one active package for every grid destination (popularity panel)", () => {
    for (const funnelSlug of DESTINATION_GRID_SLUGS) {
      const catalog = getPackages(funnelSlug.slice("esim-".length));
      expect(catalog.length, funnelSlug).toBeGreaterThan(0);
      expect(catalog[0].priceCents, funnelSlug).toBeGreaterThan(0);
    }
  });
  it("stores integer cents", () => {
    for (const p of getPackages("maroc")) expect(Number.isInteger(p.priceCents)).toBe(true);
  });
});
