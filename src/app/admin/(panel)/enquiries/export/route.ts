import { type NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isAuthenticated } from "@/lib/session";
import {
  SERVICE_TYPE_LABELS,
  ENQUIRY_STATUS_LABELS,
  ENQUIRY_STATUS_ORDER,
  SERVICE_TYPE_ORDER,
  type ServiceType,
  type EnquiryStatus,
} from "@/lib/constants";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

function csvCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const sp = req.nextUrl.searchParams;
  const where: Prisma.EnquiryWhereInput = {};
  const status = sp.get("status");
  const serviceType = sp.get("serviceType");
  const q = sp.get("q");

  if (status && ENQUIRY_STATUS_ORDER.includes(status as never)) {
    where.status = status as never;
  }
  if (serviceType && SERVICE_TYPE_ORDER.includes(serviceType as never)) {
    where.serviceType = serviceType as never;
  }
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { phone: { contains: q } },
      { pickupLocation: { contains: q } },
      { dropLocation: { contains: q } },
    ];
  }

  const rows = await prisma.enquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 5000,
  });

  const header = [
    "Received",
    "Name",
    "Phone",
    "Service",
    "Pickup",
    "Drop",
    "Preferred time",
    "Status",
    "Message",
    "Notes",
    "Source",
  ];

  const lines = [header.join(",")];
  for (const e of rows) {
    lines.push(
      [
        formatDateTime(e.createdAt),
        e.name,
        e.phone,
        SERVICE_TYPE_LABELS[e.serviceType as ServiceType],
        e.pickupLocation,
        e.dropLocation ?? "",
        e.pickupAt ? formatDateTime(e.pickupAt) : "",
        ENQUIRY_STATUS_LABELS[e.status as EnquiryStatus],
        e.message ?? "",
        e.adminNotes ?? "",
        e.sourcePage,
      ]
        .map((v) => csvCell(String(v)))
        .join(","),
    );
  }

  const stamp = new Date().toISOString().slice(0, 10);
  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="enquiries-${stamp}.csv"`,
    },
  });
}
