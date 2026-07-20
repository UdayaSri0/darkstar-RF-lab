export type ToolId =
  | "select"
  | "rotate"
  | "pan"
  | "wire"
  | "measure"
  | "note"
  | "labels"
  | "delete"
  | "undo"
  | "redo"
  | "reset";

export type VisualMode = "realistic" | "functional" | "xray";
export type CameraView = "perspective" | "top" | "front" | "side";
export type RenderQuality = "low" | "medium" | "high";

export interface PinDefinition {
  id: string;
  name: string;
  pinNumber: number;
  gpio: number | null;
  side: "left" | "right";
  functions: string[];
  voltage: string;
  capabilities: {
    input: boolean;
    output: boolean;
    adc?: string;
    dac?: string;
    uart?: string;
    spi?: string;
    i2c?: string;
    touch?: string;
  };
  warnings: string[];
}

export interface BoardDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  dimensionsMm: [number, number, number];
  pins: PinDefinition[];
}

export interface LegacyWireConnection {
  id: string;
  fromPinId: string;
  toPinId: string;
  color: string;
  label: string;
}

export interface Measurement {
  id: string;
  from: [number, number, number];
  to: [number, number, number];
  distanceMm: number;
}

export interface LabNote {
  id: string;
  targetId: string;
  text: string;
  createdAt: string;
}

export interface LabProjectV1 {
  version: 1;
  name: string;
  boardId: string;
  wires: LegacyWireConnection[];
  measurements: Measurement[];
  notes: LabNote[];
  modifiedAt: string;
}

export interface ComponentTransform {
  positionMm: [number, number, number];
  rotationDeg: [number, number, number];
  scale: [number, number, number];
}

export interface ComponentInstance {
  id: string;
  typeId: string;
  variantId: string;
  transform: ComponentTransform;
  locked: boolean;
  groupId?: string;
  userLabel?: string;
  properties: Record<string, unknown>;
}

export interface TerminalRef {
  instanceId: string;
  terminalId: string;
}

export interface CableConnection {
  id: string;
  from: TerminalRef;
  to: TerminalRef;
  cableTypeId: string;
  color: string;
  controlPointsMm: [number, number, number][];
  label?: string;
  bundleId?: string;
}

export interface SimulationState {
  status: "idle" | "running" | "paused";
  elapsedMs: number;
  properties: Record<string, unknown>;
}

export interface LabProjectV2 {
  version: 2;
  name: string;
  verificationMode: "conceptual" | "validated";
  layoutPresetId?: string;
  components: ComponentInstance[];
  cables: CableConnection[];
  measurements: Measurement[];
  notes: LabNote[];
  simulation: SimulationState;
  modifiedAt: string;
}

export type LabProject = LabProjectV2;

export interface LabSettings {
  quality: RenderQuality;
  labelsVisible: boolean;
  gridVisible: boolean;
  reducedMotion: boolean;
}

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
}

export interface SelectionDetails {
  id: string;
  instanceId?: string;
  name: string;
  category: string;
  pin?: PinDefinition;
}
