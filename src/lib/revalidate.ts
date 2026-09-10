import { revalidateTag, revalidatePath } from "next/cache";
import { TAGS } from "./site";

/**
 * Refresh the public site after an admin edit. We invalidate the specific data
 * tag *and* the whole layout, so any change (a rate, a photo, hero text, a FAQ)
 * shows on every page on the very next request — no waiting for the ISR window.
 * The cost of full revalidation is negligible for this site's traffic.
 */
export function revalidatePublic(tag: (typeof TAGS)[keyof typeof TAGS]) {
  revalidateTag(tag, "max");
  revalidatePath("/", "layout");
}
