# Assembly guide

This sequence is for staged receive-only development. It is not a substitute
for a reviewed schematic, PCB layout, battery-safety design or electrical
inspection.

## Before assembly

- Select exact module and breakout revisions and download their datasheets.
- Review [PIN_MAP.md](PIN_MAP.md), [POWER_DESIGN.md](POWER_DESIGN.md) and the
  [interactive explorer](../web-guide/index.html).
- Confirm the ESP32-C5 GPIO2/GPIO3 proposal against the exact board and
  firmware; do not treat it as final.
- Confirm boot-strapping pin pulls, supply/logic voltages, connector polarity,
  antenna bands and regional rules.
- Use ESD precautions and never connect/disconnect RF or power hardware live.

## Staged build

1. Build the protected regulated 5 V input, star point, common ground and
   low-noise 3.3 V RF rail. Verify without sensitive modules.
2. Add the main ESP32 and confirm reliable boot with all CS/CSN outputs high.
3. Add nRF24L01 #1 with 100 nF/10 µF local decoupling and test passive receive
   observation.
4. Add nRF #2, nRF #3 and CC1101 one at a time. Confirm MISO release and
   dedicated selects after each addition.
5. Add ILI9341, then MicroSD. Check breakout voltage, backlight current and
   MISO tri-state behaviour.
6. Add MCP23017 at `0x20`, its reset pull-up, and active-low buttons. Debounce
   inputs before navigating menus.
7. Add BME280, optional MAX17043 and ADS1115. Scan I²C and resolve address or
   pull-up conflicts.
8. Add GPS TX to GPIO36 and verify serial data with the antenna placed away
   from RF/digital noise.
9. Add TEMT6000 to ADS1115 A1. Add the optional buffered WS2812 path only after
   checking GPIO15 boot behaviour and 5 V current.
10. Add ESP32-C5 only after finalising its host protocol and verified pins.
11. Build the 50 Ω 5 GHz antenna/filter/attenuator/AD8318 chain, then verify the
    divider voltage before connecting ADS1115 A0.
12. Add the optional Raspberry Pi/HackRF receive branch last on its independent
    supply.

## Detector calibration

Use authorised laboratory equipment and receive-side conditions only. Record
frequency, known input level, antenna/cable/filter/attenuator losses,
temperature, divider ratio and ADS1115 gain. Fit detector slope and intercept
over the intended range and report uncertainty/limits. Never label an
uncalibrated voltage as absolute RF power.

## Final checks

- No rail exceeds the exact component limit.
- All base modules share ground and RF returns are short.
- GPIO34–39 are used only as inputs.
- Every inactive SPI CS/CSN is high and MISO is released.
- I²C pull-ups terminate at 3.3 V and all addresses are unique.
- The detector divider cannot exceed ADS1115 VDD under worst-case tolerance.
- Antennas, cables and modules suit their intended bands.
- Firmware contains passive observation and receive-only functions only.
