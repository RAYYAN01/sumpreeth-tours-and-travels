/**
 * Lightweight, vendor-free consent state. Stored only in `localStorage` (never
 * a cookie) so the site stays "strictly necessary" until the visitor chooses.
 * Categories:
 *   - necessary   — always on (theme not included; see below)
 *   - preferences — remember light/dark theme choice
 *   - maps        — load the Google Maps embed on the Contact page
 */

export type OptionalCategory = "preferences" | "maps" | "analytics";
export type ConsentCategory = "necessary" | OptionalCategory;
export type ConsentChoices = Record<OptionalCategory, boolean>;
export type ConsentRecord = { v: 2; choices: ConsentChoices; ts: number };

const KEY = "stt_consent";
const VERSION = 2 as const;

export const CONSENT_EVENT = "stt:consent";
export const CONSENT_OPEN_EVENT = "stt:consent-open";

export const ACCEPT_ALL: ConsentChoices = {
  preferences: true,
  maps: true,
  analytics: true,
};
export const REJECT_ALL: ConsentChoices = {
  preferences: false,
  maps: false,
  analytics: false,
};

export const CATEGORY_LABELS: Record<
  OptionalCategory,
  { title: string; body: string }
> = {
  preferences: {
    title: "Preferences",
    body: "Remembers your light or dark theme choice in this browser. Never leaves your device.",
  },
  maps: {
    title: "Google Maps",
    body: "Loads the embedded map on our Contact page. Google may set its own cookies when the map loads.",
  },
  analytics: {
    title: "Analytics",
    body: "Anonymous, aggregated usage measurement (Google Analytics) so we can see which pages and services people use. No ads.",
  },
};

export function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    if (parsed?.v !== VERSION || typeof parsed.choices !== "object") return null;
    return {
      v: VERSION,
      ts: Number(parsed.ts) || Date.now(),
      choices: {
        preferences: Boolean(parsed.choices.preferences),
        maps: Boolean(parsed.choices.maps),
        analytics: Boolean(parsed.choices.analytics),
      },
    };
  } catch {
    return null;
  }
}

export function writeConsent(choices: ConsentChoices): ConsentRecord {
  const rec: ConsentRecord = { v: VERSION, choices, ts: Date.now() };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(rec));
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: rec }));
  } catch {
    /* storage unavailable — treat as no consent */
  }
  return rec;
}

export function hasConsent(category: ConsentCategory): boolean {
  if (category === "necessary") return true;
  return readConsent()?.choices[category] ?? false;
}
