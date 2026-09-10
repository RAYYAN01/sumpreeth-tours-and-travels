"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Progressive scroll-reveal. Arms every `.reveal` element (hides it), then
 * reveals it as it enters the viewport. Safety net: everything is force-revealed
 * after 1.4s so content can never get stuck hidden.
 */
export default function RevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (els.length === 0) return;

    const revealAll = () =>
      els.forEach((el) => {
        el.classList.add("reveal-armed", "is-visible");
      });

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      revealAll();
      return;
    }

    els.forEach((el) => el.classList.add("reveal-armed"));

    // Stagger children inside a .reveal-stagger group so they ease in in sequence.
    document
      .querySelectorAll<HTMLElement>(".reveal-stagger")
      .forEach((group) => {
        group
          .querySelectorAll<HTMLElement>(":scope > .reveal")
          .forEach((child, idx) => {
            child.style.setProperty(
              "--reveal-delay",
              `${Math.min(idx * 55, 440)}ms`,
            );
          });
      });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));

    // Reveal anything already on screen right now.
    requestAnimationFrame(() => {
      const vh = window.innerHeight;
      els.forEach((el) => {
        if (el.getBoundingClientRect().top < vh) el.classList.add("is-visible");
      });
    });

    const safety = window.setTimeout(revealAll, 1400);

    return () => {
      io.disconnect();
      window.clearTimeout(safety);
    };
  }, [pathname]);

  return null;
}
