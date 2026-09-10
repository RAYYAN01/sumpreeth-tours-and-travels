import Link from "next/link";
import { Users, ArrowRight, MessageCircle } from "lucide-react";
import { rupees, perKm } from "@/lib/format";
import { vehiclePhotos, type VehicleView } from "@/lib/features";
import { contactLink } from "@/lib/whatsapp";
import VehicleImages from "./VehicleImages";

type Props = {
  vehicle: VehicleView;
  phone: string;
  whatsappNumber: string;
  priority?: boolean;
};

function typeLabel(v: VehicleView): string {
  if (v.category === "TEMPO_TRAVELLER") return "Tempo Traveller";
  if (v.category === "BUS") return "Coach";
  return v.seats.startsWith("4") ? "Sedan" : "SUV / MPV";
}

function priceLine(v: VehicleView): { amount: string; unit: string } | null {
  if (v.quoteOnRequest) return { amount: "On request", unit: "group quote" };
  if (v.oneWayRate != null)
    return { amount: rupees(v.oneWayRate), unit: "one-way fare" };
  if (v.roundTripPerKm != null)
    return { amount: perKm(v.roundTripPerKm), unit: "round trip" };
  if (v.localPackageRate != null)
    return { amount: rupees(v.localPackageRate), unit: "8 hr / 80 km" };
  return null;
}

export default function VehicleCard({
  vehicle,
  whatsappNumber,
  priority,
}: Props) {
  const wa = contactLink(
    whatsappNumber,
    `Welcome to Sumpreeth Tours and Travels. I'd like to book the ${vehicle.name} (${vehicle.seats} seater) — please share availability and a quote.`,
  );
  const price = priceLine(vehicle);

  return (
    <article className="group card-interactive relative flex h-full flex-col overflow-hidden">
      <div className="card-media">
        <VehicleImages
          photos={vehiclePhotos(vehicle)}
          name={vehicle.name}
          variant="card"
          priority={priority}
        />
        <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-bodytext backdrop-blur">
          {typeLabel(vehicle)}
        </span>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Book the ${vehicle.name} on WhatsApp`}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-[#25D366] text-white shadow-md transition hover:scale-105 motion-reduce:transition-none"
        >
          <MessageCircle className="h-4 w-4" />
        </a>
      </div>

      <div className="card-body">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-ink">
            <Link
              href={`/fleet/${vehicle.slug}`}
              className="after:absolute after:inset-0 hover:text-bodytext"
            >
              {vehicle.name}
            </Link>
          </h3>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-forest-50 dark:bg-white/[0.04] px-2.5 py-1 text-xs font-semibold text-bodytext">
            <Users className="h-3.5 w-3.5" />
            {vehicle.seats}
          </span>
        </div>

        {vehicle.features.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {vehicle.features.slice(0, 3).map((f) => (
              <li
                key={f}
                className="rounded-md bg-page px-2 py-1 text-xs text-bodytext ring-1 ring-line"
              >
                {f}
              </li>
            ))}
          </ul>
        )}

        <div className="card-foot">
          {price && (
            <div>
              <span className="block text-[11px] uppercase tracking-wide text-muted">
                {vehicle.quoteOnRequest ? "" : "From"}
              </span>
              <span className="text-xl font-extrabold tabular-nums text-ink">
                {price.amount}
              </span>{" "}
              <span className="text-xs text-forest-500 dark:text-forest-400">
                {price.unit}
              </span>
            </div>
          )}
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            data-track="book-cta"
            aria-label={`Book the ${vehicle.name} now on WhatsApp`}
            className="btn-accent btn-sm btn-shine relative z-10 shrink-0"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Book now
          </a>
        </div>

        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-bodytext transition group-hover:text-ink">
          View details &amp; rates
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
