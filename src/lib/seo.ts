import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE_NAME = "Sumpreeth Tours and Travels";

/**
 * Name / address / phone / geo — the single source of truth for every place
 * the business identity is rendered (header, footer, contact, JSON-LD,
 * sitemap). Keep this consistent with the DB `SiteSettings` defaults.
 */
export const BUSINESS = {
  name: SITE_NAME,
  legalName: "Sumpreeth Tours and Travels",
  phone: "+91 94486 48898",
  email: "info@sumpreethtoursandtravels.com",
  streetAddress: "Bangalore",
  locality: "Bengaluru",
  region: "Karnataka",
  postalCode: "560078",
  country: "IN",
  // Approximate centroid of the 560078 (JP Nagar / Bengaluru South) service base.
  latitude: 12.8916,
  longitude: 77.5847,
  priceRange: "₹₹",
  areaServed: [
    "Bengaluru",
    "Karnataka",
    "Tamil Nadu",
    "Kerala",
    "Andhra Pradesh",
    "Telangana",
  ],
} as const;

/** Absolute canonical URL for a path (`/fleet`, `/` …). */
export function canonical(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** OG image path relative to the site root. */
  image?: string;
  /** Set true for thin/utility pages that should not be indexed. */
  noindex?: boolean;
};

/**
 * Builds a consistent per-route `Metadata` block: canonical + Open Graph +
 * Twitter, derived from one title/description/path.
 */
export const DEFAULT_OG_IMAGE = "/og.jpg";

export function pageMeta({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  noindex = false,
}: PageMetaInput): Metadata {
  const url = canonical(path);
  // Top-level `title` stays bare so the root layout template appends the brand;
  // OG/Twitter get the fully-qualified title since no template applies there.
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: SITE_NAME,
      url,
      title: fullTitle,
      description,
      images: [
        {
          url: image,
          width: image === DEFAULT_OG_IMAGE ? 1200 : undefined,
          height: image === DEFAULT_OG_IMAGE ? 630 : undefined,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
