import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f1" },
    { media: "(prefers-color-scheme: dark)", color: "#09140d" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Sumpreeth Tours and Travels | Bangalore Cabs & Karnataka Outstation Travel",
    template: "%s | Sumpreeth Tours and Travels",
  },
  description:
    "24/7 cab rental in Bangalore for one-way, round trip, airport and local trips, plus tempo travellers and buses for outstation tours across Karnataka and South India.",
  keywords: [
    "Bangalore taxi",
    "Karnataka outstation cab",
    "airport cab Bangalore",
    "tempo traveller rental Bangalore",
    "one way cab Karnataka",
    "Coorg cab package",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Sumpreeth Tours and Travels",
    url: siteUrl,
    title:
      "Sumpreeth Tours and Travels | Bangalore Cabs & Karnataka Outstation Travel",
    description:
      "24/7 cabs, tempo travellers and buses for airport, local and outstation trips across Karnataka.",
  },
};

const themeScript = `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
