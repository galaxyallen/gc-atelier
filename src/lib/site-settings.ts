export type SiteGlobals = {
  siteName: string;
  footerCopyright: string;
  socialFacebook: string;
  socialInstagram: string;
  socialLinkedin: string;
  shopLabel: string;
  shopTitle: string;
  shopSubtitle: string;
  projectsLabel: string;
  projectsTitle: string;
  projectsCountText: string;
};

export const SITE_GLOBALS_DEFAULTS: SiteGlobals = {
  siteName: "GC ATELIER",
  footerCopyright: "© 2026 GC Atelier. Guangzhou, China.",
  socialFacebook: "https://www.facebook.com/gccreativestudio",
  socialInstagram: "https://www.instagram.com/gccreativestudio",
  socialLinkedin: "https://www.linkedin.com/in/galaxyallenlee",
  shopLabel: "Shop",
  shopTitle: "Products",
  shopSubtitle: "Objects designed and manufactured by GC Atelier.",
  projectsLabel: "Portfolio",
  projectsTitle: "Projects",
  projectsCountText: "projects across spaces and objects",
};

export const SITE_SETTING_KEY_MAP: Record<keyof SiteGlobals, string> = {
  siteName: "site_name",
  footerCopyright: "footer_copyright",
  socialFacebook: "social_facebook",
  socialInstagram: "social_instagram",
  socialLinkedin: "social_linkedin",
  shopLabel: "shop_page_label",
  shopTitle: "shop_page_title",
  shopSubtitle: "shop_page_subtitle",
  projectsLabel: "projects_page_label",
  projectsTitle: "projects_page_title",
  projectsCountText: "projects_page_count_text",
};

export const SITE_SETTING_KEYS = Object.values(SITE_SETTING_KEY_MAP);

export type SocialLink = { label: string; href: string };

export function socialLinksFromGlobals(globals: SiteGlobals): SocialLink[] {
  return [
    { label: "Facebook", href: globals.socialFacebook },
    { label: "Instagram", href: globals.socialInstagram },
    { label: "LinkedIn", href: globals.socialLinkedin },
  ].filter((link) => link.href.trim());
}
