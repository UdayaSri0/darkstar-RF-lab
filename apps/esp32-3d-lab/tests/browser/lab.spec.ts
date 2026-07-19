import { expect, test } from "@playwright/test";

test("loads the standalone engineering shell and WebGL viewport", async ({ page }) => {
  await page.goto("./");
  await expect(page).toHaveTitle("DarkStar ESP32 3D Lab");
  await expect(page.locator("#esp32-3d-lab-root .ds3d-app")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tools" })).toBeVisible();
  await expect(page.locator("canvas.ds3d-canvas")).toBeVisible();
  await expect(page.getByText("Nothing selected")).toBeVisible();
});

test("switches tools and opens settings", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Wire" }).click();
  await expect(page.locator("#ds3d-status-tool")).toHaveText("Wire");
  await page.getByRole("button", { name: "Open settings" }).click();
  await expect(page.getByRole("heading", { name: "Laboratory settings" })).toBeVisible();
});

test("uses only the namespaced local storage area", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Open settings" }).click();
  await page.getByLabel("Show engineering grid").uncheck();
  const keys = await page.evaluate(() => Object.keys(localStorage));
  expect(keys.length).toBeGreaterThan(0);
  expect(keys.every((key) => key.startsWith("darkstar.esp32-3d-lab."))).toBe(true);
});
