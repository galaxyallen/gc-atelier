import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeListPreviewImage } from "@/lib/project-images";
import { revalidateSitePages } from "@/lib/revalidate-site";

type RouteParams = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const image = normalizeListPreviewImage(body.image);

  const project = await prisma.project.update({
    where: { id: params.id },
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
  return NextResponse.json(project);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.project.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
