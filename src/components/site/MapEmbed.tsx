"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import {
  CONSENT_EVENT,
  REJECT_ALL,
  hasConsent,
  readConsent,
  writeConsent,
} from "@/lib/consent";

/**
 * Google Maps iframe, loaded only after the visitor has allowed the "maps"
 * consent category (or clicks "Load map" here, which grants it).
 */
export default function MapEmbed({ src, title }: { src: string; title: string }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(hasConsent("maps"));
    const onChange = () => setAllowed(hasConsent("maps"));
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (allowed) {
    return (
      <iframe
        title={title}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-64 w-full border-0"
      />
    );
  }

  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3 bg-forest-50 p-6 text-center dark:bg-white/[0.04]">
      <MapPin className="h-6 w-6 text-forest-600 dark:text-forest-300" />
      <p className="text-sm text-bodytext">
        The map is loaded from Google Maps, which may set its own cookies.
      </p>
      <button
        type="button"
        onClick={() => {
          const current = readConsent()?.choices ?? REJECT_ALL;
          writeConsent({ ...current, maps: true });
          setAllowed(true);
        }}
        className="btn-outline btn-sm"
      >
        Load map
      </button>
    </div>
  );
}
