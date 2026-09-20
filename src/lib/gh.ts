/**
 * GitHub REST fetch with a localStorage cache (default 6h). Unauthenticated
 * GitHub API allows 60 req/h per IP — shared visitor IPs burn that fast, so
 * repeat visits shouldn't re-request. Order: fresh cache → network → stale
 * cache → null (caller falls back to the bundled snapshot).
 */
const PREFIX = "ghcache:";
const TTL_MS = 6 * 60 * 60 * 1000;

interface CacheEntry<T> {
  t: number;
  data: T;
}

function readCache<T>(url: string): CacheEntry<T> | null {
  try {
    const raw = localStorage.getItem(PREFIX + url);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEntry<T>;
  } catch {
    return null;
  }
}

export async function cachedFetchJson<T>(url: string): Promise<T | null> {
  const cached = readCache<T>(url);
  if (cached && Date.now() - cached.t < TTL_MS) return cached.data;

  try {
    const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as T;
    try {
      localStorage.setItem(PREFIX + url, JSON.stringify({ t: Date.now(), data } satisfies CacheEntry<T>));
    } catch {
      /* storage full or blocked — cache is best-effort */
    }
    return data;
  } catch {
    return cached ? cached.data : null; // stale is better than nothing
  }
}
