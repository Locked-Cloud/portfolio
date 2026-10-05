/**
 * JWT decoder — client-side, decode-only. Splits the JWS compact form,
 * base64url-decodes header + payload (padding restored), pretty-prints both,
 * renders iat/exp/nbf as human-readable relative times, and flags the
 * classic alg problems (alg=none, signed-but-claims-none, unrecognized alg).
 *
 * It does NOT verify signatures — no key handling happens here, and the
 * token never leaves the tab. Every output says so.
 */
import { err, out, type TermLine } from "./term";

export interface JwtNote {
  level: "warn" | "info";
  text: string;
}

export type JwtResult =
  | {
      ok: true;
      header: Record<string, unknown>;
      payload: Record<string, unknown>;
      /** raw third segment — only inspected for presence, never trusted */
      signatureSegment: string;
      notes: JwtNote[];
    }
  | { ok: false; error: string };

/** base64url → bytes; accepts missing padding and the URL-safe alphabet */
export function base64UrlDecode(segment: string): Uint8Array {
  const b64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

/** "3h 12m ago" / "in 2d 4h" — coarse units, terminal-width output */
export function relativeTime(deltaMs: number): string {
  const abs = Math.abs(deltaMs);
  const units: [number, string][] = [
    [365.25 * 86_400_000, "y"],
    [86_400_000, "d"],
    [3_600_000, "h"],
    [60_000, "m"],
    [1_000, "s"],
  ];
  let remaining = abs;
  const parts: string[] = [];
  for (const [ms, label] of units) {
    const n = Math.floor(remaining / ms);
    if (n > 0 && parts.length < 2) {
      parts.push(`${n}${label}`);
      remaining -= n * ms;
    }
  }
  const span = parts.join(" ") || "0s";
  return deltaMs < 0 ? `${span} ago` : `in ${span}`;
}

const KNOWN_ALGS = new Set([
  "HS256", "HS384", "HS512",
  "RS256", "RS384", "RS512",
  "ES256", "ES384", "ES512",
  "PS256", "PS384", "PS512",
  "EdDSA",
]);

export function parseJwt(token: string): JwtResult {
  const trimmed = token.trim();
  const parts = trimmed.split(".");
  if (parts.length !== 3)
    return { ok: false, error: `expected 3 dot-separated segments (header.payload.signature), got ${parts.length}` };
  if (!parts[0] || !parts[1])
    return { ok: false, error: "empty header or payload segment" };

  let header: Record<string, unknown>;
  let payload: Record<string, unknown>;
  try {
    header = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[0])));
    payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[1])));
  } catch {
    return { ok: false, error: "segment is not valid base64url-encoded JSON" };
  }
  if (typeof header !== "object" || header === null || Array.isArray(header))
    return { ok: false, error: "header segment did not decode to a JSON object" };
  if (typeof payload !== "object" || payload === null || Array.isArray(payload))
    return { ok: false, error: "payload segment did not decode to a JSON object" };

  const notes: JwtNote[] = [];
  const alg = header.alg;
  if (alg === "none") {
    notes.push({ level: "warn", text: "alg=none — unsigned token. any server that accepts this is broken." });
    if (parts[2])
      notes.push({
        level: "warn",
        text: "alg=none but a signature segment is present — tamper/confusion signal, treat as hostile.",
      });
  } else if (typeof alg !== "string") {
    notes.push({ level: "warn", text: "header has no alg — malformed or hand-crafted token." });
  } else if (!KNOWN_ALGS.has(alg)) {
    notes.push({ level: "warn", text: `unrecognized alg '${alg}' — not a standard JWS algorithm.` });
  }
  // the mix-up you *can* see client-side: a payload claiming a different typ/cnf
  // than the header advertises is the shape of an alg-confusion attack payload
  if (typeof alg === "string" && alg.startsWith("RS") && typeof payload.iss === "string" && !parts[2])
    notes.push({ level: "warn", text: "asymmetric alg with an empty signature segment." });
  if (parts[2] === "" && alg !== "none")
    notes.push({ level: "warn", text: `empty signature with alg=${String(alg)} — unsigned where a signature is claimed.` });

  return { ok: true, header, payload, signatureSegment: parts[2], notes };
}

const TIME_CLAIMS = ["exp", "iat", "nbf"] as const;

/** terminal output for a decoded token — structured result in, lines out */
export function formatJwtLines(token: string, now = Date.now()): TermLine[] {
  const result = parseJwt(token);
  if (!result.ok) return [err(`jwt: ${result.error}`)];

  const lines: TermLine[] = [];
  const pretty = (obj: Record<string, unknown>) =>
    JSON.stringify(obj, null, 2).split("\n").map((l) => `  ${l}`);

  lines.push(out("header:"));
  lines.push(...pretty(result.header).map(out));
  lines.push(out("payload:"));
  lines.push(...pretty(result.payload).map(out));

  lines.push(out("claims:"));
  let anyClaim = false;
  for (const claim of TIME_CLAIMS) {
    const raw = result.payload[claim];
    if (typeof raw !== "number") continue;
    anyClaim = true;
    const iso = new Date(raw * 1000).toISOString();
    const rel = relativeTime((raw * 1000) - now);
    const verdict =
      claim === "exp"
        ? raw * 1000 <= now
          ? `expired ${rel}`
          : `valid ${rel}`
        : claim === "nbf"
          ? raw * 1000 > now
            ? `not yet valid — ${rel}`
            : `active ${rel}`
          : `issued ${rel}`;
    lines.push(out(`  ${claim.padEnd(4)} ${String(raw).padEnd(11)} ${iso}  (${verdict})`));
  }
  if (!anyClaim) lines.push(out("  (no iat/exp/nbf claims present)"));

  for (const note of result.notes) lines.push(note.level === "warn" ? err(`  ⚠ ${note.text}`) : out(`  · ${note.text}`));
  lines.push(err("  · signature NOT verified — decode-only, client-side. the token never leaves this tab."));
  return lines;
}
