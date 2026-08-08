import type { Metadata } from "next";
import { PostEditor } from "../../../components/PostEditor";

export const metadata: Metadata = { title: "Add Series — Admin", robots: { index: false, follow: false } };

export default async function NewSeriesPage({ searchParams }: { searchParams: Promise<{ seriesTitle?: string; partNumber?: string }> }) {
  const values = await searchParams;
  const partNumber = Math.max(1, Number.parseInt(values.partNumber || "1", 10) || 1);
  return <PostEditor seriesMode initialSeriesTitle={values.seriesTitle || ""} initialPartNumber={partNumber} />;
}
