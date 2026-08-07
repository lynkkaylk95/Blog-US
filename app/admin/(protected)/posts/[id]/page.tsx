import type { Metadata } from "next";
import { PostEditor } from "../../../components/PostEditor";
export const metadata: Metadata = { title: "Edit Post — Admin", robots: { index: false, follow: false } };
export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) { return <PostEditor postId={Number((await params).id)} />; }
