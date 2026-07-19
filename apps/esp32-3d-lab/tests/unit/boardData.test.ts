import { describe, expect, it } from "vitest";
import { esp32DevKit, getPin } from "../../src/data/esp32DevKit";
import { evaluatePin } from "../../src/circuit/electricalRules";

describe("ESP32 board data", () => {
  it("defines 30 unique physical pins", () => {
    expect(esp32DevKit.pins).toHaveLength(30);
    expect(new Set(esp32DevKit.pins.map((pin) => pin.id)).size).toBe(30);
    expect(new Set(esp32DevKit.pins.map((pin) => pin.pinNumber)).size).toBe(30);
  });

  it("records expected default bus capabilities", () => {
    expect(getPin(esp32DevKit, "pin-21")?.capabilities.spi).toBe("VSPI SCK");
    expect(getPin(esp32DevKit, "pin-24")?.capabilities.i2c).toBe("Default SDA");
  });

  it("adds the universal 3.3 V warning for GPIO", () => {
    const pin = getPin(esp32DevKit, "pin-28");
    expect(pin).toBeDefined();
    expect(evaluatePin(pin!).some((result) => result.message.includes("not 5 V tolerant"))).toBe(true);
  });
});
