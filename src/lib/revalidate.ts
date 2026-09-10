import { revalidateTag, revalidatePath } from "next/cache";
import { TAGS } from "./site";

/** Refresh public pages after an admin edit. */
export function revalidatePublic(tag: (typeof TAGS)[keyof typeof TAGS]) {
  // Next 16 requires a cache-life profile; "max" expires every entry with the tag.
  revalidateTag(tag, "max");
  // Home aggregates most things; other pages are covered by their tag.
  revalidatePath("/", "page");
}
