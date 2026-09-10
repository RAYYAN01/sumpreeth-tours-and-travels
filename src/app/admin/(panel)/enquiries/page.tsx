import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  SERVICE_TYPE_LABELS,
  SERVICE_TYPE_ORDER,
  ENQUIRY_STATUS_LABELS,
  ENQUIRY_STATUS_ORDER,
  type ServiceType,
  type EnquiryStatus,
} from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { PageTitle, Panel, StatusBadge, EmptyState } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

type SP = {
  status?: string;
  serviceType?: string;
  q?: string;
  page?: string;
};

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const where: Prisma.EnquiryWhereInput = {};
  if (sp.status && ENQUIRY_STATUS_ORDER.includes(sp.status as never)) {
    where.status = sp.status as never;
  }
  if (
    sp.serviceType &&
    SERVICE_TYPE_ORDER.includes(sp.serviceType as never)
  ) {
    where.serviceType = sp.serviceType as never;
  }
  if (sp.q) {
    // SQLite `contains` is already case-insensitive for ASCII (no `mode` option).
    where.OR = [
      { name: { contains: sp.q } },
      { phone: { contains: sp.q } },
      { pickupLocation: { contains: sp.q } },
      { dropLocation: { contains: sp.q } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.enquiry.count({ where }),
  ]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const qs = new URLSearchParams();
  if (sp.status) qs.set("status", sp.status);
  if (sp.serviceType) qs.set("serviceType", sp.serviceType);
  if (sp.q) qs.set("q", sp.q);

  return (
    <>
      <PageTitle
        title="Enquiries"
        subtitle={`${total} enquir${total === 1 ? "y" : "ies"} match`}
        action={
          <a
            href={`/admin/enquiries/export?${qs.toString()}`}
            className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Export CSV
          </a>
        }
      />

      <Panel className="mb-4">
        <form className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
          <input
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="Search name, phone, location…"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-200"
          />
          <select
            name="status"
            defaultValue={sp.status ?? ""}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            {ENQUIRY_STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {ENQUIRY_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <select
            name="serviceType"
            defaultValue={sp.serviceType ?? ""}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All services</option>
            {SERVICE_TYPE_ORDER.map((s) => (
              <option key={s} value={s}>
                {SERVICE_TYPE_LABELS[s]}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-forest-600 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-700"
          >
            Filter
          </button>
        </form>
      </Panel>

      {rows.length === 0 ? (
        <EmptyState>No enquiries match these filters.</EmptyState>
      ) : (
        <Panel className="overflow-x-auto p-0">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-500">
                    {formatDateTime(e.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/enquiries/${e.id}`}
                      className="font-medium text-forest-700 hover:underline"
                    >
                      {e.name}
                    </Link>
                    <div className="text-xs text-slate-500">{e.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    {SERVICE_TYPE_LABELS[e.serviceType as ServiceType]}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {e.pickupLocation}
                    {e.dropLocation ? ` → ${e.dropLocation}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={e.status as EnquiryStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      {pageCount > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
          {Array.from({ length: pageCount }).map((_, i) => {
            const p = i + 1;
            const params = new URLSearchParams(qs);
            params.set("page", String(p));
            return (
              <Link
                key={p}
                href={`/admin/enquiries?${params.toString()}`}
                className={`rounded-md px-3 py-1.5 ${
                  p === page
                    ? "bg-forest-600 text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
