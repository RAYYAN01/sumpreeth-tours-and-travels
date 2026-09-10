import { SignJWT, jwtVerify } from "jose";
import { SESSION_MAX_AGE } from "./constants";

/**
 * Edge-safe JWT helpers (no `next/headers`, no `server-only`) so they can be
 * used from middleware as well as server components / actions.
 */

function secretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET is missing or too short (min 16 chars).",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(): Promise<string> {
  return new SignJWT({ sub: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifySessionToken(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.sub === "admin";
  } catch {
    return false;
  }
}

/**
 * Returns `{ valid, exp }` for a session token in one verification pass so
 * middleware can decide whether to slide the expiry without re-verifying.
 * `exp` is Unix seconds, or `null` when the token is missing/invalid.
 */
export async function inspectSessionToken(
  token: string | undefined | null,
): Promise<{ valid: boolean; exp: number | null }> {
  if (!token) return { valid: false, exp: null };
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.sub !== "admin") return { valid: false, exp: null };
    return { valid: true, exp: typeof payload.exp === "number" ? payload.exp : null };
  } catch {
    return { valid: false, exp: null };
  }
}
