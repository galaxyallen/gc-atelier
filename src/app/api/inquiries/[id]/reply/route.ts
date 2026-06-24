import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.body) {
    return NextResponse.json({ error: "Reply body required" }, { status: 400 });
  }

  const reply = await prisma.inquiryReply.create({
    data: {
      inquiryId: params.id,
      from: session.user.email,
      subject: body.subject || null,
      body: body.body,
    },
  });

  await prisma.inquiry.update({
    where: { id: params.id },
    data: { status: "REPLIED" },
  });

  return NextResponse.json(reply, { status: 201 });
}
