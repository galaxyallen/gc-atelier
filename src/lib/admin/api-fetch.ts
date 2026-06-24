/** Authenticated admin API requests — always send session cookies. */
export function adminFetch(input: RequestInfo | URL, init?: RequestInit) {
  return fetch(input, {
    ...init,
    credentials: "same-origin",
  });
}

export async function uploadFile(file: File): Promise<{ url?: string; error?: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await adminFetch("/api/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { error: (data as { error?: string }).error || `Upload failed (${res.status})` };
  }
  return { url: (data as { url?: string }).url };
}
