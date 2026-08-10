"use client";

import { useEffect, useRef, useState } from "react";
import { adConfig } from "./config";

export function AdSlot({ compact = false }: { compact?: boolean }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(compact ? 280 : 320);

  useEffect(() => {
    function resizeFrame(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      if (event.data?.type !== "adsterra-native-resize") return;
      const nextHeight = Number(event.data.height);
      if (Number.isFinite(nextHeight)) setHeight(Math.min(Math.max(nextHeight, 160), 900));
    }

    window.addEventListener("message", resizeFrame);
    return () => window.removeEventListener("message", resizeFrame);
  }, []);

  if (!adConfig.enabled) return null;

  const placement = compact ? "inline" : "lead";
  return (
    <aside className={`ad-slot ad-slot--native ${compact ? "ad-slot--compact" : ""}`} aria-label="Advertisement" data-ad-provider={adConfig.provider}>
      <span>ADVERTISEMENT</span>
      <iframe
        ref={frameRef}
        src={`${adConfig.nativeAd.frameUrl}?placement=${placement}`}
        title={`Adsterra native advertisement (${placement})`}
        loading="lazy"
        scrolling="no"
        style={{ height }}
      />
    </aside>
  );
}
