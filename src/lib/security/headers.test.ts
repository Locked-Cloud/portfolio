import { describe, expect, it } from "vitest";
import { formatHeaderReport, gradeHeaders, gradeSummary, parseHeaderBlock, type HeaderPair } from "./headers";

/** headers from a block, or [] if the block doesn't parse — keeps tests on the happy shape */
const headersOf = (raw: string): HeaderPair[] => {
  const res = parseHeaderBlock(raw);
  return res.ok ? res.headers : [];
};

const GOOD_BLOCK = [
  "HTTP/2 200 OK", // status line — must be skipped, not graded
  "content-type: text/html; charset=utf-8",
  "", // interior blank line — also skipped
  "content-security-policy: default-src 'self'",
  "strict-transport-security: max-age=63072000; includeSubDomains",
  "x-frame-options: DENY",
  "x-content-type-options: nosniff",
  "referrer-policy: no-referrer",
  "permissions-policy: camera=(), geolocation=()",
  "cross-origin-opener-policy: same-origin",
  "cross-origin-resource-policy: same-origin",
].join("\r\n");

describe("parseHeaderBlock", () => {
  it("parses a raw block, skipping status and blank lines", () => {
    const res = parseHeaderBlock(GOOD_BLOCK);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.headers).toHaveLength(9);
      expect(res.skipped).toBe(2);
      expect(res.headers[0]).toEqual({ name: "content-type", value: "text/html; charset=utf-8" });
    }
  });

  it("keeps duplicate headers as separate rows (set-cookie, say)", () => {
    const res = parseHeaderBlock("set-cookie: a=1\nset-cookie: b=2");
    expect(res.ok && res.headers).toHaveLength(2);
  });

  it("splits on the first colon only — values may contain colons", () => {
    const res = parseHeaderBlock("authorization: Bearer a.b:c");
    expect(res.ok && res.headers[0].value).toBe("Bearer a.b:c");
  });

  it("accepts a JSON object on one line", () => {
    const res = parseHeaderBlock('{"x-frame-options": "DENY", "server": "nginx"}');
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.headers).toEqual([
        { name: "x-frame-options", value: "DENY" },
        { name: "server", value: "nginx" },
      ]);
    }
  });

  it("rejects empty input", () => {
    expect(parseHeaderBlock("   ")).toMatchObject({ ok: false });
  });

  it("rejects a block with no key: value lines at all", () => {
    expect(parseHeaderBlock("just some text\nmore text").ok).toBe(false);
  });

  it("rejects invalid JSON and non-object JSON", () => {
    expect(parseHeaderBlock('{"broken":').ok).toBe(false);
    expect(parseHeaderBlock("[1,2,3]").ok).toBe(false);
  });
});

describe("gradeHeaders", () => {
  it("marks every security header ok for a hardened block", () => {
    const headers = headersOf(GOOD_BLOCK);
    const grades = gradeHeaders(headers);
    expect(grades).toHaveLength(8);
    expect(grades.every((g) => g.status === "ok")).toBe(true);
    expect(gradeSummary(grades)).toBe("8/8 present · 0 weak · verdict: hardened");
  });

  it("finds headers case-insensitively", () => {
    const headers = headersOf("X-Frame-Options: deny\nContent-Security-Policy: default-src 'self'");
    const grades = gradeHeaders(headers);
    const xfo = grades.find((g) => g.key === "x-frame-options");
    expect(xfo?.status).toBe("ok");
    expect(xfo?.value).toBe("deny");
  });

  it("marks everything missing for a bare block", () => {
    const headers = headersOf("content-type: text/html");
    const grades = gradeHeaders(headers);
    expect(grades.every((g) => g.status === "missing" && g.present === false)).toBe(true);
    expect(gradeSummary(grades)).toMatch(/0\/8 present .* verdict: soft/);
  });

  it("downgrades CSP with unsafe-inline to weak", () => {
    const headers = headersOf(
      "content-security-policy: default-src 'self'; script-src 'unsafe-inline'"
    );
    const csp = gradeHeaders(headers).find((g) => g.key === "content-security-policy");
    expect(csp?.status).toBe("weak");
    expect(csp?.note).toMatch(/unsafe-inline/);
  });

  it("downgrades short HSTS without includeSubDomains to weak", () => {
    const headers = headersOf("strict-transport-security: max-age=300");
    const hsts = gradeHeaders(headers).find((g) => g.key === "strict-transport-security");
    expect(hsts?.status).toBe("weak");
    expect(hsts?.note).toMatch(/short of the 6mo bar/);
  });

  it("flags HSTS with no max-age as weak", () => {
    const headers = headersOf("strict-transport-security: includeSubDomains");
    expect(gradeHeaders(headers).find((g) => g.key === "strict-transport-security")?.status).toBe("weak");
  });

  it("flags the deprecated XFO ALLOW-FROM as weak", () => {
    const headers = headersOf("x-frame-options: ALLOW-FROM https://a.example");
    const xfo = gradeHeaders(headers).find((g) => g.key === "x-frame-options");
    expect(xfo?.status).toBe("weak");
    expect(xfo?.note).toMatch(/deprecated/);
  });
});

describe("formatHeaderReport", () => {
  it("tables the headers and grades with a why line per header", () => {
    const lines = formatHeaderReport(GOOD_BLOCK);
    const text = lines.map((l) => l.text).join("\n");
    expect(text).toContain("9 headers parsed · 2 line(s) skipped");
    expect(text).toContain("content-type: text/html; charset=utf-8");
    expect(text).toContain("ok      content-security-policy");
    expect(text).toContain("the only header that actually mitigates XSS");
    expect(text).toContain("8/8 present · 0 weak · verdict: hardened");
  });

  it("marks missing headers loudly", () => {
    const text = formatHeaderReport("content-type: text/html").map((l) => l.text).join("\n");
    expect(text.match(/MISSING/g)?.length).toBe(8);
    expect(text).toContain("forces https on future visits");
  });

  it("returns one error line for unparseable input", () => {
    const lines = formatHeaderReport("garbage");
    expect(lines).toHaveLength(1);
    expect(lines[0].kind).toBe("err");
    expect(lines[0].text).toMatch(/^headers: /);
  });
});
