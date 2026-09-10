import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  SERVICE_TYPE_LABELS,
  type ServiceType,
  type EnquiryStatus,
} from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { PageTitle, Panel, StatusBadge, EmptyState } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [newCount, weekCount, totalCount, bookedCount, recent, counts] =
    await Promise.all([
      prisma.enquiry.count({ where: { status: "NEW" } }),
      prisma.enquiry.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: "BOOKED" } }),
      prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
      Promise.all([
        prisma.vehicle.count(),
        prisma.destination.count(),
        prisma.testimonial.count(),
        prisma.faqItem.count(),
      ]),
    ]);

  const [vehicleCount, destinationCount, testimonialCount, faqCount] = counts;

  const stats = [
    { label: "New enquiries", value: newCount, href: "/admin/enquiries?status=NEW" },
    { label: "Last 7 days", value: weekCount, href: "/admin/enquiries" },
    { label: "Booked", value: bookedCount, href: "/admin/enquiries?status=BOOKED" },
    { label: "Total enquiries", value: totalCount, href: "/admin/enquiries" },
  ];

  return (
    <>
      <PageTitle title="Dashboard" subtitle="Overview of enquiries and content" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Panel className="transition-shadow hover:shadow-md">
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{s.value}</p>
            </Panel>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Panel>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Recent enquiries</h2>
            <Link
              href="/admin/enquiries"
              className="text-sm font-medium text-forest-700 hover:underline"
            >
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState>No enquiries yet.</EmptyState>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((e) => (
                <li key={e.id}>
                  <Link
                    href={`/admin/enquiries/${e.id}`}
                    className="flex items-center justify-between gap-3 py-3 hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {e.name} · {e.phone}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {SERVICE_TYPE_LABELS[e.serviceType as ServiceType]} — {e.pickupLocation}
                        {e.dropLocation ? ` → ${e.dropLocation}` : ""} ·{" "}
                        {formatDateTime(e.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={e.status as EnquiryStatus} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel>
          <h2 className="mb-3 font-semibold text-slate-900">Content</h2>
          <ul className="space-y-2 text-sm">
            {[
              ["Vehicles", vehicleCount, "/admin/fleet"],
              ["Destinations", destinationCount, "/admin/destinations"],
              ["Testimonials", testimonialCount, "/admin/testimonials"],
              ["FAQ items", faqCount, "/admin/faqs"],
            ].map(([label, count, href]) => (
              <li key={label as string}>
                <Link
                  href={href as string}
                  className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-50"
                >
                  <span className="text-slate-600">{label}</span>
                  <span className="font-semibold text-slate-900">{count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
