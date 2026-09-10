import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "./db";
import { decodeFeatures, type VehicleView } from "./features";

export type { VehicleView };

/**
 * Cached read helpers for the public site. Each is tagged so the admin portal
 * can call `revalidateTag(...)` after a mutation and have pages refresh within
 * seconds without losing full-page caching.
 */

export const TAGS = {
  settings: "site-settings",
  vehicles: "vehicles",
  destinations: "destinations",
  testimonials: "testimonials",
  faqs: "faqs",
} as const;

const FALLBACK_SETTINGS = {
  id: "singleton",
  heroHeadline: "Reliable Cabs & Outstation Travel Across Karnataka, 24/7",
  heroSubheadline:
    "Cars, tempo travellers and buses for airport runs, local errands and multi-day road trips across Karnataka and South India.",
  heroImageUrl: "/images/fleet/IMG-20260901-WA0058.jpg",
  aboutStory:
    "Sumpreeth Tours and Travels is a Bangalore-based cab and outstation travel service focused on reliable, comfortable and safe rides.",
  aboutPromise:
    "Timeliness, cleanliness, safety and professionalism on every trip — with transparent pricing and no hidden charges.",
  trustYears: "12+",
  trustTrips: "50,000+",
  trustCities: "180+",
  ctaBannerText: "Plan your next trip with Sumpreeth Tours and Travels",
  phone: "+91 94486 48898",
  whatsappNumber: "919448648898",
  email: "info@sumpreethtoursandtravels.com",
  address: "Bangalore – 560078, Karnataka, India",
  hours: "Open all days · 24/7",
  mapEmbedUrl: "https://www.google.com/maps?q=Bangalore%20560078&output=embed",
  facebookUrl: null as string | null,
  instagramUrl: null as string | null,
  youtubeUrl: null as string | null,
  adminPasswordHash: null as string | null,
  updatedAt: new Date(0),
};

export type SiteSettingsData = typeof FALLBACK_SETTINGS;

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettingsData> => {
    try {
      const row = await prisma.siteSettings.findUnique({
        where: { id: "singleton" },
      });
      return row ?? FALLBACK_SETTINGS;
    } catch {
      return FALLBACK_SETTINGS;
    }
  },
  ["site-settings"],
  { tags: [TAGS.settings], revalidate: 3600 },
);

export const getVehicles = unstable_cache(
  async (): Promise<VehicleView[]> => {
    try {
      const rows = await prisma.vehicle.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      });
      return rows.map((r) => ({
        ...r,
        features: decodeFeatures(r.features),
        images: decodeFeatures(r.images),
      }));
    } catch {
      return [];
    }
  },
  ["vehicles"],
  { tags: [TAGS.vehicles], revalidate: 3600 },
);

/** Single active vehicle by slug, with features/images decoded. */
export async function getVehicleBySlug(
  slug: string,
): Promise<VehicleView | null> {
  const all = await getVehicles();
  return all.find((v) => v.slug === slug) ?? null;
}

export const getDestinations = unstable_cache(
  async () => {
    try {
      return await prisma.destination.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      });
    } catch {
      return [];
    }
  },
  ["destinations"],
  { tags: [TAGS.destinations], revalidate: 3600 },
);

export const getTestimonials = unstable_cache(
  async () => {
    try {
      return await prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      });
    } catch {
      return [];
    }
  },
  ["testimonials"],
  { tags: [TAGS.testimonials], revalidate: 3600 },
);

export const getFaqs = unstable_cache(
  async () => {
    try {
      return await prisma.faqItem.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      });
    } catch {
      return [];
    }
  },
  ["faqs"],
  { tags: [TAGS.faqs], revalidate: 3600 },
);
