import { test, expect } from "@playwright/test";

/** Env-guarded: run with WORK_SHOT=1 via the record config. Captures the
 *  #work section element alone, so no sticky-nav overlap can confuse review. */
const run = !!process.env.WORK_SHOT;

test.skip(!run, "set WORK_SHOT=1 to capture");

test("capture the work section element", async ({ page }) => {
  await page.goto("/");
  await page.locator("#work").scrollIntoViewIfNeeded();
  // sanity inside the same run: the case study must exist in this render
  await expect(page.getByText("~7.8K LOC", { exact: false })).toBeVisible();
  await expect(page.getByText("merit verdict 28/30", { exact: false })).toBeVisible();
  await page.waitForTimeout(800);
  await page.locator("#work").screenshot({ path: "shots/03-work-section.png" });
});
