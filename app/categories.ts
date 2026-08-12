export const storyCategories = [
  "Family & Legacy", "Second Chances", "Life Stories", "Justice & Truth", "Love After 50", "Grandparents",
  "Mystery", "Secrets", "Confessions", "Unbelievable Stories", "Unexpected Encounters", "Plot Twists",
  "Strange Stories", "Hidden Truths", "Revenge Stories", "Karma Stories", "Cheating", "First Love",
  "Family Stories", "Mother & Daughter", "Father & Son", "Parenting", "Family Secrets", "Life & Lifestyle",
  "Life Lessons", "Everyday Life",
] as const;

export function categorySlug(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const categorySlugs: Record<string, string> = Object.fromEntries([
  ...storyCategories.map((value) => [value, categorySlug(value)]),
  ["Series", "series"],
]);
