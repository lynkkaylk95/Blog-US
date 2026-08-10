export type AdProvider = "monetag" | "custom" | "none";

/** Central advertising configuration for the entire website. */
export const adConfig = {
  provider: "monetag" as AdProvider,
  enabled: false,
  showPlaceholders: true,
  scripts: [] as Array<{
    id: string;
    src: string;
    location: "head" | "body";
  }>,
};
