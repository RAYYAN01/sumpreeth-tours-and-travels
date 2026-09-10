/**
 * Tiny in-memory fixed-window rate limiter. Good enough for a single-instance
 * deploy (login brute-force + enquiry spam). Swap for Upstash/Redis if the app
 * scales to multiple instances.
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }
  return { ok: true, retryAfterSec: 0 };
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
