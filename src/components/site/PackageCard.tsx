import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MessageCircle, Star, TrendingUp } from "lucide-react";
import type { PackageView } from "@/lib/site";
import { rupees } from "@/lib/format";
import { contactLink } from "@/lib/whatsapp";

export default function PackageCard({
  pkg,
  whatsappNumber,
}: {
  pkg: PackageView;
  whatsappNumber: string;
}) {
  const wa = contactLink(
    whatsappNumber,
    `Hi, I am interested in the ${pkg.title}. Please share the itinerary and quotation.`,
  );

  return (
    <article className="group card-interactive relative flex h-full flex-col overflow-hidden">
      <div className="card-media aspect-[4/3]">
        <Image
          src={pkg.featuredImage}
          alt={pkg.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
        />
        <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-bodytext backdrop-blur">
          {pkg.durationNights}N / {pkg.durationDays}D
        </span>
        {(pkg.featured || pkg.popular) && (
          <span
            className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-md ${
              pkg.featured ? "bg-saffron-500" : "bg-forest-600"
            }`}
          >
            {pkg.featured ? (
              <Star className="h-3 w-3" fill="currentColor" />
            ) : (
              <TrendingUp className="h-3 w-3" />
            )}
            {pkg.featured ? "Featured" : "Popular"}
          </span>
        )}
      </div>

      <div className="card-body">
        <p className="text-xs font-semibold uppercase tracking-wide text-saffron-600">
          {pkg.route}
        </p>
        <h3 className="mt-1 text-lg font-bold text-ink">
          <Link
            href={`/tours-packages/${pkg.slug}`}
            className="after:absolute after:inset-0 hover:text-bodytext"
          >
            {pkg.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-bodytext">
          {pkg.shortDescription}
        </p>

        {pkg.vehicleOptions.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {pkg.vehicleOptions.slice(0, 3).map((v) => (
              <li
                key={v}
                className="rounded-md bg-page px-2 py-1 text-xs text-bodytext ring-1 ring-line"
              >
                {v}
              </li>
            ))}
          </ul>
        )}

        <div className="card-foot">
          <div>
            <span className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted">
              <Clock className="h-3 w-3" />
              {pkg.durationNights} Nights / {pkg.durationDays} Days
            </span>
            <span className="text-xl font-extrabold tabular-nums text-ink">
              {pkg.startingPrice != null ? rupees(pkg.startingPrice) : "On request"}
            </span>
            {pkg.startingPrice != null && (
              <span className="ml-1 text-xs text-forest-500 dark:text-forest-400">
                {pkg.priceType === "PER_PERSON" ? "per person" : "per package"}
              </span>
            )}
          </div>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            data-track="book-cta"
            aria-label={`Enquire about the ${pkg.title} on WhatsApp`}
            className="btn-accent btn-sm btn-shine relative z-10 shrink-0"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Enquire
          </a>
        </div>

        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-bodytext transition group-hover:text-ink">
          View package &amp; itinerary
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
