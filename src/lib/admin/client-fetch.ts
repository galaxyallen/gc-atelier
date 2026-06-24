/** Authenticated admin API calls — always send session cookies. */
export function adminFetch(input: RequestInfo | URL, init?: RequestInit) {
  return fetch(input, {
    ...init,
    credentials: "include",
  });
}
