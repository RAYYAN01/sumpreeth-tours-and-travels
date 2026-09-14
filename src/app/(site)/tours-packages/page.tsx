import { getSiteSettings, getPackages } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { PACKAGE_STATE_ORDER, PACKAGE_CATEGORY_ORDER } from "@/lib/constants";
import PageHeader from "@/components/site/PageHeader";
import PackagesView from "@/components/site/PackagesView";
import CtaBanner from "@/components/site/CtaBanner";
import Section from "@/components/site/Section";
import { contactLink } from "@/lib/whatsapp";

export const metadata = pageMeta({
  title: "Tours & Packages from Bangalore",
  description:
    "Bangalore-origin tour packages across Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Telangana, Goa and Puducherry — weekend getaways, family holidays, honeymoon trips, group tours and customized itineraries.",
  path: "/tours-packages",
  image: "/images/destinations/coorg-getaway.webp",
});

export default async function ToursPackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; category?: string }>;
}) {
  const [{ state, category }, settings, packages] = await Promise.all([
    searchParams,
    getSiteSettings(),
    getPackages(),
  ]);
  const waHref = contactLink(settings.whatsappNumber);
  const initialState = (PACKAGE_STATE_ORDER as string[]).includes(state ?? "")
    ? (state as (typeof PACKAGE_STATE_ORDER)[number])
    : "ALL";
  const initialCategory = (PACKAGE_CATEGORY_ORDER as string[]).includes(category ?? "")
    ? (category as (typeof PACKAGE_CATEGORY_ORDER)[number])
    : "ALL";

  return (
    <>
      <PageHeader
        trail={[["Tours & Packages", "/tours-packages"]]}
        eyebrow="Tours & Packages"
        title="Explore South India with Reliable Tours & Travels from Bangalore"
        intro="Discover carefully planned tour packages from Bangalore to Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Telangana and other popular South Indian destinations. Choose from weekend getaways, family holidays, honeymoon trips, group tours and customized travel packages."
        image="/images/destinations/coorg-getaway.webp"
        imageAlt="Misty coffee estate hills in Coorg, Karnataka"
      />

      <Section>
        <PackagesView
          packages={packages}
          whatsappNumber={settings.whatsappNumber}
          initialState={initialState}
          initialCategory={initialCategory}
        />
      </Section>

      <CtaBanner text={settings.ctaBannerText} phone={settings.phone} whatsappHref={waHref} />
    </>
  );
}
