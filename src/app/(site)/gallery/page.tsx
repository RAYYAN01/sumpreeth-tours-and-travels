import { getSiteSettings } from "@/lib/site";
import { buildWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/site/PageHeader";
import Gallery from "@/components/site/Gallery";
import CtaBanner from "@/components/site/CtaBanner";
import Section from "@/components/site/Section";

export const revalidate = 3600;

export const metadata = pageMeta({
  title: "Fleet Photo Gallery",
  description:
    "Photos of the Sumpreeth Tours and Travels fleet — sedans, SUVs, tempo travellers and coaches used for airport, local and outstation trips across Karnataka.",
  path: "/gallery",
  image: "/images/fleet/IMG-20260901-WA0056.jpg",
});

export default async function GalleryPage() {
  const settings = await getSiteSettings();
  const waHref = whatsappLink(
    settings.whatsappNumber,
    buildWhatsAppMessage({ message: "Hi, I'd like to book a cab" }),
  );

  return (
    <>
      <PageHeader
        trail={[["Gallery", "/gallery"]]}
        eyebrow="Gallery"
        title="Our fleet, on the road"
        intro="Real photos of the cars, tempo travellers and coaches our customers travel in — sanitised between trips and GPS-enabled."
        image="/images/fleet/IMG-20260901-WA0056.jpg"
        imageAlt="Front of a Sumpreeth Force tempo traveller"
      />

      <Section>
        <Gallery />
      </Section>

      <CtaBanner
        text={settings.ctaBannerText}
        phone={settings.phone}
        whatsappHref={waHref}
      />
    </>
  );
}
