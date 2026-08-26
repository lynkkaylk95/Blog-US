/** Central advertising configuration for the entire website. */
export const nativeAdPlacements = ["lead", "inline", "end"] as const;
export type NativeAdPlacement = (typeof nativeAdPlacements)[number];

const currentNativeZoneId = "fa440f56b6e1471dc9cd83adbf2d7820";

export const adConfig = {
  provider: "adsterra",
  enabled: true,
  nativeFrameUrl: "/ads/native",
  nativeAds: {
    // Replace these individually after creating the matching Adsterra zones.
    // Keeping the current ID here preserves the existing ads until then.
    lead: { enabled: true, zoneId: currentNativeZoneId },
    inline: { enabled: true, zoneId: currentNativeZoneId },
    end: { enabled: true, zoneId: currentNativeZoneId },
  },
} as const;

export function isNativeAdPlacement(value: string | null): value is NativeAdPlacement {
  return Boolean(value && nativeAdPlacements.includes(value as NativeAdPlacement));
}
