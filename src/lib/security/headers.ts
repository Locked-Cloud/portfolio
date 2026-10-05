/**
 * Header analyzer — pure parsing, no requests. Takes a raw `key: value`
 * response-header block (as copied from devtools or `curl -I`) or a JSON
 * object of headers, tables what it saw, and grades the security header set:
 * present / weak / missing, with a one-line why-it-matters per header.
 */
import { err, out, type TermLine } from "./term";

export interface HeaderPair {
  name: string;
  value: string;
}

export type ParsedHeaders = { ok: true; headers: HeaderPair[]; skipped: number } | { ok: false; error: string };

/** accepts `Key: value` lines (status lines + empties skipped) or a JSON object */
export function parseHeaderBlock(raw: string): ParsedHeaders {
  const input = raw.trim();
  if (!input) return { ok: false, error: "no headers given" };

  // JSON object form — `headers '{"x-frame-options":"DENY"}'` on one line
  if (input.startsWith("{")) {
    try {
      const obj = JSON.parse(input) as Record<string, unknown>;
      if (typeof obj !== "object" || obj === null || Array.isArray(obj))
        return { ok: false, error: "JSON input must be an object of header name → value" };
      const headers = Object.entries(obj).map(([name, value]) => ({
        name,
        value: typeof value === "string" ? value : JSON.stringify(value),
      }));
      if (!headers.length) return { ok: false, error: "empty header object" };
      return { ok: true, headers, skipped: 0 };
    } catch {
      return { ok: false, error: "not valid JSON — expected an object like {\"x-frame-options\":\"DENY\"}" };
    }
  }

  // raw block form
  const headers: HeaderPair[] = [];
  let skipped = 0;
  for (const line of input.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      skipped++; // blanks and comments — copied blocks carry both
      continue;
    }
    if (/^HTTP\/[\d.]+\s/.test(trimmed)) {
      skipped++; // status line ("HTTP/1.1 200 OK") rides along with copied headers
      continue;
    }
    const colon = trimmed.indexOf(":");
    if (colon <= 0) {
      skipped++;
      continue;
    }
    headers.push({ name: trimmed.slice(0, colon).trim(), value: trimmed.slice(colon + 1).trim() });
  }
  if (!headers.length)
    return { ok: false, error: "no `key: value` lines found — expected one header per line" };
  return { ok: true, headers, skipped };
}

export type HeaderStatus = "ok" | "weak" | "missing";

export interface HeaderGrade {
  /** canonical lowercase name */
  key: string;
  present: boolean;
  status: HeaderStatus;
  /** the value as given, when found */
  value: string | null;
  /** short per-header verdict, e.g. "DENY ✓" or "unsafe-inline weakens it" */
  note: string;
  /** one-line why-it-matters — printed for every row, present or not */
  why: string;
}

interface HeaderSpec {
  key: string;
  why: string;
  grade: (value: string | null) => { status: HeaderStatus; note: string };
}

const missing = (value: string | null): { status: HeaderStatus; note: string } =>
  value === null ? { status: "missing", note: "—" } : { status: "ok", note: "present" };

const SECURITY_SPECS: HeaderSpec[] = [
  {
    key: "content-security-policy",
    why: "content injection — the only header that actually mitigates XSS",
    grade: (v) => {
      if (v === null) return missing(null);
      if (/unsafe-inline|unsafe-eval|\*\s*(;|$)/.test(v))
        return { status: "weak", note: "present, but unsafe-inline / * weakens it" };
      return { status: "ok", note: "present" };
    },
  },
  {
    key: "strict-transport-security",
    why: "forces https on future visits — no downgrade to plaintext",
    grade: (v) => {
      if (v === null) return missing(null);
      const maxAge = /max-age=(\d+)/i.exec(v)?.[1];
      if (!maxAge) return { status: "weak", note: "present, but no max-age" };
      if (parseInt(maxAge, 10) < 15_576_000 || !/includeSubDomains/i.test(v))
        return { status: "weak", note: `max-age ${maxAge}s${/includeSubDomains/i.test(v) ? "" : ", no includeSubDomains"} — short of the 6mo bar` };
      return { status: "ok", note: "present" };
    },
  },
  {
    key: "x-frame-options",
    why: "clickjacking — who may frame the page (pair with CSP frame-ancestors)",
    grade: (v) => {
      if (v === null) return missing(null);
      if (/allow-from/i.test(v)) return { status: "weak", note: "ALLOW-FROM is deprecated and ignored by modern browsers" };
      return { status: "ok", note: v.toUpperCase() };
    },
  },
  {
    key: "x-content-type-options",
    why: "stops mime-sniffing turning a text response into script",
    grade: (v) => (v === null ? missing(null) : { status: "ok", note: "nosniff" }),
  },
  {
    key: "referrer-policy",
    why: "leaks full urls — tokens included — to every linked third party",
    grade: (v) => (v === null ? missing(null) : { status: "ok", note: v }),
  },
  {
    key: "permissions-policy",
    why: "locks powerful apis (camera, mic, geo) away from third-party frames",
    grade: (v) => (v === null ? missing(null) : { status: "ok", note: "present" }),
  },
  {
    key: "cross-origin-opener-policy",
    why: "isolates the window opener — the basis of cross-origin leak defenses",
    grade: (v) => (v === null ? missing(null) : { status: "ok", note: v }),
  },
  {
    key: "cross-origin-resource-policy",
    why: "blocks other origins from reading this origin's resources",
    grade: (v) => (v === null ? missing(null) : { status: "ok", note: v }),
  },
];

/** first matching value, case-insensitive on the name */
function findHeader(headers: HeaderPair[], key: string): string | null {
  const hit = headers.find((h) => h.name.toLowerCase() === key);
  return hit ? hit.value : null;
}

export function gradeHeaders(headers: HeaderPair[]): HeaderGrade[] {
  return SECURITY_SPECS.map((spec) => {
    const value = findHeader(headers, spec.key);
    const { status, note } = spec.grade(value);
    return { key: spec.key, present: value !== null, status, value, note, why: spec.why };
  });
}

export function gradeSummary(grades: HeaderGrade[]): string {
  const ok = grades.filter((g) => g.status === "ok").length;
  const weak = grades.filter((g) => g.status === "weak").length;
  const verdict = ok === grades.length ? "hardened" : ok + weak >= 6 ? "solid" : ok + weak >= 4 ? "partial" : "soft";
  return `${ok}/${grades.length} present · ${weak} weak · verdict: ${verdict}`;
}

export function formatHeaderReport(raw: string): TermLine[] {
  const parsed = parseHeaderBlock(raw);
  if (!parsed.ok) return [err(`headers: ${parsed.error}`)];
  const { headers, skipped } = parsed;

  const lines: TermLine[] = [out(`${headers.length} headers parsed${skipped ? ` · ${skipped} line(s) skipped` : ""}:`)];
  for (const h of headers.slice(0, 25)) lines.push(out(`  ${h.name}: ${h.value}`));
  if (headers.length > 25) lines.push(out(`  … ${headers.length - 25} more`));

  const grades = gradeHeaders(headers);
  lines.push(out("security grade:"));
  for (const g of grades) {
    const status = g.status === "ok" ? "ok    " : g.status === "weak" ? "weak  " : "MISSING";
    lines.push(out(`  ${status}  ${g.key.padEnd(28)} ${g.note}`));
    lines.push(out(`          ${g.why}`));
  }
  lines.push(out(`  ${gradeSummary(grades)}`));
  return lines;
}
