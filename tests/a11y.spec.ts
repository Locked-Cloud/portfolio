import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home page has no axe violations", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(4_500); // let the shell script finish so all content exists
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const summary = results.violations
    .map((v) => `${v.id} (${v.nodes.length} nodes): ${v.help}`)
    .join(" | ");
  expect(results.violations, summary).toEqual([]);
});

test("cv page has no axe violations", async ({ page }) => {
  await page.goto("/cv.html");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  const summary = results.violations
    .map((v) => `${v.id} (${v.nodes.length} nodes): ${v.help}`)
    .join(" | ");
  expect(results.violations, summary).toEqual([]);
});
