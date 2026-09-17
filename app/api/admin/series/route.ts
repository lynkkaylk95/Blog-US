import { NextResponse } from "next/server";
import { createSeriesPosts, listPostRecords } from "../../../../db/posts";
import { hasValidMutationOrigin, isAdminAuthenticated } from "../../../admin-auth";
import { normalizeSeriesTitle } from "../../../series";
import { prepareSeries } from "../series-input";

export async function POST(request: Request) {
  if (!await isAdminAuthenticated()) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  if (!await hasValidMutationOrigin()) return NextResponse.json({ message: "Invalid request origin." }, { status: 403 });
  let parts;
  try { parts = prepareSeries(await request.json()); }
  catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "Invalid series data." }, { status: 400 }); }
  try {
    const existing = await listPostRecords();
    const seriesKey = normalizeSeriesTitle(parts[0].seriesTitle!);
    if (existing.some((post) => post.seriesTitle && normalizeSeriesTitle(post.seriesTitle) === seriesKey)) {
      return NextResponse.json({ message: "Series này đã tồn tại. Hãy sửa các part trong danh sách bài viết hoặc dùng tên series khác. / This series already exists." }, { status: 409 });
    }
    const slugs = new Set(existing.map((post) => post.slug));
    if (parts.some((part) => slugs.has(part.slug))) return NextResponse.json({ message: "Một đường dẫn part đã tồn tại. / A part URL already exists." }, { status: 409 });
    const now = new Date().toISOString();
    const created = await createSeriesPosts(parts.map((part) => ({ ...part, createdAt: now, updatedAt: now, publishedAt: part.status === "published" ? now : null })));
    return NextResponse.json({ count: created.length, posts: created.map(({ id, slug, title, partNumber }) => ({ id, slug, title, partNumber })) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: String(error).includes("UNIQUE") ? "Series hoặc đường dẫn đã tồn tại. / Series or URL already exists." : "Không thể lưu series. Chưa có part nào được tạo. / Could not save the series; no parts were created." }, { status: 409 });
  }
}
