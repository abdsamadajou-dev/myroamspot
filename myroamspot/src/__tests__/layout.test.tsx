import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

async function importWidget() {
  vi.resetModules();
  const mod = await import("../components/whatsapp-widget");
  return mod.WhatsAppWidget;
}

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe("layout", () => {
  it("renders the brand in the header", async () => {
    const { SiteHeader } = await import("../components/site-header");
    render(<SiteHeader />);
    expect(screen.getByText("MyRoamSpot")).toBeInTheDocument();
  });

  it("links to WhatsApp with a prefilled message when configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "33612345678");
    const WhatsAppWidget = await importWidget();
    render(<WhatsAppWidget />);
    const link = screen.getByRole("link");
    const href = link.getAttribute("href");
    expect(href).toMatch(/wa\.me\/33612345678/);
    expect(href).toMatch(/text=Bonjour/);
  });

  it("renders nothing when the WhatsApp number is not configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "");
    const WhatsAppWidget = await importWidget();
    const { container } = render(<WhatsAppWidget />);
    expect(container).toBeEmptyDOMElement();
  });
});
