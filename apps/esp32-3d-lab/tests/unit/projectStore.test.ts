// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import {
  STORAGE_KEYS,
  createEmptyProject,
  loadProject,
  loadSettings,
  saveProject,
  saveSettings,
} from "../../src/app/ProjectStore";

describe("isolated project persistence", () => {
  beforeEach(() => localStorage.clear());

  it("uses application-specific storage keys", () => {
    expect(Object.values(STORAGE_KEYS).every((key) => key.startsWith("darkstar.esp32-3d-lab."))).toBe(true);
  });

  it("round-trips a project", () => {
    const project = createEmptyProject();
    project.name = "Bench test";
    saveProject(project);
    expect(loadProject()?.name).toBe("Bench test");
  });

  it("falls back safely when stored JSON is invalid", () => {
    localStorage.setItem(STORAGE_KEYS.project, "not-json");
    expect(loadProject()).toBeNull();
  });

  it("merges saved settings with defaults", () => {
    const defaults = { quality: "high" as const, labelsVisible: true, gridVisible: true, reducedMotion: false };
    saveSettings({ ...defaults, quality: "low" });
    expect(loadSettings(defaults).quality).toBe("low");
  });
});
