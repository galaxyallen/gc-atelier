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

export function projectImageSrc(image: string | null | undefined, category: string) {
  if (image) return image;
  const slug = category.toLowerCase();
  return `/images/projects/${slug}.svg`;
}

/** Cover image for list cards: explicit cover → gallery[0] → category placeholder. */
export function resolveProjectCoverImage(
  image: string | null | undefined,
  galleryJson: string | null | undefined,
  category: string
): string {
  if (image?.trim()) return image.trim();
  try {
    const gallery = galleryJson ? (JSON.parse(galleryJson) as string[]) : [];
    if (gallery[0]?.trim()) return gallery[0].trim();
  } catch {
    /* ignore */
  }
  return projectImageSrc(null, category);
}

export function productImageSrc(imagesJson: string | null | undefined, category: string) {
  try {
    const images = imagesJson ? (JSON.parse(imagesJson) as string[]) : [];
    if (images[0]) return images[0];
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
