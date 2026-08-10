"use client";

import { useEffect } from "react";
import { adConfig } from "./config";

/** Loads the active provider's global scripts once for the entire website. */
export function AdManager() {
  useEffect(() => {
    if (!adConfig.enabled || adConfig.provider === "none") return;

    const addedScripts: HTMLScriptElement[] = [];
    for (const configuredScript of adConfig.scripts) {
      if (document.querySelector(`script[data-ad-script="${configuredScript.id}"]`)) continue;

      const script = document.createElement("script");
      script.async = configuredScript.async ?? true;
      script.src = configuredScript.src;
      script.dataset.adScript = configuredScript.id;
      for (const [name, value] of Object.entries(configuredScript.attributes ?? {})) {
        script.setAttribute(name, value);
      }
      (configuredScript.location === "head" ? document.head : document.body).appendChild(script);
      addedScripts.push(script);
    }

    return () => {
      for (const script of addedScripts) script.remove();
    };
  }, []);

  return null;
}
