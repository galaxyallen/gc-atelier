import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma, parseJson, toJson } from "@/lib/prisma";
import { revalidateSitePages } from "@/lib/revalidate-site";
import { HomeContent, pickHomeContactSection } from "@/lib/page-content";

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
  let sections = toJson(body.sections ?? body);

  if (params.page === "homepage") {
    const stored = (body.sections ?? body) as Partial<HomeContent>;
    sections = toJson({
      ...stored,
      contact: pickHomeContactSection(stored.contact),
    });
  }

  const content = await prisma.pageContent.upsert({
    where: { pageKey: params.page },
    create: { pageKey: params.page, sections },
    update: { sections },
  });

  // Drop legacy homepage contact overrides so Contact page edits show on the homepage too.
  if (params.page === "contact") {
    const homeRow = await prisma.pageContent.findUnique({ where: { pageKey: "homepage" } });
    if (homeRow?.sections) {
      const stored = parseJson<Partial<HomeContent>>(homeRow.sections, {});
      const hasLegacyOverrides =
        stored.contact?.email ||
        stored.contact?.phone ||
        stored.contact?.wechat ||
        stored.contact?.address;
      if (hasLegacyOverrides) {
        await prisma.pageContent.update({
          where: { pageKey: "homepage" },
          data: {
            sections: toJson({
              ...stored,
              contact: pickHomeContactSection(stored.contact),
            }),
          },
        });
      }
    }
  }

  revalidateSitePages();

  return NextResponse.json(content);
}
