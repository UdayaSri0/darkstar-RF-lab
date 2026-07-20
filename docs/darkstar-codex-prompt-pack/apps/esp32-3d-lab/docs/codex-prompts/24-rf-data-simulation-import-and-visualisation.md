# Prompt 24 — RF Mock Data, Import Adapters and Signal Visualisation

## Branch

```text
feat/3d-24-rf-simulation
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Implement simulation Level 3 for receive-only project behaviour using synthetic or imported data.

## Implementation requirements

1. Create a simulation adapter interface shared by nRF24, CC1101, ESP32-C5, AD8318, GPS, BME280 and TEMT6000.
2. Support data sources:
   - Manual values.
   - Deterministic synthetic generator with seed.
   - JSON import.
   - CSV import.
3. Reserve, but do not activate, future adapters:
   - Web Serial.
   - WebSocket.
4. Add timeline controls: play, pause, seek, speed and loop.
5. Add visualisations:
   - nRF activity bars by configured channel segment.
   - CC1101 tuned-channel activity.
   - ESP32-C5 Wi-Fi survey table.
   - AD8318 aggregate passband-power trace.
   - Animated signal paths.
   - TFT mock dashboard.
6. Clearly label source as synthetic, imported or future live.
7. Keep all RF behaviour receive-only.
8. Do not claim electromagnetic field simulation, calibrated amplitude or frequency-selective detector behaviour beyond the documented hardware.
9. Make simulation optional so placement remains responsive.

## Tests

- Parser tests for valid/invalid JSON and CSV.
- Deterministic-generator tests.
- E2E test loading a sample dataset and playing the timeline.
- Performance test in High quality with the complete base preset.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- Synthetic and imported data produce repeatable visual output.
- Data provenance is visible.
- Future live-data interfaces exist only as disabled adapters/contracts.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
