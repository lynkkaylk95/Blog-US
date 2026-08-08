"use client";

import { useEffect, useState } from "react";

export function ViewTracker({ slug, initialViews }: { slug: string; initialViews: number }) {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    const key = `porchlight-viewed:${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    void fetch(`/api/stories/${encodeURIComponent(slug)}/view`, { method: "POST", keepalive: true })
      .then((response) => response.ok ? response.json() : null)
      .then((result: { views?: number } | null) => { if (typeof result?.views === "number") setViews(result.views); })
      .catch(() => sessionStorage.removeItem(key));
  }, [slug]);

  return <>{views.toLocaleString("en-US")} views</>;
}
