import { test, expect } from "@playwright/test";

// On-demand PWA icon capture:  ICONS=1 npx playwright test tests/icon-shot.spec.ts
// Renders the standalone favicon.svg at exact square sizes; its #050806 background
// rect covers the viewBox, so viewport screenshots are fully covered.
const run = !!process.env.ICONS;
test.skip(!run, "set ICONS=1");

test("capture pwa icons", async ({ page }) => {
  await page.setViewportSize({ width: 192, height: 192 });
  await page.goto("/favicon.svg");
  await page.waitForLoadState("load");
  expect(await page.locator("svg, img").count()).toBeGreaterThanOrEqual(1);
  await page.screenshot({ path: "shots/icon-192.png" });

  await page.setViewportSize({ width: 512, height: 512 });
  await page.goto("/favicon.svg");
  await page.waitForLoadState("load");
  await page.screenshot({ path: "shots/icon-512.png" });
});
