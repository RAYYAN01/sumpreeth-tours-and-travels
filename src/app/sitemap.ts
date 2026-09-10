import type { MetadataRoute } from "next";
import { getVehicles, getDestinations } from "@/lib/site";
import { vehiclePhotos } from "@/lib/features";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const abs = (path: string) => new URL(path, SITE_URL).toString();
  const absImg = (src: string) =>
    src.startsWith("http") ? src : new URL(src, SITE_URL).toString();

  let vehicles: Awaited<ReturnType<typeof getVehicles>> = [];
  let destinations: Awaited<ReturnType<typeof getDestinations>> = [];
  try {
    [vehicles, destinations] = await Promise.all([
      getVehicles(),
      getDestinations(),
    ]);
  } catch {
    /* fall back to routes only */
  }

  const fleetImages = vehicles
    .flatMap((v) => vehiclePhotos(v))
    .map(absImg)
    .slice(0, 20);
  const destImages = destinations
    .map((d) => d.imageUrl)
    .filter(Boolean)
    .map(absImg)
    .slice(0, 20);

  const entries: Entry[] = [
    { url: abs("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: abs("/fleet"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      images: fleetImages,
    },
    {
      url: abs("/destination"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
      images: destImages,
    },
    {
      url: abs("/gallery"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
      images: fleetImages,
    },
    { url: abs("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: abs("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: abs("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: abs("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  for (const v of vehicles) {
    if (!v.slug) continue;
    entries.push({
      url: abs(`/fleet/${v.slug}`),
      lastModified: v.updatedAt ?? now,
      changeFrequency: "monthly",
      priority: 0.7,
      images: vehiclePhotos(v).map(absImg).slice(0, 10),
    });
  }

  return entries;
}
