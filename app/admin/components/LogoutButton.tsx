"use client";
export function LogoutButton() { return <button className="admin-nav-button" onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); window.location.href = "/admin/login"; }}>⇥ Sign out</button>; }
