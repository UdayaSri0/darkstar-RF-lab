// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { createEmptyProject } from "../../src/app/ProjectStore";
import { esp32ComponentDefinition, esp32RuntimeFactory } from "../../src/components/esp32/esp32Component";
import {
  CONNECTOR_END_TYPES,
  TERMINAL_CATEGORIES,
  ComponentRegistry,
  componentRegistry,
  resolveLocalAssetUrl,
} from "../../src/components/registry";
import type { ComponentDefinition } from "../../src/components/registry";

describe("component registry", () => {
  it("contains unique component, variant and terminal IDs", () => {
    const definitions = componentRegistry.listDefinitions();
    expect(new Set(definitions.map((definition) => definition.typeId)).size).toBe(definitions.length);
    definitions.forEach((definition) => {
      expect(new Set(definition.variants.map((variant) => variant.variantId)).size).toBe(definition.variants.length);
      expect(new Set(definition.terminals.map((terminal) => terminal.id)).size).toBe(definition.terminals.length);
    });
  });

  it("defines the required terminal and connector taxonomies", () => {
    expect(TERMINAL_CATEGORIES).toEqual(expect.arrayContaining([
      "power-input", "power-output", "ground", "digital-gpio", "analogue", "spi", "i2c", "uart",
      "usb", "dupont-header", "sma", "ufl-ipex", "passive-node",
    ]));
    expect(CONNECTOR_END_TYPES).toEqual(expect.arrayContaining([
      "female-dupont", "male-dupont", "header-pin", "sma-male", "sma-female", "ufl-ipex-plug", "ufl-ipex-jack",
    ]));
  });

  it("exposes complete terminal metadata for the ESP32 definition", () => {
    const definition = componentRegistry.getDefinition("esp32-devkit");
    expect(definition).toBeDefined();
    expect(definition?.evidence.state).toBe("exact-part-unverified");
    definition?.terminals.forEach((terminal) => {
      expect(terminal.direction).toBeTruthy();
      expect(terminal.nominalVoltageDomain.description).toBeTruthy();
      expect(terminal.allowedCableEnds.length).toBeGreaterThan(0);
      expect(terminal.bus.type).toBeTruthy();
      expect(terminal.signalAliases.length).toBeGreaterThan(0);
      expect(terminal.evidenceState).toBeTruthy();
    });
  });

  it("resolves definitions, variants, terminals and categories", () => {
    const instance = createEmptyProject().components[0]!;
    expect(componentRegistry.getDefinition(instance.typeId)?.typeId).toBe("esp32-devkit");
    expect(componentRegistry.getVariant(instance.typeId, instance.variantId)?.variantId).toBe(instance.variantId);
    expect(componentRegistry.getTerminal(instance, "pin-21")?.bus.type).toBe("spi");
    expect(componentRegistry.listByCategory("Microcontroller development board")).toHaveLength(1);
  });

  it("creates an ESP32 through the shared runtime contract", () => {
    const instance = createEmptyProject().components[0]!;
    const runtime = componentRegistry.createRuntime(instance);
    expect(runtime.status).toBe("ready");
    expect(runtime.root.name).toBe(instance.id);
    expect(runtime.selectables.length).toBeGreaterThan(30);
    expect(runtime.terminalAnchors.has("pin-21")).toBe(true);
    expect(runtime.boundingBox.isEmpty()).toBe(false);
    expect(runtime.keepOutZones).toHaveLength(1);
    expect(runtime.labels.length).toBeGreaterThan(0);
    runtime.dispose();
  });

  it("returns visible placeholders for unknown types and missing variants", () => {
    const instance = createEmptyProject().components[0]!;
    const unknown = componentRegistry.createRuntime({ ...instance, id: "unknown", typeId: "missing-component" });
    const missingVariant = componentRegistry.createRuntime({ ...instance, id: "missing-variant", variantId: "missing" });
    expect(unknown.status).toBe("placeholder");
    expect(unknown.issues[0]).toMatch(/Unknown component type/);
    expect(missingVariant.status).toBe("placeholder");
    expect(missingVariant.issues[0]).toMatch(/Unknown variant/);
    expect(componentRegistry.getTerminal({ ...instance, variantId: "missing" }, "pin-21")).toBeUndefined();
    unknown.dispose();
    missingVariant.dispose();
  });

  it("rejects duplicate registrations and duplicate definition-local IDs", () => {
    const duplicateTypes = new ComponentRegistry();
    duplicateTypes.register(esp32ComponentDefinition, esp32RuntimeFactory);
    expect(() => duplicateTypes.register(esp32ComponentDefinition, esp32RuntimeFactory)).toThrow(/Duplicate component type ID/);

    const duplicateTerminalDefinition: ComponentDefinition = {
      ...esp32ComponentDefinition,
      typeId: "duplicate-terminal-test",
      terminals: [...esp32ComponentDefinition.terminals, { ...esp32ComponentDefinition.terminals[0]! }],
    };
    expect(() => new ComponentRegistry().register(duplicateTerminalDefinition, esp32RuntimeFactory)).toThrow(/Duplicate terminal/);

    const duplicateVariantDefinition: ComponentDefinition = {
      ...esp32ComponentDefinition,
      typeId: "duplicate-variant-test",
      variants: [...esp32ComponentDefinition.variants, { ...esp32ComponentDefinition.variants[0]! }],
    };
    expect(() => new ComponentRegistry().register(duplicateVariantDefinition, esp32RuntimeFactory)).toThrow(/Duplicate variant/);
  });

  it("keeps GLB paths local and resolves them under the Vite base", () => {
    expect(resolveLocalAssetUrl("models/example.glb", "/esp32-3d-lab/")).toBe("/esp32-3d-lab/models/example.glb");
    expect(() => resolveLocalAssetUrl("https://example.com/model.glb")).toThrow(/local and base-relative/);
  });
});
