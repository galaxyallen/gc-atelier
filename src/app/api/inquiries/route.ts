import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { assignedTo: { select: { id: true, name: true } } },
  });

  return NextResponse.json(inquiries);
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      company: body.company || null,
      projectType: body.projectType || null,
      budget: body.budget || null,
      message: body.message,
    },
  });

  return NextResponse.json(inquiry, { status: 201 });
}
