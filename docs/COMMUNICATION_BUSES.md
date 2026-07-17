# Communication buses and signals

This page explains the design's electrical relationships. The interactive
[component explorer](../web-guide/index.html) can highlight each bus and every
participating component.

## RF SPI

The main ESP32 is the controller. GPIO18 (`SCK`), GPIO23 (`MOSI`) and GPIO19
(`MISO`) are shared by all three nRF24L01 modules and the CC1101. Each module
has a dedicated active-low chip select, which idles high. An inactive
peripheral must make MISO high impedance so another peripheral can answer.

Each nRF24L01 also has a dedicated `CE`. CE changes the radio operating state;
it is not the SPI chip select. The CC1101's `GDO0` is a dedicated interrupt or
data-ready output into input-only ESP32 GPIO34.

## UI SPI

GPIO14 (`SCK`), GPIO13 (`MOSI`) and input-only GPIO35 (`MISO`) are shared by
the ILI9341 and MicroSD. The display uses GPIO4 CS; the card uses GPIO5 CS.
Only one may be selected. Some MicroSD level-shifter breakouts do not release
MISO when CS is high and therefore cannot share this bus reliably.

The TFT also has GPIO2 D/C and MCP23017 GPA5 reset. Breakout supply-voltage,
logic-level and backlight-current requirements must be checked separately.

## I²C

I²C is a shared, addressed, two-wire bus:

- GPIO21 is bidirectional `SDA`.
- GPIO22 is `SCL`.
- Both lines require pull-ups to 3.3 V, approximately 4.7 kΩ as a starting
  value when modules do not already provide suitable pull-ups.
- All devices need a unique address and common ground.

The planned devices are MCP23017 (`0x20` by the shown address straps), BME280
(`0x76` or `0x77`), MAX17043, ADS1115, and a conceptual ESP32-C5 host link.
Scan and verify the actual bus before enabling drivers. The C5 GPIO2/GPIO3
mapping is not final until checked against the exact DevKit revision and
firmware.

## UART

UART connects a transmitter to a receiver and both ends must agree on baud,
data bits, parity and stop bits. NEO-6M TX connects to ESP32 GPIO36 RX. Normal
receive-only GPS tagging needs no ESP32-to-GPS transmit line. Common ground is
still required.

## ADC and analogue signals

The ADS1115 converts voltage into a numeric sample and reports it over I²C.
A0 measures the divided AD8318 detector output and A1 measures TEMT6000
ambient-light voltage. Inputs must stay between ground and the ADS1115 supply,
independent of the selected programmable-gain range.

The detector reading becomes meaningful only after applying the measured
divider ratio, ADC gain, AD8318 slope/intercept, filter insertion loss,
attenuator loss, cable loss and frequency-dependent calibration.

## GPIO

GPIO signals may be outputs, inputs or interrupt inputs. The five buttons are
active-low: MCP23017 pull-ups hold them high and a press connects them to
ground. Chip selects are also active-low but are driven outputs. GPIO34–39 on
the main ESP32 are input-only. Boot-strapping pins must not be forced to the
wrong level during reset.

## Power and ground

Power is not a communication bus. Supply voltage, logic voltage and current
capacity are different properties. The system uses protected 5 V distribution,
a low-noise 3.3 V RF regulator, local decoupling and a common ground reference.
See [POWER_DESIGN.md](POWER_DESIGN.md).

