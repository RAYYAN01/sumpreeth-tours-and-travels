import { INDEXNOW_KEY } from "@/lib/indexnow";

/** IndexNow key-verification file — must be served at the site root as
 * `/{key}.txt` returning just the key, per the IndexNow protocol spec. */
export async function GET() {
  return new Response(INDEXNOW_KEY, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
