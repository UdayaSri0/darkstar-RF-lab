// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import {
  STORAGE_KEYS,
  createEmptyProject,
  loadProject,
  loadProjectResult,
  loadSettings,
  saveProject,
  saveSettings,
} from "../../src/app/ProjectStore";
import legacyProject from "../fixtures/project-v1.json";

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
    expect(loadProject()?.version).toBe(2);
  });

  it("falls back safely when stored JSON is invalid", () => {
    localStorage.setItem(STORAGE_KEYS.project, "not-json");
    expect(loadProject()).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.project)).toBe("not-json");
  });

  it("migrates a stored version 1 project without overwriting the source", () => {
    const raw = JSON.stringify(legacyProject);
    localStorage.setItem(STORAGE_KEYS.project, raw);
    const result = loadProjectResult();
    expect(result.migrated).toBe(true);
    expect(result.project?.version).toBe(2);
    expect(result.project?.cables[0]?.from.instanceId).toBe("main-controller");
    expect(localStorage.getItem(STORAGE_KEYS.project)).toBe(raw);
  });

  it("merges saved settings with defaults", () => {
    const defaults = { quality: "high" as const, labelsVisible: true, gridVisible: true, reducedMotion: false };
    saveSettings({ ...defaults, quality: "low" });
    expect(loadSettings(defaults).quality).toBe("low");
  });
});
