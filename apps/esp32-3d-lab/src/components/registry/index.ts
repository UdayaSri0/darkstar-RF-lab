export { ComponentRegistry } from "./ComponentRegistry";
export { componentRegistry } from "./defaultRegistry";
export { CONNECTOR_END_TYPES, TERMINAL_CATEGORIES } from "./taxonomies";
export type { BusType, ConnectorEndType, TerminalCategory, TerminalDirection } from "./taxonomies";
export type {
  ComponentDefinition,
  ComponentRegistration,
  ComponentRuntimeContext,
  ComponentRuntimeFactory,
  ComponentVariantDefinition,
  EvidenceMetadata,
  EvidenceState,
  KeepOutZoneDefinition,
  MountingDefinition,
  RuntimeComponent,
  TerminalDefinition,
} from "./types";
export { assertLocalAssetPath, resolveLocalAssetUrl, resolveVariant } from "./variantResolver";
