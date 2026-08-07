import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "../../admin-auth";
import { LogoutButton } from "../components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  if (!await isAdminAuthenticated()) redirect("/admin/login");
  return <div className="admin-shell"><aside className="admin-sidebar"><Link href="/admin" className="admin-brand"><span>P</span><div><b>Porchlight</b><small>ADMIN</small></div></Link><nav><Link href="/admin">▦ Overview</Link><Link href="/admin">▤ Posts</Link><Link href="/admin/posts/new">＋ Add story</Link><Link href="/">↗ View website</Link></nav><div className="admin-sidebar-bottom"><Link href="/admin/settings">⚙ Settings</Link><LogoutButton /></div></aside><div className="admin-workspace"><header className="admin-topbar"><span>Content management</span><Link href="/" target="_blank">Open site ↗</Link></header>{children}</div></div>;
}
