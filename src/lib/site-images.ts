export type SiteImageField = {
  key: string;
  label: string;
  hint?: string;
  accept?: string;
  defaultValue?: string;
  fallbackKey?: string;
};

export type SiteImageGroup = {
  id: string;
  label: string;
  images: SiteImageField[];
};

export const SITE_IMAGE_GROUPS: SiteImageGroup[] = [
  {
    id: "homepage",
    label: "Homepage",
    images: [
      {
        key: "hero_poster",
        label: "Hero video poster",
        hint: "Shown before the hero video loads.",
        defaultValue: "/video/hero-poster.jpg",
      },
      {
        key: "hero_video",
        label: "Hero background video",
        hint: "MP4 URL or upload a video file.",
        accept: "video/mp4,video/webm",
        defaultValue: "/video/hero-video.mp4",
      },
      {
        key: "studio_founder_image",
        label: "Studio section portrait",
        hint: "Homepage studio preview block.",
        defaultValue: "/images/studio/founder.svg",
      },
    ],
  },
  {
    id: "studio",
    label: "Studio page",
    images: [
      {
        key: "studio_hero_image",
        label: "Hero background",
        hint: "Full-width image behind the studio hero.",
      },
      {
        key: "studio_origin_image",
        label: "Origin section portrait",
        hint: "Founder image in the origin section.",
        fallbackKey: "studio_founder_image",
      },
    ],
  },
  {
    id: "services",
    label: "Services page",
    images: [
      { key: "services_feat_interior", label: "Interior — featured project", hint: "Overrides linked project image if set." },
      { key: "services_feat_villa", label: "Villa — featured project" },
      { key: "services_feat_landscape", label: "Landscape — featured project" },
      { key: "services_feat_diffuser", label: "Diffuser — featured project" },
      { key: "services_feat_backpack", label: "Backpack — featured project" },
      { key: "services_feat_speaker", label: "Speaker — featured project" },
      { key: "services_d2p_01", label: "Design journey — Stage 01" },
      { key: "services_d2p_02", label: "Design journey — Stage 02" },
      { key: "services_d2p_03", label: "Design journey — Stage 03" },
      { key: "services_d2p_04", label: "Design journey — Stage 04" },
      { key: "services_d2p_05", label: "Design journey — Stage 05" },
    ],
  },
  {
    id: "contact",
    label: "Contact page",
    images: [
      {
        key: "contact_map_image",
        label: "Map area background",
        hint: "Optional image behind the location map.",
      },
    ],
  },
];

export const ALL_SITE_IMAGE_KEYS = SITE_IMAGE_GROUPS.flatMap((g) => g.images.map((i) => i.key));

export function siteImageDefaults(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const group of SITE_IMAGE_GROUPS) {
    for (const img of group.images) {
      map[img.key] = img.defaultValue ?? "";
    }
  }
  return map;
}

export function resolveSiteImage(images: Record<string, string>, key: string): string {
  const field = SITE_IMAGE_GROUPS.flatMap((g) => g.images).find((i) => i.key === key);
  const value = images[key];
  if (value) return value;
  if (field?.fallbackKey) return images[field.fallbackKey] || field.defaultValue || "";
  return field?.defaultValue || "";
}
