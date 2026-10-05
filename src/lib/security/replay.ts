/**
 * Request replayer — curl-in-a-terminal for public targets only, entirely
 * client-side. `replay [METHOD] URL [-H "Name: value"]… [-d "body"]`.
 *
 * SSRF discipline, by hard fail: the target is validated BEFORE any fetch —
 * http/https schemes only, and the hostname must not be a loopback, link-local,
 * private-range, unspecified, or .local name. A browser can't resolve-then-check
 * (no DNS visibility), so obvious literals are rejected and everything private
 * is blocked by design: public targets only. That keeps the tool deployable
 * and un-abusable — there is no proxy here, this tab IS the client.
 */
import { err, out, type TermLine } from "./term";
import type { HeaderPair } from "./headers";

export type TargetCheck =
  | { ok: true; url: URL; host: string; scheme: string }
  | { ok: false; reason: string };

/** inet_aton-style IPv4 parse: 1–4 parts, decimal/hex/octal, last part may
 *  carry the remaining bytes (127.1 → 127.0.0.1, 2130706433 → 127.0.0.1) */
export function parseIPv4(host: string): number | null {
  const parts = host.split(".");
  if (parts.length < 1 || parts.length > 4) return null;
  let value = 0;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    let n: number;
    if (/^0x[0-9a-f]{1,8}$/i.test(part)) n = parseInt(part.slice(2), 16);
    else if (/^0[0-7]+$/.test(part)) n = parseInt(part.slice(1), 8);
    else if (/^\d{1,10}$/.test(part)) n = parseInt(part, 10);
    else return null;
    if (i < parts.length - 1) {
      if (n > 255) return null;
      value = value * 256 + n;
    } else {
      const bytesLeft = 5 - parts.length; // bytes the last part may occupy
      if (n >= 256 ** bytesLeft) return null;
      value = value * 256 ** bytesLeft + n;
    }
  }
  return value <= 0xffffffff ? value : null;
}

const PRIVATE_V4: { mask: number; bits: number; name: string }[] = [
  { mask: 0x00000000, bits: 8, name: "unspecified (0.0.0.0/8)" },
  { mask: 0x0a000000, bits: 8, name: "private (10/8)" },
  { mask: 0x7f000000, bits: 8, name: "loopback (127/8)" },
  { mask: 0xac100000, bits: 12, name: "private (172.16/12)" },
  { mask: 0xc0a80000, bits: 16, name: "private (192.168/16)" },
  { mask: 0xa9fe0000, bits: 16, name: "link-local (169.254/16)" },
];

function ipv4ProblemFromAddr(addr: number): string | null {
  for (const range of PRIVATE_V4) {
    const shift = 32 - range.bits;
    if ((addr >>> shift) === (range.mask >>> shift)) return range.name;
  }
  return null;
}

function ipv4Problem(host: string): string | null {
  const addr = parseIPv4(host);
  if (addr === null) return null;
  return ipv4ProblemFromAddr(addr);
}

/** IPv6 literal checks on the compressed lowercase form — literal patterns only.
 *  (WHATWG URLs normalize IPv4-mapped forms to hex, e.g. [::ffff:a00:1].) */
function ipv6Problem(host: string): string | null {
  const h = host.replace(/^\[|\]$/g, "").toLowerCase();
  if (!h.includes(":")) return null;
  if (h === "::1" || h === "::") return "IPv6 loopback/unspecified";
  if (/^f[cd][0-9a-f]{2}:/.test(h)) return "IPv6 unique-local (fc00::/7)";
  if (/^fe[89ab][0-9a-f]:/.test(h)) return "IPv6 link-local (fe80::/10)";
  const dotted = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/.exec(h);
  if (dotted) {
    const v4 = ipv4Problem(dotted[1]);
    if (v4) return `IPv4-mapped (${v4})`;
  }
  const hexMapped = /^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/.exec(h);
  if (hexMapped) {
    const addr = ((parseInt(hexMapped[1], 16) << 16) | parseInt(hexMapped[2], 16)) >>> 0;
    const v4 = ipv4ProblemFromAddr(addr);
    if (v4) return `IPv4-mapped (${v4})`;
  }
  return null;
}

/** validate the fetch target — scheme, hostname, private/loopback ranges */
export function checkTarget(raw: string): TargetCheck {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return { ok: false, reason: "not a valid absolute URL — include the scheme, e.g. https://example.com/path" };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:")
    return { ok: false, reason: `scheme '${url.protocol}' not allowed — http/https only` };

  const host = url.hostname.toLowerCase();
  if (!host) return { ok: false, reason: "no hostname in URL" };
  if (host === "localhost" || host.endsWith(".localhost"))
    return { ok: false, reason: "loopback host — localhost is blocked by design" };
  if (host.endsWith(".local"))
    return { ok: false, reason: ".local hostname — mDNS/intranet names are blocked by design" };

  if (host.includes(":")) {
    const v6 = ipv6Problem(host);
    if (v6) return { ok: false, reason: `${v6} — private ranges are blocked by design` };
  } else if (parseIPv4(host) !== null) {
    // IPv4 in any literal form (127.0.0.1, 127.1, 0x7f.1, 2130706433)
    const v4 = ipv4Problem(host);
    if (v4) return { ok: false, reason: `${v4} — private ranges are blocked by design` };
  } else if (!host.includes(".")) {
    // bare intranet-style name ("http://intranet/") — blocked by design
    return { ok: false, reason: "hostname has no dot — intranet-style names are blocked by design" };
  }
  return { ok: true, url, host, scheme: url.protocol.replace(":", "") };
}

export interface ReplayRequest {
  method: string;
  url: string;
  headers: HeaderPair[];
  body?: string;
}

/** split a command line into tokens, honoring "…" and '…' quotes */
export function tokenize(arg: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let quote: '"' | "'" | null = null;
  for (let i = 0; i < arg.length; i++) {
    const c = arg[i];
    if (quote) {
      if (c === quote) quote = null;
      else current += c;
    } else if (c === '"' || c === "'") {
      quote = c;
    } else if (/\s/.test(c)) {
      if (current) tokens.push(current);
      current = "";
    } else {
      current += c;
    }
  }
  if (current) tokens.push(current);
  return tokens;
}

export function parseReplayArgs(arg: string): { ok: true; req: ReplayRequest } | { ok: false; error: string } {
  const tokens = tokenize(arg.trim());
  if (!tokens.length) return { ok: false, error: "usage: replay [METHOD] URL [-H \"name: value\"]… [-d \"body\"] — e.g. `replay GET https://example.com/api`" };

  let method = "GET";
  let urlToken: string | null = null;
  const headers: HeaderPair[] = [];
  let body: string | undefined;

  if (/^[a-z]+$/i.test(tokens[0]) && tokens.length > 1 && !/^[a-z]+:\/\//i.test(tokens[0])) {
    method = tokens[0].toUpperCase();
    tokens.shift();
  }
  urlToken = tokens.shift() ?? null;
  if (!urlToken) return { ok: false, error: "no URL given — e.g. `replay GET https://example.com/api`" };

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "-H" || t === "--header") {
      const raw = tokens[++i];
      if (raw === undefined) return { ok: false, error: "-H needs a value — e.g. -H \"accept: application/json\"" };
      const colon = raw.indexOf(":");
      if (colon <= 0) return { ok: false, error: `-H value must be "name: value" — got '${raw}'` };
      const name = raw.slice(0, colon).trim();
      const lower = name.toLowerCase();
      // the browser owns these; promising them would be a lie
      if (["host", "cookie", "referer", "origin", "content-length", "user-agent"].includes(lower))
        return { ok: false, error: `header '${name}' is browser-controlled and can't be set from a page` };
      headers.push({ name, value: raw.slice(colon + 1).trim() });
    } else if (t === "-d" || t === "--data") {
      const raw = tokens[++i];
      if (raw === undefined) return { ok: false, error: "-d needs a value" };
      body = raw;
    } else {
      return { ok: false, error: `unexpected token '${t}' — flags are -H "name: value" and -d "body"` };
    }
  }
  if (body !== undefined && (method === "GET" || method === "HEAD"))
    return { ok: false, error: `a ${method} with a body is a footgun — use POST/PUT/PATCH for -d` };

  return { ok: true, req: { method, url: urlToken, headers, body } };
}

export const BODY_PREVIEW_LIMIT = 1200;
export const FETCH_TIMEOUT_MS = 10_000;

export type ReplayResult =
  | {
      ok: true;
      status: number;
      statusText: string;
      ms: number;
      responseHeaders: HeaderPair[];
      bodyPreview: string;
      truncated: boolean;
      totalBytes: number;
    }
  | { ok: false; kind: "rejected" | "network" | "timeout"; error: string };

/** run the (already user-reviewed) request — fetch is injectable for tests */
export async function executeReplay(
  req: ReplayRequest,
  fetchImpl: typeof fetch = fetch,
  now: () => number = () => performance.now()
): Promise<ReplayResult> {
  const check = checkTarget(req.url);
  if (!check.ok) return { ok: false, kind: "rejected", error: check.reason };

  const headers = new Headers();
  for (const h of req.headers) headers.set(h.name, h.value);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const start = now();
  try {    const res = await fetchImpl(check.url.toString(), {
      method: req.method,
      headers,
      ...(req.body !== undefined ? { body: req.body } : {}),
      signal: controller.signal,
      redirect: "follow",
    });
    const ms = now() - start;
    const text = await res.text();
    const responseHeaders: HeaderPair[] = [];
    res.headers.forEach((value, name) => responseHeaders.push({ name, value }));
    return {
      ok: true,
      status: res.status,
      statusText: res.statusText,
      ms,
      responseHeaders,
      bodyPreview: text.slice(0, BODY_PREVIEW_LIMIT),
      truncated: text.length > BODY_PREVIEW_LIMIT,
      totalBytes: text.length,
    };
  } catch (e) {
    const ms = now() - start;
    if (e instanceof DOMException && e.name === "AbortError")
      return { ok: false, kind: "timeout", error: `no response within ${FETCH_TIMEOUT_MS / 1000}s` };
    return {
      ok: false,
      kind: "network",
      error: `network/CORS failure after ${ms.toFixed(0)} ms — cross-origin targets must send CORS headers for a page to read them`,
    };
  } finally {
    clearTimeout(timer);
  }
}

export function formatReplayLines(res: ReplayResult): TermLine[] {
  if (!res.ok) return [err(`replay: ${res.error}`)];
  const lines: TermLine[] = [
    out(`${res.status} ${res.statusText || ""}`.trim() + ` — ${res.ms.toFixed(0)} ms`),
  ];
  lines.push(out(`response headers (${res.responseHeaders.length}):`));
  for (const h of res.responseHeaders) lines.push(out(`  ${h.name}: ${h.value}`));
  lines.push(out(`body (${res.totalBytes} bytes${res.truncated ? `, truncated at ${BODY_PREVIEW_LIMIT}` : ""}):`));
  for (const l of res.bodyPreview.split(/\r?\n/)) lines.push(out(`  ${l}`));
  return lines;
}
