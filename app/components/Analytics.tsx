"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export const analyticsConsentKey = "porchlight-analytics-consent";
export const analyticsConsentEvent = "porchlight-consent-change";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

function initializeGoogleAnalytics(measurementId: string) {
  if (document.querySelector(`script[data-google-analytics="${measurementId}"]`)) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) { window.dataLayer.push(args); };
  window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  window.gtag("js", new Date());
  window.gtag("consent", "update", { analytics_storage: "granted" });
  window.gtag("config", measurementId, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.dataset.googleAnalytics = measurementId;
  document.head.appendChild(script);
}

export function GoogleAnalytics({ measurementId }: { measurementId?: string }) {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const lastPage = useRef("");

  useEffect(() => {
    if (!measurementId) return;
    const syncConsent = () => {
      const accepted = localStorage.getItem(analyticsConsentKey) === "granted";
      setEnabled(accepted);
      if (accepted) {
        initializeGoogleAnalytics(measurementId);
        window.gtag?.("consent", "update", { analytics_storage: "granted" });
      } else {
        window.gtag?.("consent", "update", { analytics_storage: "denied" });
      }
    };
    syncConsent();
    window.addEventListener(analyticsConsentEvent, syncConsent);
    return () => window.removeEventListener(analyticsConsentEvent, syncConsent);
  }, [measurementId]);

  useEffect(() => {
    if (!enabled || !measurementId || !window.gtag) return;
    const page = pathname;
    if (page === lastPage.current) return;
    lastPage.current = page;
    window.gtag("event", "page_view", { page_title: document.title, page_location: window.location.href, page_path: page });
  }, [enabled, measurementId, pathname]);

  return null;
}

export function CloudflareAnalytics({ token }: { token?: string }) {
  useEffect(() => {
    if (!token || document.querySelector("script[data-cf-beacon]")) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://static.cloudflareinsights.com/beacon.min.js";
    script.dataset.cfBeacon = JSON.stringify({ token });
    document.body.appendChild(script);
  }, [token]);
  return null;
}
