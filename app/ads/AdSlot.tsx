"use client";

import { useEffect } from "react";
import { adConfig } from "./config";

export function AdSlot({ compact = false }: { compact?: boolean }) {
  const nativeAd = adConfig.nativeAd;

  useEffect(() => {
    if (!adConfig.enabled || !adConfig.renderSlots || compact) return;
    if (document.querySelector(`script[data-native-ad="${nativeAd.id}"]`)) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = nativeAd.src;
    script.dataset.nativeAd = nativeAd.id;
    script.setAttribute("data-cfasync", "false");

    const container = document.getElementById(`container-${nativeAd.id}`);
    container?.parentElement?.insertBefore(script, container);

    return () => script.remove();
  }, [compact, nativeAd.id, nativeAd.src]);

  if (!adConfig.enabled || !adConfig.renderSlots) return null;

  if (compact) {
    return (
      <aside className="ad-slot ad-slot--compact" aria-label="Advertisement" data-ad-provider="adsterra">
        <span>ADVERTISEMENT</span>
        <div>Additional native ad placement</div>
      </aside>
    );
  }

  return (
    <aside className="ad-slot" aria-label="Advertisement" data-ad-provider="adsterra">
      <span>ADVERTISEMENT</span>
      <div id={`container-${nativeAd.id}`} />
    </aside>
  );
}
