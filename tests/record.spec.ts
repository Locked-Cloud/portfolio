import { test } from "@playwright/test";

/** Drives the terminal through a demo session for the README video. */
test("record demo session", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(6_000); // boot narrative

  const input = page.getByLabel("terminal input");
  for (const cmd of ["help", "verify", "scorecard", "neofetch", "coverage"]) {
    await input.fill(cmd);
    await input.press("Enter");
    await page.waitForTimeout(2_600);
  }

  await input.fill("goto proof");
  await input.press("Enter");
  await page.waitForTimeout(3_500); // 3D scene loads
  await page.mouse.move(640, 400);
  await page.mouse.down();
  await page.mouse.move(900, 340, { steps: 30 }); // spin the tooth
  await page.mouse.up();
  await page.waitForTimeout(1_500);

  await input.fill("goto work");
  await input.press("Enter");
  await page.waitForTimeout(2_500);
  await input.fill("goto contact");
  await input.press("Enter");
  await page.waitForTimeout(2_500);
});
