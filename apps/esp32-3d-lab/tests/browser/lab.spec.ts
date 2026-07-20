import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

const legacyProject = JSON.parse(
  readFileSync(new URL("../fixtures/project-v1.json", import.meta.url), "utf8"),
) as Record<string, unknown>;

test("loads the standalone engineering shell and WebGL viewport", async ({ page }) => {
  await page.goto("./");
  await expect(page).toHaveTitle("DarkStar ESP32 3D Lab");
  await expect(page.locator("#esp32-3d-lab-root .ds3d-app")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Tools" })).toBeVisible();
  await expect(page.locator("canvas.ds3d-canvas")).toBeVisible();
  await expect(page.getByText("Nothing selected")).toBeVisible();
});

test("creates the ESP32 through the registry and keeps it selectable", async ({ page }) => {
  await page.goto("./");
  const canvas = page.locator("canvas.ds3d-canvas");
  await expect(canvas).toHaveAttribute("data-runtime-count", "1");
  await expect(canvas).toHaveAttribute("data-runtime-type-ids", "esp32-devkit");
  await canvas.click();
  await expect(page.locator("#ds3d-status-selection")).not.toHaveText("None");
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

test("loads a version 1 fixture and renders its migrated ESP32 wire", async ({ page }) => {
  await page.addInitScript((project) => {
    localStorage.setItem("darkstar.esp32-3d-lab.project", JSON.stringify(project));
  }, legacyProject);
  await page.goto("./");

  const canvas = page.locator("canvas.ds3d-canvas");
  await expect(canvas).toHaveAttribute("data-rendered-component-id", "main-controller");
  await expect(canvas).toHaveAttribute("data-rendered-cable-count", "1");
  await expect(page.locator("#ds3d-status-warnings")).toHaveText("1");
  await expect(page.locator("#ds3d-toast")).toContainText("migrated safely to version 2");

  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save" }).click();
  await download;
  const savedVersion = await page.evaluate(() => {
    const raw = localStorage.getItem("darkstar.esp32-3d-lab.project");
    return raw ? (JSON.parse(raw) as { version?: number }).version : null;
  });
  expect(savedVersion).toBe(2);
});

test("does not overwrite a stored project when migration fails", async ({ page }) => {
  const invalidStoredProject = JSON.stringify({
    ...legacyProject,
    wires: [{
      id: "wire-invalid",
      fromPinId: "pin-12",
      toPinId: "pin-999",
      color: "#42c9ff",
      label: "Invalid legacy wire",
    }],
  });
  await page.addInitScript((raw) => {
    if (!sessionStorage.getItem("ds3d-invalid-fixture-installed")) {
      localStorage.setItem("darkstar.esp32-3d-lab.project", raw);
      sessionStorage.setItem("ds3d-invalid-fixture-installed", "true");
    }
  }, invalidStoredProject);
  await page.goto("./");
  await expect(page.locator("#ds3d-toast")).toContainText("Saved project left unchanged");
  await page.reload();
  const storedProject = await page.evaluate(() => localStorage.getItem("darkstar.esp32-3d-lab.project"));
  expect(storedProject).toBe(invalidStoredProject);
});

test("renders an explanatory placeholder for an unknown saved component", async ({ page }) => {
  const project = {
    version: 2,
    name: "Unknown component recovery",
    verificationMode: "conceptual",
    components: [{
      id: "unknown-module",
      typeId: "future-hardware",
      variantId: "future-variant",
      transform: { positionMm: [0, 0, 0], rotationDeg: [0, 0, 0], scale: [1, 1, 1] },
      locked: false,
      properties: {},
    }],
    cables: [],
    measurements: [],
    notes: [],
    simulation: { status: "idle", elapsedMs: 0, properties: {} },
    modifiedAt: "2026-07-20T00:00:00.000Z",
  };
  await page.addInitScript((savedProject) => {
    localStorage.setItem("darkstar.esp32-3d-lab.project", JSON.stringify(savedProject));
  }, project);
  await page.goto("./");

  await expect(page.locator("canvas.ds3d-canvas")).toHaveAttribute("data-placeholder-count", "1");
  await expect(page.locator(".ds3d-component-error")).toContainText("future-hardware / future-variant");
  await expect(page.locator("#esp32-3d-lab-root .ds3d-app")).toBeVisible();
});
