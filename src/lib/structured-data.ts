import { BUSINESS, SITE_NAME, SITE_URL, canonical } from "./seo";
import type { SiteSettingsData } from "./site";
import type { VehicleView } from "./features";
import { vehiclePhotos } from "./features";

/** LocalBusiness / TravelAgency graph for the site-wide JSON-LD. */
export function businessJsonLd(settings: SiteSettingsData) {
  const sameAs = [
    settings.facebookUrl,
    settings.instagramUrl,
    settings.youtubeUrl,
  ].filter((x): x is string => Boolean(x));

  return {
    "@context": "https://schema.org",
    "@type": ["TravelAgency", "TaxiService", "LocalBusiness"],
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    url: SITE_URL,
    telephone: settings.phone,
    email: settings.email,
    image: canonical("/logo.png"),
    priceRange: BUSINESS.priceRange,
    description:
      "24/7 cab rental and outstation travel service in Bengaluru covering Karnataka and South India — one-way, round trip, airport, local and tour packages.",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.streetAddress,
      addressLocality: BUSINESS.locality,
      postalCode: BUSINESS.postalCode,
      addressRegion: BUSINESS.region,
      addressCountry: BUSINESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.latitude,
      longitude: BUSINESS.longitude,
    },
    areaServed: BUSINESS.areaServed.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** Product + Offer + Vehicle for a fleet detail page. */
export function vehicleJsonLd(vehicle: VehicleView, tagline: string) {
  const url = canonical(`/fleet/${vehicle.slug}`);
  const startingFare =
    vehicle.oneWayRate ??
    vehicle.localPackageRate ??
    (vehicle.roundTripPerKm != null ? vehicle.roundTripPerKm : null);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${vehicle.name} — ${vehicle.seats} seater`,
    description: tagline,
    url,
    image: vehiclePhotos(vehicle).map((src) =>
      src.startsWith("http") ? src : canonical(src),
    ),
    brand: { "@type": "Brand", name: SITE_NAME },
    category: "Car rental with driver",
    ...(startingFare != null && !vehicle.quoteOnRequest
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: String(startingFare),
            availability: "https://schema.org/InStock",
            url,
            seller: { "@id": `${SITE_URL}/#business` },
          },
        }
      : {}),
  };
}

/** FAQPage from the contact-page FAQ list. */
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** BreadcrumbList from an ordered [label, path] trail (path relative). */
export function breadcrumbJsonLd(trail: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: canonical(path),
    })),
  };
}
