/** Category-based placeholder visuals when no upload exists yet */

const PROJECT_GRADIENTS: Record<string, string> = {
  VILLA: "linear-gradient(145deg, #2e3228 0%, #1e1e1c 55%, #252218 100%)",
  INTERIOR: "linear-gradient(145deg, #2a2826 0%, #1e1e1c 50%, #2c2a28 100%)",
  LANDSCAPE: "linear-gradient(145deg, #262a24 0%, #1e1e1c 50%, #222820 100%)",
  DIFFUSER: "linear-gradient(145deg, #28261e 0%, #1e1e1c 50%, #2a2820 100%)",
  BACKPACK: "linear-gradient(145deg, #242628 0%, #1e1e1c 50%, #282a2c 100%)",
  SPEAKER: "linear-gradient(145deg, #2a2624 0%, #1e1e1c 50%, #2c2826 100%)",
};

const PRODUCT_GRADIENTS: Record<string, string> = {
  DIFFUSER: "linear-gradient(160deg, #323028 0%, #1e1e1c 100%)",
  BACKPACK: "linear-gradient(160deg, #2a2c30 0%, #1e1e1c 100%)",
  SPEAKER: "linear-gradient(160deg, #302a26 0%, #1e1e1c 100%)",
};

/** True when value looks like a static path or remote URL, not descriptive text. */
export function isImageUrl(value: string | null | undefined): value is string {
  const v = value?.trim();
  if (!v) return false;
  if (v.startsWith("/") || v.startsWith("http://") || v.startsWith("https://")) return true;
  return false;
}

/** Built-in category SVGs — not user uploads; should not block gallery cover. */
export function isBuiltinPlaceholderImage(value: string | null | undefined): boolean {
  const v = value?.trim();
  if (!v) return false;
  return (
    /^\/images\/projects\/[a-z]+\.svg$/i.test(v) ||
    /^\/images\/products\/[a-z]+\.svg$/i.test(v)
  );
}

/** User upload or external URL suitable for cover / gallery display. */
export function isRealImageUrl(value: string | null | undefined): boolean {
  return isImageUrl(value) && !isBuiltinPlaceholderImage(value);
}

function firstImageUrl(values: string[] | null | undefined): string | null {
  if (!values?.length) return null;
  for (const item of values) {
    if (isRealImageUrl(item)) return item.trim();
  }
  return null;
}

export function projectImageSrc(image: string | null | undefined, category: string) {
  if (isRealImageUrl(image)) return image!.trim();
  const slug = category.toLowerCase();
  return `/images/projects/${slug}.svg`;
}

/** Cover image for list cards: explicit cover → gallery URL → category placeholder. */
export function resolveProjectCoverImage(
  image: string | null | undefined,
  galleryJson: string | null | undefined,
  category: string
): string {
  if (isRealImageUrl(image)) return image!.trim();
  try {
    const gallery = galleryJson ? (JSON.parse(galleryJson) as string[]) : [];
    const fromGallery = firstImageUrl(gallery);
    if (fromGallery) return fromGallery;
  } catch {
    /* ignore */
  }
  return projectImageSrc(null, category);
}

export function productImageSrc(imagesJson: string | null | undefined, category: string) {
  try {
    const images = imagesJson ? (JSON.parse(imagesJson) as string[]) : [];
    const fromImages = firstImageUrl(images);
    if (fromImages) return fromImages;
  } catch {
    /* ignore */
  }
  const slug = category.toLowerCase();
  return `/images/products/${slug}.svg`;
}

export function projectGradient(category: string) {
  return PROJECT_GRADIENTS[category] || PROJECT_GRADIENTS.INTERIOR;
}

export function productGradient(category: string) {
  return PRODUCT_GRADIENTS[category] || PRODUCT_GRADIENTS.DIFFUSER;
}

/** Homepage prototype uses compound category labels */
export function homeProjectCategoryLabel(category: string) {
  const map: Record<string, string> = {
    VILLA: "Villa · Landscape",
    INTERIOR: "Interior · Residential",
    LANDSCAPE: "Landscape · Garden",
    DIFFUSER: "Product · Diffuser",
    BACKPACK: "Product · Backpack",
    SPEAKER: "Product · Speaker",
  };
  return map[category] || category;
}
