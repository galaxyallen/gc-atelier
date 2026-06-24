import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_HOME_CONTENT,
  DEFAULT_STUDIO_CONTENT,
  DEFAULT_SERVICES_CONTENT,
  DEFAULT_CONTACT_CONTENT,
} from "@/lib/page-content";

const projects = [
  {
    name: "Shenzhen hilltop villa",
    slug: "shenzhen-hilltop-villa",
    category: "VILLA" as const,
    year: 2024,
    location: "Shenzhen, China",
    client: "Private client",
    scope: "Full design + landscape",
    isHero: true,
    sortOrder: 0,
    brief: "The client envisioned a family home that would sit within — not upon — the hillside terrain of eastern Shenzhen.",
    approach: "We organized the program into three staggered volumes following the hillside contour, each stepping down with the terrain.",
    details: [
      { icon: "◎", name: "Material palette", desc: "Local quartzite stone, reclaimed teak, brushed brass hardware." },
      { icon: "◇", name: "Key detail", desc: "Custom steel-and-glass pivot door connecting living area to terrace." },
      { icon: "▣", name: "Technical solution", desc: "Stepped retaining wall system with integrated drainage." },
    ],
    quote: { text: "GC Atelier understood that we didn't want a house on a hill — we wanted a house that is part of the hill.", attr: "Private client, Shenzhen" },
    gallery: ["Wide spatial render", "Material detail", "Interior view", "Landscape overview"],
  },
  {
    name: "Stone mist diffuser",
    slug: "stone-mist-diffuser",
    category: "DIFFUSER" as const,
    year: 2024,
    location: "Guangzhou, China",
    client: "GC Atelier",
    scope: "Product design + production",
    isHero: false,
    sortOrder: 1,
    brief: "A sculptural aroma diffuser inspired by natural river stones.",
    approach: "Hand-finished ceramic form with ultrasonic mist technology and ambient LED.",
    details: [],
    gallery: [],
  },
  {
    name: "Courtyard residence",
    slug: "courtyard-residence",
    category: "INTERIOR" as const,
    year: 2023,
    location: "Guangzhou, China",
    client: "Private client",
    scope: "Full interior design",
    isHero: false,
    sortOrder: 2,
    brief: "A residential interior organized around a central courtyard.",
    approach: "Material palette of lime wash, oak, and hand-troweled plaster.",
    details: [],
    gallery: [],
  },
  {
    name: "Commuter daypack",
    slug: "commuter-daypack",
    category: "BACKPACK" as const,
    year: 2024,
    location: "Guangzhou, China",
    client: "GC Atelier",
    scope: "Product design",
    isHero: false,
    sortOrder: 3,
    brief: "25L daily carry backpack for bike-to-office commuters.",
    approach: "500D Cordura exterior with YKK aquaguard zippers.",
    details: [],
    gallery: [],
  },
  {
    name: "Lakeside garden retreat",
    slug: "lakeside-garden-retreat",
    category: "LANDSCAPE" as const,
    year: 2023,
    location: "Hangzhou, China",
    client: "Private client",
    scope: "Landscape design",
    isHero: false,
    sortOrder: 4,
    brief: "A private garden retreat extending living space to the lakeshore.",
    approach: "Native planting with stone terraces and a reflecting pool.",
    details: [],
    gallery: [],
  },
  {
    name: "Walnut desk speaker",
    slug: "walnut-desk-speaker",
    category: "SPEAKER" as const,
    year: 2025,
    location: "Guangzhou, China",
    client: "GC Atelier",
    scope: "Product design + manufacturing",
    isHero: true,
    sortOrder: 5,
    brief: "Full-range bookshelf speaker in solid walnut housing.",
    approach: "Acoustic tuning for intimate desk listening with sculptural form.",
    details: [],
    gallery: [],
  },
  {
    name: "Boutique hotel lobby",
    slug: "boutique-hotel-lobby",
    category: "INTERIOR" as const,
    year: 2024,
    location: "Chengdu, China",
    client: "Hospitality group",
    scope: "Lobby + lounge design",
    isHero: false,
    sortOrder: 6,
    brief: "A boutique hotel lobby balancing warmth with contemporary minimalism.",
    approach: "Custom furniture program with local artisan collaborations.",
    details: [],
    gallery: [],
  },
  {
    name: "Ceramic cone diffuser",
    slug: "ceramic-cone-diffuser",
    category: "DIFFUSER" as const,
    year: 2024,
    location: "Guangzhou, China",
    client: "GC Atelier",
    scope: "Product design",
    isHero: false,
    sortOrder: 7,
    brief: "Minimalist conical form in matte ceramic with walnut base.",
    approach: "Whisper-quiet operation with sculptural desk presence.",
    details: [],
    gallery: [],
  },
  {
    name: "Mountain edge residence",
    slug: "mountain-edge-residence",
    category: "VILLA" as const,
    year: 2023,
    location: "Kunming, China",
    client: "Private client",
    scope: "Architecture + interior",
    isHero: false,
    sortOrder: 8,
    brief: "A mountain-edge residence with panoramic valley views.",
    approach: "Cantilevered volumes with floor-to-ceiling glazing.",
    details: [],
    gallery: [],
  },
  {
    name: "Zen garden pavilion",
    slug: "zen-garden-pavilion",
    category: "LANDSCAPE" as const,
    year: 2022,
    location: "Suzhou, China",
    client: "Private client",
    scope: "Garden pavilion",
    isHero: false,
    sortOrder: 9,
    brief: "A contemplative garden pavilion within a traditional courtyard.",
    approach: "Stone paths, moss gardens, and a single specimen tree.",
    details: [],
    gallery: [],
  },
  {
    name: "Portable speaker mini",
    slug: "portable-speaker-mini",
    category: "SPEAKER" as const,
    year: 2025,
    location: "Guangzhou, China",
    client: "GC Atelier",
    scope: "Product design",
    isHero: false,
    sortOrder: 10,
    brief: "Compact portable speaker in pebble-inspired form.",
    approach: "IP67 waterproof with custom oval driver.",
    details: [],
    gallery: [],
  },
  {
    name: "Travel daypack",
    slug: "travel-daypack",
    category: "BACKPACK" as const,
    year: 2023,
    location: "Guangzhou, China",
    client: "GC Atelier",
    scope: "Product design",
    isHero: false,
    sortOrder: 11,
    brief: "35L expandable travel backpack meeting carry-on requirements.",
    approach: "X-Pac fabric with clamshell opening and compression straps.",
    details: [],
    gallery: [],
  },
];

const products = [
  { name: "Stone mist diffuser", sku: "GC-DIF-001", category: "DIFFUSER" as const, price: 680, badge: "Bestseller", stock: 50, description: "Hand-finished ceramic diffuser inspired by natural river stones.", specs: [["Material", "Ceramic + ABS"], ["Size", "Ø 12 × H 15 cm"], ["Capacity", "300 ml"], ["Coverage", "Up to 40 m²"]] },
  { name: "Ceramic cone diffuser", sku: "GC-DIF-002", category: "DIFFUSER" as const, price: 520, badge: "", stock: 40, description: "Minimalist conical form in matte ceramic with walnut base.", specs: [["Material", "Ceramic + walnut"], ["Size", "Ø 9 × H 18 cm"], ["Capacity", "200 ml"], ["Timer", "2h / 4h"]] },
  { name: "Mist cylinder — black", sku: "GC-DIF-003", category: "DIFFUSER" as const, price: 460, badge: "New", stock: 35, description: "Cylindrical diffuser in anodized aluminum with soft-touch controls.", specs: [["Material", "Anodized aluminum"], ["Size", "Ø 7 × H 14 cm"], ["Capacity", "150 ml"], ["Power", "USB-C"]] },
  { name: "Commuter daypack", sku: "GC-BPK-001", category: "BACKPACK" as const, price: 1280, badge: "", stock: 25, description: "25L daily carry backpack with padded 15\" laptop compartment.", specs: [["Material", "500D Cordura"], ["Volume", "25 L"], ["Laptop", "Up to 15\""], ["Weight", "780 g"]] },
  { name: "Weekend travel pack", sku: "GC-BPK-002", category: "BACKPACK" as const, price: 1580, badge: "", stock: 20, description: "35L expandable travel backpack meeting carry-on requirements.", specs: [["Material", "X-Pac VX21"], ["Volume", "35 L"], ["Laptop", "Up to 16\""], ["Weight", "1,050 g"]] },
  { name: "Sling crossbody", sku: "GC-BPK-003", category: "BACKPACK" as const, price: 680, badge: "New", stock: 30, description: "Compact 5L sling bag for daily essentials.", specs: [["Material", "Recycled ripstop"], ["Volume", "5 L"], ["Tablet", "Up to 11\""], ["Weight", "320 g"]] },
  { name: "Desk speaker — walnut", sku: "GC-SPK-001", category: "SPEAKER" as const, price: 2400, badge: "Bestseller", stock: 15, description: "Full-range bookshelf speaker in solid walnut housing.", specs: [["Driver", "3\" full-range"], ["Output", "15W RMS"], ["Connectivity", "BT 5.3 / USB-C"], ["Material", "Solid walnut"]] },
  { name: "Portable speaker — stone", sku: "GC-SPK-002", category: "SPEAKER" as const, price: 1280, badge: "", stock: 22, description: "IP67 waterproof portable speaker in pebble-inspired form.", specs: [["Driver", "45mm oval custom"], ["Battery", "12 hours"], ["Rating", "IP67"], ["Weight", "420 g"]] },
  { name: "Desk speaker — concrete", sku: "GC-SPK-003", category: "SPEAKER" as const, price: 2800, badge: "Limited", stock: 8, description: "Limited edition speaker in hand-poured concrete with brass accent.", specs: [["Driver", "3\" full-range"], ["Output", "15W RMS"], ["Material", "Concrete + brass"], ["Edition", "200 units"]] },
];

export type SeedResult = "seeded" | "skipped";

export async function seedDatabase(force = false): Promise<SeedResult> {
  const existingAdmin = await prisma.adminUser.findFirst();
  if (existingAdmin && !force) {
    return "skipped";
  }

  if (force) {
    await prisma.inquiryReply.deleteMany();
    await prisma.inquiry.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.product.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    await prisma.adminUser.deleteMany();
    await prisma.pageContent.deleteMany();
    await prisma.siteSetting.deleteMany();
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.adminUser.create({
    data: {
      email: "admin@gcatelier.com",
      name: "Admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  for (const p of projects) {
    const cat = p.category.toLowerCase();
    await prisma.project.create({
      data: {
        name: p.name,
        slug: p.slug,
        category: p.category,
        year: p.year,
        location: p.location,
        client: p.client,
        scope: p.scope,
        brief: p.brief,
        approach: p.approach,
        isHero: p.isHero,
        sortOrder: p.sortOrder,
        status: "PUBLISHED",
        image: `/images/projects/${cat}.svg`,
        gallery: JSON.stringify(p.gallery),
        details: JSON.stringify(p.details),
        quote: p.quote ? JSON.stringify(p.quote) : null,
      },
    });
  }

  for (const p of products) {
    const cat = p.category.toLowerCase();
    await prisma.product.create({
      data: {
        name: p.name,
        sku: p.sku,
        category: p.category,
        price: p.price,
        badge: p.badge || null,
        stock: p.stock,
        description: p.description,
        specs: JSON.stringify(p.specs),
        images: JSON.stringify([`/images/products/${cat}.svg`]),
        status: "PUBLISHED",
      },
    });
  }

  await prisma.inquiry.createMany({
    data: [
      { name: "Li Wei", email: "liwei@example.com", company: "Studio LW", projectType: "Villa design", budget: "¥500K+", message: "Interested in a hillside villa project in Shenzhen.", status: "NEW" },
      { name: "Sarah Chen", email: "sarah@example.com", company: "Chen Design", projectType: "Product — Diffuser", budget: "¥50K-200K", message: "Looking for OEM diffuser production.", status: "REPLIED" },
      { name: "Mark Tan", email: "mark@example.com", projectType: "Interior design", budget: "¥200K-500K", message: "Boutique hotel lobby renovation inquiry.", status: "NEW" },
    ],
  });

  await prisma.siteSetting.createMany({
    data: [
      { key: "site_name", value: "GC ATELIER" },
      { key: "footer_copyright", value: "© 2026 GC Atelier. Guangzhou, China." },
      { key: "social_facebook", value: "https://www.facebook.com/gccreativestudio" },
      { key: "social_instagram", value: "https://www.instagram.com/gccreativestudio" },
      { key: "social_linkedin", value: "https://www.linkedin.com/in/galaxyallenlee" },
      { key: "shop_page_label", value: "Shop" },
      { key: "shop_page_title", value: "Products" },
      { key: "shop_page_subtitle", value: "Objects designed and manufactured by GC Atelier." },
      { key: "projects_page_label", value: "Portfolio" },
      { key: "projects_page_title", value: "Projects" },
      { key: "projects_page_count_text", value: "projects across spaces and objects" },
      { key: "contact_email", value: "hello@gcatelier.com" },
      { key: "contact_phone", value: "+86 138 0000 0000" },
      { key: "contact_wechat", value: "gc_atelier" },
      { key: "studio_address", value: "Guangzhou, China" },
    ],
  });

  await prisma.pageContent.createMany({
    data: [
      { pageKey: "homepage", sections: JSON.stringify(DEFAULT_HOME_CONTENT) },
      { pageKey: "studio", sections: JSON.stringify(DEFAULT_STUDIO_CONTENT) },
      { pageKey: "services", sections: JSON.stringify(DEFAULT_SERVICES_CONTENT) },
      { pageKey: "contact", sections: JSON.stringify(DEFAULT_CONTACT_CONTENT) },
    ],
  });

  const customer = await prisma.user.create({
    data: {
      email: "customer@example.com",
      name: "Jane Doe",
      phone: "+86 138 1111 2222",
      password: "",
    },
  });

  const firstProduct = await prisma.product.findFirst();
  if (firstProduct) {
    await prisma.order.create({
      data: {
        orderNumber: "GC-SAMPLE01",
        customerId: customer.id,
        subtotal: firstProduct.price,
        shipping: 50,
        total: firstProduct.price + 50,
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
        items: {
          create: [{ productId: firstProduct.id, quantity: 1, price: firstProduct.price }],
        },
      },
    });
  }

  return "seeded";
}
