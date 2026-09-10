"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";
import { faqSchema } from "@/lib/validation";
import { formObject } from "@/lib/form";
import { revalidatePublic } from "@/lib/revalidate";
import { TAGS } from "@/lib/site";
import type { ActionResult } from "@/components/admin/form";

export async function saveFaqAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const parsed = faqSchema.safeParse(formObject(formData));
  if (!parsed.success) {
    return {
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const data = parsed.data;

  try {
    if (id) await prisma.faqItem.update({ where: { id }, data });
    else await prisma.faqItem.create({ data });
  } catch {
    return { error: "Could not save the FAQ." };
  }

  revalidatePublic(TAGS.faqs);
  revalidatePath("/contact");
  revalidatePath("/admin/faqs");
  redirect("/admin/faqs");
}

export async function deleteFaqAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.faqItem.delete({ where: { id } });
  revalidatePublic(TAGS.faqs);
  revalidatePath("/contact");
  revalidatePath("/admin/faqs");
  redirect("/admin/faqs");
}

export async function toggleFaqAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const current = await prisma.faqItem.findUnique({
    where: { id },
    select: { isActive: true },
  });
  if (!current) return;
  await prisma.faqItem.update({
    where: { id },
    data: { isActive: !current.isActive },
  });
  revalidatePublic(TAGS.faqs);
  revalidatePath("/contact");
  revalidatePath("/admin/faqs");
}
