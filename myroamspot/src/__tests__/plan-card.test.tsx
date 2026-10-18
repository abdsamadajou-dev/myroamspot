import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import PlanCard from "../components/plan-card";
import type { Package } from "../lib/packages.seed";

const pack: Package = { slug: "omra-express", destinationSlug: "arabie-saoudite", nameFr: "Express", days: 10, dataGb: 5, priceCents: 1299, active: true };

afterEach(() => {
  cleanup();
});

describe("PlanCard", () => {
  const highlighted: Package = { ...pack, highlight: true };
  it("renders the TTC price and allowance", () => {
    render(<PlanCard pack={pack} />);
    expect(screen.getByText("12,99 €")).toBeInTheDocument();
    expect(screen.getByText(/10\s*jours/)).toBeInTheDocument();
    expect(screen.getByText(/5\s*Go/)).toBeInTheDocument();
  });
  it("uses an active high-intent CTA with micro-reassurance", () => {
    render(<PlanCard pack={pack} />);
    expect(screen.getByRole("button", { name: "Obtenir mon eSIM" })).toBeInTheDocument();
    expect(screen.getByText(/Livraison instantanée/)).toBeInTheDocument();
    expect(screen.getByText(/Sans engagement/)).toBeInTheDocument();
  });
  it("shows the bestseller tag only on the highlighted plan", () => {
    render(<PlanCard pack={highlighted} />);
    expect(screen.getByText(/Le Choix des Voyageurs/)).toBeInTheDocument();
    cleanup();
    render(<PlanCard pack={pack} />);
    expect(screen.queryByText(/Le Choix des Voyageurs/)).not.toBeInTheDocument();
  });
  it("renders a placeholder and hides the CTA when price is zero", () => {
    render(<PlanCard pack={{ ...pack, priceCents: 0 }} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
