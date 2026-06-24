import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma, parseJson, toJson } from "@/lib/prisma";
import { revalidateSitePages } from "@/lib/revalidate-site";

export async function GET(
  _req: NextRequest,
  { params }: { params: { page: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const content = await prisma.pageContent.findUnique({
    where: { pageKey: params.page },
  });

  if (!content) {
    return NextResponse.json({ pageKey: params.page, sections: {} });
  }

  return NextResponse.json({
    pageKey: content.pageKey,
    sections: parseJson(content.sections, {}),
    updatedAt: content.updatedAt,
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { page: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role === "SALES") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const sections = toJson(body.sections ?? body);

  const content = await prisma.pageContent.upsert({
    where: { pageKey: params.page },
    create: { pageKey: params.page, sections },
    update: { sections },
  });

  revalidateSitePages();

  return NextResponse.json(content);
}
