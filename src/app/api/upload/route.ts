import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { authOptions } from "@/lib/auth";
import { saveUpload } from "@/lib/blob-storage";

export const dynamic = "force-dynamic";

const MAX_BYTES = 50 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized — please log in again" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const filename = `${nanoid()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await saveUpload(filename, buffer, file.type || undefined);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Upload failed:", error);
    const message =
      error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
