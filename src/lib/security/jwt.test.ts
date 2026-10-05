import { describe, expect, it } from "vitest";
import { base64UrlDecode, formatJwtLines, parseJwt, relativeTime } from "./jwt";

/** build a JWS compact token the way a server would (btoa = base64, strip padding) */
const b64url = (obj: unknown) =>
  btoa(JSON.stringify(obj)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const HOUR = 3_600_000;
const NOW = Date.UTC(2026, 0, 1, 12, 0, 0); // 2026-01-01T12:00:00Z — fixed clock

describe("base64url decoding", () => {
  it("decodes segments without padding", () => {
    // "e30" is "{}" in base64url with the "=" stripped
    expect(new TextDecoder().decode(base64UrlDecode("e30"))).toBe("{}");
  });

  it("decodes segments that still carry padding", () => {
    expect(new TextDecoder().decode(base64UrlDecode("e30="))).toBe("{}");
  });

  it("handles the url-safe alphabet (- and _)", () => {
    // bytes that would encode as +/ in standard base64
    const bytes = new Uint8Array([251, 255, 190]);
    const seg = btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    expect(Array.from(base64UrlDecode(seg))).toEqual([251, 255, 190]);
  });

  it("round-trips a utf-8 payload", () => {
    const payload = { sub: "user-1", name: "ibrahim" };
    expect(new TextDecoder().decode(base64UrlDecode(b64url(payload)))).toBe(JSON.stringify(payload));
  });
});

describe("relativeTime", () => {
  it("renders past deltas with ago", () => {
    expect(relativeTime(-3 * HOUR)).toBe("3h ago");
    expect(relativeTime(-3 * HOUR - 12 * 60_000)).toBe("3h 12m ago");
    expect(relativeTime(-45_000)).toBe("45s ago");
    expect(relativeTime(-(86_400_000 * 2 + HOUR))).toBe("2d 1h ago");
  });

  it("renders future deltas with in", () => {
    expect(relativeTime(HOUR)).toBe("in 1h");
    expect(relativeTime(90_000)).toBe("in 1m 30s");
  });

  it("renders multi-year spans in years", () => {
    expect(relativeTime(74 * 365.25 * 86_400_000)).toBe("in 74y");
    expect(relativeTime(-(2 * 365.25 * 86_400_000))).toBe("2y ago");
  });
});

describe("parseJwt", () => {
  it("decodes a well-formed HS256 token", () => {
    const header = { alg: "HS256", typ: "JWT" };
    const payload = { sub: "42", iat: 1_700_000_000 };
    const token = `${b64url(header)}.${b64url(payload)}.sig-segment`;
    const res = parseJwt(token);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.header).toEqual(header);
      expect(res.payload).toEqual(payload);
      expect(res.signatureSegment).toBe("sig-segment");
      expect(res.notes).toEqual([]);
    }
  });

  it("flags alg=none", () => {
    const token = `${b64url({ alg: "none" })}.${b64url({ sub: "1" })}.`;
    const res = parseJwt(token);
    expect(res.ok && res.notes.some((n) => /alg=none/.test(n.text) && n.level === "warn")).toBe(true);
  });

  it("doubly flags alg=none with a signature segment present", () => {
    const token = `${b64url({ alg: "none" })}.${b64url({ sub: "1" })}.c2lnbmF0dXJl`;
    const res = parseJwt(token);
    expect(res.ok && res.notes.some((n) => /signature segment is present/.test(n.text))).toBe(true);
  });

  it("flags an empty signature when an alg is claimed", () => {
    const token = `${b64url({ alg: "RS256" })}.${b64url({ sub: "1" })}.`;
    const res = parseJwt(token);
    expect(res.ok && res.notes.some((n) => /empty signature/.test(n.text))).toBe(true);
  });

  it("flags an unrecognized alg", () => {
    const token = `${b64url({ alg: "HS1" })}.${b64url({})}.sig`;
    const res = parseJwt(token);
    expect(res.ok && res.notes.some((n) => /unrecognized alg 'HS1'/.test(n.text))).toBe(true);
  });

  it("rejects the wrong number of segments", () => {
    expect(parseJwt("only-two.parts")).toEqual({
      ok: false,
      error: "expected 3 dot-separated segments (header.payload.signature), got 2",
    });
    expect(parseJwt("a.b.c.d").ok).toBe(false);
  });

  it("rejects empty header/payload segments", () => {
    expect(parseJwt(".payload.sig").ok).toBe(false);
    expect(parseJwt("header..sig").ok).toBe(false);
  });

  it("rejects invalid base64url", () => {
    expect(parseJwt("!!!.e30.sig").ok).toBe(false);
  });

  it("rejects base64 that is not JSON", () => {
    // "aGk" decodes to "hi" — valid base64url, not a JSON object
    expect(parseJwt("aGk.e30.sig").ok).toBe(false);
  });

  it("rejects a JSON payload that is not an object", () => {
    expect(parseJwt(`${b64url({ alg: "HS256" })}.${b64url([1, 2])}.sig`).ok).toBe(false);
  });
});

describe("formatJwtLines", () => {
  it("pretty-prints header and payload", () => {
    const token = `${b64url({ alg: "HS256", typ: "JWT" })}.${b64url({ sub: "42" })}.sig`;
    const text = formatJwtLines(token, NOW).map((l) => l.text).join("\n");
    expect(text).toContain('"alg": "HS256"');
    expect(text).toContain('"sub": "42"');
  });

  it("renders exp in the past as expired with a human span", () => {
    const exp = (NOW - 3 * HOUR) / 1000;
    const token = `${b64url({ alg: "HS256" })}.${b64url({ exp })}.sig`;
    const text = formatJwtLines(token, NOW).map((l) => l.text).join("\n");
    expect(text).toContain("expired 3h ago");
  });

  it("renders a future exp as still valid", () => {
    const exp = (NOW + 2 * HOUR) / 1000;
    const token = `${b64url({ alg: "HS256" })}.${b64url({ exp })}.sig`;
    const text = formatJwtLines(token, NOW).map((l) => l.text).join("\n");
    expect(text).toContain("valid in 2h");
  });

  it("renders nbf in the future as not yet valid", () => {
    const nbf = (NOW + 5 * 60_000) / 1000;
    const token = `${b64url({ alg: "HS256" })}.${b64url({ nbf })}.sig`;
    const text = formatJwtLines(token, NOW).map((l) => l.text).join("\n");
    expect(text).toContain("not yet valid — in 5m");
  });

  it("prints the no-signature-verification disclosure as an error line", () => {
    const token = `${b64url({ alg: "HS256" })}.${b64url({})}.sig`;
    const lines = formatJwtLines(token, NOW);
    const disclosure = lines.find((l) => /signature NOT verified/.test(l.text));
    expect(disclosure?.kind).toBe("err");
    expect(disclosure?.text).toContain("never leaves this tab");
  });

  it("says so when no time claims exist", () => {
    const token = `${b64url({ alg: "HS256" })}.${b64url({ sub: "1" })}.sig`;
    expect(formatJwtLines(token, NOW).some((l) => /no iat\/exp\/nbf claims/.test(l.text))).toBe(true);
  });

  it("returns a single error line for malformed input", () => {
    const lines = formatJwtLines("garbage", NOW);
    expect(lines).toHaveLength(1);
    expect(lines[0].kind).toBe("err");
    expect(lines[0].text).toMatch(/^jwt: /);
  });
});
