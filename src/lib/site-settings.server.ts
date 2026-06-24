import { prisma } from "@/lib/prisma";
import {
  SITE_GLOBALS_DEFAULTS,
  SITE_SETTING_KEY_MAP,
  SITE_SETTING_KEYS,
  type SiteGlobals,
} from "@/lib/site-settings";

export { SITE_SETTING_KEYS, socialLinksFromGlobals, type SiteGlobals, type SocialLink } from "@/lib/site-settings";

export async function getSiteGlobals(): Promise<SiteGlobals> {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: SITE_SETTING_KEYS } },
  });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  const globals = { ...SITE_GLOBALS_DEFAULTS };
  for (const [field, key] of Object.entries(SITE_SETTING_KEY_MAP) as [keyof SiteGlobals, string][]) {
    const value = map[key]?.trim();
    if (value) globals[field] = value;
  }
  return globals;
}
