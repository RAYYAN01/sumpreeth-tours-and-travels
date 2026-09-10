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
import { rupees, perKm } from "@/lib/format";
import { buildWhatsAppMessage, whatsappLink, telLink } from "@/lib/whatsapp";
import VehicleImages from "@/components/site/VehicleImages";
import VehicleCard from "@/components/site/VehicleCard";
import CtaBanner from "@/components/site/CtaBanner";

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
  if (!vehicle) return { title: "Vehicle not found" };
  return {
    title: `${vehicle.name} (${vehicle.seats}) — Rates & Booking`,
    description: vehicleGuide(vehicle).tagline,
  };
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

  const rateRows: [string, string][] = [];
  if (!vehicle.quoteOnRequest) {
    if (vehicle.oneWayRate != null)
      rateRows.push([
        "One way",
        `${rupees(vehicle.oneWayRate)}${vehicle.oneWayNote ? ` ${vehicle.oneWayNote}` : ""}`,
      ]);
    if (vehicle.roundTripPerKm != null)
      rateRows.push(["Round trip", `${perKm(vehicle.roundTripPerKm)}`]);
    if (vehicle.minKmPerDay != null)
      rateRows.push(["Minimum running", `${vehicle.minKmPerDay} km / day`]);
    if (vehicle.driverBata != null)
      rateRows.push(["Driver bata", `${rupees(vehicle.driverBata)} / day`]);
    if (vehicle.localPackageRate != null)
      rateRows.push([
        "Local package (8 hr / 80 km)",
        `${rupees(vehicle.localPackageRate)}`,
      ]);
    if (vehicle.localExtraPerKm != null)
      rateRows.push(["Local — extra per km", perKm(vehicle.localExtraPerKm)]);
    if (vehicle.localExtraPerHr != null)
      rateRows.push(["Local — extra per hour", `₹${vehicle.localExtraPerHr}`]);
  }

  return (
    <>
      <section className="container-page pt-28 pb-8">
        <Link
          href="/fleet"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-600 dark:text-forest-300 hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          All vehicles
        </Link>

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
              <h1 className="text-3xl font-bold sm:text-4xl">{vehicle.name}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-forest-50 dark:bg-white/[0.04] px-3 py-1 text-sm font-semibold text-bodytext">
                <Users className="h-4 w-4" />
                {vehicle.seats} seater
              </span>
            </div>
            <p className="mt-3 text-lg text-bodytext">{guide.tagline}</p>

            <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {vehicle.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest-500 dark:text-forest-400" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl bg-page p-5 ring-1 ring-line">
              <h2 className="text-sm font-bold uppercase tracking-wide text-saffron-600">
                {vehicle.quoteOnRequest ? "Pricing" : "Rate card"}
              </h2>
              {vehicle.quoteOnRequest ? (
                <p className="mt-2 text-ink">
                  {vehicle.roundTripNote || "Contact us for a group quote."}
                </p>
              ) : (
                <dl className="mt-3 divide-y divide-line">
                  {rateRows.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 py-2 text-sm">
                      <dt className="text-forest-600 dark:text-forest-300">{k}</dt>
                      <dd className="font-semibold text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {vehicle.roundTripNote && !vehicle.quoteOnRequest && (
                <p className="mt-2 text-xs text-forest-500 dark:text-forest-400">{vehicle.roundTripNote}</p>
              )}
              <p className="mt-2 text-xs text-forest-500 dark:text-forest-400">
                Tolls, parking, permits and state taxes are charged at actuals.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-accent">
                <MessageCircle className="h-4 w-4" />
                Book this vehicle
              </a>
              <a href={telLink(settings.phone)} className="btn-outline">
                <Phone className="h-4 w-4" />
                {settings.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-14">
        <div className="container-page grid gap-8 md:grid-cols-3">
          <div className="reveal">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
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
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
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
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
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
        </div>
      </section>

      {others.length > 0 && (
        <section className="container-page py-14">
          <h2 className="text-2xl font-bold">Compare other vehicles</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                phone={settings.phone}
                whatsappNumber={settings.whatsappNumber}
              />
            ))}
          </div>
        </section>
      )}

      <CtaBanner
        text={settings.ctaBannerText}
        phone={settings.phone}
        whatsappHref={wa}
      />
    </>
  );
}
