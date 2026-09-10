"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GA_ID, TRACK_EVENTS, trackEvent, trackPageView } from "@/lib/analytics";
import { CONSENT_EVENT, hasConsent } from "@/lib/consent";

/**
 * Loads Google Analytics 4 — but only when `NEXT_PUBLIC_GA_ID` is configured
 * and the visitor has opted into the "analytics" consent category. Also wires a
 * single delegated click listener that turns any `[data-track]` element into a
 * conversion event (phone / WhatsApp / email / directions / CTA clicks).
 */
export default function Analytics() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    const sync = () => setEnabled(hasConsent("analytics"));
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  // Delegated conversion tracking — works even for links in server components.
  useEffect(() => {
    if (!enabled) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.("[data-track]");
      const key = el?.getAttribute("data-track");
      if (!key) return;
      trackEvent(TRACK_EVENTS[key] ?? key, { location: pathname });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [enabled, pathname]);

  // SPA page views.
  useEffect(() => {
    if (enabled) trackPageView(pathname);
  }, [enabled, pathname]);

  if (!GA_ID || !enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true,send_page_view:false});`}
      </Script>
    </>
  );
}
