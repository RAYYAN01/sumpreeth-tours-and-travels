"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { testimonialSchema } from "@/lib/validation";
import { formObject } from "@/lib/form";
import { revalidatePublic } from "@/lib/revalidate";
import { TAGS } from "@/lib/site";
import type { ActionResult } from "@/components/admin/form";

export async function saveTestimonialAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = testimonialSchema.safeParse(formObject(formData));
  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const t = parsed.data;
  const data = {
    authorName: t.authorName,
    location: t.location,
    rating: t.rating,
    quote: t.quote,
    imageUrl: t.imageUrl || null,
    sortOrder: t.sortOrder,
    isActive: t.isActive,
  };

  try {
    if (id) await prisma.testimonial.update({ where: { id }, data });
    else await prisma.testimonial.create({ data });
  } catch {
    return { error: "Could not save the testimonial." };
  }

  revalidatePublic(TAGS.testimonials);
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export async function deleteTestimonialAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.testimonial.delete({ where: { id } });
  revalidatePublic(TAGS.testimonials);
  revalidatePath("/admin/testimonials");
  redirect("/admin/testimonials");
}

export async function toggleTestimonialAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const current = await prisma.testimonial.findUnique({
    where: { id },
    select: { isActive: true },
  });
  if (!current) return;
  await prisma.testimonial.update({
    where: { id },
    data: { isActive: !current.isActive },
  });
  revalidatePublic(TAGS.testimonials);
  revalidatePath("/admin/testimonials");
}
