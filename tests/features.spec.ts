import { test, expect } from "@playwright/test";

test("goto command scrolls the page", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("terminal input");
  await input.fill("goto contact");
  await input.press("Enter");
  await expect(page.getByText("→ /#contact")).toBeVisible();
  await page.waitForTimeout(900);
  const scrolled = await page.evaluate(() => window.scrollY > 100);
  expect(scrolled).toBe(true);
});

test("theme command toggles quiet mode", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("terminal input");
  await input.fill("theme");
  await input.press("Enter");
  await expect(page.getByText("quiet mode", { exact: false })).toBeVisible();
  expect(await page.evaluate(() => document.body.classList.contains("quiet"))).toBe(true);
  await input.fill("theme");
  await input.press("Enter");
  await expect(page.getByText("full weather restored")).toBeVisible();
  expect(await page.evaluate(() => document.body.classList.contains("quiet"))).toBe(false);
});

test("blog section renders and expands a post", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("DEVLOG")).toBeVisible();
  await page.getByRole("button", { name: /Why my portfolio is a terminal/ }).click();
  await expect(page.getByText("Most portfolios are a grid of cards.")).toBeVisible();
});

test("PULPOVR gallery opens and closes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "open PULPOVR image gallery" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("img")).toBeVisible({ timeout: 15_000 });
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("all local asset srcs are relative (subpath-hostable)", async ({ page }) => {
  await page.goto("/");
  const imgs = page.locator("#work img");
  const count = await imgs.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const src = await imgs.nth(i).getAttribute("src");
    // absolute-root paths break under /portfolio/ hosting
    expect(src?.startsWith("/")).toBe(false);
  }
});

test("session section sees the visitor, live", async ({ page }) => {
  await page.goto("/");
  const s = page.locator("#session");
  await expect(s).toBeVisible();
  await expect(s.getByText("pointer travel")).toBeVisible();
  // it responds to the visitor — a click lands in the counters and the packet log
  await page.mouse.click(640, 300);
  await expect(s.getByText(/CLK #1 at \(640, 300\)/)).toBeVisible({ timeout: 5_000 });
  await page.mouse.click(700, 320);
  await expect(s.getByText(/CLK #2/)).toBeVisible();
  // the page receipts measured in this very browser
  await expect(s.getByText(/entry js/)).toBeVisible({ timeout: 5_000 });
  await expect(s.getByText(/budget 120 KB/i)).toBeVisible();
  await expect(s.getByText("REMOVED — −192 KB gz", { exact: false })).toBeVisible();
});

test("statusbar carries the session window tab", async ({ page }) => {
  await page.goto("/");
  const bar = page.locator("[data-statusbar]");
  await expect(bar.getByRole("link", { name: "1:session" })).toBeVisible();
});

test("phosphor color modes swap at runtime", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("terminal input");
  await input.fill("theme amber");
  await input.press("Enter");
  await expect(page.getByText("phosphor set to amber", { exact: false })).toBeVisible();
  const phos = await page.evaluate(() =>
    document.documentElement.style.getPropertyValue("--color-phos")
  );
  expect(phos).toBe("#ffb000");
  await input.fill("theme green");
  await input.press("Enter");
  await expect(
    page.evaluate(() => document.documentElement.style.getPropertyValue("--color-phos"))
  ).resolves.toBe("#3dff88");
});

test("CV toggles to Arabic", async ({ page }) => {
  await page.goto("/cv.html");
  await page.getByRole("button", { name: "عربي" }).click();
  const dir = await page.locator(".cv-page").getAttribute("dir");
  expect(dir).toBe("rtl");
  await expect(page.getByRole("heading", { name: "إبراهيم أحمد" })).toBeVisible();
});

test("work section is a TUI browser: select, preview, keyboard nav", async ({ page }) => {
  await page.goto("/");
  // smooth-scroll + reveal are still animating right after scrollIntoView —
  // clicking mid-flight hits stale coordinates (CI-only flake). settle first.
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  const listbox = page.getByRole("listbox", { name: "project files" });
  await expect(listbox).toBeVisible();
  // flagship selected on arrival — counted LOC + verdict ride the preview
  await expect(page.getByText("~7.8K LOC [counted]", { exact: false })).toBeVisible();
  await expect(page.getByText("merit verdict 28/30", { exact: false })).toBeVisible();
  await expect(page.getByText("TypeScript / TSX")).toBeVisible();
  // click-select bazarna
  await listbox.getByRole("option", { name: /03-bazarna/ }).click();
  await expect(page.getByRole("heading", { name: /BAZARNA/ })).toBeVisible();
  // keyboard: focus the pane, arrow back up to smart-parking
  await listbox.focus();
  await page.keyboard.press("ArrowUp");
  await expect(page.getByRole("heading", { name: /SMART-PARKING/ })).toBeVisible();
});

test("graveyard lists killed ideas with reasons", async ({ page }) => {
  await page.goto("/");
  await page.locator("#log").scrollIntoViewIfNeeded();
  await expect(page.getByText("git log --diff-filter=D --summary")).toBeVisible();
  await expect(page.getByText("scanlines overlay")).toBeVisible();
  await expect(page.getByText("neon-green CRT skin")).toBeVisible();
  await expect(page.getByText("deletions are decisions", { exact: false })).toBeVisible();
});

test("devlog posts carry deep-link anchors and RSS feed ships", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#post-how-this-homepage-was-chosen")).toBeVisible();
  await expect(page.locator("#post-malware-analysis-lab")).toBeVisible();
  const res = await page.request.get("/rss.xml");
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain("<rss");
  expect(body).toContain("how-this-homepage-was-chosen");
  expect(body).toContain("malware-analysis-lab");
});

test("tmux status bar: session, windows, live clock", async ({ page }) => {
  await page.goto("/");
  const bar = page.locator("[data-statusbar]");
  await expect(bar).toBeVisible();
  await expect(bar.getByText("[IBRAHIM.SYS]")).toBeVisible();
  await expect(bar.getByRole("link", { name: "2:work" })).toBeVisible();
  await expect(bar.getByText(/\d{2}:\d{2}:\d{2}/)).toBeVisible();
});

test("hack command grants access", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("terminal input");
  await input.fill("hack");
  await input.press("Enter");
  await expect(page.getByText("ACCESS GRANTED", { exact: false })).toBeVisible();
});

test("codec commands actually transform", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("terminal input");
  await input.fill("encode hello");
  await input.press("Enter");
  await expect(page.getByText("b64: aGVsbG8=")).toBeVisible();
  await input.fill("decode aGVsbG8=");
  await input.press("Enter");
  await expect(page.getByText("txt: hello")).toBeVisible();
  await input.fill("hex AB");
  await input.press("Enter");
  await expect(page.getByText("hex: 41 42")).toBeVisible();
  await input.fill("decode !!!not-base64!!!");
  await input.press("Enter");
  await expect(page.getByText("not valid input", { exact: false })).toBeVisible();
});

test("tab completes commands", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("terminal input");
  await input.fill("ars");
  await input.press("Tab");
  await expect(input).toHaveValue("arsenal ");
  await input.fill("enc");
  await input.press("Tab");
  await expect(input).toHaveValue("encode ");
});

test("arsenal lists the security toolkit", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("terminal input");
  await input.fill("arsenal");
  await input.press("Enter");
  await expect(page.getByText("security toolkit — what i actually run:")).toBeVisible();
  await expect(page.getByText("bounty scopes + own labs", { exact: false })).toBeVisible();
});

test("skills section carries SECURITY and MOBILE groups", async ({ page }) => {
  await page.goto("/");
  await page.locator("#skills").scrollIntoViewIfNeeded();
  await expect(page.getByText("/security")).toBeVisible();
  await expect(page.getByText("/mobile")).toBeVisible();
});

test("flutter project previews with its visual", async ({ page }) => {
  await page.goto("/");
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  // keyboard path: layout-independent (no coordinate click to race)
  const listbox = page.getByRole("listbox", { name: "project files" });
  await listbox.focus();
  await page.keyboard.press("End"); // last entry = 05-plant-diseases
  await expect(page.getByRole("heading", { name: /PLANT-DISEASES/ })).toBeVisible();
  await expect(page.getByAltText(/Wireframe phone scanning a leaf/)).toBeVisible();
  await expect(page.getByText("1.7K", { exact: true })).toBeVisible();
});

test("status bar shows live uptime", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-statusbar]").getByText(/up \d+[hms]/)).toBeVisible({
    timeout: 5_000,
  });
});

test("status bar carries the current focus", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-statusbar]").getByText(/focus: bounty lab/)).toBeVisible();
});

test("nmap scans ibrahim.sys", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("terminal input");
  await input.fill("nmap");
  await input.press("Enter");
  await expect(page.getByText("1337/tcp    open   pwn")).toBeVisible();
  await expect(page.getByText("Nmap scan report for ibrahim.sys")).toBeVisible();
});

test("ps lists projects as processes", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("terminal input");
  await input.fill("ps aux");
  await input.press("Enter");
  await expect(page.getByText("bug-bounty-lab   [always-on]")).toBeVisible();
  await expect(page.getByText("your-session     [reading]")).toBeVisible();
});

test("df reports counted lines", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("terminal input");
  await input.fill("df -h");
  await input.press("Enter");
  await expect(page.getByText("where the lines live")).toBeVisible();
  await expect(page.getByText("total: ~7.8K lines across firmware → 3D")).toBeVisible();
});

test("sha256 uses real webcrypto", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("terminal input");
  await input.fill("sha256 hello");
  await input.press("Enter");
  await expect(
    page.getByText("sha256: 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824")
  ).toBeVisible();
});

test("rot13 and uuid work", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("terminal input");
  await input.fill("rot13 hello");
  await input.press("Enter");
  await expect(page.getByText("rot13: uryyb")).toBeVisible();
  await input.fill("uuid");
  await input.press("Enter");
  await expect(page.getByText(/^uuid: [0-9a-f-]{36}$/)).toBeVisible();
});

test("?run= links auto-execute commands", async ({ page }) => {
  await page.goto("/?run=hack");
  await expect(page.getByText("ACCESS GRANTED", { exact: false })).toBeVisible({
    timeout: 15_000,
  });
});

test("konami code pours the rain", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(5_000); // let the shell script finish
  for (const k of ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight"]) {
    await page.keyboard.press(k);
  }
  await page.keyboard.type("ba");
  await expect(page.getByText("KONAMI ACCEPTED", { exact: false })).toBeVisible();
  expect(await page.evaluate(() => document.body.classList.contains("godmode"))).toBe(true);
});

test("mobile command chips run commands", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const chips = page.getByRole("toolbar", { name: "quick commands" });
  await expect(chips).toBeVisible();
  await chips.getByRole("button", { name: "hack" }).click();
  await expect(page.getByText("ACCESS GRANTED", { exact: false })).toBeVisible();
});

test("sitemap ships for crawlers", async ({ page }) => {
  const res = await page.request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain("<urlset");
});

test("contact section carries the real channels", async ({ page }) => {
  await page.goto("/");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.getByRole("link", { name: "/in/lockedcloud ↗" })).toBeVisible();
  await expect(page.getByRole("link", { name: "users/1908251 ↗" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "locked.cloud1day@gmail.com ↗" })
  ).toBeVisible();
  await expect(page.getByText(/remote · cairo on-site · relocation · freelance/)).toBeVisible();
});

test("cv carries availability, not location", async ({ page }) => {
  await page.goto("/cv.html");
  await expect(page.getByText(/open to: remote/)).toBeVisible();
  await expect(page.getByText("Cairo, Egypt")).toBeHidden();
});

test("malware analysis ships as a skill, an arsenal line, and a file scan", async ({ page }) => {
  await page.goto("/");
  await page.locator("#skills").scrollIntoViewIfNeeded();
  await expect(page.getByText("Malware analysis — static triage · sandboxed dynamics · YARA")).toBeVisible();
  const input = page.getByLabel("terminal input");
  await input.fill("arsenal");
  await input.press("Enter");
  await expect(page.getByText("static triage → sandboxed dynamics → yara")).toBeVisible();
  await input.fill("file");
  await input.press("Enter");
  await expect(page.getByText("0/64 engines flag it", { exact: false })).toBeVisible();
});

test("snake: the arcade break", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("terminal input");
  await input.fill("snake");
  await input.press("Enter");
  const game = page.getByRole("application", { name: "snake game" });
  await expect(game).toBeVisible();
  await expect(game.getByText(/SCORE \d+/)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByText(/snake closed — final score \d+/)).toBeVisible();
});

test("man pages document the shell", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("terminal input");
  await input.fill("man verify");
  await input.press("Enter");
  await expect(page.getByText("VERIFY(1)")).toBeVisible();
  await expect(page.getByText("no number without a source", { exact: false })).toBeVisible();
  await input.fill("man definitely-not-a-command");
  await input.press("Enter");
  await expect(page.getByText("No manual entry for definitely-not-a-command")).toBeVisible();
});

test("history, !! rerun, and share links", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("terminal input");
  await input.fill("help");
  await input.press("Enter");
  await expect(page.getByText("available commands:")).toBeVisible();
  await input.fill("history");
  await input.press("Enter");
  await expect(page.getByText("commands this session:")).toBeVisible();
  await input.fill("share hack");
  await input.press("Enter");
  await expect(page.getByText(/run=hack/)).toBeVisible();
  await input.fill("!!");
  await input.press("Enter");
  await expect(page.getByText("!! → share hack")).toBeVisible();
});

test("pwa manifest and 404 page ship as static assets", async ({ page }) => {
  const manifest = await page.request.get("/manifest.webmanifest");
  expect(manifest.status()).toBe(200);
  expect(await manifest.text()).toContain('"display": "standalone"');
  const icon = await page.request.get("/icons/icon-192.png");
  expect(icon.status()).toBe(200);
  // vite preview SPA-fallbacks unknown paths, so assert the page itself
  // ships — GitHub Pages serves it automatically with a real 404 status
  const notFound = await page.request.get("/404.html");
  expect(notFound.status()).toBe(200);
  expect(await notFound.text()).toContain("SEGMENT NOT FOUND");
});
