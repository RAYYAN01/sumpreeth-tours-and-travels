"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import {
  ACCEPT_ALL,
  CATEGORY_LABELS,
  CONSENT_OPEN_EVENT,
  REJECT_ALL,
  readConsent,
  writeConsent,
  type ConsentChoices,
  type OptionalCategory,
} from "@/lib/consent";

const OPTIONAL: OptionalCategory[] = ["preferences", "maps"];

export default function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [draft, setDraft] = useState<ConsentChoices>(REJECT_ALL);

  useEffect(() => {
    // Show on first visit (no stored decision).
    if (!readConsent()) setOpen(true);

    const openHandler = () => {
      const current = readConsent();
      setDraft(current?.choices ?? REJECT_ALL);
      setShowDetails(true);
      setOpen(true);
    };
    const clickHandler = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest("[data-consent-open]");
      if (t) {
        e.preventDefault();
        openHandler();
      }
    };
    window.addEventListener(CONSENT_OPEN_EVENT, openHandler);
    document.addEventListener("click", clickHandler);
    return () => {
      window.removeEventListener(CONSENT_OPEN_EVENT, openHandler);
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  if (!open) return null;

  const commit = (choices: ConsentChoices) => {
    writeConsent(choices);
    setOpen(false);
    setShowDetails(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie and privacy choices"
      className="fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-4"
    >
      <div className="container-page">
        <div className="relative mx-auto max-w-3xl rounded-2xl bg-surface p-5 shadow-card ring-1 ring-black/10 dark:ring-white/15 sm:p-6">
          <button
            type="button"
            aria-label="Dismiss — keeps only strictly necessary storage"
            onClick={() => commit(REJECT_ALL)}
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-forest-50 dark:hover:bg-white/[0.06]"
          >
            <X className="h-4 w-4" />
          </button>

          <h2 className="text-h4 font-bold text-ink">Your privacy choices</h2>
          <p className="mt-2 text-sm text-bodytext">
            We use only strictly necessary storage by default. You can allow a
            couple of optional items below. See our{" "}
            <Link
              href="/privacy"
              className="font-medium text-forest-700 hover:underline dark:text-forest-200"
            >
              Privacy &amp; Cookie Policy
            </Link>
            . Your choice is stored on this device under India&apos;s DPDP Act,
            2023.
          </p>

          {showDetails && (
            <ul className="mt-4 space-y-3">
              <li className="rounded-xl bg-page p-3 text-sm ring-1 ring-line">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-ink">
                    Strictly necessary
                  </span>
                  <span className="text-xs font-medium text-muted">
                    Always on
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  Security, load balancing and (if a staff member signs in) the
                  admin session. No tracking.
                </p>
              </li>
              {OPTIONAL.map((cat) => (
                <li
                  key={cat}
                  className="rounded-xl bg-page p-3 text-sm ring-1 ring-line"
                >
                  <label className="flex items-start justify-between gap-3">
                    <span>
                      <span className="font-semibold text-ink">
                        {CATEGORY_LABELS[cat].title}
                      </span>
                      <span className="mt-1 block text-xs text-muted">
                        {CATEGORY_LABELS[cat].body}
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      className="mt-0.5 h-5 w-5 shrink-0 accent-forest-600"
                      checked={draft[cat]}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, [cat]: e.target.checked }))
                      }
                    />
                  </label>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => commit(ACCEPT_ALL)}
              className="btn-primary btn-sm"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={() => commit(REJECT_ALL)}
              className="btn-outline btn-sm"
            >
              Reject non-essential
            </button>
            {showDetails ? (
              <button
                type="button"
                onClick={() => commit(draft)}
                className="btn-ghost btn-sm"
              >
                Save choices
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowDetails(true)}
                className="btn-ghost btn-sm"
              >
                Preferences
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
