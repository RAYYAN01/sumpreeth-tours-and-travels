import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Images, ArrowRight } from "lucide-react";
import { getSiteSettings, getVehicles } from "@/lib/site";
import { buildWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";
import PageHeader from "@/components/site/PageHeader";
import FleetView from "@/components/site/FleetView";
import CtaBanner from "@/components/site/CtaBanner";
import Section from "@/components/site/Section";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Fleet & Rates",
  description:
    "Sedans, SUVs, 12 & 16-seater tempo travellers and buses for hire in Bangalore. One-way, round trip, airport and local rates for Toyota Etios, Swift Dzire, Innova, Innova Crysta and more.",
};

export default async function FleetPage() {
  const [settings, vehicles] = await Promise.all([
    getSiteSettings(),
    getVehicles(),
  ]);

  const waHref = whatsappLink(
    settings.whatsappNumber,
    buildWhatsAppMessage({ message: "Hi, I'd like to book a cab" }),
  );

  return (
    <>
      <PageHeader
        eyebrow="Our fleet"
        title="A vehicle for every group size and trip"
        intro="Sedans, SUVs, 12 & 16-seater tempo travellers and coaches — all GPS-enabled, sanitised, and driven by verified drivers. Book by the kilometre, by the day, or as a fixed one-way fare."
        image="/images/fleet/IMG-20260901-WA0058.jpg"
        imageAlt="A Sumpreeth tempo traveller parked under palm trees"
      />

      <Section>
        <FleetView
          vehicles={vehicles}
          phone={settings.phone}
          whatsappNumber={settings.whatsappNumber}
        />

        <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-forest-50 p-5 sm:flex-row sm:items-center sm:justify-between dark:bg-white/[0.04]">
          <p className="flex items-start gap-2 text-sm text-ink">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-forest-600 dark:text-forest-300" />
            All vehicles are GPS-enabled, sanitised regularly, and driven by
            verified, background-checked drivers.
          </p>
          <Link
            href="/gallery"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-bodytext ring-1 ring-line hover:bg-forest-100 dark:hover:bg-white/[0.08]"
          >
            <Images className="h-4 w-4" />
            View all photos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      <CtaBanner
        text={settings.ctaBannerText}
        phone={settings.phone}
        whatsappHref={waHref}
      />
    </>
  );
}
