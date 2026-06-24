import { NextRequest, NextResponse } from "next/server";
import { readUpload } from "@/lib/blob-storage";

export const dynamic = "force-dynamic";

type Params = { params: { filename: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  const filename = params.filename;
  if (!filename || filename.includes("..") || filename.includes("/")) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const file = await readUpload(filename);
    if (!file) return new NextResponse("Not found", { status: 404 });

    return new NextResponse(new Uint8Array(file.data), {
      headers: {
        "Content-Type": file.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Serve upload failed:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
