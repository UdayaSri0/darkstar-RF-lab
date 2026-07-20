import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import type { ComponentInstance, VisualMode } from "../../app/types";
import type { ComponentDefinition, ComponentVariantDefinition, RuntimeComponent } from "./types";

export function createPlaceholderRuntime(
  instance: ComponentInstance,
  message: string,
  definition: ComponentDefinition | null = null,
  variant: ComponentVariantDefinition | null = null,
): RuntimeComponent {
  const root = new THREE.Group();
  root.name = `unavailable-${instance.id}`;

  const geometry = new THREE.BoxGeometry(28, 8, 28);
  const material = new THREE.MeshStandardMaterial({
    color: 0x7d1f2b,
    emissive: 0x321018,
    roughness: 0.72,
    transparent: true,
    opacity: 0.82,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 4;
  mesh.name = `Unavailable component ${instance.id}`;
  mesh.userData.selection = {
    id: instance.id,
    name: `Unavailable: ${instance.typeId}`,
    category: "Component load error",
  };
  root.add(mesh);

  const labelNode = document.createElement("span");
  labelNode.className = "ds3d-label ds3d-component-error";
  labelNode.textContent = `Unavailable component: ${instance.typeId} / ${instance.variantId}`;
  labelNode.title = message;
  const label = new CSS2DObject(labelNode);
  label.position.set(0, 11, 0);
  root.add(label);

  return {
    instance: structuredClone(instance),
    definition,
    variant,
    root,
    selectables: [mesh],
    terminalAnchors: new Map(),
    mountingPoints: [],
    boundingBox: new THREE.Box3().setFromObject(root),
    keepOutZones: [],
    labels: [label],
    status: "placeholder",
    issues: [message],
    setVisualMode(mode: VisualMode): void {
      material.wireframe = mode === "functional";
      material.opacity = mode === "xray" ? 0.42 : 0.82;
      material.needsUpdate = true;
    },
    dispose(): void {
      geometry.dispose();
      material.dispose();
      labelNode.remove();
      root.removeFromParent();
    },
  };
}
