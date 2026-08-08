"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function NewsletterForm() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          website: formData.get("website"),
        }),
      });
      const result = await response.json() as { message?: string };

      if (!response.ok) throw new Error(result.message || "We could not add you right now.");

      form.reset();
      setState("success");
      setMessage(result.message || "Thank you for joining Porchlight Stories.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Please try again later.");
    }
  }

  return (
    <form onSubmit={subscribe} className="newsletter-form">
      <label htmlFor="newsletter-email">Email address</label>
      <input id="newsletter-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      <div className="form-trap" aria-hidden="true">
        <label htmlFor="newsletter-website">Website</label>
        <input id="newsletter-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Joining…" : "Join the porch"}
      </button>
      <small>By joining, you agree to receive our weekly story. Unsubscribe anytime.</small>
      <p className={`form-message form-message--${state}`} role="status" aria-live="polite">{message}</p>
    </form>
  );
}
