"use client";

import { useState } from "react";
import PlanCard from "./plan-card";
import { CompatibilityModal } from "./compatibility-modal";
import { getDictionary } from "../../lib/i18n";
import type { Package } from "../../lib/packages.seed";

// Client island inside otherwise static funnel pages: owns only the modal
// state. Network/speed/hotspot aids come from the funnel dictionary config;
// pages stay server-rendered and fast.
export function PlansSection({ packs, funnelSlug }: { packs: Package[]; funnelSlug: string }) {
  const dict = getDictionary("fr");
  const funnel = dict.funnels[funnelSlug as keyof typeof dict.funnels];
  const [compatOpen, setCompatOpen] = useState(false);
  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {packs.map((pack) => (
          <PlanCard
            key={pack.slug}
            pack={pack}
            networks={funnel.networks}
            hotspot={funnel.hotspot}
            speed={funnel.speed}
            onCompatCheck={() => setCompatOpen(true)}
          />
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">{dict.trust.compatPromise}</p>
      <CompatibilityModal open={compatOpen} onClose={() => setCompatOpen(false)} />
    </div>
  );
}
