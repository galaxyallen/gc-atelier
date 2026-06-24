import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const UPLOADS_BUCKET = "uploads";

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}
