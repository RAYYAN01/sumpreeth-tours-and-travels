import type { MetadataRoute } from "next";
import { getVehicles } from "@/lib/site";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const abs = (path: string) => new URL(path, SITE_URL).toString();

  const entries: Entry[] = [
    { url: abs("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: abs("/fleet"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: abs("/destination"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: abs("/gallery"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: abs("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: abs("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: abs("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    const vehicles = await getVehicles();
    for (const v of vehicles) {
      if (!v.slug) continue;
      entries.push({
        url: abs(`/fleet/${v.slug}`),
        lastModified: v.updatedAt ?? now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch {
    // Fall back to the core routes only.
  }

  return entries;
}
