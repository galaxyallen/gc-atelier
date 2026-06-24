/**
 * Creates the Supabase Storage bucket for CMS uploads.
 * Usage: set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_KEY, then npm run supabase:setup
 */
import "dotenv/config";
import { UPLOADS_BUCKET, getSupabaseAdmin } from "../src/lib/supabase";

async function main() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY in environment.",
    );
    process.exit(1);
  }

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error("Failed to list buckets:", listError.message);
    process.exit(1);
  }

  const exists = buckets?.some((b) => b.name === UPLOADS_BUCKET);
  if (exists) {
    console.log(`Bucket "${UPLOADS_BUCKET}" already exists — OK`);
    return;
  }

  const { error } = await supabase.storage.createBucket(UPLOADS_BUCKET, {
    public: false,
  });
  if (error) {
    console.error("Failed to create bucket:", error.message);
    process.exit(1);
  }

  console.log(`Created bucket "${UPLOADS_BUCKET}" (private — served via /uploads/* API)`);
}

main();
