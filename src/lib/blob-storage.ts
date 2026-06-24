import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { UPLOADS_BUCKET, getSupabaseAdmin } from "@/lib/supabase";

function blobKey(filename: string) {
  return `uploads/${filename}`;
}

/** Vercel serverless has no writable filesystem; use Supabase Storage in production. */
export function isRemoteStorageEnabled(): boolean {
  if (process.env.USE_LOCAL_UPLOADS === "true") return false;
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY,
  );
}

function contentTypeFromFilename(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
  };
  return map[ext ?? ""] ?? "application/octet-stream";
}

export async function saveUpload(
  filename: string,
  data: Buffer,
  contentType?: string,
): Promise<void> {
  const type = contentType || contentTypeFromFilename(filename);

  if (isRemoteStorageEnabled()) {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      throw new Error(
        "Supabase Storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY.",
      );
    }
    const { error } = await supabase.storage
      .from(UPLOADS_BUCKET)
      .upload(blobKey(filename), data, { contentType: type, upsert: true });
    if (error) throw error;
    return;
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), data);
}

export async function readUpload(
  filename: string,
): Promise<{ data: Buffer; contentType: string } | null> {
  if (isRemoteStorageEnabled()) {
    const supabase = getSupabaseAdmin();
    if (!supabase) return null;

    const { data, error } = await supabase.storage
      .from(UPLOADS_BUCKET)
      .download(blobKey(filename));
    if (error || !data) return null;

    return {
      data: Buffer.from(await data.arrayBuffer()),
      contentType: contentTypeFromFilename(filename),
    };
  }

  try {
    const filePath = path.join(process.cwd(), "public", "uploads", filename);
    const data = await readFile(filePath);
    return { data, contentType: contentTypeFromFilename(filename) };
  } catch {
    return null;
  }
}
