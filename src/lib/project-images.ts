/** When saving a project, use cover image or fall back to first gallery image. */
export function normalizeProjectCoverImage(
  image: string | null | undefined,
  galleryJson: string | null | undefined
): string | null {
  const cover = image?.trim();
  if (cover) return cover;
  try {
    const gallery = galleryJson ? (JSON.parse(galleryJson) as string[]) : [];
    const first = gallery[0]?.trim();
    if (first) return first;
  } catch {
    /* ignore */
  }
  return null;
}
