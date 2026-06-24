import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidateSitePages } from "@/lib/revalidate-site";

function canEditSettings(role: string | undefined) {
  return role === "SUPER_ADMIN" || role === "EDITOR";
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !canEditSettings(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await prisma.siteSetting.findMany();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !canEditSettings(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const settings = body.settings as { key: string; value: string }[];

  if (!Array.isArray(settings)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await Promise.all(
    settings.map((s) =>
      prisma.siteSetting.upsert({
        where: { key: s.key },
        create: { key: s.key, value: s.value ?? "" },
        update: { value: s.value ?? "" },
      })
    )
  );

  revalidateSitePages();

  return NextResponse.json({ ok: true });
}
