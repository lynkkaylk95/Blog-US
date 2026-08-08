export type Chapter = { title: string; paragraphs: string[] };

export type Story = {
  slug: string;
  category: string;
  seriesTitle?: string | null;
  partNumber?: number | null;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  status: "draft" | "published";
  featured: boolean;
  chapters: Chapter[];
  date: string;
  updatedDate: string;
  contentHtml?: string;
  author: string;
  views: number;
};

export const categorySlugs: Record<string, string> = {
  "Family & Legacy": "family-legacy", "Second Chances": "second-chances", "Life Stories": "life-stories",
  "Justice & Truth": "justice-truth", "Love After 50": "love-after-50", Grandparents: "grandparents", Series: "series",
  Mystery: "mystery", Secrets: "secrets", Confessions: "confessions", "Unbelievable Stories": "unbelievable-stories",
  "Unexpected Encounters": "unexpected-encounters", "Plot Twists": "plot-twists", "Strange Stories": "strange-stories",
  "Hidden Truths": "hidden-truths", "Revenge Stories": "revenge-stories", "Karma Stories": "karma-stories",
  Cheating: "cheating", "First Love": "first-love", "Family Stories": "family-stories",
  "Mother & Daughter": "mother-daughter", "Father & Son": "father-son", Parenting: "parenting",
  "Family Secrets": "family-secrets", "Life & Lifestyle": "life-lifestyle", "Life Lessons": "life-lessons",
  "Everyday Life": "everyday-life",
};

const modules = import.meta.glob("../content/stories/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const requiredFields = ["slug", "category", "title", "excerpt", "image", "imageAlt", "readTime", "publishedAt", "updatedAt", "status"] as const;

function parseFrontmatter(source: string, file: string) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`${file}: missing valid frontmatter`);
  const values: Record<string, unknown> = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const separator = line.indexOf(":");
    if (separator < 1) throw new Error(`${file}: invalid frontmatter line: ${line}`);
    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    try { values[key] = JSON.parse(rawValue); }
    catch { throw new Error(`${file}: frontmatter values must use JSON syntax (${key})`); }
  }
  return { values, body: match[2].trim() };
}

function parseChapters(body: string, file: string): Chapter[] {
  const sections = body.split(/^## /m).filter(Boolean);
  const chapters = sections.map((section) => {
    const [titleLine, ...contentLines] = section.trim().split(/\r?\n/);
    const paragraphs = contentLines.join("\n").trim().split(/\r?\n\s*\r?\n/).map((paragraph) => paragraph.replace(/\r?\n/g, " ").trim()).filter(Boolean);
    return { title: titleLine.trim(), paragraphs };
  });
  if (!chapters.length || chapters.some((chapter) => !chapter.title || !chapter.paragraphs.length)) {
    throw new Error(`${file}: every story needs at least one ## chapter with body paragraphs`);
  }
  return chapters;
}

function parseStory(source: string, file: string): Story {
  const { values, body } = parseFrontmatter(source, file);
  for (const field of requiredFields) if (!(field in values)) throw new Error(`${file}: missing ${field}`);
  for (const field of requiredFields) if (typeof values[field] !== "string" || !values[field].trim()) throw new Error(`${file}: ${field} must be a non-empty string`);
  if (values.status !== "draft" && values.status !== "published") throw new Error(`${file}: status must be draft or published`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(values.slug))) throw new Error(`${file}: slug must use lowercase letters, numbers, and hyphens`);
  if (!(String(values.category) in categorySlugs)) throw new Error(`${file}: unsupported category`);
  if ("featured" in values && typeof values.featured !== "boolean") throw new Error(`${file}: featured must be true or false`);
  for (const field of ["publishedAt", "updatedAt"] as const) if (Number.isNaN(Date.parse(String(values[field])))) throw new Error(`${file}: ${field} must be an ISO date`);
  if (Date.parse(String(values.updatedAt)) < Date.parse(String(values.publishedAt))) throw new Error(`${file}: updatedAt cannot be earlier than publishedAt`);
  const publishedAt = String(values.publishedAt);
  const updatedAt = String(values.updatedAt);
  const formatDate = (value: string) => new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" }).format(new Date(value));
  return {
    slug: String(values.slug), category: String(values.category), title: String(values.title), excerpt: String(values.excerpt),
    image: String(values.image), imageAlt: String(values.imageAlt), readTime: String(values.readTime), publishedAt,
    updatedAt, status: values.status, featured: values.featured === true, author: "Porchlight Editors", views: 0, seriesTitle: null, partNumber: null,
    chapters: parseChapters(body, file),
    date: formatDate(publishedAt), updatedDate: formatDate(updatedAt),
  };
}

const allStories = Object.entries(modules).map(([file, source]) => parseStory(source, file));
const duplicateSlugs = allStories.filter((story, index) => allStories.findIndex((candidate) => candidate.slug === story.slug) !== index);
if (duplicateSlugs.length) throw new Error(`Duplicate story slug: ${duplicateSlugs[0].slug}`);
if (allStories.filter((story) => story.status === "published" && story.featured).length > 1) throw new Error("Only one published story may be featured");

export const stories = allStories.filter((story) => story.status === "published").sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
export const draftStories = allStories.filter((story) => story.status === "draft");
