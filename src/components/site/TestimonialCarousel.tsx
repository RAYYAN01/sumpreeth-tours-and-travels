"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Star, Quote } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";

type Item = {
  id: string;
  authorName: string;
  location: string;
  rating: number;
  quote: string;
};

export default function TestimonialCarousel({ items }: { items: Item[] }) {
  if (items.length === 0) return null;

  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      slidesPerView={1}
      spaceBetween={24}
      autoplay={{ delay: 5500, disableOnInteraction: true }}
      pagination={{ clickable: true }}
      breakpoints={{
        768: { slidesPerView: 2 },
        1100: { slidesPerView: 3 },
      }}
      className="!pb-12"
      a11y={{ enabled: true }}
    >
      {items.map((t) => (
        <SwiperSlide key={t.id} className="h-auto">
          <figure className="relative flex h-full flex-col rounded-2xl bg-surface p-6 pt-8 ring-1 ring-line">
            <Quote
              className="absolute right-5 top-5 h-8 w-8 text-forest-100"
              fill="currentColor"
              strokeWidth={0}
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
                  <span className="flex gap-0.5 text-saffron-500">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3" fill="currentColor" strokeWidth={0} />
                    ))}
                  </span>
                  {t.location}
                </span>
              </span>
            </figcaption>
          </figure>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
