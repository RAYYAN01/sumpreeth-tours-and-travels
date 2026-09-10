import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { enquiryInputSchema } from "@/lib/validation";
import { rateLimit, rateLimitHeaders } from "@/lib/rate-limit";

export const runtime = "nodejs";

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const limit = rateLimit(`enquiry:${ip}`, 8, 60 * 60 * 1000); // 8 / hour / IP
  const rlHeaders = rateLimitHeaders(limit);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429, headers: rlHeaders },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = enquiryInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please check the form and try again.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Honeypot: a bot filled the hidden "company" field.
  if (data.company) {
    return NextResponse.json({ ok: true, id: "skipped" }, { headers: rlHeaders });
  }

  try {
    const enquiry = await prisma.enquiry.create({
      data: {
        name: data.name,
        phone: data.phone,
        serviceType: data.serviceType,
        pickupLocation: data.pickupLocation,
        dropLocation: data.dropLocation || null,
        pickupAt: data.pickupAt ? new Date(data.pickupAt) : null,
        message: data.message || null,
        sourcePage: data.sourcePage || "home",
      },
      select: { id: true },
    });
    return NextResponse.json(
      { ok: true, id: enquiry.id },
      { headers: rlHeaders },
    );
  } catch (err) {
    console.error("Failed to save enquiry:", err);
    // The client still opens WhatsApp, so contact is never blocked.
    return NextResponse.json(
      { ok: false, error: "Could not save your enquiry, but you can still message us on WhatsApp." },
      { status: 500 },
    );
  }
}
