import { rupees, perKm } from "@/lib/format";
import type { VehicleView } from "@/lib/features";

type Row = { label: string; value: string; sub?: string };
type Group = { heading: string; rows: Row[] };

/** Split a vehicle's stored rates into the groups shown on the rate card. */
export function buildRateGroups(v: VehicleView): Group[] {
  if (v.quoteOnRequest) return [];

  const outstation: Row[] = [];
  if (v.oneWayRate != null)
    outstation.push({
      label: "One way",
      value: rupees(v.oneWayRate),
      sub: v.oneWayNote ?? "starting fare",
    });
  if (v.roundTripPerKm != null)
    outstation.push({ label: "Round trip", value: perKm(v.roundTripPerKm) });
  if (v.minKmPerDay != null)
    outstation.push({
      label: "Minimum running",
      value: `${v.minKmPerDay} km / day`,
    });
  if (v.driverBata != null)
    outstation.push({
      label: "Driver bata",
      value: `${rupees(v.driverBata)} / day`,
    });

  const local: Row[] = [];
  if (v.localPackageRate != null)
    local.push({
      label: "Package",
      value: rupees(v.localPackageRate),
      sub: "8 hr / 80 km",
    });
  if (v.localExtraPerKm != null)
    local.push({ label: "Extra per km", value: perKm(v.localExtraPerKm) });
  if (v.localExtraPerHr != null)
    local.push({ label: "Extra per hour", value: `₹${v.localExtraPerHr}` });

  const groups: Group[] = [];
  if (outstation.length) groups.push({ heading: "Outstation", rows: outstation });
  if (local.length) groups.push({ heading: "Local · in-city", rows: local });
  return groups;
}

type Props = {
  vehicle: VehicleView;
  /** Optional CTA row rendered in a bordered footer. */
  actions?: React.ReactNode;
};

export default function RateCard({ vehicle, actions }: Props) {
  const groups = buildRateGroups(vehicle);
  const showBata =
    !vehicle.quoteOnRequest &&
    vehicle.minKmPerDay != null &&
    vehicle.driverBata != null;

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-line px-5 py-4 sm:px-6">
        <p className="eyebrow">
          {vehicle.quoteOnRequest ? "Pricing" : "Rate card"}
        </p>
        <p className="mt-1 text-sm text-muted">
          {vehicle.quoteOnRequest
            ? "Group quote on request"
            : `Indicative rates for the ${vehicle.name}`}
        </p>
      </div>

      <div className="px-5 py-4 sm:px-6">
        {vehicle.quoteOnRequest ? (
          <p className="text-ink">
            {vehicle.roundTripNote || "Contact us for a tailored group quote."}
          </p>
        ) : (
          <div className="space-y-5">
            {groups.map((g) => (
              <div key={g.heading}>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-forest-600 dark:text-forest-300">
                  {g.heading}
                </p>
                <dl className="mt-1.5 divide-y divide-line">
                  {g.rows.map((r) => (
                    <div
                      key={r.label}
                      className="flex items-baseline justify-between gap-4 py-2.5"
                    >
                      <dt className="text-sm text-bodytext">
                        {r.label}
                        {r.sub && (
                          <span className="ml-1.5 text-xs text-muted">
                            {r.sub}
                          </span>
                        )}
                      </dt>
                      <dd className="shrink-0 text-sm font-bold tabular-nums text-ink">
                        {r.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 space-y-1 border-t border-line pt-3 text-xs text-muted">
          {showBata && (
            <p>
              min {vehicle.minKmPerDay} km/day · {rupees(vehicle.driverBata)}{" "}
              driver bata
            </p>
          )}
          {vehicle.roundTripNote && !vehicle.quoteOnRequest && (
            <p>{vehicle.roundTripNote}</p>
          )}
          <p>Tolls, parking, permits and state taxes are charged at actuals.</p>
        </div>
      </div>

      {actions && (
        <div className="border-t border-line px-5 py-4 sm:px-6">{actions}</div>
      )}
    </div>
  );
}
