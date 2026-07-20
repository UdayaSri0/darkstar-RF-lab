# Prompt 17 — TEMT6000 Ambient-Light Module

## Branch

```text
feat/3d-17-temt6000
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Add a generic analogue light-sensor module connected through the ADS1115.

## Implementation requirements

1. Model VCC, GND and OUT.
2. Map OUT to ADS1115 A1.
3. Add configurable synthetic lux/voltage.
4. Validate that output remains inside the ADC rail.
5. Add optical keep-clear guidance and enclosure-aperture note.
6. Optionally bind the value to mock TFT brightness.

## Tests

- Unit tests for voltage conversion bounds.
- E2E test linking sensor value to mock display brightness.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The sensor connects to ADS1115 A1 rather than directly to an arbitrary ESP32 pin.
- Optical placement guidance is visible.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
