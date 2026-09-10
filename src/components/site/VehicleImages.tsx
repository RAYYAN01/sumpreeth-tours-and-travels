"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";

type Props = {
  photos: string[];
  name: string;
  variant?: "card" | "full";
  priority?: boolean;
};

export default function VehicleImages({
  photos,
  name,
  variant = "card",
  priority = false,
}: Props) {
  const [i, setI] = useState(0);
  const list = photos.length ? photos : [];
  const active = list[Math.min(i, list.length - 1)] ?? "";
  const go = (n: number) => setI((n + list.length) % list.length);

  // -------- Card variant: static cover + photo count, no controls --------
  if (variant === "card") {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-forest-100 dark:bg-white/[0.08]">
        {active && (
          <Image
            src={active}
            alt={name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-900/25 to-transparent" />
        {list.length > 1 && (
          <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-forest-900/70 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
            <Images className="h-3 w-3" />
            {list.length}
          </span>
        )}
      </div>
    );
  }

  // -------- Full variant: main image + arrows + thumbnail strip --------
  return (
    <div>
      <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-forest-100 dark:bg-white/[0.08] sm:aspect-[3/2]">
        {active && (
          <Image
            src={active}
            alt={`${name} — photo ${i + 1} of ${list.length}`}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        )}
        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(i - 1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-surface/85 text-ink shadow-md backdrop-blur transition hover:bg-surface"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(i + 1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-surface/85 text-ink shadow-md backdrop-blur transition hover:bg-surface"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-forest-900/70 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
              {i + 1} / {list.length}
            </span>
          </>
        )}
      </div>

      {list.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {list.map((src, idx) => (
            <button
              key={src}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`View photo ${idx + 1}`}
              className={`relative aspect-[4/3] h-16 shrink-0 overflow-hidden rounded-lg ring-2 transition ${
                idx === i
                  ? "ring-saffron-500"
                  : "ring-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
