import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(body.password ?? "");
    const name = String(body.name ?? "").trim();
    const phone = body.phone ? String(body.phone).trim() : undefined;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const [existingUser, existingAdmin] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.adminUser.findUnique({ where: { email } }),
    ]);

    if (existingUser || existingAdmin) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Register failed:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
