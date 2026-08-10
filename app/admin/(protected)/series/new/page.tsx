import type { Metadata } from "next";
import { PostEditor } from "../../../components/PostEditor";

export const metadata: Metadata = { title: "Add Series — Admin", robots: { index: false, follow: false } };

export default async function NewSeriesPage({ searchParams }: { searchParams: Promise<{ seriesTitle?: string; partNumber?: string; categories?: string; author?: string; imageUrl?: string }> }) {
  const values = await searchParams;
  const partNumber = Math.max(1, Number.parseInt(values.partNumber || "1", 10) || 1);
  let categories = ["Series"];
  try { const parsed = JSON.parse(values.categories || "[]"); if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) categories = parsed; } catch { /* Use the series default. */ }
  return <PostEditor seriesMode initialSeriesTitle={values.seriesTitle || ""} initialPartNumber={partNumber} initialCategories={categories} initialAuthor={values.author || "Porchlight Editors"} initialImageUrl={values.imageUrl || ""} />;
}
