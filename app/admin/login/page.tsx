import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "../../admin-auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin Login", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function AdminLoginPage() { if (await isAdminAuthenticated()) redirect("/admin"); return <main className="admin-login"><LoginForm /></main>; }
