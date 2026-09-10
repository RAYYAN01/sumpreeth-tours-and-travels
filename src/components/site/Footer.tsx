import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube } from "lucide-react";
import type { SiteSettingsData } from "@/lib/site";

const EXPLORE: [string, string][] = [
  ["/", "Home"],
  ["/fleet", "Fleet & rates"],
  ["/destination", "Destinations"],
  ["/gallery", "Photo gallery"],
  ["/about", "About us"],
  ["/contact", "Contact & FAQ"],
];

const POPULAR_ROUTES = [
  "Madikeri / Coorg",
  "Chikmagalur",
  "Hampi",
  "Mysore",
  "Ooty",
  "Tirupati",
];

export default function Footer({ settings }: { settings: SiteSettingsData }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-forest-900 text-forest-100">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link
            href="/"
            aria-label="Sumpreeth Tours and Travels — home"
            className="inline-flex rounded-lg bg-white p-2 shadow-sm"
          >
            <Image
              src="/logo.png"
              alt="Sumpreeth Tours and Travels"
              width={512}
              height={512}
              className="h-16 w-auto"
            />
          </Link>
          <p className="mt-4 text-sm text-forest-200/80">
            24/7 cabs, tempo travellers and buses for airport, local and
            outstation trips across Karnataka and South India.
          </p>
          <div className="mt-4 flex gap-3">
            {settings.facebookUrl && (
              <a href={settings.facebookUrl} aria-label="Facebook" className="hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} aria-label="Instagram" className="hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {settings.youtubeUrl && (
              <a href={settings.youtubeUrl} aria-label="YouTube" className="hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            Explore
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {EXPLORE.map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-forest-200/80 hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            Popular routes
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {POPULAR_ROUTES.map((name) => (
              <li key={name}>
                <Link
                  href={`/contact?destination=${encodeURIComponent(name)}`}
                  className="text-forest-200/80 hover:text-white"
                >
                  Bangalore → {name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/destination"
                className="font-semibold text-saffron-200 hover:text-white"
              >
                All destinations →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-forest-200/80">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0" />
              <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="hover:text-white">
                {settings.phone}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" />
              <a href={`mailto:${settings.email}`} className="hover:text-white">
                {settings.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{settings.address}</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{settings.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-forest-200/70 sm:flex-row">
          <p>© {year} Sumpreeth Tours and Travels. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy &amp; Cookies
            </Link>
            <Link href="/admin" className="hover:text-white">
              Staff login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
