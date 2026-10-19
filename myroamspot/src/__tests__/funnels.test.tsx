import { describe, it, expect, afterEach } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { render, screen, cleanup } from "@testing-library/react";
import { DESTINATION_SLUGS } from "../lib/destinations";
import { buildFunnelMetadata, buildProductJsonLd } from "../lib/seo";
import { getDictionary } from "../lib/i18n";
import { getPackages } from "../lib/packages";
import { PlansSection } from "../components/funnel/plans-section";

afterEach(() => {
  cleanup();
});

describe("funnels", () => {
  it("every destination maps to a real funnel slug", () => {
    expect(DESTINATION_SLUGS).toContain("esim-omra");
    expect(DESTINATION_SLUGS).toHaveLength(6);
  });
  it("has no dynamic esim slug route (prevents junk SEO URLs)", () => {
    const dynamicDir = path.join(process.cwd(), "src/app/esim-[city]");
    expect(existsSync(dynamicDir)).toBe(false);
  });
  it("emits title, description, and canonical for a funnel", () => {
    const meta = buildFunnelMetadata("esim-maroc");
    expect(meta.title).toBe("eSIM Maroc — Marrakech, Casa, Agadir, Tanger sans frais de roaming");
    expect(meta.description).toContain("Maroc Telecom");
    expect(meta.alternates?.canonical).toBe("https://myroamspot.com/esim-maroc");
  });
  it("emits Product JSON-LD with an EUR offer", () => {
    const ld = buildProductJsonLd(getPackages("maroc")[0]);
    expect(ld["@type"]).toBe("Product");
    expect((ld.offers as Record<string, string>).priceCurrency).toBe("EUR");
  });
  it("renders a plan card on a funnel page", () => {
    const dict = getDictionary("fr");
    render(<PlansSection packs={getPackages("suisse")} funnelSlug="esim-suisse" />);
    expect(screen.getByText("8,99 €")).toBeInTheDocument();
    expect(screen.getAllByTestId("network-pill").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByTestId("compat-trigger")).toHaveLength(2); // one per card
  });
  it("every funnel declares non-empty networks, a speed label, and a boolean hotspot", () => {
    const dict = getDictionary("fr");
    for (const slug of DESTINATION_SLUGS) {
      const funnel = dict.funnels[slug as keyof typeof dict.funnels];
      expect(Array.isArray(funnel.networks), `${slug} networks`).toBe(true);
      expect(funnel.networks.length, `${slug} networks`).toBeGreaterThan(0);
      expect(funnel.networks.every((n) => typeof n === "string" && n.length > 0), `${slug} network names`).toBe(true);
      expect(typeof funnel.hotspot, `${slug} hotspot`).toBe("boolean");
      expect(funnel.speed, `${slug} speed`).toMatch(/5G/);
    }
  });
});
