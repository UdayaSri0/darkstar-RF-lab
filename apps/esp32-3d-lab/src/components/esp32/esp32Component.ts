import * as THREE from "three";
import type { PinDefinition } from "../../app/types";
import { createEsp32Board } from "../../boards/createEsp32Board";
import { esp32DevKit } from "../../data/esp32DevKit";
import type {
  BusType,
  ComponentDefinition,
  ComponentRuntimeFactory,
  EvidenceMetadata,
  RuntimeComponent,
  TerminalCategory,
  TerminalDefinition,
  TerminalDirection,
} from "../registry";

export const ESP32_COMPONENT_TYPE_ID = "esp32-devkit";
export const ESP32_LEGACY_VARIANT_ID = esp32DevKit.id;

const boardEvidence: EvidenceMetadata = {
  state: "exact-part-unverified",
  summary: "Generic procedural representation of a common 30-pin ESP32 DevKit; dimensions and labels require revision-specific confirmation.",
  sources: [],
};

function terminalCategories(pin: PinDefinition): TerminalCategory[] {
  const categories = new Set<TerminalCategory>(["dupont-header"]);
  if (pin.name === "GND") categories.add("ground");
  else if (pin.name === "VIN") categories.add("power-input");
  else if (pin.name === "3V3") categories.add("power-output");
  else categories.add("digital-gpio");
  if (pin.capabilities.adc || pin.capabilities.dac) categories.add("analogue");
  if (pin.capabilities.spi) categories.add("spi");
  if (pin.capabilities.i2c) categories.add("i2c");
  if (pin.capabilities.uart) categories.add("uart");
  return [...categories];
}

function terminalDirection(pin: PinDefinition): TerminalDirection {
  if (pin.name === "GND") return "ground";
  if (pin.name === "VIN") return "power-input";
  if (pin.name === "3V3") return "power-output";
  if (pin.capabilities.input && pin.capabilities.output) return "bidirectional";
  return pin.capabilities.output ? "output" : "input";
}

function terminalBus(pin: PinDefinition): { type: BusType; role: string; shared: boolean } {
  if (pin.name === "GND" || pin.name === "VIN" || pin.name === "3V3") {
    return { type: "power", role: pin.name.toLowerCase(), shared: true };
  }
  if (pin.capabilities.spi) return { type: "spi", role: pin.capabilities.spi, shared: true };
  if (pin.capabilities.i2c) return { type: "i2c", role: pin.capabilities.i2c, shared: true };
  if (pin.capabilities.uart) return { type: "uart", role: pin.capabilities.uart, shared: false };
  if (pin.capabilities.adc || pin.capabilities.dac) {
    return { type: "analogue", role: pin.capabilities.adc ?? pin.capabilities.dac ?? "analogue", shared: false };
  }
  return { type: "gpio", role: pin.gpio === null ? pin.name : `GPIO ${pin.gpio}`, shared: false };
}

function pinTerminal(pin: PinDefinition): TerminalDefinition {
  const nominalVolts = pin.name === "GND" ? 0 : pin.name === "VIN" ? 5 : 3.3;
  return {
    id: pin.id,
    displayName: pin.name,
    categories: terminalCategories(pin),
    direction: terminalDirection(pin),
    nominalVoltageDomain: {
      id: pin.name === "GND" ? "ground" : pin.name === "VIN" ? "5v-input" : "3v3-logic",
      nominalVolts,
      description: pin.voltage,
    },
    allowedCableEnds: ["female-dupont"],
    bus: terminalBus(pin),
    signalAliases: [...new Set([pin.name, ...(pin.gpio === null ? [] : [`GPIO${pin.gpio}`]), ...pin.functions])],
    evidenceState: boardEvidence.state,
  };
}

export const esp32ComponentDefinition: ComponentDefinition = {
  typeId: ESP32_COMPONENT_TYPE_ID,
  displayName: esp32DevKit.name,
  category: esp32DevKit.category,
  variants: [{
    variantId: ESP32_LEGACY_VARIANT_ID,
    displayName: esp32DevKit.name,
    description: esp32DevKit.description,
    dimensionsMm: esp32DevKit.dimensionsMm,
    asset: { kind: "procedural" },
    evidence: boardEvidence,
  }],
  terminals: [
    ...esp32DevKit.pins.map(pinTerminal),
    {
      id: "usb-micro-b",
      displayName: "Micro USB connector",
      categories: ["usb", "power-input"],
      direction: "bidirectional",
      nominalVoltageDomain: {
        id: "usb-5v",
        nominalVolts: 5,
        description: "USB 5 V power with USB 2.0 data signalling.",
      },
      allowedCableEnds: ["usb-micro-b"],
      bus: { type: "usb", role: "power-and-programming", shared: false },
      signalAliases: ["USB", "VBUS", "D+", "D-"],
      evidenceState: boardEvidence.state,
    },
  ],
  mounting: {
    methods: ["breadboard", "standoff"],
    points: [],
    clearanceMm: 2,
    notes: ["Mounting-hole positions are not claimed for this generic board revision."],
  },
  keepOutZones: [{
    id: "pcb-antenna-zone",
    centreMm: [0, 2.5, -19],
    sizeMm: [18, 6, 8],
    reason: "Keep conductive material away from the onboard PCB antenna region.",
  }],
  evidence: boardEvidence,
};

function disposeMaterial(material: THREE.Material | THREE.Material[]): void {
  if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
  else material.dispose();
}

export const esp32RuntimeFactory: ComponentRuntimeFactory = {
  create({ instance, definition, variant }): RuntimeComponent {
    const board = createEsp32Board(esp32DevKit);
    board.group.name = instance.id;
    board.group.userData.componentTypeId = definition.typeId;
    const terminalAnchors = new Map([...board.pinPositions.entries()].map(([id, point]) => [id, point.clone()]));
    terminalAnchors.set("usb-micro-b", new THREE.Vector3(0, 3.2, 27));
    board.group.updateMatrixWorld(true);

    return {
      instance: structuredClone(instance),
      definition,
      variant,
      root: board.group,
      selectables: board.selectables,
      terminalAnchors,
      mountingPoints: definition.mounting.points.map((point) => new THREE.Vector3(...point.positionMm)),
      boundingBox: new THREE.Box3().setFromObject(board.group),
      keepOutZones: definition.keepOutZones,
      labels: board.labels,
      status: "ready",
      issues: [],
      setVisualMode: board.setVisualMode,
      dispose(): void {
        board.group.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            disposeMaterial(child.material);
          }
        });
        board.labels.forEach((label) => label.element.remove());
        board.group.removeFromParent();
      },
    };
  },
};
