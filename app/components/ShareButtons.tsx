"use client";

import { useState } from "react";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
  }

  function email() {
    window.location.href = "/#newsletter";
  }

  return (
    <div className="share-row">
      <button type="button" onClick={share}>{copied ? "Link copied" : "Share"}</button>
      <button type="button" onClick={email}>✉ Email</button>
    </div>
  );
}
