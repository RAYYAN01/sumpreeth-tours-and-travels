import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import FloatingButtons from "@/components/site/FloatingButtons";
import RevealInit from "@/components/site/RevealInit";
import ConsentBanner from "@/components/site/ConsentBanner";
import { getSiteSettings } from "@/lib/site";
import { buildWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";
import { businessJsonLd } from "@/lib/structured-data";

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

  const jsonLd = businessJsonLd(settings);

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
      <ConsentBanner />
    </>
  );
}
