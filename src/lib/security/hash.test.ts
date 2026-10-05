import { afterEach, describe, expect, it, vi } from "vitest";
import { digestHex, formatOps, opsPerSecond, parseHashArgs, toHex } from "./hash";

describe("toHex", () => {
  it("encodes bytes as lowercase hex without separators", () => {
    expect(toHex(new Uint8Array([]))).toBe("");
    expect(toHex(new Uint8Array([0x00, 0x01, 0x02, 0xfa]))).toBe("000102fa");
  });

  it("zero-pads each byte", () => {
    expect(toHex(new Uint8Array([0x0a, 0xbc]))).toBe("0abc");
  });
});

describe("digestHex — real webcrypto vectors", () => {
  it("sha-256 of 'abc' matches the NIST vector", async () => {
    expect(await digestHex("SHA-256", "abc")).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    );
  });

  it("sha-256 of 'hello' matches the vector the e2e suite pins", async () => {
    expect(await digestHex("SHA-256", "hello")).toBe(
      "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
    );
  });

  it("sha-384 of 'abc' matches the NIST vector", async () => {
    expect(await digestHex("SHA-384", "abc")).toBe(
      "cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7"
    );
  });

  it("sha-512 of 'abc' matches the NIST vector", async () => {
    expect(await digestHex("SHA-512", "abc")).toBe(
      "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f"
    );
  });

  it("digests differ across algorithms for the same input", async () => {
    const inputs = await Promise.all(
      (["SHA-256", "SHA-384", "SHA-512"] as const).map((a) => digestHex(a, "same input"))
    );
    expect(new Set(inputs).size).toBe(3);
    expect(inputs[0]).toHaveLength(64);
    expect(inputs[1]).toHaveLength(96);
    expect(inputs[2]).toHaveLength(128);
  });
});

describe("digestHex — missing crypto.subtle (plain-http context)", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("fails with the secure-context error, not a crash", async () => {
    vi.stubGlobal("crypto", {}); // no subtle
    await expect(digestHex("SHA-256", "x")).rejects.toThrow(/crypto\.subtle unavailable.*secure context/);
  });

  it("fails when crypto itself is absent", async () => {
    vi.stubGlobal("crypto", undefined);
    await expect(digestHex("SHA-512", "x")).rejects.toThrow(/crypto\.subtle unavailable/);
  });
});

describe("opsPerSecond", () => {
  it("computes ops/sec from iterations and elapsed ms", () => {
    expect(opsPerSecond(100, 50)).toBe(2000);
    expect(opsPerSecond(1, 250)).toBe(4);
  });

  it("returns 0 for degenerate inputs", () => {
    expect(opsPerSecond(0, 100)).toBe(0);
    expect(opsPerSecond(100, 0)).toBe(0);
  });
});

describe("formatOps", () => {
  it("renders thousands compactly", () => {
    expect(formatOps(4840)).toBe("4.8k");
    expect(formatOps(512)).toBe("512");
    expect(formatOps(42.5)).toBe("42.5");
  });
});

describe("parseHashArgs", () => {
  it("defaults to digest mode", () => {
    expect(parseHashArgs("hello")).toEqual({ bench: false, iterations: 100, text: "hello" });
  });

  it("keeps the full text after the flags", () => {
    expect(parseHashArgs("hello world  again")).toMatchObject({ text: "hello world  again" });
  });

  it("parses -b with an iteration count", () => {
    expect(parseHashArgs("-b 500 hello world")).toEqual({ bench: true, iterations: 500, text: "hello world" });
  });

  it("-b without a count defaults to 100 iterations", () => {
    expect(parseHashArgs("-b hello")).toEqual({ bench: true, iterations: 100, text: "hello" });
  });

  it("accepts --bench and clamps absurd counts to the cap", () => {
    expect(parseHashArgs("--bench 999999 x")).toEqual({ bench: true, iterations: 2000, text: "x" });
    expect(parseHashArgs("--bench 0 x")).toEqual({ bench: true, iterations: 1, text: "x" });
  });

  it("demands an argument", () => {
    expect(parseHashArgs("")).toMatchObject({ error: expect.stringMatching(/give me an argument/) });
    expect(parseHashArgs("  -b ")).toMatchObject({ error: expect.any(String) });
  });
});
