export function normalizeSeriesTitle(value: string) {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US");
}

export function isPublicListingStory(story: { seriesTitle?: string | null; partNumber?: number | null }) {
  return !story.seriesTitle || story.partNumber === 1;
}

export function collapseSeriesStories<T extends { seriesTitle?: string | null; partNumber?: number | null }>(stories: T[]) {
  const emitted = new Set<string>();
  return stories.filter((story) => {
    if (!isPublicListingStory(story)) return false;
    if (!story.seriesTitle) return true;
    const key = normalizeSeriesTitle(story.seriesTitle);
    if (emitted.has(key)) return false;
    emitted.add(key);
    return true;
  });
}
