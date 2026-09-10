import Link from "next/link";
import { prisma } from "@/lib/db";
import { VEHICLE_CATEGORY_LABELS, type VehicleCategory } from "@/lib/constants";
import { rupees, perKm } from "@/lib/format";
import { PageTitle, Panel, EmptyState, LinkButton } from "@/components/admin/ui";
import { toggleVehicleAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function FleetAdminPage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <>
      <PageTitle
        title="Fleet"
        subtitle="Vehicles, rates and availability shown on the public site"
        action={<LinkButton href="/admin/fleet/new">New vehicle</LinkButton>}
      />

      {vehicles.length === 0 ? (
        <EmptyState>No vehicles yet. Add your first one.</EmptyState>
      ) : (
        <Panel className="overflow-x-auto p-0">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-forest-100 text-xs uppercase tracking-wide text-forest-700/60">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Rates</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-100">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-forest-50/60">
                  <td className="px-4 py-3 text-forest-700/50">{v.sortOrder}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/fleet/${v.id}`}
                      className="font-medium text-forest-700 hover:underline"
                    >
                      {v.name}
                    </Link>
                    <div className="text-xs text-forest-700/60">{v.seats} seats</div>
                  </td>
                  <td className="px-4 py-3">
                    {VEHICLE_CATEGORY_LABELS[v.category as VehicleCategory]}
                  </td>
                  <td className="px-4 py-3 text-forest-700/80">
                    {v.quoteOnRequest
                      ? "Quote on request"
                      : [
                          v.oneWayRate != null
                            ? `1-way ${rupees(v.oneWayRate)}`
                            : null,
                          v.roundTripPerKm != null
                            ? `RT ${perKm(v.roundTripPerKm)}`
                            : null,
                          v.localPackageRate != null
                            ? `Local ${rupees(v.localPackageRate)}`
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleVehicleAction}>
                      <input type="hidden" name="id" value={v.id} />
                      <button
                        type="submit"
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          v.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-forest-100 text-forest-700/70"
                        }`}
                      >
                        {v.isActive ? "Active" : "Hidden"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/fleet/${v.id}`}
                      className="text-sm font-medium text-forest-700 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </>
  );
}
