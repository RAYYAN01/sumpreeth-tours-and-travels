import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // All crawlers: the whole public site is open; only the private
        // admin area and internal API are off-limits. CSS/JS/images under
        // /_next are explicitly allowed so Google can render pages.
        userAgent: "*",
        allow: ["/", "/_next/static/", "/_next/image", "/images/"],
        disallow: ["/admin", "/api"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL.replace(/^https?:\/\//, ""),
  };
}
