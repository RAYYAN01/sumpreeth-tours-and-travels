import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { getSiteSettings, getFaqs } from "@/lib/site";
import { buildWhatsAppMessage, whatsappLink, telLink } from "@/lib/whatsapp";
import PageHeader from "@/components/site/PageHeader";
import SectionHeading from "@/components/site/SectionHeading";
import EnquiryForm from "@/components/site/EnquiryForm";
import FaqAccordion from "@/components/site/FaqAccordion";
import Section from "@/components/site/Section";

export const metadata: Metadata = {
  title: "Contact & Booking",
  description:
    "Book a cab with Sumpreeth Tours and Travels — call +91 94486 48898, message us on WhatsApp, or send an enquiry. Open 24/7, based in Bangalore 560078.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string }>;
}) {
  const [{ destination }, settings, faqs] = await Promise.all([
    searchParams,
    getSiteSettings(),
    getFaqs(),
  ]);

  const waHref = whatsappLink(
    settings.whatsappNumber,
    buildWhatsAppMessage({ message: "Hi, I'd like to book a cab" }),
  );

  const dest = destination?.slice(0, 80);

  return (
    <>
      <PageHeader
        title="Book your trip"
        intro="Send an enquiry and we'll open WhatsApp with your details, or reach us directly — any hour, any day."
        image="/images/destinations/hero-bangalore.webp"
        imageAlt="Bengaluru skyline"
      />

      <Section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          {dest && (
            <p className="mb-4 rounded-xl bg-saffron-50 px-4 py-3 text-sm font-medium text-saffron-800">
              Planning a trip to <strong>{dest}</strong> — your form is pre-filled.
            </p>
          )}
          <EnquiryForm
            variant="page"
            whatsappNumber={settings.whatsappNumber}
            sourcePage={dest ? `contact:${dest}` : "contact"}
            defaultServiceType={dest ? "TOUR_PACKAGE" : "ONE_WAY"}
            defaultDrop={dest ?? ""}
            defaultMessage={dest ? `Planning a trip to ${dest}.` : ""}
          />
        </div>

        <aside className="space-y-4">
          <div className="card p-6">
            <h2 className="text-h4 font-bold text-ink">Reach us now</h2>
            <div className="mt-4 flex flex-col gap-3">
              <a href={telLink(settings.phone)} className="btn-primary">
                <Phone className="h-4 w-4" />
                Call {settings.phone}
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp us
              </a>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-bodytext">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-forest-500 dark:text-forest-400" />
                <a href={`mailto:${settings.email}`} className="hover:underline">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest-500 dark:text-forest-400" />
                {settings.address}
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-forest-500 dark:text-forest-400" />
                {settings.hours}
              </li>
            </ul>
          </div>

          <div className="card overflow-hidden">
            <iframe
              title="Sumpreeth Tours and Travels location — Bangalore 560078"
              src={settings.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-64 w-full border-0"
            />
          </div>
        </aside>
      </Section>

      {faqs.length > 0 && (
        <Section bleed="surface" className="max-w-3xl">
          <SectionHeading center eyebrow="FAQ" title="Common questions" />
          <div className="mt-8">
            <FaqAccordion
              items={faqs.map((f) => ({
                id: f.id,
                question: f.question,
                answer: f.answer,
              }))}
            />
          </div>
        </Section>
      )}
    </>
  );
}
