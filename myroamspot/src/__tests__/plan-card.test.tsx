import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import PlanCard from "../components/plan-card";
import type { Package } from "../lib/packages.seed";

const pack: Package = { slug: "omra-express", destinationSlug: "arabie-saoudite", nameFr: "Express", days: 10, dataGb: 5, priceCents: 1299, active: true };

afterEach(() => {
  cleanup();
});

describe("PlanCard", () => {
  it("renders the TTC price and allowance", () => {
    render(<PlanCard pack={pack} />);
    expect(screen.getByText("12,99 €")).toBeInTheDocument();
    expect(screen.getByText(/10\s*jours/)).toBeInTheDocument();
    expect(screen.getByText(/5\s*Go/)).toBeInTheDocument();
  });
  it("renders a placeholder and hides the CTA when price is zero", () => {
    render(<PlanCard pack={{ ...pack, priceCents: 0 }} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
