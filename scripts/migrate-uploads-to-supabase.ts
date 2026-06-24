/**
 * Upload local public/uploads files to Supabase Storage (one-time migration).
 * Usage: npm run migrate:uploads
 */
import "dotenv/config";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { UPLOADS_BUCKET, getSupabaseAdmin } from "../src/lib/supabase";

function uploadKey(filename: string) {
  return `uploads/${filename}`;
}

async function main() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY first.");
    process.exit(1);
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  let files: string[];
  try {
    files = await readdir(uploadDir);
  } catch {
    console.log("No public/uploads directory — nothing to migrate.");
    return;
  }

  const uploads = files.filter((f) => !f.startsWith("."));
  if (uploads.length === 0) {
    console.log("No files in public/uploads.");
    return;
  }

  let ok = 0;
  let fail = 0;

  for (const filename of uploads) {
    const data = await readFile(path.join(uploadDir, filename));
    const { error } = await supabase.storage
      .from(UPLOADS_BUCKET)
      .upload(uploadKey(filename), data, { upsert: true });

    if (error) {
      console.error(`  ✗ ${filename}: ${error.message}`);
      fail++;
    } else {
      console.log(`  ✓ ${filename}`);
      ok++;
    }
  }

  console.log(`\nDone: ${ok} uploaded, ${fail} failed.`);
  if (fail > 0) process.exit(1);
}

main();
