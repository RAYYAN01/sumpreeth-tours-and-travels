import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Check,
  Sparkles,
  ThumbsUp,
  Info,
  MessageCircle,
  Phone,
} from "lucide-react";
import { getVehicleBySlug, getVehicles, getSiteSettings } from "@/lib/site";
import { vehiclePhotos } from "@/lib/features";
import { vehicleGuide } from "@/lib/vehicle-content";
import { buildWhatsAppMessage, whatsappLink, telLink } from "@/lib/whatsapp";
import { pageMeta } from "@/lib/seo";
import { rupees } from "@/lib/format";
import { vehicleJsonLd } from "@/lib/structured-data";
import VehicleImages from "@/components/site/VehicleImages";
import VehicleCard from "@/components/site/VehicleCard";
import RateCard from "@/components/site/RateCard";
import CtaBanner from "@/components/site/CtaBanner";
import Section from "@/components/site/Section";
import Breadcrumbs from "@/components/site/Breadcrumbs";

export const revalidate = 300;

export async function generateStaticParams() {
  const vehicles = await getVehicles();
  return vehicles
    .filter((v) => typeof v.slug === "string" && v.slug.length > 0)
    .map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return { title: "Vehicle not found", robots: { index: false } };

  const guide = vehicleGuide(vehicle);
  const from =
    !vehicle.quoteOnRequest && vehicle.oneWayRate != null
      ? ` One-way fares from ${rupees(vehicle.oneWayRate)}.`
      : "";
  return pageMeta({
    title: `${vehicle.name} (${vehicle.seats} seater) — Rates & Booking`,
    description: `${guide.tagline}${from} Book on WhatsApp or call — GPS-tracked, driven by verified drivers across Karnataka.`,
    path: `/fleet/${vehicle.slug}`,
    image: vehiclePhotos(vehicle)[0] ?? "/logo.png",
  });
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [vehicle, allVehicles, settings] = await Promise.all([
    getVehicleBySlug(slug),
    getVehicles(),
    getSiteSettings(),
  ]);

  if (!vehicle) notFound();

  const guide = vehicleGuide(vehicle);
  const photos = vehiclePhotos(vehicle);
  const others = allVehicles.filter((v) => v.slug !== vehicle.slug).slice(0, 3);

  const wa = whatsappLink(
    settings.whatsappNumber,
    buildWhatsAppMessage({
      message: `I'd like to book the ${vehicle.name} (${vehicle.seats} seater). Please share availability and a quote.`,
    }),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(vehicleJsonLd(vehicle, guide.tagline)),
        }}
      />
      <section className="container-page pb-8 pt-28">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Breadcrumbs
            trail={[
              ["Fleet", "/fleet"],
              [vehicle.name, `/fleet/${vehicle.slug}`],
            ]}
          />
          <Link
            href="/fleet"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-600 hover:text-ink dark:text-forest-300"
          >
            <ArrowLeft className="h-4 w-4" />
            All vehicles
          </Link>
        </div>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="reveal">
            <VehicleImages
              photos={photos}
              name={vehicle.name}
              variant="full"
              priority
            />
          </div>

          <div className="reveal">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-h1 font-bold">{vehicle.name}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-forest-50 px-3 py-1 text-sm font-semibold text-bodytext dark:bg-white/[0.04]">
                <Users className="h-4 w-4" />
                {vehicle.seats} seater
              </span>
            </div>
            <p className="mt-3 text-lead text-bodytext">{guide.tagline}</p>

            <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {vehicle.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest-500 dark:text-forest-400" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <RateCard
                vehicle={vehicle}
                actions={
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-accent"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Book this vehicle
                    </a>
                    <a href={telLink(settings.phone)} className="btn-outline">
                      <Phone className="h-4 w-4" />
                      {settings.phone}
                    </a>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </section>

      <Section bleed="surface" className="grid gap-8 md:grid-cols-3">
          <div className="reveal">
            <h2 className="flex items-center gap-2 text-h4 font-bold text-ink">
              <ThumbsUp className="h-5 w-5 text-forest-600 dark:text-forest-300" />
              Best for
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-bodytext">
              {guide.bestFor.map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron-500" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal">
            <h2 className="flex items-center gap-2 text-h4 font-bold text-ink">
              <Sparkles className="h-5 w-5 text-forest-600 dark:text-forest-300" />
              Highlights
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-bodytext">
              {guide.highlights.map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest-500 dark:text-forest-400" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal">
            <h2 className="flex items-center gap-2 text-h4 font-bold text-ink">
              <Info className="h-5 w-5 text-forest-600 dark:text-forest-300" />
              Good to know
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-bodytext">
              {guide.goodToKnow.map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-300" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
      </Section>

      <Section size="sm">
        <div className="flex flex-col gap-3 rounded-2xl bg-forest-50 p-5 dark:bg-white/[0.04] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink">
            Know where you&apos;re headed? Browse routes and distances, or send
            your trip details for a quick quote.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/destination" className="btn-ghost btn-sm">
              Browse destinations
            </Link>
            <Link href="/contact" className="btn-outline btn-sm">
              Get a quote
            </Link>
          </div>
        </div>
      </Section>

      {others.length > 0 && (
        <Section>
          <h2 className="text-h2 font-bold">Compare other vehicles</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {others.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                phone={settings.phone}
                whatsappNumber={settings.whatsappNumber}
              />
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
