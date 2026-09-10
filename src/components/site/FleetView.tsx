"use client";

import { useState } from "react";
import { VEHICLE_CATEGORY_LABELS, type VehicleCategory } from "@/lib/constants";
import type { VehicleView } from "@/lib/features";
import VehicleCard from "./VehicleCard";

type TripFilter = "ALL" | "ONE_WAY" | "ROUND_TRIP" | "AIRPORT" | "LOCAL";

const TRIP_LABELS: Record<TripFilter, string> = {
  ALL: "All trips",
  ONE_WAY: "One Way",
  ROUND_TRIP: "Round Trip",
  AIRPORT: "Airport",
  LOCAL: "Local",
};

const CATEGORY_TABS: ("ALL" | VehicleCategory)[] = [
  "ALL",
  "CAR",
  "TEMPO_TRAVELLER",
  "BUS",
];

function matchesTrip(v: VehicleView, trip: TripFilter): boolean {
  if (trip === "ALL") return true;
  if (v.quoteOnRequest) return true;
  switch (trip) {
    case "ONE_WAY":
    case "AIRPORT":
      return v.oneWayRate != null;
    case "ROUND_TRIP":
      return v.roundTripPerKm != null;
    case "LOCAL":
      return v.localPackageRate != null;
    default:
      return true;
  }
}

type Props = {
  vehicles: VehicleView[];
  phone: string;
  whatsappNumber: string;
};

export default function FleetView({ vehicles, phone, whatsappNumber }: Props) {
  const [category, setCategory] = useState<"ALL" | VehicleCategory>("ALL");
  const [trip, setTrip] = useState<TripFilter>("ALL");

  const filtered = vehicles.filter(
    (v) =>
      (category === "ALL" || v.category === category) && matchesTrip(v, trip),
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Vehicle type">
          {CATEGORY_TABS.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                category === c
                  ? "bg-forest-600 text-white"
                  : "bg-surface text-bodytext ring-1 ring-line hover:bg-forest-50 dark:hover:bg-white/[0.04]"
              }`}
            >
              {c === "ALL" ? "All vehicles" : VEHICLE_CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(TRIP_LABELS) as TripFilter[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTrip(t)}
              aria-pressed={trip === t}
              className={`rounded-full px-4 py-2.5 text-xs font-semibold transition-colors ${
                trip === t
                  ? "bg-saffron-500 text-white"
                  : "bg-surface text-forest-600 dark:text-forest-300 ring-1 ring-line hover:bg-forest-50 dark:hover:bg-white/[0.04]"
              }`}
            >
              {TRIP_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-xl bg-surface p-8 text-center text-forest-600 dark:text-forest-300 ring-1 ring-line">
          No vehicles match this combination. Try “All trips”.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              phone={phone}
              whatsappNumber={whatsappNumber}
            />
          ))}
        </div>
      )}
    </div>
  );
}
