import type { Metadata } from "next";
import { PostEditor } from "../../../components/PostEditor";
export const metadata: Metadata = { title: "Add Post — Admin", robots: { index: false, follow: false } };
export default function NewPostPage() { return <PostEditor />; }
