"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { analyticsConsentEvent, analyticsConsentKey } from "./Analytics";

type Choice = "granted" | "denied";

function saveChoice(choice: Choice) {
  localStorage.setItem(analyticsConsentKey, choice);
  window.dispatchEvent(new Event(analyticsConsentEvent));
}

export function CookieConsent({ enabled }: { enabled: boolean }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(() => setVisible(localStorage.getItem(analyticsConsentKey) === null), 0);
    const open = () => setVisible(true);
    window.addEventListener("porchlight-open-cookie-settings", open);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("porchlight-open-cookie-settings", open);
    };
  }, [enabled]);

  if (!visible) return null;

  function choose(choice: Choice) {
    saveChoice(choice);
    setVisible(false);
  }

  return <aside className="consent-banner" aria-label="Analytics preferences">
    <div><b>Your privacy choices</b><p>We use optional Google Analytics only with your permission. Cloudflare provides privacy-focused site performance measurements. <Link href="/cookies">Learn more</Link></p></div>
    <div className="consent-actions"><button type="button" className="consent-secondary" onClick={() => choose("denied")}>Decline optional analytics</button><button type="button" onClick={() => choose("granted")}>Allow analytics</button></div>
  </aside>;
}

export function CookieSettingsButton() {
  return <button type="button" className="text-button" onClick={() => window.dispatchEvent(new Event("porchlight-open-cookie-settings"))}>Change analytics preferences</button>;
}
