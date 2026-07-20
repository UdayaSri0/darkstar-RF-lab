import { esp32ComponentDefinition, esp32RuntimeFactory } from "../esp32/esp32Component";
import { ComponentRegistry } from "./ComponentRegistry";

export const componentRegistry = new ComponentRegistry([
  { definition: esp32ComponentDefinition, factory: esp32RuntimeFactory },
]);
