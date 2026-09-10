import { getSiteSettings, getDestinations } from "@/lib/site";
import { buildWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";
import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/site/PageHeader";
import DestinationView from "@/components/site/DestinationView";
import CoverageMap from "@/components/site/CoverageMap";
import CtaBanner from "@/components/site/CtaBanner";
import Section from "@/components/site/Section";

export const revalidate = 600;

export const metadata = pageMeta({
  title: "Destinations Across Karnataka & South India",
  description:
    "Cab and tempo traveller trips from Bangalore to Coorg, Chikmagalur, Hampi, Mysore, Dharmasthala, Gokarna and interior Karnataka towns, plus outstation routes to Ooty, Munnar, Tirupati and Hyderabad.",
  path: "/destination",
  image: "/images/destinations/hero-bangalore.webp",
});

export default async function DestinationPage() {
  const [settings, destinations] = await Promise.all([
    getSiteSettings(),
    getDestinations(),
  ]);

  const waHref = whatsappLink(
    settings.whatsappNumber,
    buildWhatsAppMessage({ message: "Hi, I'd like to book a cab" }),
  );

  return (
    <>
      <PageHeader
        trail={[["Destinations", "/destination"]]}
        title="From city landmarks to interior villages"
        intro="We cover every major Karnataka city and countless interior towns and villages, with extended outstation routes into Tamil Nadu, Kerala, Andhra Pradesh and Telangana. Pick a destination to start planning."
        image="/images/destinations/hero-bangalore.webp"
        imageAlt="Bengaluru skyline at dusk"
      />

      <Section>
        <div className="reveal mb-12">
          <CoverageMap />
        </div>

        <DestinationView destinations={destinations} />

        <p className="mt-10 rounded-2xl bg-forest-50 p-5 text-sm text-ink dark:bg-white/[0.04]">
          Don&apos;t see your town? We build custom routes across Karnataka&apos;s
          interior on request — just share your pickup and drop points.
        </p>
      </Section>

      <CtaBanner
        text={settings.ctaBannerText}
        phone={settings.phone}
        whatsappHref={waHref}
      />
    </>
  );
}
