"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Star, Quote } from "lucide-react";

type Item = {
  id: string;
  authorName: string;
  location: string;
  rating: number;
  quote: string;
};

/**
 * Native CSS scroll-snap carousel — no carousel library. Autoplay pauses on
 * hover / focus / pointer interaction and is disabled under
 * `prefers-reduced-motion`.
 */
export default function TestimonialCarousel({ items }: { items: Item[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);

  const scrollToIndex = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[i] as HTMLElement | undefined;
    if (slide) track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  }, []);

  // Track which slide is centred for the dot indicator.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = slides.indexOf(e.target as HTMLElement);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { root: track, threshold: 0.6 },
    );
    slides.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [items.length]);

  // Autoplay.
  useEffect(() => {
    if (items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      setActive((cur) => {
        const next = (cur + 1) % items.length;
        scrollToIndex(next);
        return next;
      });
    }, 5500);
    return () => window.clearInterval(id);
  }, [items.length, scrollToIndex]);

  if (items.length === 0) return null;

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <div onMouseEnter={pause} onMouseLeave={resume}>
      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onPointerDown={pause}
        onFocusCapture={pause}
        onBlurCapture={resume}
        aria-label="Customer testimonials"
      >
        {items.map((t) => (
          <li
            key={t.id}
            className="min-w-[85%] shrink-0 snap-start sm:min-w-[46%] lg:min-w-[31.5%]"
          >
            <figure className="relative flex h-full flex-col rounded-2xl bg-surface p-6 pt-8 ring-1 ring-line">
              <Quote
                className="absolute right-5 top-5 h-8 w-8 text-forest-100"
                fill="currentColor"
                strokeWidth={0}
                aria-hidden
              />
              <blockquote className="flex-1 text-[15px] leading-[1.7] text-bodytext">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest-600 text-sm font-bold text-white"
                  aria-hidden
                >
                  {t.authorName.trim().charAt(0)}
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-ink">
                    {t.authorName}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-forest-500 dark:text-forest-400">
                    <span
                      className="flex gap-0.5 text-saffron-500"
                      aria-label={`${t.rating} out of 5`}
                    >
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3"
                          fill="currentColor"
                          strokeWidth={0}
                          aria-hidden
                        />
                      ))}
                    </span>
                    {t.location}
                  </span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {items.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {items.map((t, i) => (
            <button
              key={t.id}
              type="button"
              aria-label={`Go to testimonial ${i + 1}`}
              aria-current={i === active}
              onClick={() => {
                scrollToIndex(i);
                setActive(i);
              }}
              className={`h-2 rounded-full transition-all ${
                i === active
                  ? "w-6 bg-forest-600"
                  : "w-2 bg-line hover:bg-forest-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
