import type * as THREE from "three";
import type { ComponentInstance, SelectionDetails, VisualMode } from "../../app/types";
import type { BusType, ConnectorEndType, TerminalCategory, TerminalDirection } from "./taxonomies";

export type EvidenceState =
  | "generic-concept"
  | "documented-allocation"
  | "exact-part-unverified"
  | "hardware-validated";

export interface EvidenceSource {
  title: string;
  revision?: string;
  url?: string;
  accessedAt?: string;
}

export interface EvidenceMetadata {
  state: EvidenceState;
  summary: string;
  sources: EvidenceSource[];
}

export interface NominalVoltageDomain {
  id: string;
  nominalVolts: number | null;
  minimumVolts?: number;
  maximumVolts?: number;
  description: string;
}

export interface TerminalBusMetadata {
  type: BusType;
  role: string;
  busId?: string;
  shared: boolean;
}

export interface TerminalDefinition {
  id: string;
  displayName: string;
  categories: TerminalCategory[];
  direction: TerminalDirection;
  nominalVoltageDomain: NominalVoltageDomain;
  allowedCableEnds: ConnectorEndType[];
  bus: TerminalBusMetadata;
  signalAliases: string[];
  evidenceState: EvidenceState;
}

export type ComponentAsset =
  | { kind: "procedural" }
  | { kind: "glb"; path: string };

export interface ComponentVariantDefinition {
  variantId: string;
  displayName: string;
  description: string;
  dimensionsMm: [number, number, number];
  asset: ComponentAsset;
  evidence: EvidenceMetadata;
}

export interface MountingPointDefinition {
  id: string;
  positionMm: [number, number, number];
  diameterMm?: number;
}

export interface MountingDefinition {
  methods: Array<"none" | "breadboard" | "standoff" | "adhesive" | "panel">;
  points: MountingPointDefinition[];
  clearanceMm: number;
  notes: string[];
}

export interface KeepOutZoneDefinition {
  id: string;
  centreMm: [number, number, number];
  sizeMm: [number, number, number];
  reason: string;
}

export interface ComponentDefinition {
  typeId: string;
  displayName: string;
  category: string;
  variants: ComponentVariantDefinition[];
  terminals: TerminalDefinition[];
  mounting: MountingDefinition;
  keepOutZones: KeepOutZoneDefinition[];
  evidence: EvidenceMetadata;
}

export interface ComponentSimulationAdapter {
  apply(state: Record<string, unknown>): void;
  dispose(): void;
}

export type RuntimeStatus = "ready" | "placeholder";

export interface RuntimeComponent {
  instance: ComponentInstance;
  definition: ComponentDefinition | null;
  variant: ComponentVariantDefinition | null;
  root: THREE.Group;
  selectables: THREE.Object3D[];
  terminalAnchors: Map<string, THREE.Vector3>;
  mountingPoints: THREE.Vector3[];
  boundingBox: THREE.Box3;
  keepOutZones: KeepOutZoneDefinition[];
  labels: THREE.Object3D[];
  status: RuntimeStatus;
  issues: string[];
  setVisualMode(mode: VisualMode): void;
  dispose(): void;
  simulationAdapter?: ComponentSimulationAdapter;
}

export interface ComponentRuntimeContext {
  instance: ComponentInstance;
  definition: ComponentDefinition;
  variant: ComponentVariantDefinition;
}

export interface ComponentRuntimeFactory {
  create(context: ComponentRuntimeContext): RuntimeComponent;
}

export interface ComponentRegistration {
  definition: ComponentDefinition;
  factory: ComponentRuntimeFactory;
}

export interface RuntimeSelection extends SelectionDetails {
  instanceId: string;
}
