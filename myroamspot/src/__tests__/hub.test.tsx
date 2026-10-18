import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { DestinationSearch } from "../components/destination-search";
import { DESTINATION_SLUGS, DESTINATION_LABELS } from "../lib/destinations";

afterEach(() => {
  cleanup();
});

describe("destination search", () => {
  it("links every destination to its funnel route", () => {
    render(<DestinationSearch />);
    for (const slug of DESTINATION_SLUGS) {
      const link = screen.getByRole("link", { name: DESTINATION_LABELS[slug] });
      expect(link).toHaveAttribute("href", `/${slug}`);
    }
  });
  it("exposes exactly six destinations", () => {
    expect(DESTINATION_SLUGS).toHaveLength(6);
  });
});
