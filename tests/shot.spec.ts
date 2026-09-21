import { test, expect } from "@playwright/test";

// On-demand design screenshots:  SHOTS=1 npx playwright test tests/shot.spec.ts
// Skipped in CI unless SHOTS is set.
const run = !!process.env.SHOTS;

test("capture boot overlay", async ({ page }) => {
  test.skip(!run, "set SHOTS=1 to capture");
  // boot is skipped for automation (navigator.webdriver) — mask it so the
  // overlay actually plays in this capture
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });
  await page.goto("/");
  await expect(page.getByText("ACCESS GRANTED")).toBeVisible({ timeout: 6_000 });
  await page.screenshot({ path: "shots/00-boot.png" });
});

test("capture og image (1200x630, real render)", async ({ page }) => {
  test.skip(!run, "set SHOTS=1 to capture");
  await page.setViewportSize({ width: 1200, height: 630 });
  await page.goto("/");
  await page.waitForTimeout(5_500); // boot-skipped (webdriver) + shell script landed
  await page.screenshot({ path: "shots/og-render.png" });
});

test("capture design review shots", async ({ page }) => {
  test.skip(!run, "set SHOTS=1 to capture");
  await page.goto("/");
  await page.waitForTimeout(5_000); // shell narrative

  await page.screenshot({ path: "shots/01-hero.png" });

  await page.locator("#session").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1_200); // let receipts + first packets land
  await page.locator("#session").screenshot({ path: "shots/02-session.png" });

  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.locator("#work").screenshot({ path: "shots/03-work.png" });

  await page.locator("#blog").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.locator("#blog").screenshot({ path: "shots/04-blog.png" });

  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({ path: "shots/05-contact.png" });

  await page.goto("/cv.html");
  await page.waitForTimeout(800);
  await page.screenshot({ path: "shots/06-cv-en.png", fullPage: true });
  await page.getByRole("button", { name: "عربي" }).click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: "shots/07-cv-ar.png", fullPage: true });
});
