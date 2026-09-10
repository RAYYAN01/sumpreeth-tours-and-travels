/**
 * Pure, edge-safe helpers for `middleware.ts`: canonical host / HTTPS
 * redirects, hostile-request filtering and a per-IP burst limiter. Kept
 * dependency-free so it can be unit tested in isolation.
 */

/** Paths that only vulnerability scanners ever request. */
export const HOSTILE_PATH_RE =
  /(^|\/)(wp-login\.php|wp-admin|xmlrpc\.php|\.env(\.|$)|\.git(\/|$)|\.aws(\/|$)|\.ssh(\/|$)|phpmyadmin|vendor\/phpunit|actuator\/|config\.json|id_rsa)/i;

const BAD_METHODS = new Set(["TRACE", "TRACK", "CONNECT"]);

export function isBlockedRequest(pathname: string, method: string): boolean {
  if (BAD_METHODS.has(method.toUpperCase())) return true;
  return HOSTILE_PATH_RE.test(pathname);
}

/** True for hosts that must never be redirected to the canonical host. */
export function isLocalOrPreviewHost(host: string): boolean {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h === "0.0.0.0" ||
    h.endsWith(".local") ||
    h.endsWith(".vercel.app")
  );
}

type CanonicalInput = {
  proto: string | null;
  host: string;
  pathname: string;
  search: string;
  canonicalHost?: string;
  isProd: boolean;
};

/**
 * Returns the absolute URL to 308-redirect to when the request is on http or
 * on a non-canonical host, otherwise `null`. No-ops for local/preview hosts.
 */
export function canonicalRedirect({
  proto,
  host,
  pathname,
  search,
  canonicalHost,
  isProd,
}: CanonicalInput): string | null {
  if (!isProd || isLocalOrPreviewHost(host)) return null;

  const wantHost = (canonicalHost || "").replace(/^https?:\/\//, "").trim();
  const targetHost = wantHost || host.split(":")[0];
  const isHttp = proto !== null && proto !== "https";
  const wrongHost = wantHost !== "" && host.split(":")[0] !== wantHost;

  if (!isHttp && !wrongHost) return null;
  return `https://${targetHost}${pathname}${search}`;
}

// --- Per-IP burst limiter (in-memory; single instance) -----------------------

type Bucket = { count: number; resetAt: number };
const bursts = new Map<string, Bucket>();

export function burstLimit(
  ip: string,
  limit = 40,
  windowMs = 10_000,
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();

  // Opportunistic cleanup so the map can't grow without bound.
  if (bursts.size > 5000) {
    for (const [k, v] of bursts) if (v.resetAt < now) bursts.delete(k);
  }

  const b = bursts.get(ip);
  if (!b || b.resetAt < now) {
    bursts.set(ip, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  b.count += 1;
  if (b.count > limit) {
    return { ok: false, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfterSec: 0 };
}
