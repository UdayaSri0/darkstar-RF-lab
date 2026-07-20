# Prompt 10 — Generic CC1101 Receive Module

## Branch

```text
feat/3d-10-cc1101
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Add a generic receive-only CC1101 module with selectable antenna style and documented project connections.

## Implementation requirements

1. Model a generic CC1101 breakout with VCC, GND, SCK, MOSI, MISO, CSN, GDO0 and optional GDO2 terminals.
2. Add antenna variants:
   - SMA connector.
   - Spring antenna.
   - External pigtail.
3. Use project mapping:
   - Shared RF SPI GPIO18/23/19.
   - CSN GPIO27.
   - GDO0 to input-only GPIO34.
4. Power it from the low-noise 3.3 V RF rail.
5. Add 100 nF and 10 µF decoupling positions.
6. Add configured-band metadata without claiming universal frequency coverage.
7. Add mock receive state:
   - Configured centre frequency.
   - Channel.
   - RSSI-like synthetic value.
   - Activity indication.
8. No transmit controls or packet injection features.

## Tests

- Unit tests for mapping and GPIO34 direction.
- E2E placement, wiring and antenna variant test.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The CC1101 participates in the shared RF SPI bus.
- Receive-only limitations are visible.
- Antenna and regional-band uncertainty are recorded.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
