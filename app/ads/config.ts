export type AdProvider = "monetag" | "custom" | "none";

/** Central advertising configuration for the entire website. */
export const adConfig = {
  provider: "monetag" as AdProvider,
  enabled: true,
  renderSlots: true,
  nativeAd: {
    provider: "adsterra",
    id: "fa440f56b6e1471dc9cd83adbf2d7820",
    src: "https://pl30777481.effectivecpmnetwork.com/fa440f56b6e1471dc9cd83adbf2d7820/invoke.js",
  },
  scripts: [
    {
      id: "monetag-multitag-268748",
      src: "https://quge5.com/88/tag.min.js",
      location: "head",
      async: true,
      attributes: {
        "data-zone": "268748",
        "data-cfasync": "false",
      },
    },
  ] as Array<{
    id: string;
    src: string;
    location: "head" | "body";
    async?: boolean;
    attributes?: Record<string, string>;
  }>,
};
