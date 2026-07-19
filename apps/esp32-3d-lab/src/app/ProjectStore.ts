import type { CameraState, LabProject, LabSettings } from "./types";

export const STORAGE_KEYS = {
  project: "darkstar.esp32-3d-lab.project",
  settings: "darkstar.esp32-3d-lab.settings",
  camera: "darkstar.esp32-3d-lab.camera",
} as const;

export function createEmptyProject(): LabProject {
  return {
    version: 1,
    name: "Untitled ESP32 Lab",
    boardId: "esp32-devkit-v1-30p",
    wires: [],
    measurements: [],
    notes: [],
    modifiedAt: new Date().toISOString(),
  };
}

export function saveProject(project: LabProject): LabProject {
  const saved = { ...project, modifiedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEYS.project, JSON.stringify(saved));
  return saved;
}

export function loadProject(): LabProject | null {
  const raw = localStorage.getItem(STORAGE_KEYS.project);
  if (!raw) return null;
  try {
    const candidate = JSON.parse(raw) as Partial<LabProject>;
    if (candidate.version !== 1 || !Array.isArray(candidate.wires) || !Array.isArray(candidate.notes)) return null;
    return { ...createEmptyProject(), ...candidate } as LabProject;
  } catch {
    return null;
  }
}

export function saveSettings(settings: LabSettings): void {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export function loadSettings(defaults: LabSettings): LabSettings {
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) ?? "{}") } as LabSettings;
  } catch {
    return defaults;
  }
}

export function saveCamera(camera: CameraState): void {
  localStorage.setItem(STORAGE_KEYS.camera, JSON.stringify(camera));
}

export function loadCamera(): CameraState | null {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEYS.camera) ?? "null") as CameraState | null;
    return value && Array.isArray(value.position) && Array.isArray(value.target) ? value : null;
  } catch {
    return null;
  }
}
