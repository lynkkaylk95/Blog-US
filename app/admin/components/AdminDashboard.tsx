"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Post = { id: number; slug: string; title: string; imageUrl: string; status: "draft" | "published"; updatedAt: string; category: string };

export function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("Loading posts…");

  async function load() {
    const response = await fetch("/api/admin/posts");
    const result = await response.json() as { posts?: Post[]; message?: string };
    if (response.status === 401) return void (window.location.href = "/admin/login");
    setPosts(result.posts || []);
    setMessage(response.ok ? "" : result.message || "Could not load posts.");
  }

  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, []);
  const visible = useMemo(() => posts.filter((post) => (filter === "all" || post.status === filter) && `${post.title} ${post.slug}`.toLowerCase().includes(query.toLowerCase())), [posts, query, filter]);
  const published = posts.filter((post) => post.status === "published").length;

  async function remove(post: Post) {
    if (!confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    const response = await fetch(`/api/admin/posts/${post.id}`, { method: "DELETE" });
    if (response.ok) setPosts((items) => items.filter((item) => item.id !== post.id));
    else alert("Could not delete this post.");
  }
  async function copy(post: Post) {
    await navigator.clipboard.writeText(`${window.location.origin}/story/${post.slug}`);
    setMessage("Link copied."); window.setTimeout(() => setMessage(""), 1800);
  }
  async function importStories() {
    setMessage("Importing bundled stories…");
    const response = await fetch("/api/admin/import-markdown", { method: "POST" });
    const result = await response.json() as { imported?: number; message?: string };
    if (!response.ok) return setMessage(result.message || "Import failed.");
    setMessage(`${result.imported || 0} stories imported.`);
    await load();
  }

  return <main className="admin-main">
    <div className="admin-page-title"><div><span>Blog</span><h1>Manage posts</h1><p>Create, edit and publish Porchlight stories.</p></div><div className="admin-title-actions"><button type="button" onClick={importStories}>Import existing stories</button><Link className="admin-primary" href="/admin/posts/new">＋ Add post</Link></div></div>
    <section className="admin-stats"><article><span>Total posts</span><b>{posts.length}</b></article><article><span>Published</span><b>{published}</b></article><article><span>Drafts</span><b>{posts.length - published}</b></article></section>
    <section className="admin-panel"><div className="admin-filters"><input type="search" placeholder="Search title or slug…" value={query} onChange={(event) => setQuery(event.target.value)} /><select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Draft</option></select><span>{visible.length} posts</span></div>{message && <div className="admin-notice" role="status">{message}</div>}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Story</th><th>Category</th><th>Updated</th><th>Status</th><th>Actions</th></tr></thead><tbody>{visible.map((post) => <tr key={post.id}><td><div className="admin-post-title"><img src={post.imageUrl} alt="" /><div><b>{post.title}</b><small>/{post.slug}</small></div></div></td><td>{post.category}</td><td>{new Date(post.updatedAt).toLocaleDateString("en-US")}</td><td><span className={`status status--${post.status}`}>{post.status}</span></td><td><div className="admin-actions">{post.status === "published" && <Link title="View" href={`/story/${post.slug}`} target="_blank">↗</Link>}<button title="Copy link" onClick={() => copy(post)}>⧉</button><Link title="Edit" href={`/admin/posts/${post.id}`}>✎</Link><button className="danger" title="Delete" onClick={() => remove(post)}>⌫</button></div></td></tr>)}</tbody></table>{!message && !visible.length && <div className="admin-empty">No posts match these filters.</div>}</div></section>
  </main>;
}
