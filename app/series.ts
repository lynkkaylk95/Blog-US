export function normalizeSeriesTitle(value: string) {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US");
}

export function collapseSeriesStories<T extends { seriesTitle?: string | null; partNumber?: number | null }>(stories: T[]) {
  const emitted = new Set<string>();
  return stories.flatMap((story) => {
    if (!story.seriesTitle) return [story];
    const key = normalizeSeriesTitle(story.seriesTitle);
    if (emitted.has(key)) return [];
    emitted.add(key);
    const firstPart = stories.filter((item) => item.seriesTitle && normalizeSeriesTitle(item.seriesTitle) === key).sort((a, b) => (a.partNumber || 0) - (b.partNumber || 0))[0];
    return firstPart ? [firstPart] : [];
  });
}
