import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import FloatingButtons from "@/components/site/FloatingButtons";
import RevealInit from "@/components/site/RevealInit";
import { getSiteSettings } from "@/lib/site";
import { buildWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const waHref = whatsappLink(
    settings.whatsappNumber,
    buildWhatsAppMessage({ message: "Hi, I'd like to book a cab" }),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: "Sumpreeth Tours and Travels",
    description:
      "24/7 cab rental and outstation travel service in Bangalore covering Karnataka and South India.",
    telephone: settings.phone,
    email: settings.email,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    areaServed: "Karnataka, India",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bangalore",
      postalCode: "560078",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    openingHours: "Mo-Su 00:00-23:59",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a
        href="#main"
        className="sr-only left-4 top-4 z-[60] rounded-lg bg-forest-700 px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed"
      >
        Skip to content
      </a>
      <Header phone={settings.phone} whatsappHref={waHref} />
      <main id="main" className="scroll-mt-24">
        {children}
      </main>
      <Footer settings={settings} />
      <FloatingButtons phone={settings.phone} whatsappHref={waHref} />
      <RevealInit />
    </>
  );
}
