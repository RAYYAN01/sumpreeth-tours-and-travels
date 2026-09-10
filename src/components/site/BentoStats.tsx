import Image from "next/image";
import { Clock, MapPin, Route, ShieldCheck } from "lucide-react";
import Counter from "./Counter";

export default function BentoStats({
  years,
  trips,
  cities,
}: {
  years: string;
  trips: string;
  cities: string;
}) {
  return (
    <section className="container-page py-12 lg:py-16">
      <div className="grid auto-rows-[130px] grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {/* Big — 24/7 */}
        <div className="reveal relative col-span-2 row-span-2 flex flex-col justify-between overflow-hidden rounded-2xl bg-forest-900 p-6 text-white ring-1 ring-white/5">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <Image
              src="/images/destinations/hero-bangalore.webp"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 640px"
              className="object-cover object-bottom opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-forest-900 via-forest-900/80 to-forest-900/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-900/70 to-transparent" />
            <svg
              viewBox="0 0 400 200"
              className="absolute inset-0 h-full w-full opacity-20"
            >
              <path
                d="M-10 170 C 80 120, 120 60, 220 70 S 380 40, 420 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="2 10"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <Clock className="relative z-10 h-7 w-7 text-saffron-300" strokeWidth={1.75} />
          <div className="relative z-10">
            <p className="font-heading text-5xl font-extrabold leading-none sm:text-6xl">
              24<span className="text-saffron-300">/</span>7
            </p>
            <p className="mt-2 max-w-xs text-sm text-forest-100/85">
              A person answers day or night — 3 pm school pickup or a 2 am airport
              run, same number.
            </p>
          </div>
        </div>

        {/* Trips */}
        <div className="reveal flex flex-col justify-center rounded-2xl bg-surface p-5 ring-1 ring-line transition-shadow hover:shadow-card">
          <Route className="mb-2 h-5 w-5 text-forest-600 dark:text-forest-300" strokeWidth={1.75} />
          <Counter value={trips} label="Trips completed" />
        </div>

        {/* Cities */}
        <div className="reveal flex flex-col justify-center rounded-2xl bg-surface p-5 ring-1 ring-line transition-shadow hover:shadow-card">
          <MapPin className="mb-2 h-5 w-5 text-forest-600 dark:text-forest-300" strokeWidth={1.75} />
          <Counter value={cities} label="Cities & towns covered" />
        </div>

        {/* Wide — years + assurance */}
        <div className="reveal col-span-2 flex items-center gap-5 rounded-2xl bg-forest-50 p-5 ring-1 ring-line dark:bg-white/[0.04]">
          <div className="shrink-0">
            <Counter value={years} label="Years on the road" />
          </div>
          <div className="border-l border-line pl-5">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
              <ShieldCheck className="h-4 w-4 text-forest-600 dark:text-forest-300" />
              Every driver vetted, every vehicle tracked
            </p>
            <p className="mt-1 text-xs text-forest-500 dark:text-forest-400">
              Address check, medical, skill test &amp; behavioural training before day one.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
