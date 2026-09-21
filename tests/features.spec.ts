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

test("3D scene loads when scrolled into view", async ({ page }) => {
  await page.goto("/");
  await page.locator("#proof").scrollIntoViewIfNeeded();
  await expect(page.locator("#proof canvas")).toBeVisible({ timeout: 20_000 });
});

test("CV toggles to Arabic", async ({ page }) => {
  await page.goto("/cv.html");
  await page.getByRole("button", { name: "عربي" }).click();
  const dir = await page.locator(".cv-page").getAttribute("dir");
  expect(dir).toBe("rtl");
  await expect(page.getByRole("heading", { name: "إبراهيم أحمد" })).toBeVisible();
});

test("PULPOVR renders as full-width case study with counted LOC", async ({ page }) => {
  await page.goto("/");
  await page.locator("#work").scrollIntoViewIfNeeded();
  const caseStudy = page.locator("#work article").first();
  await expect(caseStudy.getByText("PULPOVR")).toBeVisible();
  await expect(caseStudy.getByText("~7.8K LOC [counted]", { exact: false })).toBeVisible();
  await expect(caseStudy.getByText("merit verdict 28/30", { exact: false })).toBeVisible();
  // the effort-allocation bar carries the three counted segments
  await expect(caseStudy.getByText("TypeScript / TSX")).toBeVisible();
  await expect(caseStudy.getByText("C++ firmware")).toBeVisible();
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
  const res = await page.request.get("/rss.xml");
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain("<rss");
  expect(body).toContain("how-this-homepage-was-chosen");
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
