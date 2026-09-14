import { notFound } from "next/navigation";
import Image from "next/image";
import { Check, MapPin, MessageCircle, Phone, X as XIcon } from "lucide-react";
import { getPackages, getPackageBySlug, getSiteSettings } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { rupees } from "@/lib/format";
import { contactLink, telLink } from "@/lib/whatsapp";
import { packageJsonLd, faqJsonLd } from "@/lib/structured-data";
import {
  PACKAGE_STATE_LABELS,
  type PackageState,
} from "@/lib/constants";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import Section from "@/components/site/Section";
import PackageCard from "@/components/site/PackageCard";
import PackageEnquiryForm from "@/components/site/PackageEnquiryForm";
import FaqAccordion from "@/components/site/FaqAccordion";
import CtaBanner from "@/components/site/CtaBanner";

export const revalidate = 600;

export async function generateStaticParams() {
  const packages = await getPackages();
  return packages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return { title: "Package not found", robots: { index: false } };

  return pageMeta({
    title: pkg.seoTitle || `${pkg.title} — Rates & Itinerary`,
    description:
      pkg.seoDescription ||
      `${pkg.shortDescription} ${pkg.durationNights} nights / ${pkg.durationDays} days from Bangalore.`,
    path: `/tours-packages/${pkg.slug}`,
    image: pkg.featuredImage,
  });
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [pkg, allPackages, settings] = await Promise.all([
    getPackageBySlug(slug),
    getPackages(),
    getSiteSettings(),
  ]);
  if (!pkg) notFound();

  const wa = contactLink(
    settings.whatsappNumber,
    `Hi, I am interested in the ${pkg.title}. Please share the itinerary and quotation.`,
  );

  const related = allPackages
    .filter((p) => p.slug !== pkg.slug && p.state === pkg.state)
    .slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(packageJsonLd(pkg)) }}
      />
      {pkg.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(pkg.faq)) }}
        />
      )}

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-forest-900 pt-28 text-white sm:pt-36">
        <Image
          src={pkg.featuredImage}
          alt={pkg.title}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-900/95 via-forest-900/80 to-forest-900/55"
        />
        <div className="container-page relative pb-14">
          <div className="mb-5 [&_a:hover]:text-white [&_a]:text-white/70 [&_[aria-current]]:text-white [&_svg]:text-white/40">
            <Breadcrumbs
              trail={[
                ["Tours & Packages", "/tours-packages"],
                [PACKAGE_STATE_LABELS[pkg.state as PackageState] ?? pkg.state, `/tours-packages?state=${pkg.state}`],
                [pkg.title, `/tours-packages/${pkg.slug}`],
              ]}
            />
          </div>
          <p className="mb-3 text-eyebrow font-bold uppercase text-saffron-300">
            {pkg.route}
          </p>
          <h1 className="max-w-3xl text-h1 font-extrabold !text-white">{pkg.title}</h1>
          <p className="mt-4 max-w-2xl text-lead text-forest-100/85">
            {pkg.shortDescription}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="text-2xl font-extrabold tabular-nums text-white">
              {pkg.startingPrice != null ? rupees(pkg.startingPrice) : "On request"}
            </span>
            {pkg.startingPrice != null && (
              <span className="text-sm text-forest-100/70">
                {pkg.priceType === "PER_PERSON" ? "per person" : "per package"} ·{" "}
                {pkg.durationNights}N / {pkg.durationDays}D
              </span>
            )}
            {pkg.startingPrice == null && (
              <span className="text-sm text-forest-100/70">
                {pkg.durationNights}N / {pkg.durationDays}D
              </span>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-accent btn-shine">
              <MessageCircle className="h-4 w-4" />
              Get Quote on WhatsApp
            </a>
            <a href={telLink(settings.phone)} className="btn-white">
              <Phone className="h-4 w-4" />
              {settings.phone}
            </a>
          </div>
        </div>
      </section>

      <Section className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-10">
          {/* Overview */}
          <div className="reveal">
            <h2 className="text-h3 font-bold text-ink">Overview</h2>
            <p className="mt-3 whitespace-pre-line text-bodytext">{pkg.description}</p>
          </div>

          {/* Highlights */}
          {pkg.tags.length > 0 && (
            <div className="reveal">
              <h2 className="text-h3 font-bold text-ink">Tour Highlights</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {pkg.tags.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-sm text-ink">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest-500 dark:text-forest-400" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Itinerary */}
          {pkg.itinerary.length > 0 && (
            <div className="reveal">
              <h2 className="text-h3 font-bold text-ink">Detailed Itinerary</h2>
              <ol className="mt-4 space-y-4">
                {pkg.itinerary.map((d) => (
                  <li key={d.day} className="card p-4 sm:p-5">
                    <p className="eyebrow">Day {d.day}</p>
                    <h3 className="mt-1 text-h4 font-bold text-ink">{d.title}</h3>
                    {d.description && (
                      <p className="mt-1.5 text-sm text-bodytext">{d.description}</p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Inclusions / Exclusions */}
          {(pkg.inclusions.length > 0 || pkg.exclusions.length > 0) && (
            <div className="reveal grid gap-6 sm:grid-cols-2">
              {pkg.inclusions.length > 0 && (
                <div>
                  <h2 className="text-h4 font-bold text-ink">Package Inclusions</h2>
                  <ul className="mt-3 space-y-2">
                    {pkg.inclusions.map((i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest-500 dark:text-forest-400" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pkg.exclusions.length > 0 && (
                <div>
                  <h2 className="text-h4 font-bold text-ink">Package Exclusions</h2>
                  <ul className="mt-3 space-y-2">
                    {pkg.exclusions.map((i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-bodytext">
                        <XIcon className="mt-0.5 h-4 w-4 shrink-0 text-forest-400" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Vehicle options */}
          {pkg.vehicleOptions.length > 0 && (
            <div className="reveal">
              <h2 className="text-h4 font-bold text-ink">Vehicle Options</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {pkg.vehicleOptions.map((v) => (
                  <li
                    key={v}
                    className="rounded-full bg-forest-50 px-3.5 py-1.5 text-sm font-semibold text-forest-800 dark:bg-white/[0.04] dark:text-forest-200"
                  >
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pricing note */}
          <div className="reveal rounded-2xl bg-forest-50 p-5 text-sm text-ink dark:bg-white/[0.04]">
            <p className="font-semibold">
              Starting from{" "}
              {pkg.startingPrice != null ? rupees(pkg.startingPrice) : "— on request"}
            </p>
            <p className="mt-1 text-bodytext">
              Final pricing may vary based on vehicle, hotel category, travel dates,
              number of travellers and itinerary. Tolls, parking, permits and state
              taxes are charged at actuals. Share your dates and group size for an
              exact quotation.
            </p>
          </div>

          {/* FAQ */}
          {pkg.faq.length > 0 && (
            <div className="reveal">
              <h2 className="text-h3 font-bold text-ink">Frequently Asked Questions</h2>
              <div className="mt-4">
                <FaqAccordion
                  items={pkg.faq.map((f, i) => ({
                    id: `${pkg.id}-${i}`,
                    question: f.question,
                    answer: f.answer,
                  }))}
                />
              </div>
            </div>
          )}
        </div>

        {/* Enquiry form */}
        <div className="reveal lg:sticky lg:top-24 lg:self-start">
          <PackageEnquiryForm
            packageSlug={pkg.slug}
            packageTitle={pkg.title}
            whatsappNumber={settings.whatsappNumber}
            vehicleOptions={pkg.vehicleOptions}
          />
        </div>
      </Section>

      {/* Related packages */}
      {related.length > 0 && (
        <Section bleed="surface">
          <h2 className="text-h2 font-bold">
            More {PACKAGE_STATE_LABELS[pkg.state as PackageState] ?? pkg.state} packages
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {related.map((p) => (
              <PackageCard key={p.id} pkg={p} whatsappNumber={settings.whatsappNumber} />
            ))}
          </div>
        </Section>
      )}

      <CtaBanner
        text={settings.ctaBannerText}
        phone={settings.phone}
        whatsappHref={wa}
      />
    </>
  );
}
