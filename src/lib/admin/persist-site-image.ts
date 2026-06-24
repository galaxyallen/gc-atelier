import { adminFetch } from "@/lib/admin/api-fetch";

/** Persist a single site image key immediately after upload (client-side). */
export async function persistSiteImage(key: string, value: string): Promise<boolean> {
  const res = await adminFetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ settings: [{ key, value }] }),
  });
  return res.ok;
}

export async function persistSiteImages(
  entries: { key: string; value: string }[]
): Promise<boolean> {
  const res = await adminFetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ settings: entries }),
  });
  return res.ok;
}
