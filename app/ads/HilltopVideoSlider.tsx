"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const hilltopVideoSliderSrc =
  "https://shameful-farm.com/b/X.VwszdyGNlU0rYUWtcc/aexmX9-ujZpUqlJk_PGTVc/zgMHDckAz_NuTBMqt/NCzRM/w/OtT/Mo1wN/wy";

export function HilltopVideoSlider() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    // The third-party slider can place a transparent click-capturing layer over
    // mobile pages. Keep it off touch-sized screens so navigation remains usable.
    if (window.matchMedia("(max-width: 900px)").matches) return;
    if (document.querySelector('script[data-hilltop-video-slider="true"]')) return;

    const script = document.createElement("script") as HTMLScriptElement & {
      settings?: Record<string, never>;
    };
    script.settings = {};
    script.src = hilltopVideoSliderSrc;
    script.async = true;
    script.referrerPolicy = "no-referrer-when-downgrade";
    script.dataset.hilltopVideoSlider = "true";

    const lastScript = document.scripts[document.scripts.length - 1];
    if (lastScript?.parentNode) {
      lastScript.parentNode.insertBefore(script, lastScript);
    } else {
      document.body.appendChild(script);
    }
  }, [pathname]);

  return null;
}
