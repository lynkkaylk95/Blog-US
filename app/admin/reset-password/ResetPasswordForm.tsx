"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";

export function ResetPasswordForm({ token }: { token: string }) {
  const [message, setMessage] = useState(""); const [loading, setLoading] = useState(false); const [complete, setComplete] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setMessage("");
    const data = new FormData(event.currentTarget); const password = String(data.get("password") || ""); const confirmation = String(data.get("confirmation") || "");
    if (password !== confirmation) { setMessage("Passwords do not match."); setLoading(false); return; }
    const response = await fetch("/api/admin/reset-password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, password }) });
    const result = await response.json() as { message?: string };
    if (response.ok) { setComplete(true); setMessage("Password updated successfully."); } else setMessage(result.message || "Could not reset password.");
    setLoading(false);
  }
  return <form className="admin-login-card" onSubmit={submit}><div className="admin-logo">P</div><h1>Reset password</h1><p>Create a new password for Porchlight Admin.</p>{complete ? <Link className="admin-login-link" href="/admin/login">Continue to sign in</Link> : <><label htmlFor="new-password">New password</label><input id="new-password" name="password" type="password" minLength={8} autoComplete="new-password" required autoFocus /><label htmlFor="confirm-password">Confirm password</label><input id="confirm-password" name="confirmation" type="password" minLength={8} autoComplete="new-password" required /><button disabled={loading || !token}>{loading ? "Updating…" : "Update password"}</button></>}{message && <div className="admin-message" role="status">{message}</div>}</form>;
}
