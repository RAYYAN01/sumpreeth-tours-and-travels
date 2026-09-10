"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    hdrs.get("x-real-ip") ??
    "unknown";

  const limit = rateLimit(`login:${ip}`, 6, 15 * 60 * 1000); // 6 tries / 15 min
  if (!limit.ok) {
    return {
      error: `Too many attempts. Try again in ${Math.ceil(
        limit.retryAfterSec / 60,
      )} minute(s).`,
    };
  }

  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Enter the password." };

  let ok = false;
  try {
    ok = await verifyAdminPassword(password);
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "Login is not configured yet.",
    };
  }

  if (!ok) return { error: "Incorrect password." };

  await createSession();
  const from = String(formData.get("from") ?? "/admin");
  redirect(from.startsWith("/admin") ? from : "/admin");
}
