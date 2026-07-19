import type { BoardDefinition, PinDefinition } from "../app/types";

type PinSeed = [number, string, number | null, string[], Partial<PinDefinition["capabilities"]>, string[]?];

const leftPins: PinSeed[] = [
  [1, "3V3", null, ["3.3 V supply"], { output: true }, ["Maximum current depends on the development board regulator."]],
  [2, "EN", null, ["Chip enable", "Reset"], { input: true }, ["Pulling low resets the ESP32."]],
  [3, "GPIO36 / VP", 36, ["ADC1_CH0", "SENSOR_VP"], { input: true, adc: "ADC1_CH0" }],
  [4, "GPIO39 / VN", 39, ["ADC1_CH3", "SENSOR_VN"], { input: true, adc: "ADC1_CH3" }],
  [5, "GPIO34", 34, ["ADC1_CH6"], { input: true, adc: "ADC1_CH6" }],
  [6, "GPIO35", 35, ["ADC1_CH7"], { input: true, adc: "ADC1_CH7" }],
  [7, "GPIO32", 32, ["ADC1_CH4", "TOUCH9", "XTAL_32K_P"], { input: true, output: true, adc: "ADC1_CH4", touch: "Touch 9" }],
  [8, "GPIO33", 33, ["ADC1_CH5", "TOUCH8", "XTAL_32K_N"], { input: true, output: true, adc: "ADC1_CH5", touch: "Touch 8" }],
  [9, "GPIO25", 25, ["ADC2_CH8", "DAC1"], { input: true, output: true, adc: "ADC2_CH8", dac: "DAC channel 1" }],
  [10, "GPIO26", 26, ["ADC2_CH9", "DAC2"], { input: true, output: true, adc: "ADC2_CH9", dac: "DAC channel 2" }],
  [11, "GPIO27", 27, ["ADC2_CH7", "TOUCH7"], { input: true, output: true, adc: "ADC2_CH7", touch: "Touch 7" }],
  [12, "GPIO14", 14, ["ADC2_CH6", "HSPI_CLK", "TOUCH6"], { input: true, output: true, adc: "ADC2_CH6", spi: "HSPI SCK", touch: "Touch 6" }],
  [13, "GPIO12", 12, ["ADC2_CH5", "HSPI_MISO", "TOUCH5"], { input: true, output: true, adc: "ADC2_CH5", spi: "HSPI MISO", touch: "Touch 5" }, ["Strapping pin; its level at reset affects flash voltage."]],
  [14, "GND", null, ["Ground"], { input: true }],
  [15, "GPIO13", 13, ["ADC2_CH4", "HSPI_MOSI", "TOUCH4"], { input: true, output: true, adc: "ADC2_CH4", spi: "HSPI MOSI", touch: "Touch 4" }],
];

const rightPins: PinSeed[] = [
  [30, "VIN", null, ["5 V input"], { input: true }, ["Never apply 5 V directly to a GPIO."]],
  [29, "GND", null, ["Ground"], { input: true }],
  [28, "GPIO23", 23, ["VSPI_MOSI"], { input: true, output: true, spi: "VSPI MOSI" }],
  [27, "GPIO22", 22, ["I2C_SCL", "VSPI_WP"], { input: true, output: true, i2c: "Default SCL" }],
  [26, "GPIO1 / TX0", 1, ["UART0_TX"], { input: true, output: true, uart: "UART0 TX" }, ["Used by USB serial programming and boot logs."]],
  [25, "GPIO3 / RX0", 3, ["UART0_RX"], { input: true, output: true, uart: "UART0 RX" }, ["Used by USB serial programming."]],
  [24, "GPIO21", 21, ["I2C_SDA"], { input: true, output: true, i2c: "Default SDA" }],
  [23, "GND", null, ["Ground"], { input: true }],
  [22, "GPIO19", 19, ["VSPI_MISO"], { input: true, output: true, spi: "VSPI MISO" }],
  [21, "GPIO18", 18, ["VSPI_CLK"], { input: true, output: true, spi: "VSPI SCK" }],
  [20, "GPIO5", 5, ["VSPI_CS0"], { input: true, output: true, spi: "VSPI CS" }, ["Strapping pin; avoid forcing the wrong level during reset."]],
  [19, "GPIO17", 17, ["UART2_TX"], { input: true, output: true, uart: "UART2 TX" }],
  [18, "GPIO16", 16, ["UART2_RX"], { input: true, output: true, uart: "UART2 RX" }],
  [17, "GPIO4", 4, ["ADC2_CH0", "TOUCH0"], { input: true, output: true, adc: "ADC2_CH0", touch: "Touch 0" }, ["Strapping pin; respect boot-time logic levels."]],
  [16, "GPIO2", 2, ["ADC2_CH2", "TOUCH2"], { input: true, output: true, adc: "ADC2_CH2", touch: "Touch 2" }, ["Strapping pin; often connected to an onboard LED."]],
];

function makePins(seeds: PinSeed[], side: "left" | "right"): PinDefinition[] {
  return seeds.map(([pinNumber, name, gpio, functions, capabilities, warnings = []]) => ({
    id: `pin-${pinNumber}`,
    name,
    pinNumber,
    gpio,
    side,
    functions,
    voltage: name === "VIN" ? "5 V input" : name === "GND" ? "0 V" : "3.3 V logic (not 5 V tolerant)",
    capabilities: {
      input: capabilities.input ?? false,
      output: capabilities.output ?? false,
      adc: capabilities.adc,
      dac: capabilities.dac,
      uart: capabilities.uart,
      spi: capabilities.spi,
      i2c: capabilities.i2c,
      touch: capabilities.touch,
    },
    warnings,
  }));
}

export const esp32DevKit: BoardDefinition = {
  id: "esp32-devkit-v1-30p",
  name: "ESP32 DevKit V1 (30 pin)",
  category: "Microcontroller development board",
  description: "Procedural educational model of an ESP32-WROOM-32 development board. Verify labels against your exact board revision before wiring.",
  dimensionsMm: [28, 52, 8],
  pins: [...makePins(leftPins, "left"), ...makePins(rightPins, "right")],
};

export const boards: BoardDefinition[] = [esp32DevKit];

export function getPin(board: BoardDefinition, id: string): PinDefinition | undefined {
  return board.pins.find((pin) => pin.id === id);
}
