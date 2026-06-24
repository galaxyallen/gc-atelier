import { prisma } from "@/lib/prisma";
import {
  ALL_SITE_IMAGE_KEYS,
  SITE_IMAGE_GROUPS,
  siteImageDefaults,
} from "@/lib/site-images";

export async function getSiteImages(): Promise<Record<string, string>> {
  const defaults = siteImageDefaults();
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: ALL_SITE_IMAGE_KEYS } },
  });
  const merged = { ...defaults };
  for (const row of rows) {
    if (row.value) merged[row.key] = row.value;
  }

  for (const group of SITE_IMAGE_GROUPS) {
    for (const img of group.images) {
      if (!merged[img.key] && img.fallbackKey) {
        merged[img.key] = merged[img.fallbackKey] || defaults[img.fallbackKey] || "";
      }
    }
  }

  return merged;
}
