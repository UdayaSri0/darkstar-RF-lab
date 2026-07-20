import { describe, expect, it } from "vitest";
import legacyProject from "../fixtures/project-v1.json";
import { createEmptyProject } from "../../src/app/ProjectStore";
import {
  ESP32_COMPONENT_TYPE_ID,
  MAIN_CONTROLLER_INSTANCE_ID,
  decodeProject,
  migrateProjectV1,
  terminalKey,
  tryImportProject,
  validateProjectV2,
} from "../../src/app/projectSchema";
import type { CableConnection, ComponentInstance, LabProjectV2 } from "../../src/app/types";

function cable(fromInstanceId = MAIN_CONTROLLER_INSTANCE_ID, toInstanceId = MAIN_CONTROLLER_INSTANCE_ID): CableConnection {
  return {
    id: "wire-test",
    from: { instanceId: fromInstanceId, terminalId: "pin-12" },
    to: { instanceId: toInstanceId, terminalId: "pin-20" },
    cableTypeId: "legacy-wire",
    color: "#42c9ff",
    controlPointsMm: [],
  };
}

function secondController(id: string): ComponentInstance {
  return {
    id,
    typeId: ESP32_COMPONENT_TYPE_ID,
    variantId: "esp32-devkit-v1-30p",
    transform: { positionMm: [40, 0, 0], rotationDeg: [0, 0, 0], scale: [1, 1, 1] },
    locked: false,
    groupId: "controller-bank",
    userLabel: "Auxiliary controller",
    properties: { role: "test" },
  };
}

describe("project schema version 2", () => {
  it("accepts a valid version 2 project", () => {
    expect(validateProjectV2(createEmptyProject())).toEqual({ valid: true, errors: [] });
  });

  it("rejects malformed and duplicate component instance IDs", () => {
    const project = createEmptyProject();
    project.components.push(secondController(MAIN_CONTROLLER_INSTANCE_ID), secondController("Invalid ID"));
    const result = validateProjectV2(project);
    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.includes("Duplicate component instance ID"))).toBe(true);
    expect(result.errors.some((error) => error.includes("id is malformed"))).toBe(true);
  });

  it("rejects terminal references that do not resolve", () => {
    const project = createEmptyProject();
    project.cables.push({
      ...cable(),
      to: { instanceId: MAIN_CONTROLLER_INSTANCE_ID, terminalId: "pin-999" },
    });
    const result = validateProjectV2(project);
    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.includes("unknown terminal"))).toBe(true);
  });

  it("allows separate instances to use the same terminal IDs", () => {
    const project = createEmptyProject();
    project.components.push(secondController("aux-controller"));
    project.cables.push({
      ...cable(MAIN_CONTROLLER_INSTANCE_ID, "aux-controller"),
      from: { instanceId: MAIN_CONTROLLER_INSTANCE_ID, terminalId: "pin-12" },
      to: { instanceId: "aux-controller", terminalId: "pin-12" },
    });
    expect(validateProjectV2(project).valid).toBe(true);
    expect(terminalKey(project.cables[0]!.from)).not.toBe(terminalKey(project.cables[0]!.to));
  });

  it("rejects non-finite component transforms", () => {
    const project = createEmptyProject();
    project.components[0]!.transform.positionMm[0] = Number.POSITIVE_INFINITY;
    const result = validateProjectV2(project);
    expect(result.valid).toBe(false);
    expect(result.errors.some((error) => error.includes("finite numbers"))).toBe(true);
  });

  it("rejects unsupported project versions", () => {
    expect(() => decodeProject({ version: 99 })).toThrow(/Unsupported project version/);
  });
});

describe("version 1 migration", () => {
  it("migrates without mutating and preserves user project data", () => {
    const source = structuredClone(legacyProject);
    const before = JSON.stringify(source);
    const migrated = migrateProjectV1(source);

    expect(JSON.stringify(source)).toBe(before);
    expect(migrated.version).toBe(2);
    expect(migrated.name).toBe(legacyProject.name);
    expect(migrated.modifiedAt).toBe(legacyProject.modifiedAt);
    expect(migrated.measurements).toEqual(legacyProject.measurements);
    expect(migrated.notes).toEqual(legacyProject.notes);
    expect(migrated.components[0]?.id).toBe(MAIN_CONTROLLER_INSTANCE_ID);
    expect(migrated.cables[0]?.from).toEqual({ instanceId: MAIN_CONTROLLER_INSTANCE_ID, terminalId: "pin-12" });
    expect(migrated.cables[0]?.to).toEqual({ instanceId: MAIN_CONTROLLER_INSTANCE_ID, terminalId: "pin-20" });
    expect(migrated.verificationMode).toBe("conceptual");
    expect(migrated.simulation.status).toBe("idle");
  });

  it("keeps the current project when an import fails", () => {
    const current: LabProjectV2 = createEmptyProject();
    current.name = "Keep me";
    const result = tryImportProject({ ...current, components: [], cables: [cable()] }, current);
    expect(result.ok).toBe(false);
    expect(result.project).toBe(current);
    expect(result.project.name).toBe("Keep me");
  });
});
