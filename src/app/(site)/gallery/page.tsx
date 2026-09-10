import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/site";
import { buildWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";
import PageHeader from "@/components/site/PageHeader";
import Gallery from "@/components/site/Gallery";
import CtaBanner from "@/components/site/CtaBanner";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Fleet Photo Gallery",
  description:
    "Photos of the Sumpreeth Tours and Travels fleet — sedans, SUVs, tempo travellers and coaches used for airport, local and outstation trips across Karnataka.",
};

export default async function GalleryPage() {
  const settings = await getSiteSettings();
  const waHref = whatsappLink(
    settings.whatsappNumber,
    buildWhatsAppMessage({ message: "Hi, I'd like to book a cab" }),
  );

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Our fleet, on the road"
        intro="Real photos of the cars, tempo travellers and coaches our customers travel in — sanitised between trips and GPS-enabled."
        image="/images/fleet/IMG-20260901-WA0056.jpg"
        imageAlt="Front of a Sumpreeth Force tempo traveller"
      />

      <section className="container-page py-14">
        <Gallery />
      </section>

      <CtaBanner
        text={settings.ctaBannerText}
        phone={settings.phone}
        whatsappHref={waHref}
      />
    </>
  );
}
