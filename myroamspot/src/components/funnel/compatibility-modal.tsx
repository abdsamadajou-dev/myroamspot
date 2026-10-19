"use client";

import { useEffect } from "react";
import { getDictionary, t } from "../../lib/i18n";

// Airalo moves compatibility checks to AFTER purchase; ours is pre-purchase —
// an informational modal (never a fake diagnostic) with the EID dial-code
// trick and the carrier-lock warning before any money changes hands.
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
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-airbnb"
      >
        <h2 id="compat-title" className="text-[21px] font-semibold text-foreground">
          {t(dict, "plan.compatTitle")}
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">{t(dict, "plan.compatIntro")}</p>
        <ul className="mt-4 space-y-3 text-sm text-foreground">
          {steps.map((step) => (
            <li key={step} className="flex gap-2.5">
              <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {step}
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-lg bg-secondary px-4 py-3 text-xs text-foreground">
          {t(dict, "plan.compatCarrierLock")}
        </p>
        <button
          type="button"
          onClick={onClose}
          data-testid="compat-close"
          className="mt-5 h-11 w-full rounded-md bg-secondary px-6 text-sm font-medium text-foreground transition-colors hover:bg-border"
        >
          {t(dict, "plan.compatClose")}
        </button>
      </div>
    </div>
  );
}
