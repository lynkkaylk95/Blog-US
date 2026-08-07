"use client";
import { useAdminLocale } from "./AdminLocale";
export function LogoutButton() { const { t } = useAdminLocale(); return <button className="admin-nav-button" onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); window.location.href = "/admin/login"; }}>⇥ {t("signOut")}</button>; }
