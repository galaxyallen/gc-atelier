import SiteShell from "@/components/layout/SiteShell";
import { getSiteGlobals } from "@/lib/site-settings.server";
import { SITE_GLOBALS_DEFAULTS } from "@/lib/site-settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let siteGlobals = SITE_GLOBALS_DEFAULTS;
  try {
    siteGlobals = await getSiteGlobals();
  } catch (error) {
    console.error("getSiteGlobals failed:", error);
  }
  return <SiteShell siteGlobals={siteGlobals}>{children}</SiteShell>;
}
