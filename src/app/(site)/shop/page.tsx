import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";
import { getSiteGlobals } from "@/lib/site-settings.server";
import ShopPageClient from "@/components/shop/ShopPageClient";

export const metadata = createMetadata({
  title: "Shop",
  description: "Objects designed and manufactured by GC ATELIER — diffusers, backpacks, and speakers.",
  path: "/shop",
});

export default async function ShopPage() {
  const [products, globals] = await Promise.all([
    prisma.product.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
    }),
    getSiteGlobals(),
  ]);

  return (
    <ShopPageClient
      products={products}
      pageHeader={{
        label: globals.shopLabel,
        title: globals.shopTitle,
        subtitle: globals.shopSubtitle,
      }}
    />
  );
}
