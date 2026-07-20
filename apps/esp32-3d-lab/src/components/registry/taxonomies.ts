export const TERMINAL_CATEGORIES = [
  "power-input",
  "power-output",
  "ground",
  "digital-gpio",
  "analogue",
  "spi",
  "i2c",
  "uart",
  "usb",
  "dupont-header",
  "sma",
  "ufl-ipex",
  "passive-node",
] as const;

export type TerminalCategory = (typeof TERMINAL_CATEGORIES)[number];

export const CONNECTOR_END_TYPES = [
  "female-dupont",
  "male-dupont",
  "header-pin",
  "bare-wire",
  "solder-pad",
  "usb-a",
  "usb-micro-b",
  "usb-c",
  "sma-male",
  "sma-female",
  "ufl-ipex-plug",
  "ufl-ipex-jack",
] as const;

export type ConnectorEndType = (typeof CONNECTOR_END_TYPES)[number];

export type TerminalDirection =
  | "input"
  | "output"
  | "bidirectional"
  | "passive"
  | "power-input"
  | "power-output"
  | "ground";

export type BusType = "power" | "gpio" | "analogue" | "spi" | "i2c" | "uart" | "usb" | "rf" | "passive";
