import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import type { Destination } from "@prisma/client";
import { distanceLabel } from "@/lib/format";

export default function DestinationCard({ dest }: { dest: Destination }) {
  return (
    <article className="group card-interactive relative flex h-full flex-col overflow-hidden">
      <div className="card-media aspect-[4/3] shrink-0">
        <Image
          src={dest.imageUrl}
          alt={dest.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
      <div className="card-body">
        <h3 className="text-h4 font-bold text-ink">{dest.name}</h3>
        {dest.distanceKm != null && (
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-saffron-600">
            <MapPin className="h-3.5 w-3.5" />
            {distanceLabel(dest.distanceKm)}
          </p>
        )}
        <p className="mt-2 flex-1 text-sm text-bodytext">{dest.description}</p>
        <Link
          href={`/contact?destination=${encodeURIComponent(dest.name)}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-bodytext after:absolute after:inset-0 hover:text-ink"
        >
          Plan this trip
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </Link>
      </div>
    </article>
  );
}
