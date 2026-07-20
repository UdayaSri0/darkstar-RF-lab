# Prompt 08 — nRF24L01 Receiver Variants

## Branch

```text
feat/3d-08-nrf24l01-variants
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Create reusable generic nRF24L01 receiver components with PA/LNA SMA and compact PCB-antenna variants.

## Implementation requirements

1. Add one component type with two variants:
   - Default `pa-lna-sma`.
   - Alternate `compact-pcb-antenna`.
2. Model GND, VCC, CE, CSN, SCK, MOSI, MISO and IRQ terminals.
3. Mark the logic and supply expectations as exact-part dependent where marketplace breakouts vary.
4. Model:
   - PCB.
   - 2×4 header.
   - RF shield/amplifier section for PA/LNA.
   - SMA connector and detachable antenna for PA/LNA.
   - Printed antenna and keep-out area for compact variant.
5. Add local-decoupling attachment points for 100 nF and 10 µF components.
6. Add antenna keep-outs, orientation arrow and minimum-separation guidance.
7. Add mock simulation state:
   - Channel.
   - RPD/activity state.
   - Scan segment.
   - Enabled/disabled.
8. Clearly state that RPD is coarse activity, not calibrated spectrum amplitude.
9. Make the model light enough to instantiate three copies.

## Tests

- Unit tests for terminal sets and variant resolution.
- E2E test for placing both variants.
- Performance check with three PA/LNA instances and antennas.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- Both variants are available.
- PA/LNA is the default.
- Antenna and electrical warnings are visible.
- The component exposes simulation inputs without implementing transmit behaviour.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
