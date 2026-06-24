import { revalidatePath, revalidateTag } from "next/cache";

export const SITE_CONTENT_TAG = "site-content";

/** Bust Next.js cache for all CMS-driven frontend routes. */
export function revalidateSitePages() {
  revalidateTag(SITE_CONTENT_TAG);
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/studio");
  revalidatePath("/services");
  revalidatePath("/contact");
  revalidatePath("/projects");
  revalidatePath("/shop");
}
