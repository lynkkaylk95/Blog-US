"use client";

import { useEffect, useRef, useState } from "react";
import { adConfig, type NativeAdPlacement } from "./config";

type AdStatus = "loading" | "filled" | "hidden";

export function AdSlot({ compact = false, placement }: { compact?: boolean; placement?: NativeAdPlacement }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const selectedPlacement = placement || (compact ? "inline" : "lead");
  const initialHeight = compact ? 280 : 320;
  const [height, setHeight] = useState(initialHeight);
  const [status, setStatus] = useState<AdStatus>("loading");
  const slot = adConfig.nativeAds[selectedPlacement];

  useEffect(() => {
    function resizeFrame(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.type !== "native-ad-status" || event.data.slot !== selectedPlacement) return;
      if (event.data.status === "error" || event.data.status === "no-fill") {
        setStatus("hidden");
        return;
      }
      if (event.data.status !== "filled") return;
      const nextHeight = Number(event.data.height);
      if (!Number.isFinite(nextHeight)) return;
      setHeight(Math.min(Math.max(nextHeight, 160), 900));
      setStatus("filled");
    }

    window.addEventListener("message", resizeFrame);
    const noFillTimeout = window.setTimeout(() => setStatus((current) => current === "filled" ? current : "hidden"), 9000);
    return () => {
      window.removeEventListener("message", resizeFrame);
      window.clearTimeout(noFillTimeout);
    };
  }, [selectedPlacement]);

  if (!adConfig.enabled || !slot.enabled || status === "hidden") return null;

  return (
    <aside className={`ad-slot ad-slot--native ad-slot--${status} ${compact ? "ad-slot--compact" : ""}`} aria-label="Advertisement" aria-busy={status === "loading"} data-ad-provider={adConfig.provider} data-ad-slot={selectedPlacement}>
      <span>ADVERTISEMENT</span>
      <iframe
        ref={frameRef}
        src={`${adConfig.nativeFrameUrl}?slot=${selectedPlacement}`}
        title={`Adsterra native advertisement (${selectedPlacement})`}
        loading="eager"
        onError={() => setStatus("hidden")}
        scrolling="no"
        style={{ height }}
      />
    </aside>
  );
}
