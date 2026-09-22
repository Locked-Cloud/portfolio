import { test } from "@playwright/test";

/** Drives the terminal through a demo session for the README video. */
test("record demo session", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(6_000); // boot narrative

  const input = page.getByLabel("terminal input");
  for (const cmd of ["help", "verify", "scorecard", "arsenal", "encode hello", "hack"]) {
    await input.fill(cmd);
    await input.press("Enter");
    await page.waitForTimeout(2_400);
  }

  await input.fill("goto session");
  await input.press("Enter");
  await page.waitForTimeout(2_600); // telemetry + receipts land

  await input.fill("goto work");
  await input.press("Enter");
  await page.waitForTimeout(1_200);
  const listbox = page.getByRole("listbox", { name: "project files" });
  await listbox.focus();
  await page.keyboard.press("End"); // flip to the flutter project preview
  await page.waitForTimeout(2_000);

  await input.fill("goto contact");
  await input.press("Enter");
  await page.waitForTimeout(2_200);
});
