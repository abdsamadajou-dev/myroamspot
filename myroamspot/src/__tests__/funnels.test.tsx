import { describe, it, expect, afterEach } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";
import { render, screen, cleanup } from "@testing-library/react";
import { DESTINATION_SLUGS } from "../lib/destinations";
import { buildFunnelMetadata, buildProductJsonLd } from "../lib/seo";
import { getPackages } from "../lib/packages";
import PlanCard from "../components/plan-card";

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
    expect(meta.title).toBe("eSIM Maroc — internet sans itinérance");
    expect(meta.description).toContain("Maroc Telecom");
    expect(meta.alternates?.canonical).toBe("https://myroamspot.com/esim-maroc");
  });
  it("emits Product JSON-LD with an EUR offer", () => {
    const ld = buildProductJsonLd(getPackages("maroc")[0]);
    expect(ld["@type"]).toBe("Product");
    expect((ld.offers as Record<string, string>).priceCurrency).toBe("EUR");
  });
  it("renders a plan card on a funnel page", () => {
    render(<PlanCard pack={getPackages("suisse")[0]} />);
    expect(screen.getByText("8,99 €")).toBeInTheDocument();
  });
});
