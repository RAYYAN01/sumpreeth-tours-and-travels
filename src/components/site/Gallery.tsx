"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * All 41 real photos of the Sumpreeth fleet, supplied by the client.
 * Files live in /public/images/fleet.
 */
const f = (n: number) => `/images/fleet/IMG-20260901-WA00${n}.jpg`;

const GROUPS: { label: string; nums: number[] }[] = [
  { label: "Toyota Etios (sedan)", nums: [40, 41, 25, 23, 24, 22, 26, 42] },
  { label: "Maruti Ertiga (7-seater)", nums: [39, 27, 37, 29, 33] },
  { label: "Toyota Innova / Crysta", nums: [38, 34, 30, 31, 32, 35, 36, 28] },
  { label: "Tempo Traveller", nums: [58, 59, 55, 54, 56, 57, 46, 49, 52, 53, 51, 60, 62, 48, 47] },
  { label: "Mini coach & on the road", nums: [50, 45, 43, 44, 61] },
];

const PHOTOS = GROUPS.flatMap((g) =>
  g.nums.map((n) => ({ src: f(n), alt: `Sumpreeth Tours and Travels — ${g.label}` })),
);

export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  const move = useCallback(
    (dir: number) =>
      setOpen((i) => (i == null ? i : (i + dir + PHOTOS.length) % PHOTOS.length)),
    [],
  );

  useEffect(() => {
    if (open == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, move]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {PHOTOS.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Open photo ${i + 1}`}
            className={`reveal group relative overflow-hidden rounded-xl bg-forest-50 dark:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-500 ${
              i % 7 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-[4/3]"
            }`}
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-forest-900/0 transition-colors group-hover:bg-forest-900/15" />
          </button>
        ))}
      </div>

      {open != null && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/92 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={() => setOpen(null)}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white/80">
            <span className="text-sm">
              {open + 1} / {PHOTOS.length}
            </span>
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Close"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center px-4 pb-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous"
              className="absolute left-2 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="relative h-full w-full max-w-5xl">
              <Image
                src={PHOTOS[open].src}
                alt={PHOTOS[open].alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next"
              className="absolute right-2 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div
            className="flex gap-2 overflow-x-auto px-4 pb-4"
            onClick={(e) => e.stopPropagation()}
          >
            {PHOTOS.map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Photo ${i + 1}`}
                className={`relative aspect-[4/3] h-14 shrink-0 overflow-hidden rounded ring-2 transition ${
                  i === open ? "ring-saffron-400" : "ring-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <Image src={p.src} alt="" fill sizes="72px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
