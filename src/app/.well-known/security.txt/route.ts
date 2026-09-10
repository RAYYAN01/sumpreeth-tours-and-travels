import { BUSINESS, SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z");

  const body = [
    `Contact: mailto:${BUSINESS.email}`,
    `Expires: ${expires}`,
    "Preferred-Languages: en",
    `Canonical: ${SITE_URL}/.well-known/security.txt`,
    `Policy: ${SITE_URL}/privacy`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
