import { test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("dump home violations", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(4_500);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  for (const v of results.violations) {
    console.log(`\n== ${v.id} (${v.nodes.length}) — ${v.help}`);
    for (const n of v.nodes.slice(0, 4)) {
      console.log("   target:", n.target.join(" "), "| html:", n.html.slice(0, 110));
    }
  }
});

test("dump cv violations", async ({ page }) => {
  await page.goto("/cv.html");
  const results = await new AxeBuilder({ page }).withTags(["wcag2aa"]).analyze();
  for (const v of results.violations) {
    console.log(`\n== ${v.id} (${v.nodes.length}) — ${v.help}`);
    for (const n of v.nodes.slice(0, 4)) {
      console.log("   target:", n.target.join(" "));
      console.log("   any:", JSON.stringify(n.any?.map((a: { message: string }) => a.message)));
    }
  }
});
