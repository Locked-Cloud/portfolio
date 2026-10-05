import { describe, expect, it, vi } from "vitest";
import { checkTarget, executeReplay, formatReplayLines, parseIPv4, parseReplayArgs, tokenize } from "./replay";

describe("parseIPv4 — the shorthand forms URLs can hide behind", () => {
  it("parses dotted quads", () => {
    expect(parseIPv4("127.0.0.1")).toBe(0x7f000001);
    expect(parseIPv4("8.8.8.8")).toBe(0x08080808);
  });

  it("parses inet_aton shorthands", () => {
    expect(parseIPv4("127.1")).toBe(0x7f000001);
    expect(parseIPv4("2130706433")).toBe(0x7f000001);
    expect(parseIPv4("0x7f000001")).toBe(0x7f000001);
  });

  it("rejects non-addresses", () => {
    expect(parseIPv4("example.com")).toBeNull();
    expect(parseIPv4("1.2.3.4.5")).toBeNull();
    expect(parseIPv4("300.1.1.1")).toBeNull();
  });
});

describe("checkTarget — public targets pass", () => {
  it("accepts https and http public hosts", () => {
    for (const url of ["https://example.com/path?q=1", "http://example.com", "https://api.example.com:8443/x"]) {
      expect(checkTarget(url)).toMatchObject({ ok: true });
    }
  });

  it("normalizes and reports host + scheme", () => {
    const res = checkTarget("https://Example.COM/Path");
    expect(res).toEqual({ ok: true, url: expect.any(URL), host: "example.com", scheme: "https" });
  });

  it("accepts public IPs just outside the private ranges", () => {
    expect(checkTarget("http://172.32.0.1/").ok).toBe(true);
    expect(checkTarget("http://8.8.8.8/").ok).toBe(true);
    expect(checkTarget("http://[2606:4700::1111]/").ok).toBe(true);
  });
});

describe("checkTarget — everything private is blocked before any fetch", () => {
  const rejected = [
    ["ftp://example.com", "scheme"],
    ["file:///etc/passwd", "scheme"],
    ["javascript:alert(1)", "scheme"],
    ["https://localhost/x", "loopback host"],
    ["https://sub.localhost/x", "loopback host"],
    ["http://127.0.0.1:8080/", "loopback (127/8)"],
    ["http://127.1/", "loopback (127/8)"],
    ["http://2130706433/", "loopback (127/8)"],
    ["http://0x7f.0.0.1/", "loopback (127/8)"],
    ["http://10.0.0.1/", "private (10/8)"],
    ["http://172.16.0.1/", "private (172.16/12)"],
    ["http://172.31.255.255/", "private (172.16/12)"],
    ["http://192.168.1.1/", "private (192.168/16)"],
    ["http://169.254.169.254/", "link-local (169.254/16)"],
    ["http://0.0.0.0/", "unspecified"],
    ["https://[::1]/x", "IPv6 loopback"],
    ["https://[::]/", "IPv6 loopback/unspecified"],
    ["http://[fe80::1]/", "IPv6 link-local"],
    ["http://[fd12::1]/", "IPv6 unique-local"],
    ["http://[::ffff:10.0.0.1]/", "IPv4-mapped"],
    ["http://printer.local/", ".local"],
    ["http://intranet/", "no dot"],
    ["totally not a url", "not a valid absolute URL"],
  ] as const;

  it.each(rejected)("rejects %s (%s)", (url, fragment) => {
    const res = checkTarget(url);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.reason).toContain(fragment);
      expect(res.reason).toMatch(/blocked by design|not allowed|not a valid absolute|intranet-style/);
    }
  });
});

describe("tokenize", () => {
  it("honors single and double quotes and keeps inner spaces", () => {
    expect(tokenize('GET https://e.com -H "x: a b" -d \'{"k": "v"}\'')).toEqual([
      "GET",
      "https://e.com",
      "-H",
      "x: a b",
      "-d",
      '{"k": "v"}',
    ]);
  });

  it("splits bare words on whitespace", () => {
    expect(tokenize("a   b c")).toEqual(["a", "b", "c"]);
    expect(tokenize("")).toEqual([]);
  });
});

describe("parseReplayArgs", () => {
  it("defaults to GET with a bare URL", () => {
    expect(parseReplayArgs("https://e.com/api")).toEqual({
      ok: true,
      req: { method: "GET", url: "https://e.com/api", headers: [], body: undefined },
    });
  });

  it("parses method, headers, and body", () => {
    const res = parseReplayArgs('POST https://e.com/api -H "content-type: application/json" -H "x-a: b" -d \'{"a":1}\'');
    expect(res).toEqual({
      ok: true,
      req: {
        method: "POST",
        url: "https://e.com/api",
        headers: [
          { name: "content-type", value: "application/json" },
          { name: "x-a", value: "b" },
        ],
        body: '{"a":1}',
      },
    });
  });

  it("refuses empty input", () => {
    expect(parseReplayArgs("  ").ok).toBe(false);
  });

  it("refuses -H without a value or without a colon", () => {
    expect(parseReplayArgs("GET https://e.com -H").ok).toBe(false);
    expect(parseReplayArgs('GET https://e.com -H "no-colon"').ok).toBe(false);
  });

  it("refuses browser-controlled headers — the page cannot honestly set them", () => {
    for (const h of ["host", "cookie", "referer", "origin"]) {
      const res = parseReplayArgs(`GET https://e.com -H "${h}: x"`);
      expect(res.ok).toBe(false);
      if (!res.ok) expect(res.error).toMatch(new RegExp(`'${h}' is browser-controlled`));
    }
  });

  it("refuses a GET with a body", () => {
    expect(parseReplayArgs('GET https://e.com -d "x"').ok).toBe(false);
  });

  it("refuses unknown tokens", () => {
    expect(parseReplayArgs("GET https://e.com --wat").ok).toBe(false);
  });
});

describe("executeReplay — happy path with a mocked fetch", () => {
  it("reports status, timing, headers, and body", async () => {
    const res = new Response("hello world", {
      status: 201,
      statusText: "Created",
      headers: { "content-type": "text/plain", "x-custom": "yes" },
    });
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => res);
    const result = await executeReplay(
      { method: "POST", url: "https://api.example.com/v1", headers: [], body: "x" },
      fetchMock as unknown as typeof fetch,
      () => 0
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.status).toBe(201);
      expect(result.statusText).toBe("Created");
      expect(result.ms).toBe(0);
      expect(result.responseHeaders).toContainEqual({ name: "content-type", value: "text/plain" });
      expect(result.bodyPreview).toBe("hello world");
      expect(result.truncated).toBe(false);
      expect(result.totalBytes).toBe(11);
    }
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [calledUrl, init] = fetchMock.mock.calls[0];
    expect(calledUrl).toBe("https://api.example.com/v1");
    expect(init?.method).toBe("POST");
  });

  it("truncates long bodies at the preview limit", async () => {
    const long = "x".repeat(5000);
    const result = await executeReplay(
      { method: "GET", url: "https://example.com/big", headers: [] },
      (async () => new Response(long)) as unknown as typeof fetch
    );
    expect(result.ok && result.truncated).toBe(true);
    expect(result.ok && result.bodyPreview.length).toBe(1200);
    expect(result.ok && result.totalBytes).toBe(5000);
  });

  it("sends the parsed headers through to fetch", async () => {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => new Response("ok"));
    await executeReplay(
      {
        method: "GET",
        url: "https://example.com",
        headers: [{ name: "accept", value: "application/json" }],
      },
      fetchMock as unknown as typeof fetch
    );
    const init = fetchMock.mock.calls[0][1];
    expect((init?.headers as Headers).get("accept")).toBe("application/json");
  });

  it("never calls fetch when the target is private — rejection happens first", async () => {
    const fetchMock = vi.fn(async () => new Response("nope"));
    const result = await executeReplay(
      { method: "GET", url: "http://192.168.0.1/admin", headers: [] },
      fetchMock as unknown as typeof fetch
    );
    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toMatchObject({ ok: false, kind: "rejected" });
  });

  it("maps a TypeError to the network/CORS error", async () => {
    const result = await executeReplay(
      { method: "GET", url: "https://example.com", headers: [] },
      (async () => {
        throw new TypeError("Failed to fetch");
      }) as unknown as typeof fetch
    );
    expect(result).toMatchObject({ ok: false, kind: "network" });
    if (!result.ok) expect(result.error).toMatch(/CORS/);
  });

  it("maps an AbortError to the timeout error", async () => {
    const result = await executeReplay(
      { method: "GET", url: "https://example.com", headers: [] },
      (async () => {
        throw new DOMException("The operation was aborted.", "AbortError");
      }) as unknown as typeof fetch
    );
    expect(result).toMatchObject({ ok: false, kind: "timeout" });
  });
});

describe("formatReplayLines", () => {
  it("renders the full receipt", () => {
    const lines = formatReplayLines({
      ok: true,
      status: 200,
      statusText: "OK",
      ms: 42.5,
      responseHeaders: [{ name: "content-type", value: "text/html" }],
      bodyPreview: "<html>",
      truncated: false,
      totalBytes: 6,
    });
    const text = lines.map((l) => l.text).join("\n");
    expect(text).toContain("200 OK — 43 ms");
    expect(text).toContain("content-type: text/html");
    expect(text).toContain("<html>");
  });

  it("renders failures as error lines", () => {
    const lines = formatReplayLines({ ok: false, kind: "rejected", error: "nope" });
    expect(lines).toHaveLength(1);
    expect(lines[0].kind).toBe("err");
    expect(lines[0].text).toBe("replay: nope");
  });
});
