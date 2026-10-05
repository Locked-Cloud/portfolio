import { test, expect } from "@playwright/test";

/* the security toolkit — four working tools, all client-side.
   Deterministic by construction: no test here touches the network. */

const b64url = (obj: unknown) => Buffer.from(JSON.stringify(obj)).toString("base64url");
const HS256_TOKEN = `${b64url({ alg: "HS256", typ: "JWT" })}.${b64url({
  sub: "guest",
  exp: 4_102_444_800, // 2100-01-01T00:00:00Z — far future, so "valid in …"
})}.c2lnbmF0dXJl`;

async function run(page: import("@playwright/test").Page, cmd: string) {
  const input = page.getByLabel("terminal input");
  await input.fill(cmd);
  await input.press("Enter");
}

test("help lists the security toolkit group", async ({ page }) => {
  await page.goto("/");
  await run(page, "help");
  await expect(page.getByText("security toolkit — client-side, nothing leaves this tab:")).toBeVisible();
});

test("jwt decodes header+payload and disclaims signature verification", async ({ page }) => {
  await page.goto("/");
  await run(page, `jwt ${HS256_TOKEN}`);
  await expect(page.getByText('"alg": "HS256"')).toBeVisible();
  await expect(page.getByText('"sub": "guest"')).toBeVisible();
  await expect(page.getByText(/exp\s+4102444800/)).toBeVisible();
  await expect(page.getByText(/valid in \d+y/)).toBeVisible();
  await expect(page.getByText("signature NOT verified — decode-only, client-side.", { exact: false })).toBeVisible();
});

test("jwt flags alg=none", async ({ page }) => {
  await page.goto("/");
  const unsigned = `${b64url({ alg: "none" })}.${b64url({ sub: "1" })}.`;
  await run(page, `jwt ${unsigned}`);
  await expect(page.getByText(/alg=none — unsigned token/)).toBeVisible();
});

test("jwt rejects malformed input", async ({ page }) => {
  await page.goto("/");
  await run(page, "jwt not-a-token");
  await expect(page.getByText("jwt: expected 3 dot-separated segments", { exact: false })).toBeVisible();
});

test("hash prints sha-256/384/512 digests via webcrypto", async ({ page }) => {
  await page.goto("/");
  await run(page, "hash abc");
  await expect(page.getByText(/sha-256\s+ba7816bf8f01cfea414140de5dae2223/)).toBeVisible();
  await expect(page.getByText(/sha-384\s+cb00753f45a35e8b/)).toBeVisible();
  await expect(page.getByText(/sha-512\s+ddaf35a193617aba/)).toBeVisible();
});

test("hash -b runs the bench and reports ops/sec", async ({ page }) => {
  await page.goto("/");
  await run(page, "hash -b 25 abc");
  await expect(page.getByText("bench — 25 iterations per algorithm on 3 bytes:")).toBeVisible();
  await expect(page.getByText(/sha-256\s+25\s+ops/)).toBeVisible();
  await expect(page.getByText(/ops\/s/).first()).toBeVisible();
});

test("hash demands an argument", async ({ page }) => {
  await page.goto("/");
  await run(page, "hash");
  await expect(page.getByText(/hash: give me an argument/)).toBeVisible();
});

test("headers grades a JSON object", async ({ page }) => {
  await page.goto("/");
  await run(page, `headers '{"x-frame-options":"DENY","content-type":"text/html"}'`);
  await expect(page.getByText("2 headers parsed:")).toBeVisible();
  await expect(page.getByText(/ok\s+x-frame-options/)).toBeVisible();
  await expect(page.getByText(/MISSING\s+content-security-policy/)).toBeVisible();
  await expect(page.getByText(/1\/8 present/)).toBeVisible();
});

test("headers paste-mode: line-by-line block, finished with a dot", async ({ page }) => {
  await page.goto("/");
  await run(page, "headers");
  await expect(page.getByText(/paste-mode: drop a raw header block/)).toBeVisible();
  await run(page, "content-security-policy: default-src 'self'");
  await expect(page.getByText("> content-security-policy: default-src 'self'")).toBeVisible();
  await run(page, ".");
  await expect(page.getByText(/1\/8 present/)).toBeVisible();
  await expect(page.getByText(/verdict: soft/)).toBeVisible();
});

test("headers rejects garbage", async ({ page }) => {
  await page.goto("/");
  await run(page, "headers garbage-no-colon");
  await expect(page.getByText(/headers: no `key: value` lines found/)).toBeVisible();
});

test("replay validates before sending: loopback is blocked with a terminal error", async ({ page }) => {
  await page.goto("/");
  await run(page, "replay GET http://127.0.0.1:8080/admin");
  await expect(page.getByText(/replay: target rejected — loopback \(127\/8\)/)).toBeVisible();
});

test("replay blocks private ranges and non-http schemes without a request", async ({ page }) => {
  await page.goto("/");
  await run(page, "replay GET http://192.168.1.1/router");
  await expect(page.getByText(/private \(192\.168\/16\) — private ranges are blocked by design/)).toBeVisible();
  await run(page, "replay GET ftp://example.com");
  await expect(page.getByText(/scheme 'ftp:' not allowed — http\/https only/)).toBeVisible();
});

test("replay without arguments prints usage", async ({ page }) => {
  await page.goto("/");
  await run(page, "replay");
  await expect(page.getByText(/usage: replay \[METHOD\] URL/)).toBeVisible();
});

test("man pages document the security toolkit", async ({ page }) => {
  await page.goto("/");
  await run(page, "man jwt");
  await expect(page.getByText("JWT(1)")).toBeVisible();
  await run(page, "man replay");
  await expect(page.getByText("REPLAY(1)")).toBeVisible();
});

test("tab completes the new tools", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("terminal input");
  await input.fill("hea");
  await input.press("Tab");
  await expect(input).toHaveValue("headers ");
  await input.fill("rep");
  await input.press("Tab");
  await expect(input).toHaveValue("replay ");
});
