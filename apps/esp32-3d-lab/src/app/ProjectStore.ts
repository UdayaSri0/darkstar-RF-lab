import {
  ESP32_COMPONENT_TYPE_ID,
  ESP32_LEGACY_VARIANT_ID,
  MAIN_CONTROLLER_INSTANCE_ID,
  decodeProject,
  validateProjectV2,
} from "./projectSchema";
import type { CameraState, LabProjectV2, LabSettings } from "./types";

export const STORAGE_KEYS = {
  project: "darkstar.esp32-3d-lab.project",
  settings: "darkstar.esp32-3d-lab.settings",
  camera: "darkstar.esp32-3d-lab.camera",
} as const;

export interface StoredProjectResult {
  project: LabProjectV2 | null;
  error: string | null;
  migrated: boolean;
}

export function createEmptyProject(): LabProjectV2 {
  return {
    version: 2,
    name: "Untitled ESP32 Lab",
    verificationMode: "conceptual",
    components: [{
      id: MAIN_CONTROLLER_INSTANCE_ID,
      typeId: ESP32_COMPONENT_TYPE_ID,
      variantId: ESP32_LEGACY_VARIANT_ID,
      transform: {
        positionMm: [0, 0, 0],
        rotationDeg: [0, 0, 0],
        scale: [1, 1, 1],
      },
      locked: false,
      properties: {},
    }],
    cables: [],
    measurements: [],
    notes: [],
    simulation: { status: "idle", elapsedMs: 0, properties: {} },
    modifiedAt: new Date().toISOString(),
  };
}

export function saveProject(project: LabProjectV2): LabProjectV2 {
  const saved: LabProjectV2 = { ...structuredClone(project), version: 2, modifiedAt: new Date().toISOString() };
  const validation = validateProjectV2(saved);
  if (!validation.valid) throw new Error(`Project could not be saved. ${validation.errors.join(" ")}`);
  localStorage.setItem(STORAGE_KEYS.project, JSON.stringify(saved));
  return saved;
}

export function loadProjectResult(): StoredProjectResult {
  const raw = localStorage.getItem(STORAGE_KEYS.project);
  if (!raw) return { project: null, error: null, migrated: false };
  try {
    const decoded = decodeProject(JSON.parse(raw) as unknown);
    return { ...decoded, error: null };
  } catch (error) {
    return {
      project: null,
      error: error instanceof Error ? error.message : "Saved project could not be loaded.",
      migrated: false,
    };
  }
}

export function loadProject(): LabProjectV2 | null {
  return loadProjectResult().project;
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
