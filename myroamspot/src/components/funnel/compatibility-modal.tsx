"use client";

import { useEffect } from "react";
import { getDictionary, t } from "../../lib/i18n";

// Apple sheet grammar (DESIGN.md): white panel, 18px radius, hairline border,
// no shadow — separation comes from the dimmed backdrop. Bullets are the one
// Action Blue moment; the carrier-lock note sits on parchment.
export function CompatibilityModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dict = getDictionary("fr");

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const steps = [t(dict, "plan.compatStepIos"), t(dict, "plan.compatStepAndroid"), t(dict, "plan.compatStepEid")];

  return (
    <div
      data-testid="compat-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="compat-title"
        data-testid="compat-dialog"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-md rounded-lg border border-border bg-white p-6"
      >
        <h2 id="compat-title" className="text-[21px] font-semibold tracking-[-0.02em] text-foreground">
          {t(dict, "plan.compatTitle")}
        </h2>
        <p className="mt-1.5 text-[15px] text-muted-foreground">{t(dict, "plan.compatIntro")}</p>
        <ul className="mt-4 space-y-3 text-[15px] text-foreground">
          {steps.map((step) => (
            <li key={step} className="flex gap-2.5">
              <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {step}
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-md bg-secondary px-4 py-3 text-[13px] text-foreground">
          {t(dict, "plan.compatCarrierLock")}
        </p>
        <button
          type="button"
          onClick={onClose}
          data-testid="compat-close"
          className="mt-5 h-11 w-full rounded-full bg-secondary px-6 text-[15px] font-normal text-foreground transition-[transform,background-color] hover:bg-border active:scale-[0.95]"
        >
          {t(dict, "plan.compatClose")}
        </button>
      </div>
    </div>
  );
}
