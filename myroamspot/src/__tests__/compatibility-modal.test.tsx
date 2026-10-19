import { describe, it, expect, vi, afterEach } from "vitest";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { CompatibilityModal } from "../components/funnel/compatibility-modal";

afterEach(() => {
  cleanup();
});

describe("CompatibilityModal", () => {
  it("renders nothing when closed", () => {
    render(<CompatibilityModal open={false} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the verification steps (iOS, Android, EID dial code) when open", () => {
    render(<CompatibilityModal open={true} onClose={() => {}} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText(/\*#06#/)).toBeInTheDocument(); // EID check
    expect(screen.getByText(/Réglages/)).toBeInTheDocument(); // iOS path
    expect(screen.getByText(/Paramètres/)).toBeInTheDocument(); // Android path
    expect(screen.getByText(/débloqué/)).toBeInTheDocument(); // carrier-lock warning
  });

  it("closes when the close button is clicked", () => {
    const onClose = vi.fn();
    render(<CompatibilityModal open={true} onClose={onClose} />);
    fireEvent.click(screen.getByTestId("compat-close"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes on Escape key", () => {
    const onClose = vi.fn();
    render(<CompatibilityModal open={true} onClose={onClose} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("closes on backdrop click but not on panel click", () => {
    const onClose = vi.fn();
    render(<CompatibilityModal open={true} onClose={onClose} />);
    fireEvent.click(screen.getByTestId("compat-backdrop"));
    expect(onClose).toHaveBeenCalledOnce();
    onClose.mockClear();
    fireEvent.click(screen.getByTestId("compat-dialog"));
    expect(onClose).not.toHaveBeenCalled();
  });
});
