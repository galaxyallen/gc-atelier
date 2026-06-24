import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data: Record<string, unknown> = {};

  if (body.orderStatus) data.orderStatus = body.orderStatus;
  if (body.paymentStatus) data.paymentStatus = body.paymentStatus;
  if (body.trackingNo !== undefined) data.trackingNo = body.trackingNo;
  if (body.notes !== undefined) data.notes = body.notes;

  const order = await prisma.order.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json(order);
}
