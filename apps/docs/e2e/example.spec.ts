import { expect, test } from "@playwright/test";

test("loads docs app", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Zela UI Docs");
});
