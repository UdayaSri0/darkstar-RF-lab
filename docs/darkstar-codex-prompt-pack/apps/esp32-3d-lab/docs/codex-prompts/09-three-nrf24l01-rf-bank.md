# Prompt 09 — Three-Receiver nRF24L01 RF Bank

## Branch

```text
feat/3d-09-nrf24-rf-bank
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Create the reusable three-module 2.4 GHz receiver-bank assembly used by the DarkStar base preset.

## Implementation requirements

1. Instantiate three default PA/LNA nRF24L01 components with stable IDs.
2. Assign:
   - Receiver 1 CE GPIO16, CSN GPIO17.
   - Receiver 2 CE GPIO25, CSN GPIO26.
   - Receiver 3 CE GPIO32, CSN GPIO33.
3. Share RF SPI SCK/MOSI/MISO from GPIO18/GPIO23/GPIO19.
4. Power all three from the low-noise 3.3 V RF rail, not the ESP32 board's normal 3.3 V pin.
5. Add individual 100 nF and 10 µF decoupling placements.
6. Add 100–220 µF bulk capacitance near the bank.
7. Create a reusable component group/preset called `nrf24-three-way-bank`.
8. Place antennas along a baseplate edge with adjustable separation.
9. Add collision and keep-out guidance, not rigid RF-performance claims.
10. Add simulated channel ranges so the three receivers may display different scan segments.

## Tests

- Unit tests for stable instance IDs and connection map.
- Validation test proving three separate CSN/CE lines and shared SPI lines.
- E2E test loading and deleting the group as one action.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The bank loads as three distinguishable instances.
- Wires never confuse identical terminal IDs across modules.
- Shared-bus and dedicated-control wiring matches the documented allocation.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
