import type { ContactContent, HomeContent, HomeProductCard, HomeProjectCard } from "@/lib/page-content";
import { isImageUrl } from "@/lib/placeholders";

export type HomeContactInfo = {
  email: string;
  phone: string;
  wechat: string;
  address: string;
};

/** Homepage contact: prefer homepage section overrides, then Contact page channels. */
export function resolveHomeContactInfo(
  home: HomeContent,
  contactPage: ContactContent
): HomeContactInfo {
  const channels = contactPage.channels;
  const address =
    home.contact.address?.trim() ||
    channels.address.replace(/\n/g, ", ").trim() ||
    "Guangzhou, China";

  return {
    email: home.contact.email?.trim() || channels.email,
    phone: home.contact.phone?.trim() || channels.phone,
    wechat: home.contact.wechat?.trim() || channels.wechat,
    address,
  };
}

type DbProject = { slug: string; name: string; category: string; image: string | null; gallery?: string | null };
type DbProduct = { id: string; name: string; price: number; category: string; images: string | null };

export function resolveHomeProjects(
  cards: HomeProjectCard[] | undefined,
  dbProjects: DbProject[]
): DbProject[] {
  if (!cards?.length) return dbProjects;
  return cards.map((card, i) => ({
    slug: dbProjects[i]?.slug ?? `home-project-${i}`,
    name: card.name,
    category: card.category,
    image: card.image || null,
  }));
}

export function resolveHomeProducts(
  cards: HomeProductCard[] | undefined,
  dbProducts: DbProduct[]
): DbProduct[] {
  if (!cards?.length) return dbProducts;
  return cards.map((card, i) => ({
    id: dbProducts[i]?.id ?? `home-product-${i}`,
    name: card.name,
    price: card.price,
    category: card.category,
    images: card.image ? JSON.stringify([card.image]) : null,
  }));
}

export function dbProjectToCard(project: DbProject): HomeProjectCard {
  const cover = isImageUrl(project.image) ? project.image!.trim() : "";
  return {
    name: project.name,
    category: project.category,
    image: cover,
  };
}

export function dbProductToCard(product: DbProduct): HomeProductCard {
  let image = "";
  try {
    const images = product.images ? (JSON.parse(product.images) as string[]) : [];
    for (const item of images) {
      if (isImageUrl(item)) {
        image = item.trim();
        break;
      }
    }
  } catch {
    /* ignore */
  }
  return {
    name: product.name,
    category: product.category,
    price: product.price,
    image,
  };
}
