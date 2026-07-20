# Prompt 25 — One-Click Complete DarkStar Base Circuit and Layout Presets

## Branch

```text
feat/3d-25-full-project-presets
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Add one-click creation of the documented base system and three arrangement presets.

## Implementation requirements

1. Add a prominent action:
   `Load Complete DarkStar RF Lab`.
2. The default preset must include:
   - ESP32-WROOM-32U generic development board.
   - External antenna pigtail and antenna.
   - Three PA/LNA nRF24L01 modules and antennas.
   - CC1101 and antenna.
   - ILI9341.
   - MicroSD.
   - MCP23017 and five buttons.
   - ADS1115.
   - BME280.
   - NEO-6M and antenna.
   - TEMT6000.
   - ESP32-C5.
   - 5 GHz antenna, filter, attenuator, AD8318 and divider.
   - USB power bank, fuse, reverse protection, switch, power LED, 5 V star distribution and 3.3 V RF regulator.
   - Required decoupling and RF bulk capacitance.
3. Keep MAX17043 and 74AHCT125/WS2812B available but unplaced by default.
4. Keep Raspberry Pi and HackRF completely outside the base preset.
5. Create three presets on the 300 × 220 mm plate:
   - Functional zones.
   - Bus-oriented.
   - Signal-flow.
6. Functional zones should reserve:
   - Power.
   - Main controller.
   - RF receiver bank.
   - UI/storage.
   - Sensors.
   - 5 GHz receive path.
7. Keep antennas at suitable plate edges and expose keep-out zones.
8. Build the documented conceptual wiring:
   - RF SPI and dedicated control lines.
   - UI SPI and TFT/SD controls.
   - I²C bus.
   - GPS TX.
   - AD8318 divider to ADS1115 A0.
   - TEMT6000 to ADS1115 A1.
   - Protected power branches and common ground.
9. Show a confirmation summary before replacing a non-empty project.
10. After loading, run validation and show:
    `Conceptual wiring — not hardware validated.`
11. Add preset reset/reapply without losing user notes unless explicitly confirmed.

## Tests

- Unit tests for component counts, stable IDs and required connections.
- Snapshot-like schema test for the preset.
- Validation test confirming no known deliberate direct short.
- E2E test loading each layout and switching among them.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- One action creates the complete base system.
- All three layout modes contain the same electrical graph.
- Optional parts remain excluded as specified.
- The project is clearly conceptual.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
