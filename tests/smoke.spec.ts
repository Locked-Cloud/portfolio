import { test, expect } from "@playwright/test";

test("hero shell boots and tells the story", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("CAIRO.SYS kernel", { exact: false })).toBeVisible({
    timeout: 10_000,
  });
  await expect(page.getByRole("heading", { name: "IBRAHIM AHMED" })).toBeVisible();
  await expect(page.getByText("Cairo, Egypt", { exact: false })).toBeVisible();
});

test("the terminal answers help", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("terminal input");
  await expect(input).toBeVisible();
  await input.fill("help");
  await input.press("Enter");
  await expect(page.getByText("available commands:")).toBeVisible();
});

test("verify command prints stat provenance", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("terminal input");
  await input.fill("verify");
  await input.press("Enter");
  await expect(page.getByText("no number without a source", { exact: false })).toBeVisible();
});

test("stats carry provenance chips", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("[record]").first()).toBeVisible();
  await expect(page.getByText("[measured]").first()).toBeVisible();
});

test("featured projects and images render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("SHIPPED SYSTEMS")).toBeVisible();
  await expect(page.getByAltText(/PULPOVR cockpit/)).toBeVisible();
});

test("cv page renders for print", async ({ page }) => {
  await page.goto("/cv.html");
  await expect(page.getByRole("heading", { name: "IBRAHIM AHMED" })).toBeVisible();
  await expect(page.getByText("Selected work")).toBeVisible();
});
