import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeProjectCoverImage } from "@/lib/project-images";
import { revalidateSitePages } from "@/lib/revalidate-site";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const image = normalizeProjectCoverImage(body.image, body.gallery ?? "[]");

  const project = await prisma.project.create({
    data: {
      name: body.name,
      slug: body.slug,
      category: body.category,
      year: Number(body.year),
      location: body.location || null,
      client: body.client || null,
      scope: body.scope || null,
      brief: body.brief || null,
      approach: body.approach || null,
      image,
      gallery: body.gallery ?? "[]",
      details: body.details ?? "[]",
      quote: body.quote || null,
      isHero: Boolean(body.isHero),
      status: body.status ?? "DRAFT",
      sortOrder: Number(body.sortOrder) || 0,
    },
  });

  revalidateSitePages();
  return NextResponse.json(project, { status: 201 });
}
