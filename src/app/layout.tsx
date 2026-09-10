import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const bodyFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const headingFont = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f1" },
    { media: "(prefers-color-scheme: dark)", color: "#09140d" },
  ],
};

const gscToken = process.env.NEXT_PUBLIC_GSC_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...(gscToken ? { verification: { google: gscToken } } : {}),
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
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
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
  twitter: {
    card: "summary_large_image",
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
    <html
      lang="en-IN"
      className={`${bodyFont.variable} ${headingFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
