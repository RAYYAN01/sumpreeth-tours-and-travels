import { NextResponse, type NextRequest } from "next/server";
import sitemap from "@/app/sitemap";
import { submitToIndexNow } from "@/lib/indexnow";

export const runtime = "nodejs";

/**
 * Submits every URL currently in the sitemap to IndexNow (Bing/Yandex —
 * Google does not support this protocol). Same auth as /api/revalidate.
 */
export async function POST(req: NextRequest) {
  const provided =
    req.nextUrl.searchParams.get("secret") ??
    req.headers.get("x-revalidate-secret");
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected || provided !== expected) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  const entries = await sitemap();
  const urls = entries.map((e) => e.url);
  const result = await submitToIndexNow(urls);

  return NextResponse.json({ ...result, submitted: urls.length, at: Date.now() });
}
