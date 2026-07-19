import type { PinDefinition } from "../app/types";

export interface ElectricalRuleResult {
  severity: "info" | "warning";
  message: string;
}

export function evaluatePin(pin: PinDefinition): ElectricalRuleResult[] {
  const results: ElectricalRuleResult[] = pin.warnings.map((message) => ({ severity: "warning", message }));
  if (pin.gpio !== null) {
    results.push({ severity: "info", message: "ESP32 GPIO is 3.3 V logic and is not 5 V tolerant." });
  }
  if (pin.capabilities.adc?.startsWith("ADC2")) {
    results.push({ severity: "info", message: "Classic ESP32 ADC2 access can conflict with Wi-Fi operation." });
  }
  return results;
}
