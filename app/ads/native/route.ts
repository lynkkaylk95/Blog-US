import { adConfig, isNativeAdPlacement, type NativeAdPlacement } from "../config";

function frameHtml(placement: NativeAdPlacement) {
  const slot = adConfig.nativeAds[placement];
  const zoneId = slot.zoneId;
  const containerId = `container-${zoneId}`;
  const providerUrl = `https://pl30777481.effectivecpmnetwork.com/${zoneId}/invoke.js`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { margin: 0; padding: 0; width: 100%; overflow: hidden; background: transparent; }
      #${containerId} { width: 100%; min-width: 0; overflow: hidden; }
      img, iframe { max-width: 100% !important; }
    </style>
  </head>
  <body>
    <div id="${containerId}"></div>
    <script>
      (() => {
        const container = document.getElementById(${JSON.stringify(containerId)});
        const placement = ${JSON.stringify(placement)};
        let filled = false;
        let reportedHeight = 0;

        const notify = (status, height = 0) => {
          parent.postMessage({ type: "native-ad-status", slot: placement, status, height }, location.origin);
        };

        const hasCreative = () => Boolean(container?.querySelector("iframe, a[href], img, video, object, embed")) || Boolean(container?.children.length && container.getBoundingClientRect().height > 40);
        const reportFill = () => {
          if (!hasCreative()) return;
          const height = Math.ceil(container.getBoundingClientRect().height);
          if (height < 40) return;
          filled = true;
          if (height !== reportedHeight) {
            reportedHeight = height;
            notify("filled", height);
          }
        };

        const resizeObserver = new ResizeObserver(reportFill);
        const mutationObserver = new MutationObserver(reportFill);
        resizeObserver.observe(container);
        mutationObserver.observe(container, { childList: true, subtree: true });

        const providerScript = document.createElement("script");
        providerScript.async = true;
        providerScript.dataset.cfasync = "false";
        providerScript.src = ${JSON.stringify(providerUrl)};
        providerScript.addEventListener("load", () => setTimeout(reportFill, 250));
        providerScript.addEventListener("error", () => {
          if (!filled) notify("error");
        });
        document.head.appendChild(providerScript);

        setTimeout(() => {
          if (!filled) notify("no-fill");
        }, 7500);
      })();
    <\/script>
</body>
</html>`;
}

export async function GET(request: Request) {
  const requestedSlot = new URL(request.url).searchParams.get("slot");
  const placement = isNativeAdPlacement(requestedSlot) ? requestedSlot : "inline";
  const slot = adConfig.nativeAds[placement];
  const html = slot.enabled ? frameHtml(placement) : "<!doctype html><title>Advertisement unavailable</title>";

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
