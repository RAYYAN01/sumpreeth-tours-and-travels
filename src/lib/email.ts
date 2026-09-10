import "server-only";

/**
 * Minimal transactional email via Resend's HTTP API (no SDK dependency).
 * Configure with:
 *   RESEND_API_KEY   — from https://resend.com (free tier is plenty here)
 *   EMAIL_FROM       — verified sender, e.g. "Sumpreeth <noreply@yourdomain>"
 *                      (Resend's "onboarding@resend.dev" also works, but only
 *                       delivers to the address that owns the Resend account)
 */

const API = "https://api.resend.com/emails";

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error(
      "Email is not configured. Set RESEND_API_KEY (and EMAIL_FROM) in the environment.",
    );
  }
  const from = process.env.EMAIL_FROM || "Sumpreeth <onboarding@resend.dev>";

  const res = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [opts.to],
      subject: opts.subject,
      text: opts.text,
      ...(opts.html ? { html: opts.html } : {}),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Email send failed (${res.status}). ${detail.slice(0, 200)}`);
  }
}
