import Link from "next/link";
import { MessageCircle, ArrowRight } from "lucide-react";
import {
  getSiteSettings,
  getVehicles,
  getDestinations,
  getTestimonials,
} from "@/lib/site";
import { buildWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";
import EnquiryForm from "@/components/site/EnquiryForm";
import HeroBackground from "@/components/site/HeroBackground";
import SectionHeading from "@/components/site/SectionHeading";
import BentoStats from "@/components/site/BentoStats";
import VehicleCard from "@/components/site/VehicleCard";
import DestinationCard from "@/components/site/DestinationCard";
import WhyChooseUs from "@/components/site/WhyChooseUs";
import TestimonialCarousel from "@/components/site/TestimonialCarousel";
import CtaBanner from "@/components/site/CtaBanner";
import Section from "@/components/site/Section";
import { pageMeta } from "@/lib/seo";

export const revalidate = 300;

export const metadata = pageMeta({
  title: "Bangalore Cabs & Karnataka Outstation Travel",
  description:
    "24/7 cab rental in Bangalore for one-way, round trip, airport and local trips, plus tempo travellers and buses for outstation tours across Karnataka and South India. Transparent rates, vetted drivers, GPS-tracked.",
  path: "/",
});

const PREVIEW_DESTS = [
  "Madikeri / Coorg",
  "Hampi",
  "Chikmagalur",
  "Mysore",
  "Shivanasamudra Falls",
  "Bangalore Palace",
];

export default async function HomePage() {
  const [settings, vehicles, destinations, testimonials] = await Promise.all([
    getSiteSettings(),
    getVehicles(),
    getDestinations(),
    getTestimonials(),
  ]);

  const waHref = whatsappLink(
    settings.whatsappNumber,
    buildWhatsAppMessage({ message: "Hi, I'd like to book a cab" }),
  );

  const fleetPreview = [
    vehicles.find((v) => v.category === "CAR" && v.seats.startsWith("4")),
    vehicles.find((v) => v.category === "CAR" && v.seats.startsWith("7")),
    vehicles.find((v) => v.category === "TEMPO_TRAVELLER"),
  ].filter(Boolean) as typeof vehicles;

  const destPreview =
    destinations.filter((d) => PREVIEW_DESTS.includes(d.name)).slice(0, 6);
  const destShown = destPreview.length >= 3 ? destPreview : destinations.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate flex min-h-[92vh] items-center overflow-hidden">
        <HeroBackground
          video="/images/fleet-hero.mp4"
          poster={settings.heroImageUrl}
          alt="A Sumpreeth Tours and Travels vehicle ready for an outstation trip"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-900/90 via-forest-900/70 to-forest-900/40" />

        <div className="container-page grid gap-10 py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="text-white">
            <p className="inline-flex rounded-full bg-surface/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-saffron-200 ring-1 ring-white/20">
              {settings.hours}
            </p>
            <h1 className="mt-5 text-display font-extrabold text-white">
              {settings.heroHeadline}
            </h1>
            <p className="mt-5 max-w-xl text-lead text-forest-100/90">
              {settings.heroSubheadline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent"
              >
                <MessageCircle className="h-4 w-4" />
                Book Now on WhatsApp
              </a>
              <Link href="/fleet" className="btn-white">
                View Fleet
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <EnquiryForm
            variant="widget"
            whatsappNumber={settings.whatsappNumber}
            sourcePage="home-hero"
          />
        </div>
      </section>

      {/* Trust bar — bento */}
      <BentoStats
        years={settings.trustYears}
        trips={settings.trustTrips}
        cities={settings.trustCities}
      />

      {/* Fleet preview */}
      <Section>
        <div className="reveal flex items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Our fleet"
            title="The right vehicle for every trip"
            intro="From solo airport runs to 16-seater temple tours — all GPS-enabled, sanitised, and driven by verified drivers."
          />
          <Link
            href="/fleet"
            className="group hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-bodytext hover:text-ink sm:inline-flex"
          >
            All vehicles &amp; rates
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="reveal-stagger mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-8">
          {fleetPreview.map((v, i) => (
            <div key={v.id} className="reveal">
              <VehicleCard
                vehicle={v}
                phone={settings.phone}
                whatsappNumber={settings.whatsappNumber}
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Popular destinations */}
      <Section bleed="surface">
        <div className="reveal flex items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Popular routes"
            title="Where Karnataka takes you"
            intro="Coffee hills, temple towns, waterfalls and heritage — with extended getaways across South India."
          />
          <Link
            href="/destination"
            className="group hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-bodytext hover:text-ink sm:inline-flex"
          >
            All destinations
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="reveal-stagger mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-8">
          {destShown.map((d) => (
            <div key={d.id} className="reveal h-full">
              <DestinationCard dest={d} />
            </div>
          ))}
        </div>
      </Section>

      {/* Why choose us */}
      <Section>
        <WhyChooseUs
          years={settings.trustYears}
          trips={settings.trustTrips}
        />
      </Section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <Section bleed="surface">
          <div className="reveal">
            <SectionHeading
              center
              eyebrow="Riders"
              title="What our customers say"
            />
          </div>
          <div className="reveal mt-12">
            <TestimonialCarousel
              items={testimonials.map((t) => ({
                id: t.id,
                authorName: t.authorName,
                location: t.location,
                rating: t.rating,
                quote: t.quote,
              }))}
            />
          </div>
        </Section>
      )}

      <CtaBanner
        text={settings.ctaBannerText}
        phone={settings.phone}
        whatsappHref={waHref}
      />
    </>
  );
}
