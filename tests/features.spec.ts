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
