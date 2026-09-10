"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { destinationSchema } from "@/lib/validation";
import { formObject } from "@/lib/form";
import { revalidatePublic } from "@/lib/revalidate";
import { TAGS } from "@/lib/site";
import type { ActionResult } from "@/components/admin/form";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function saveDestinationAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = destinationSchema.safeParse(formObject(formData));
  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const d = parsed.data;
  const base = slugify(d.name) || "destination";

  try {
    // Ensure a unique slug (ignoring the current row on edit).
    let slug = base;
    let n = 1;
    while (
      await prisma.destination.findFirst({
        where: { slug, ...(id ? { NOT: { id } } : {}) },
        select: { id: true },
      })
    ) {
      slug = `${base}-${++n}`;
    }

    const data = {
      name: d.name,
      slug,
      category: d.category,
      description: d.description,
      imageUrl: d.imageUrl,
      distanceKm: d.distanceKm,
      sortOrder: d.sortOrder,
      isActive: d.isActive,
    };

    if (id) await prisma.destination.update({ where: { id }, data });
    else await prisma.destination.create({ data });
  } catch {
    return { error: "Could not save the destination." };
  }

  revalidatePublic(TAGS.destinations);
  revalidatePath("/destination");
  revalidatePath("/admin/destinations");
  redirect("/admin/destinations");
}

export async function deleteDestinationAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.destination.delete({ where: { id } });
  revalidatePublic(TAGS.destinations);
  revalidatePath("/destination");
  revalidatePath("/admin/destinations");
  redirect("/admin/destinations");
}

export async function toggleDestinationAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const current = await prisma.destination.findUnique({
    where: { id },
    select: { isActive: true },
  });
  if (!current) return;
  await prisma.destination.update({
    where: { id },
    data: { isActive: !current.isActive },
  });
  revalidatePublic(TAGS.destinations);
  revalidatePath("/destination");
  revalidatePath("/admin/destinations");
}
