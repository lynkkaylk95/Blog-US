"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

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
  window.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.dataset.googleAnalytics = measurementId;
  document.head.appendChild(script);
}

export function GoogleAnalytics({ measurementId }: { measurementId?: string }) {
  const pathname = usePathname();
  const lastPage = useRef("");

  useEffect(() => {
    if (!measurementId) return;
    initializeGoogleAnalytics(measurementId);
  }, [measurementId]);

  useEffect(() => {
    if (!measurementId || !window.gtag) return;
    const page = pathname;
    if (page === lastPage.current) return;
    lastPage.current = page;
    window.gtag("event", "page_view", { page_title: document.title, page_location: window.location.href, page_path: page });
  }, [measurementId, pathname]);

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
