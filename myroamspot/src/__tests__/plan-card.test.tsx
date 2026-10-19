import { describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import PlanCard from "../components/funnel/plan-card";
import type { Package } from "../lib/packages.seed";

const pack: Package = { slug: "omra-express", destinationSlug: "arabie-saoudite", nameFr: "Express", days: 10, dataGb: 5, priceCents: 1299, active: true };

afterEach(() => {
  cleanup();
});

describe("PlanCard", () => {
  const highlighted: Package = { ...pack, highlight: true };
  it("renders the TTC price (card + price-anchored CTA) and allowance", () => {
    render(<PlanCard pack={pack} />);
    expect(screen.getByText("12,99 €")).toBeInTheDocument();
    const cta = screen.getByRole("button", { name: /Commander/ });
    expect(cta.textContent?.replace(/\u00a0/g, " ")).toMatch(/Commander • 12,99 €/);
    expect(screen.getByText(/10\s*jours/)).toBeInTheDocument();
    expect(screen.getByText(/5\s*Go/)).toBeInTheDocument();
  });
  it("uses an active price-anchored CTA with micro-reassurance", () => {
    render(<PlanCard pack={pack} />);
    const cta = screen.getByRole("button", { name: /Commander/ });
    expect(cta.textContent?.replace(/\u00a0/g, " ")).toMatch(/^Commander • 12,99 €$/);
    expect(screen.getByText(/Livraison instantanée/)).toBeInTheDocument();
    expect(screen.getByText(/Sans engagement/)).toBeInTheDocument();
  });
  it("marks data as the prominent attribute, validity as secondary", () => {
    render(<PlanCard pack={pack} />);
    const data = screen.getByText(/5\s*Go/);
    const validity = screen.getByText(/10\s*jours/);
    expect(data.className).toMatch(/font-bold/);
    expect(validity.className).toMatch(/muted/);
  });
  it("renders network, speed and hotspot decision aids when provided", () => {
    render(<PlanCard pack={pack} networks={["Maroc Telecom", "Orange"]} hotspot speed="5G / 4G LTE" />);
    expect(screen.getAllByTestId("network-pill")).toHaveLength(2);
    expect(screen.getByText(/Réseau : Maroc Telecom/)).toBeInTheDocument();
    expect(screen.getByText("5G / 4G LTE")).toBeInTheDocument();
    expect(screen.getByText(/Partage : Oui/)).toBeInTheDocument();
  });
  it("omits decision aids when props are absent", () => {
    render(<PlanCard pack={pack} />);
    expect(screen.queryByTestId("network-pill")).not.toBeInTheDocument();
    expect(screen.queryByText(/Partage : Oui/)).not.toBeInTheDocument();
  });
  it("shows the compatibility trigger and fires it on click", () => {
    const onCompatCheck = vi.fn();
    render(<PlanCard pack={pack} onCompatCheck={onCompatCheck} />);
    expect(screen.getByTestId("compat-trigger")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("compat-trigger"));
    expect(onCompatCheck).toHaveBeenCalledOnce();
  });
  it("no compatibility trigger without the callback", () => {
    render(<PlanCard pack={pack} />);
    expect(screen.queryByTestId("compat-trigger")).not.toBeInTheDocument();
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
