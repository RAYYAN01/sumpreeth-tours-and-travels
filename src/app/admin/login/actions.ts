"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminCredentials } from "@/lib/auth";
import { setAdminPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { emailConfigured, sendEmail } from "@/lib/email";
import { issueOtp, verifyOtp } from "@/lib/otp";
import { adminLoginSchema, otpResetSchema } from "@/lib/validation";
import { seedSettingsIfMissing } from "../(panel)/content/ensure";

async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}

const RESET_EMAIL =
  process.env.ADMIN_RESET_EMAIL || "maheshsumpreeth@gmail.com";

// --- Sign in ---------------------------------------------------------------

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const ip = await clientIp();
  const limit = rateLimit(`login:${ip}`, 6, 15 * 60 * 1000);
  if (!limit.ok) {
    return {
      error: `Too many attempts. Try again in ${Math.ceil(
        limit.retryAfterSec / 60,
      )} minute(s).`,
    };
  }

  const parsed = adminLoginSchema.safeParse({
    id: formData.get("id"),
    password: formData.get("password"),
    remember: formData.get("remember") ? "true" : "false",
  });
  if (!parsed.success) return { error: "Enter your ID and password." };

  let ok = false;
  try {
    ok = await verifyAdminCredentials(parsed.data.id, parsed.data.password);
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Login is not configured yet.",
    };
  }
  if (!ok) return { error: "Incorrect ID or password." };

  await createSession(parsed.data.remember);
  const from = String(formData.get("from") ?? "/admin");
  redirect(from.startsWith("/admin") ? from : "/admin");
}

// --- Request a reset code ------------------------------------------------------

export type ResetRequestState = { error?: string; sent?: boolean };

export async function requestResetAction(
  _prev: ResetRequestState,
  _formData: FormData,
): Promise<ResetRequestState> {
  const ip = await clientIp();
  const limit = rateLimit(`otp-request:${ip}`, 3, 60 * 60 * 1000);
  if (!limit.ok) {
    return {
      error: `Too many code requests. Try again in ${Math.ceil(
        limit.retryAfterSec / 60,
      )} minute(s).`,
    };
  }

  if (!emailConfigured()) {
    return {
      error:
        "Password reset by email is not set up yet. Add RESEND_API_KEY to the environment, or change the password from Settings after signing in.",
    };
  }

  try {
    const code = await issueOtp();
    await sendEmail({
      to: RESET_EMAIL,
      subject: "Your Sumpreeth admin reset code",
      text: `Your one-time code is ${code}. It expires in 10 minutes.\n\nIf you did not request this, ignore this email and the code is useless.`,
      html: `<p>Your one-time code is <strong style="font-size:20px;letter-spacing:3px">${code}</strong>.</p><p>It expires in 10 minutes. If you did not request this, you can ignore this email.</p>`,
    });
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Could not send the code.",
    };
  }

  return { sent: true };
}

// --- Reset the password with a code -----------------------------------------

export type ResetState = { error?: string; done?: boolean };

export async function resetPasswordAction(
  _prev: ResetState,
  formData: FormData,
): Promise<ResetState> {
  const ip = await clientIp();
  const limit = rateLimit(`otp-verify:${ip}`, 10, 15 * 60 * 1000);
  if (!limit.ok) {
    return {
      error: `Too many attempts. Try again in ${Math.ceil(
        limit.retryAfterSec / 60,
      )} minute(s).`,
    };
  }

  const parsed = otpResetSchema.safeParse({
    code: formData.get("code"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  }

  const check = await verifyOtp(parsed.data.code);
  if (!check.ok) {
    const msg = {
      missing: "No active code. Request a new one.",
      expired: "That code has expired. Request a new one.",
      locked: "Too many wrong tries. Request a new code.",
      mismatch: "That code is not correct.",
    }[check.reason];
    return { error: msg };
  }

  await seedSettingsIfMissing();
  await setAdminPassword(parsed.data.newPassword);
  return { done: true };
}
