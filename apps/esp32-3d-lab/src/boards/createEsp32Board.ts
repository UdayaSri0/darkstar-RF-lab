import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import type { BoardDefinition, SelectionDetails } from "../app/types";

export interface BoardModel {
  group: THREE.Group;
  selectables: THREE.Object3D[];
  pinPositions: Map<string, THREE.Vector3>;
  labels: CSS2DObject[];
  setVisualMode: (mode: "realistic" | "functional" | "xray") => void;
}

const materials = {
  pcb: new THREE.MeshStandardMaterial({ color: 0x0b5448, roughness: 0.6, metalness: 0.08 }),
  pcbEdge: new THREE.MeshStandardMaterial({ color: 0x06342e, roughness: 0.75 }),
  metal: new THREE.MeshStandardMaterial({ color: 0xaeb8bd, roughness: 0.28, metalness: 0.84 }),
  darkMetal: new THREE.MeshStandardMaterial({ color: 0x26313a, roughness: 0.4, metalness: 0.55 }),
  chip: new THREE.MeshStandardMaterial({ color: 0x16191c, roughness: 0.75, metalness: 0.15 }),
  gold: new THREE.MeshStandardMaterial({ color: 0xd5a83c, roughness: 0.24, metalness: 0.68 }),
  silk: new THREE.MeshStandardMaterial({ color: 0xe7e3cf, roughness: 0.8 }),
};

function box(
  dimensions: [number, number, number],
  material: THREE.Material,
  position: [number, number, number],
  name: string,
): THREE.Mesh {
  // Each selectable mesh owns its material so selection emissive state never
  // leaks to every pin or component that shares the same visual preset.
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...dimensions), material.clone());
  mesh.position.set(...position);
  mesh.name = name;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function labelFor(text: string, kind: "pin" | "component" = "component"): CSS2DObject {
  const node = document.createElement("span");
  node.className = `ds3d-label ds3d-label--${kind}`;
  node.textContent = text;
  const label = new CSS2DObject(node);
  label.name = `label-${text}`;
  return label;
}

function markSelectable(object: THREE.Object3D, details: SelectionDetails): void {
  object.userData.selection = details;
}

export function createEsp32Board(board: BoardDefinition): BoardModel {
  const group = new THREE.Group();
  group.name = board.id;
  const selectables: THREE.Object3D[] = [];
  const pinPositions = new Map<string, THREE.Vector3>();
  const labels: CSS2DObject[] = [];

  const pcb = box([28, 1.6, 52], materials.pcb, [0, 1.6, 0], "ESP32 DevKit PCB");
  markSelectable(pcb, { id: board.id, name: board.name, category: board.category });
  group.add(pcb);
  selectables.push(pcb);

  const moduleShield = box([18, 2.4, 25], materials.metal, [0, 3.6, -6.2], "ESP32-WROOM-32 RF shield");
  markSelectable(moduleShield, { id: "esp32-wroom", name: "ESP32-WROOM-32", category: "Wireless MCU module" });
  group.add(moduleShield);
  selectables.push(moduleShield);

  const shieldLabel = labelFor("ESP32-WROOM-32");
  shieldLabel.position.set(0, 5.2, -6.2);
  group.add(shieldLabel);
  labels.push(shieldLabel);

  const antenna = box([15.5, 0.25, 5.8], materials.gold, [0, 2.56, -18.6], "PCB antenna");
  markSelectable(antenna, { id: "antenna", name: "2.4 GHz PCB antenna", category: "RF antenna" });
  group.add(antenna);
  selectables.push(antenna);

  for (let i = 0; i < 5; i += 1) {
    const slot = box([12.5 - i * 1.35, 0.08, 0.5], materials.pcbEdge, [0, 2.74, -20.4 + i * 1.1], `Antenna keepout ${i + 1}`);
    group.add(slot);
  }

  const usb = box([9, 3.4, 7], materials.metal, [0, 3.2, 23.5], "Micro USB connector");
  markSelectable(usb, { id: "usb", name: "Micro USB connector", category: "Power and programming" });
  group.add(usb);
  selectables.push(usb);

  const regulator = box([4.5, 1.2, 5.5], materials.chip, [7, 3.15, 13], "3.3 V regulator");
  markSelectable(regulator, { id: "regulator", name: "3.3 V regulator", category: "Power management" });
  group.add(regulator);
  selectables.push(regulator);

  const uart = box([5.5, 1.1, 5.5], materials.chip, [-6, 3.1, 13.5], "USB UART bridge");
  markSelectable(uart, { id: "uart-bridge", name: "USB-to-UART bridge", category: "Programming interface" });
  group.add(uart);
  selectables.push(uart);

  for (const [index, pin] of board.pins.entries()) {
    const sameSideIndex = board.pins.filter((candidate) => candidate.side === pin.side).findIndex((candidate) => candidate.id === pin.id);
    const count = board.pins.filter((candidate) => candidate.side === pin.side).length;
    const z = -20.3 + (sameSideIndex * 40.6) / (count - 1);
    const x = pin.side === "left" ? -12.2 : 12.2;
    const header = box([2.4, 2.2, 2.1], materials.darkMetal, [x, 3.1, z], `${pin.name} header`);
    const contact = box([0.85, 3.3, 0.85], materials.gold, [x, 4.6, z], `${pin.name} contact`);
    const details: SelectionDetails = { id: pin.id, name: pin.name, category: "Header pin", pin };
    markSelectable(header, details);
    markSelectable(contact, details);
    group.add(header, contact);
    selectables.push(header, contact);
    pinPositions.set(pin.id, new THREE.Vector3(x, 6.5, z));

    const pinLabel = labelFor(pin.gpio === null ? pin.name : `GPIO ${pin.gpio}`, "pin");
    pinLabel.position.set(pin.side === "left" ? -15.6 : 15.6, 6.8, z);
    group.add(pinLabel);
    labels.push(pinLabel);

    if (index % 3 === 0) {
      const via = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.12, 12), materials.silk.clone());
      via.position.set(pin.side === "left" ? -9.8 : 9.8, 2.5, z);
      group.add(via);
    }
  }

  const componentLabel = labelFor("ESP32 DevKit V1");
  componentLabel.position.set(0, 5.5, 8);
  group.add(componentLabel);
  labels.push(componentLabel);

  const baseMaterials = new Map<THREE.Material, { transparent: boolean; opacity: number; wireframe: boolean }>();
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const material = child.material as THREE.MeshStandardMaterial;
      if (!baseMaterials.has(material)) {
        baseMaterials.set(material, { transparent: material.transparent, opacity: material.opacity, wireframe: material.wireframe });
      }
    }
  });

  function setVisualMode(mode: "realistic" | "functional" | "xray"): void {
    baseMaterials.forEach((base, material) => {
      const standard = material as THREE.MeshStandardMaterial;
      standard.transparent = mode === "xray" ? true : base.transparent;
      standard.opacity = mode === "xray" ? 0.42 : base.opacity;
      standard.wireframe = mode === "functional";
      standard.needsUpdate = true;
    });
  }

  return { group, selectables, pinPositions, labels, setVisualMode };
}
