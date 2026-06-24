export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(price: number) {
  const currency = (process.env.NEXT_PUBLIC_SHOP_CURRENCY || "USD").toUpperCase();
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export const categoryLabels: Record<string, string> = {
  INTERIOR: "Interior",
  VILLA: "Villa",
  LANDSCAPE: "Landscape",
  DIFFUSER: "Diffuser",
  BACKPACK: "Backpack",
  SPEAKER: "Speaker",
};

export const productCategoryLabels: Record<string, string> = {
  DIFFUSER: "Diffuser",
  BACKPACK: "Backpack",
  SPEAKER: "Speaker",
};
