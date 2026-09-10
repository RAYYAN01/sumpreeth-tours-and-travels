/**
 * Tiny in-memory fixed-window rate limiter. Good enough for a single-instance
 * deploy (login brute-force + enquiry spam). Swap for Upstash/Redis if the app
 * scales to multiple instances.
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  ok: boolean;
  retryAfterSec: number;
  /** Requests still allowed in the current window. */
  remaining: number;
  /** Configured ceiling for the window. */
  limit: number;
  /** Unix seconds when the window resets. */
  resetSec: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return {
      ok: true,
      retryAfterSec: 0,
      remaining: limit - 1,
      limit,
      resetSec: Math.ceil(resetAt / 1000),
    };
  }

  existing.count += 1;
  const resetSec = Math.ceil(existing.resetAt / 1000);
  if (existing.count > limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
      remaining: 0,
      limit,
      resetSec,
    };
  }
  return {
    ok: true,
    retryAfterSec: 0,
    remaining: Math.max(0, limit - existing.count),
    limit,
    resetSec,
  };
}

/** Standard `RateLimit-*` (+ `Retry-After` when blocked) response headers. */
export function rateLimitHeaders(r: RateLimitResult): Record<string, string> {
  const h: Record<string, string> = {
    "RateLimit-Limit": String(r.limit),
    "RateLimit-Remaining": String(r.remaining),
    "RateLimit-Reset": String(Math.max(0, r.resetSec - Math.ceil(Date.now() / 1000))),
  };
  if (!r.ok) h["Retry-After"] = String(r.retryAfterSec);
  return h;
}

// Opportunistic cleanup so the map doesn't grow forever.
if (typeof setInterval !== "undefined") {
  const t = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k);
  }, 60_000);
  // Don't keep the process alive just for cleanup.
  (t as unknown as { unref?: () => void }).unref?.();
}
