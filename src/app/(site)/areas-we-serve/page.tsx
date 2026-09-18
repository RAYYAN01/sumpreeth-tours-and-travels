import Link from "next/link";
import { MapPin, MessageCircle } from "lucide-react";
import { getSiteSettings, getDestinations } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { contactLink } from "@/lib/whatsapp";
import { slugify } from "@/lib/validation";
import { serviceAreaJsonLd } from "@/lib/structured-data";
import { KARNATAKA_AREAS, KARNATAKA_TOWN_COUNT } from "@/lib/karnataka-areas";
import PageHeader from "@/components/site/PageHeader";
import Section from "@/components/site/Section";
import CtaBanner from "@/components/site/CtaBanner";

export const revalidate = 3600;

export const metadata = pageMeta({
  title: "Areas We Serve — One-Way Taxi Across Karnataka",
  description: `One-way, round-trip and local taxi coverage across all 31 Karnataka districts — ${KARNATAKA_TOWN_COUNT}+ towns and taluks, from Bengaluru to the interior.`,
  path: "/areas-we-serve",
});

export default async function AreasWeServePage() {
  const [settings, destinations] = await Promise.all([
    getSiteSettings(),
    getDestinations(),
  ]);
  const destSlugs = new Set(destinations.map((d) => d.slug));
  const waHref = contactLink(settings.whatsappNumber);
  const allTowns = KARNATAKA_AREAS.flatMap((d) => d.towns);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceAreaJsonLd(allTowns)) }}
      />

      <PageHeader
        trail={[["Areas We Serve", "/areas-we-serve"]]}
        eyebrow="Coverage"
        title="One-Way & Outstation Taxi Across Every District of Karnataka"
        intro={`Sumpreeth Tours and Travels runs one-way cabs, round trips and local rentals to ${KARNATAKA_TOWN_COUNT}+ towns and taluks across all 31 Karnataka districts — not just the well-known tourist routes. Don't see your town below? Ask us on WhatsApp; we cover interior Karnataka on request.`}
      />

      <Section>
        <p className="reveal max-w-3xl text-sm text-bodytext">
          Browse by district for a one-way sedan, SUV or tempo traveller to
          any taluk headquarters or town listed here. Towns with a dedicated
          route guide link through to full trip details; every other town is
          still a real pickup/drop point — message us on WhatsApp for a fare.
        </p>

        <div className="reveal-stagger mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {KARNATAKA_AREAS.map((d) => (
            <div key={d.district} className="reveal card p-5">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-ink">
                <MapPin className="h-4 w-4 shrink-0 text-forest-500 dark:text-forest-400" />
                {d.district}
              </h2>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {d.towns.map((town) => {
                  const slug = slugify(town);
                  const hasPage = destSlugs.has(slug);
                  return (
                    <li key={town}>
                      {hasPage ? (
                        <Link
                          href={`/destination/${slug}`}
                          className="inline-block rounded-full bg-forest-50 px-2.5 py-1 text-xs font-medium text-forest-800 hover:bg-forest-100 dark:bg-white/[0.04] dark:text-forest-200"
                        >
                          {town}
                        </Link>
                      ) : (
                        <span className="inline-block rounded-full bg-page px-2.5 py-1 text-xs text-bodytext ring-1 ring-line">
                          {town}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="reveal mt-10 rounded-2xl bg-forest-50 p-5 text-sm text-ink dark:bg-white/[0.04]">
          <p className="font-semibold">Don&apos;t see your exact village or pickup point?</p>
          <p className="mt-1 text-bodytext">
            This list covers every taluk and major town, but we drive to
            interior villages too. Share your pickup and drop location on
            WhatsApp and we&apos;ll confirm a one-way or round-trip fare.
          </p>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            data-track="whatsapp"
            className="btn-accent btn-sm mt-4"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Ask on WhatsApp
          </a>
        </div>
      </Section>

      <CtaBanner text={settings.ctaBannerText} phone={settings.phone} whatsappHref={waHref} />
    </>
  );
}
