import { seedDatabase } from "@/lib/seed-database";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const setupSecret = process.env.SETUP_SECRET;
  if (!setupSecret) {
    return NextResponse.json({ error: "Setup is not configured" }, { status: 503 });
  }

  const provided = request.headers.get("x-setup-secret");
  if (provided !== setupSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const force = request.headers.get("x-setup-force") === "true";

  try {
    const result = await seedDatabase(force);
    return NextResponse.json({
      ok: true,
      result,
      message: result === "seeded" ? "Database seeded" : "Database already seeded",
    });
  } catch (error) {
    console.error("Setup seed failed:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
