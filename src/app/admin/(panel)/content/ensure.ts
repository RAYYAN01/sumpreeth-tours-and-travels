import "server-only";
import { prisma } from "@/lib/db";

/** Create the singleton SiteSettings row with safe defaults if the seed never ran. */
export async function seedSettingsIfMissing() {
  return prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      heroHeadline: "Reliable Cabs & Outstation Travel Across Karnataka, 24/7",
      heroSubheadline:
        "Cars, tempo travellers and buses for airport, local and multi-day trips across Karnataka and South India.",
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
    },
  });
}
