import { isRealImageUrl } from "./placeholders";

/** When saving a project, use cover image or fall back to first gallery image URL. */
export function normalizeProjectCoverImage(
  image: string | null | undefined,
  galleryJson: string | null | undefined
): string | null {
  if (isRealImageUrl(image)) return image!.trim();
  try {
    const gallery = galleryJson ? (JSON.parse(galleryJson) as string[]) : [];
    for (const item of gallery) {
      if (isRealImageUrl(item)) return item.trim();
    }
  } catch {
    /* ignore */
  }
  return null;
}
