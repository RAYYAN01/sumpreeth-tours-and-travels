"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { vehicleSchema, parseFeatures, slugify } from "@/lib/validation";
import { encodeFeatures } from "@/lib/features";
import { formObject } from "@/lib/form";
import { revalidatePublic } from "@/lib/revalidate";
import { TAGS } from "@/lib/site";
import type { ActionResult } from "@/components/admin/form";

export async function saveVehicleAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const raw = formObject(formData);

  const parsed = vehicleSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const v = parsed.data;

  // Build a unique slug from the name (kept stable on edit unless it collides).
  const base = slugify(v.name) || "vehicle";
  let slug = base;
  for (let i = 2; i < 50; i++) {
    const clash = await prisma.vehicle.findFirst({
      where: { slug, NOT: id ? { id } : undefined },
      select: { id: true },
    });
    if (!clash) break;
    slug = `${base}-${i}`;
  }

  const data = {
    name: v.name,
    slug,
    category: v.category,
    seats: v.seats,
    features: encodeFeatures(parseFeatures(v.features)),
    imageUrl: v.imageUrl,
    images: encodeFeatures(parseFeatures(v.images ?? "")),
    sortOrder: v.sortOrder,
    isActive: v.isActive,
    quoteOnRequest: v.quoteOnRequest,
    oneWayRate: v.oneWayRate,
    oneWayNote: v.oneWayNote || null,
    roundTripPerKm: v.roundTripPerKm,
    minKmPerDay: v.minKmPerDay,
    driverBata: v.driverBata,
    roundTripNote: v.roundTripNote || null,
    localPackageRate: v.localPackageRate,
    localExtraPerKm: v.localExtraPerKm,
    localExtraPerHr: v.localExtraPerHr,
  };

  try {
    if (id) {
      await prisma.vehicle.update({ where: { id }, data });
    } else {
      await prisma.vehicle.create({ data });
    }
  } catch {
    return { error: "Could not save the vehicle." };
  }

  revalidatePublic(TAGS.vehicles);
  revalidatePath("/admin/fleet");
  redirect("/admin/fleet");
}

export async function deleteVehicleAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.vehicle.delete({ where: { id } });
  revalidatePublic(TAGS.vehicles);
  revalidatePath("/admin/fleet");
  redirect("/admin/fleet");
}

export async function toggleVehicleAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const current = await prisma.vehicle.findUnique({
    where: { id },
    select: { isActive: true },
  });
  if (!current) return;
  await prisma.vehicle.update({
    where: { id },
    data: { isActive: !current.isActive },
  });
  revalidatePublic(TAGS.vehicles);
  revalidatePath("/admin/fleet");
}
