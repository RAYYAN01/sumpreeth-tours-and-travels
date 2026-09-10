import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { TAGS } from "@/lib/site";

export const runtime = "nodejs";

/**
 * Purges every public data-cache tag. Needed because Vercel's Data Cache
 * persists across deployments, so an `unstable_cache` entry populated while the
 * database was unreachable (e.g. before it was provisioned) would otherwise be
 * served stale until its TTL expires.
 *
 * Auth: `?secret=` query param or `x-revalidate-secret` header must equal
 * `REVALIDATE_SECRET`.
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

  const tags = Object.values(TAGS);
  for (const tag of tags) revalidateTag(tag, "max");

  return NextResponse.json({ ok: true, revalidated: tags, at: Date.now() });
}
