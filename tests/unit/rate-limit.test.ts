import { describe, it, expect } from "vitest";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("counts down remaining and blocks past the limit", () => {
    const key = `t-${Math.random()}`;
    const a = rateLimit(key, 3, 60_000);
    expect(a.ok).toBe(true);
    expect(a.remaining).toBe(2);

    rateLimit(key, 3, 60_000);
    rateLimit(key, 3, 60_000);
    const blocked = rateLimit(key, 3, 60_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
  });
});

describe("rateLimitHeaders", () => {
  it("emits RateLimit-* and adds Retry-After only when blocked", () => {
    const ok = rateLimitHeaders({
      ok: true,
      retryAfterSec: 0,
      remaining: 5,
      limit: 8,
      resetSec: Math.ceil(Date.now() / 1000) + 30,
    });
    expect(ok["RateLimit-Limit"]).toBe("8");
    expect(ok["RateLimit-Remaining"]).toBe("5");
    expect(ok["Retry-After"]).toBeUndefined();

    const blocked = rateLimitHeaders({
      ok: false,
      retryAfterSec: 12,
      remaining: 0,
      limit: 8,
      resetSec: Math.ceil(Date.now() / 1000) + 12,
    });
    expect(blocked["Retry-After"]).toBe("12");
  });
});
