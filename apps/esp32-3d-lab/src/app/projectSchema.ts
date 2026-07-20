import { boards, esp32DevKit } from "../data/esp32DevKit";
import type {
  CableConnection,
  ComponentInstance,
  LabNote,
  LabProjectV1,
  LabProjectV2,
  Measurement,
  TerminalRef,
} from "./types";

export const MAIN_CONTROLLER_INSTANCE_ID = "main-controller";
export const ESP32_COMPONENT_TYPE_ID = "esp32-devkit";
export const ESP32_LEGACY_VARIANT_ID = esp32DevKit.id;
export const LEGACY_CABLE_TYPE_ID = "legacy-wire";

const idPattern = /^[a-z0-9](?:[a-z0-9._-]{0,63})$/;

export interface ProjectValidationResult {
  valid: boolean;
  errors: string[];
}

export interface DecodedProject {
  project: LabProjectV2;
  migrated: boolean;
}

export type ProjectImportResult =
  | { ok: true; project: LabProjectV2; migrated: boolean }
  | { ok: false; project: LabProjectV2; error: string };

export class ProjectSchemaError extends Error {
  constructor(public readonly issues: string[]) {
    super(issues.join(" "));
    this.name = "ProjectSchemaError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isId(value: unknown): value is string {
  return typeof value === "string" && idPattern.test(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteTuple(value: unknown): value is [number, number, number] {
  return Array.isArray(value) && value.length === 3 && value.every((entry) => typeof entry === "number" && Number.isFinite(entry));
}

function validateMeasurement(value: unknown, path: string, errors: string[]): value is Measurement {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return false;
  }
  if (!isId(value.id)) errors.push(`${path}.id is malformed.`);
  if (!isFiniteTuple(value.from)) errors.push(`${path}.from must contain three finite numbers.`);
  if (!isFiniteTuple(value.to)) errors.push(`${path}.to must contain three finite numbers.`);
  if (typeof value.distanceMm !== "number" || !Number.isFinite(value.distanceMm) || value.distanceMm < 0) {
    errors.push(`${path}.distanceMm must be a non-negative finite number.`);
  }
  return true;
}

function validateNote(value: unknown, path: string, errors: string[]): value is LabNote {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return false;
  }
  if (!isId(value.id)) errors.push(`${path}.id is malformed.`);
  if (!isNonEmptyString(value.targetId)) errors.push(`${path}.targetId must be a non-empty string.`);
  if (typeof value.text !== "string") errors.push(`${path}.text must be a string.`);
  if (!isNonEmptyString(value.createdAt)) errors.push(`${path}.createdAt must be a non-empty string.`);
  return true;
}

function validateComponent(value: unknown, index: number, errors: string[]): value is ComponentInstance {
  const path = `components[${index}]`;
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return false;
  }
  if (!isId(value.id)) errors.push(`${path}.id is malformed.`);
  if (!isId(value.typeId)) errors.push(`${path}.typeId is malformed.`);
  if (!isId(value.variantId)) errors.push(`${path}.variantId is malformed.`);
  if (value.typeId !== ESP32_COMPONENT_TYPE_ID || !boards.some((board) => board.id === value.variantId)) {
    errors.push(`${path} uses an unsupported component type or variant.`);
  }
  if (!isRecord(value.transform)) {
    errors.push(`${path}.transform must be an object.`);
  } else {
    if (!isFiniteTuple(value.transform.positionMm)) errors.push(`${path}.transform.positionMm must contain three finite numbers.`);
    if (!isFiniteTuple(value.transform.rotationDeg)) errors.push(`${path}.transform.rotationDeg must contain three finite numbers.`);
    if (!isFiniteTuple(value.transform.scale)) errors.push(`${path}.transform.scale must contain three finite numbers.`);
  }
  if (typeof value.locked !== "boolean") errors.push(`${path}.locked must be a boolean.`);
  if (value.groupId !== undefined && !isId(value.groupId)) errors.push(`${path}.groupId is malformed.`);
  if (value.userLabel !== undefined && typeof value.userLabel !== "string") errors.push(`${path}.userLabel must be a string.`);
  if (!isRecord(value.properties)) errors.push(`${path}.properties must be an object.`);
  return true;
}

function validateTerminalRef(
  value: unknown,
  path: string,
  components: Map<string, ComponentInstance>,
  errors: string[],
): value is TerminalRef {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return false;
  }
  if (!isId(value.instanceId)) errors.push(`${path}.instanceId is malformed.`);
  if (!isId(value.terminalId)) errors.push(`${path}.terminalId is malformed.`);
  if (!isId(value.instanceId) || !isId(value.terminalId)) return false;
  const component = components.get(value.instanceId);
  if (!component) {
    errors.push(`${path} references unknown component instance "${value.instanceId}".`);
    return false;
  }
  if (component.typeId === ESP32_COMPONENT_TYPE_ID && !esp32DevKit.pins.some((pin) => pin.id === value.terminalId)) {
    errors.push(`${path} references unknown terminal "${value.terminalId}" on "${value.instanceId}".`);
  }
  return true;
}

function validateCable(
  value: unknown,
  index: number,
  components: Map<string, ComponentInstance>,
  errors: string[],
): value is CableConnection {
  const path = `cables[${index}]`;
  if (!isRecord(value)) {
    errors.push(`${path} must be an object.`);
    return false;
  }
  if (!isId(value.id)) errors.push(`${path}.id is malformed.`);
  validateTerminalRef(value.from, `${path}.from`, components, errors);
  validateTerminalRef(value.to, `${path}.to`, components, errors);
  if (!isId(value.cableTypeId)) errors.push(`${path}.cableTypeId is malformed.`);
  if (!isNonEmptyString(value.color)) errors.push(`${path}.color must be a non-empty string.`);
  if (!Array.isArray(value.controlPointsMm)) {
    errors.push(`${path}.controlPointsMm must be an array.`);
  } else {
    value.controlPointsMm.forEach((point, pointIndex) => {
      if (!isFiniteTuple(point)) errors.push(`${path}.controlPointsMm[${pointIndex}] must contain three finite numbers.`);
    });
  }
  if (value.label !== undefined && typeof value.label !== "string") errors.push(`${path}.label must be a string.`);
  if (value.bundleId !== undefined && !isId(value.bundleId)) errors.push(`${path}.bundleId is malformed.`);
  return true;
}

export function validateProjectV2(value: unknown): ProjectValidationResult {
  const errors: string[] = [];
  if (!isRecord(value)) return { valid: false, errors: ["Project must be an object."] };
  if (value.version !== 2) errors.push(`Unsupported project version "${String(value.version)}".`);
  if (!isNonEmptyString(value.name)) errors.push("name must be a non-empty string.");
  if (value.verificationMode !== "conceptual" && value.verificationMode !== "validated") {
    errors.push("verificationMode must be conceptual or validated.");
  }
  if (value.layoutPresetId !== undefined && !isId(value.layoutPresetId)) errors.push("layoutPresetId is malformed.");

  const components = new Map<string, ComponentInstance>();
  if (!Array.isArray(value.components)) {
    errors.push("components must be an array.");
  } else {
    value.components.forEach((component, index) => {
      validateComponent(component, index, errors);
      if (isRecord(component) && isId(component.id)) {
        if (components.has(component.id)) errors.push(`Duplicate component instance ID "${component.id}".`);
        else components.set(component.id, component as unknown as ComponentInstance);
      }
    });
  }

  if (!Array.isArray(value.cables)) errors.push("cables must be an array.");
  else value.cables.forEach((cable, index) => validateCable(cable, index, components, errors));
  if (!Array.isArray(value.measurements)) errors.push("measurements must be an array.");
  else value.measurements.forEach((measurement, index) => validateMeasurement(measurement, `measurements[${index}]`, errors));
  if (!Array.isArray(value.notes)) errors.push("notes must be an array.");
  else value.notes.forEach((note, index) => validateNote(note, `notes[${index}]`, errors));

  if (!isRecord(value.simulation)) {
    errors.push("simulation must be an object.");
  } else {
    if (!(["idle", "running", "paused"] as unknown[]).includes(value.simulation.status)) {
      errors.push("simulation.status is unsupported.");
    }
    if (typeof value.simulation.elapsedMs !== "number" || !Number.isFinite(value.simulation.elapsedMs) || value.simulation.elapsedMs < 0) {
      errors.push("simulation.elapsedMs must be a non-negative finite number.");
    }
    if (!isRecord(value.simulation.properties)) errors.push("simulation.properties must be an object.");
  }
  if (!isNonEmptyString(value.modifiedAt)) errors.push("modifiedAt must be a non-empty string.");

  return { valid: errors.length === 0, errors };
}

function parseLegacyProject(value: unknown): LabProjectV1 {
  const errors: string[] = [];
  if (!isRecord(value) || value.version !== 1) throw new ProjectSchemaError(["Project is not a version 1 document."]);
  if (!isNonEmptyString(value.boardId) || !boards.some((board) => board.id === value.boardId)) {
    errors.push("Version 1 boardId is unsupported.");
  }
  if (!Array.isArray(value.wires)) {
    errors.push("Version 1 wires must be an array.");
  } else {
    value.wires.forEach((wire, index) => {
      if (!isRecord(wire)) {
        errors.push(`wires[${index}] must be an object.`);
        return;
      }
      if (!isId(wire.id)) errors.push(`wires[${index}].id is malformed.`);
      if (!isId(wire.fromPinId) || !esp32DevKit.pins.some((pin) => pin.id === wire.fromPinId)) {
        errors.push(`wires[${index}].fromPinId is invalid.`);
      }
      if (!isId(wire.toPinId) || !esp32DevKit.pins.some((pin) => pin.id === wire.toPinId)) {
        errors.push(`wires[${index}].toPinId is invalid.`);
      }
      if (!isNonEmptyString(wire.color)) errors.push(`wires[${index}].color must be a non-empty string.`);
      if (typeof wire.label !== "string") errors.push(`wires[${index}].label must be a string.`);
    });
  }

  const measurements = value.measurements ?? [];
  const notes = value.notes ?? [];
  if (!Array.isArray(measurements)) errors.push("Version 1 measurements must be an array.");
  else measurements.forEach((measurement, index) => validateMeasurement(measurement, `measurements[${index}]`, errors));
  if (!Array.isArray(notes)) errors.push("Version 1 notes must be an array.");
  else notes.forEach((note, index) => validateNote(note, `notes[${index}]`, errors));
  if (value.name !== undefined && !isNonEmptyString(value.name)) errors.push("Version 1 name must be a non-empty string.");
  if (value.modifiedAt !== undefined && !isNonEmptyString(value.modifiedAt)) errors.push("Version 1 modifiedAt must be a non-empty string.");
  if (errors.length) throw new ProjectSchemaError(errors);

  return {
    version: 1,
    name: typeof value.name === "string" ? value.name : "Untitled ESP32 Lab",
    boardId: value.boardId as string,
    wires: structuredClone(value.wires) as LabProjectV1["wires"],
    measurements: structuredClone(measurements) as Measurement[],
    notes: structuredClone(notes) as LabNote[],
    modifiedAt: typeof value.modifiedAt === "string" ? value.modifiedAt : new Date().toISOString(),
  };
}

export function migrateProjectV1(value: unknown): LabProjectV2 {
  const legacy = parseLegacyProject(value);
  const project: LabProjectV2 = {
    version: 2,
    name: legacy.name,
    verificationMode: "conceptual",
    components: [{
      id: MAIN_CONTROLLER_INSTANCE_ID,
      typeId: ESP32_COMPONENT_TYPE_ID,
      variantId: legacy.boardId,
      transform: {
        positionMm: [0, 0, 0],
        rotationDeg: [0, 0, 0],
        scale: [1, 1, 1],
      },
      locked: false,
      properties: {},
    }],
    cables: legacy.wires.map((wire) => ({
      id: wire.id,
      from: { instanceId: MAIN_CONTROLLER_INSTANCE_ID, terminalId: wire.fromPinId },
      to: { instanceId: MAIN_CONTROLLER_INSTANCE_ID, terminalId: wire.toPinId },
      cableTypeId: LEGACY_CABLE_TYPE_ID,
      color: wire.color,
      controlPointsMm: [],
      label: wire.label,
    })),
    measurements: structuredClone(legacy.measurements),
    notes: structuredClone(legacy.notes),
    simulation: { status: "idle", elapsedMs: 0, properties: {} },
    modifiedAt: legacy.modifiedAt,
  };
  const validation = validateProjectV2(project);
  if (!validation.valid) throw new ProjectSchemaError(validation.errors);
  return project;
}

export function decodeProject(value: unknown): DecodedProject {
  if (!isRecord(value)) throw new ProjectSchemaError(["Project must be an object."]);
  if (value.version === 1) return { project: migrateProjectV1(value), migrated: true };
  if (value.version !== 2) throw new ProjectSchemaError([`Unsupported project version "${String(value.version)}".`]);
  const validation = validateProjectV2(value);
  if (!validation.valid) throw new ProjectSchemaError(validation.errors);
  return { project: structuredClone(value) as unknown as LabProjectV2, migrated: false };
}

export function tryImportProject(value: unknown, currentProject: LabProjectV2): ProjectImportResult {
  try {
    const decoded = decodeProject(value);
    return { ok: true, ...decoded };
  } catch (error) {
    return {
      ok: false,
      project: currentProject,
      error: error instanceof Error ? error.message : "Project could not be loaded.",
    };
  }
}

export function terminalKey(terminal: TerminalRef): string {
  return `${terminal.instanceId}::${terminal.terminalId}`;
}
