import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MentionsLegales from "../app/mentions-legales/page";
import { sitemap } from "../app/sitemap";

describe("legal", () => {
  it("renders placeholder tokens intact", () => {
    render(<MentionsLegales />);
    expect(screen.getByText("[COMPANY_NAME]")).toBeInTheDocument();
    expect(screen.getByText("[REGISTRATION_NUMBER]")).toBeInTheDocument();
  });
  it("lists the hub, six funnels, and legal pages in the sitemap", () => {
    const urls = sitemap().map((u) => u.url);
    expect(urls).toContain("https://myroamspot.com/esim-omra");
    expect(urls).toContain("https://myroamspot.com/cgv");
    expect(urls.filter((u) => u.includes("/esim-"))).toHaveLength(6);
  });
});
