import { SITE_URL } from "./seo";

/**
 * IndexNow (indexnow.org) — a real, no-login protocol that Bing and Yandex
 * (and a few smaller engines) support for near-instant crawl notification.
 * Google does not participate in IndexNow; there is no equivalent public API
 * for Google, and no website-side action can add a business to Google Maps —
 * that requires a verified Google Business Profile, a separate account-level
 * step only the business owner can do.
 *
 * The key below is published (not secret) at /{key}.txt, exactly as the
 * protocol requires for domain ownership verification.
 */
export const INDEXNOW_KEY = "24ee46446e20d7b2322434188fd0a5f0";

/** Submit one or more absolute URLs to IndexNow. Best-effort; never throws. */
export async function submitToIndexNow(urls: string[]): Promise<{
  ok: boolean;
  status?: number;
}> {
  if (urls.length === 0) return { ok: true };
  try {
    const host = new URL(SITE_URL).hostname;
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });
    return { ok: res.ok, status: res.status };
  } catch {
    return { ok: false };
  }
}
