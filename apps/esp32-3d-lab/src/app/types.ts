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

export interface WireConnection {
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

export interface LabProject {
  version: 1;
  name: string;
  boardId: string;
  wires: WireConnection[];
  measurements: Measurement[];
  notes: LabNote[];
  modifiedAt: string;
}

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
  name: string;
  category: string;
  pin?: PinDefinition;
}
