"use client";
import { FormEvent, useState } from "react";

export function LoginForm() {
  const [message, setMessage] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage("");
    const password = String(new FormData(event.currentTarget).get("password") || "");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
    const result = await response.json() as { message?: string };
    if (response.ok) window.location.href = "/admin"; else { setMessage(result.message || "Login failed."); setLoading(false); }
  }
  return <form className="admin-login-card" onSubmit={submit}><div className="admin-logo">P</div><h1>Porchlight Admin</h1><p>Sign in to manage stories.</p><label htmlFor="admin-password">Admin password</label><input id="admin-password" name="password" type="password" autoComplete="current-password" required autoFocus /><button disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>{message && <div className="admin-error" role="alert">{message}</div>}</form>;
}
