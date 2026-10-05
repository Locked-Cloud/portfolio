/**
 * Hash bench — SHA-256/384/512 digests via the browser's own WebCrypto
 * (crypto.subtle). All client-side, no deps. `hash <text>` prints the three
 * digests; `hash -b [n] <text>` runs n iterations per algorithm and reports
 * ops/sec so the SHA family can be compared on the visitor's own machine.
 *
 * crypto.subtle only exists in secure contexts — plain-http visitors get a
 * clear error line instead of a crash.
 */
import { err, out, type TermLine } from "./term";

export const HASH_ALGOS = ["SHA-256", "SHA-384", "SHA-512"] as const;
export type HashAlgo = (typeof HASH_ALGOS)[number];

export const MAX_ITERATIONS = 2000;

/** digest bytes → lowercase hex (no separators — the sha256 command convention) */
export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function subtle(): SubtleCrypto | null {
  return typeof globalThis.crypto !== "undefined" && globalThis.crypto.subtle ? globalThis.crypto.subtle : null;
}

/** one text → one hex digest; throws the http-context error line when subtle is absent */
export async function digestHex(algo: HashAlgo, text: string): Promise<string> {
  const api = subtle();
  if (!api)
    throw new Error("crypto.subtle unavailable — webcrypto needs a secure context (https, or localhost in dev)");
  const buf = await api.digest(algo, new TextEncoder().encode(text));
  return toHex(new Uint8Array(buf));
}

/** ops/sec from a measured run — pure, so the arithmetic is testable */
export function opsPerSecond(iterations: number, elapsedMs: number): number {
  if (iterations <= 0 || elapsedMs <= 0) return 0;
  return iterations / (elapsedMs / 1000);
}

export function formatOps(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n >= 100 ? n.toFixed(0) : n.toFixed(1);
}

/** parse the text after `hash ` — returns bench flag, iteration count, payload */
export function parseHashArgs(raw: string): { bench: boolean; iterations: number; text: string } | { error: string } {
  const tokens = raw.trim().split(/\s+/);
  let bench = false;
  let iterations = 100;
  let rest = raw.trim();
  if (tokens[0] === "-b" || tokens[0] === "--bench") {
    bench = true;
    rest = raw.trim().slice(tokens[0].length).trim();
    const next = rest.split(/\s+/)[0];
    if (/^\d+$/.test(next)) {
      iterations = Math.min(Math.max(parseInt(next, 10), 1), MAX_ITERATIONS);
      rest = rest.slice(next.length).trim();
    }
  }
  if (!rest) return { error: "hash: give me an argument — try `hash hello` or `hash -b 500 hello`" };
  return { bench, iterations, text: rest };
}

export function formatDigestLines(text: string, digestOf: (algo: HashAlgo, text: string) => Promise<string>): Promise<TermLine[]> {
  return Promise.all(HASH_ALGOS.map((algo) => digestOf(algo, text)))
    .then((hexes) => hexes.map((hex, i) => out(`${HASH_ALGOS[i].toLowerCase().padEnd(8)} ${hex}`)))
    .catch((e: unknown) => [err(`hash: ${(e as Error).message}`)]);
}

export async function formatBenchLines(text: string, iterations: number, digestOf: (algo: HashAlgo, text: string) => Promise<string>): Promise<TermLine[]> {
  const lines: TermLine[] = [
    out(`bench — ${iterations} iterations per algorithm on ${new TextEncoder().encode(text).length} bytes:`),
  ];
  for (const algo of HASH_ALGOS) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) await digestOf(algo, text);
    const elapsed = performance.now() - start;
    const ops = opsPerSecond(iterations, elapsed);
    lines.push(out(`  ${algo.toLowerCase().padEnd(8)} ${String(iterations).padStart(5)} ops · ${elapsed.toFixed(1).padStart(8)} ms · ${formatOps(ops).padStart(7)} ops/s`));
  }
  return lines;
}
