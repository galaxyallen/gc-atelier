import { isRealImageUrl } from "./placeholders";

/** Save list preview only — never copy from gallery. */
export function normalizeListPreviewImage(
  image: string | null | undefined,
): string | null {
  if (isRealImageUrl(image)) return image!.trim();
  return null;
}
