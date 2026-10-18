import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { DestinationSearch } from "../components/destination-search";
import { DESTINATION_SLUGS, DESTINATION_GRID_SLUGS, DESTINATION_LABELS } from "../lib/destinations";

afterEach(() => {
  cleanup();
});

describe("destination search", () => {
  it("links every grid destination to its funnel route", () => {
    render(<DestinationSearch />);
    for (const slug of DESTINATION_GRID_SLUGS) {
      const link = screen.getByRole("link", { name: DESTINATION_LABELS[slug] });
      expect(link).toHaveAttribute("href", `/${slug}`);
    }
  });
  it("keeps the Omra edition out of the grid to avoid funnel duplication", () => {
    render(<DestinationSearch />);
    expect(screen.queryByRole("link", { name: DESTINATION_LABELS["esim-omra"] })).not.toBeInTheDocument();
  });
  it("exposes exactly six destinations (grid + dedicated Omra funnel)", () => {
    expect(DESTINATION_SLUGS).toHaveLength(6);
    expect(DESTINATION_GRID_SLUGS).toHaveLength(5);
  });
});
