# Prompt 16 — NEO-6M GPS Module

## Branch

```text
feat/3d-16-neo6m-gps
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Add a generic NEO-6M GPS receiver module and antenna representation.

## Implementation requirements

1. Model the GPS breakout with VCC, GND, TX and optional RX.
2. Map GPS TX to main-controller GPIO36 receive.
3. Add patch-antenna and external-antenna variants.
4. Add sky-view/orientation keep-out guidance.
5. Add mock NMEA-derived state:
   - Fix/no fix.
   - Latitude/longitude.
   - Satellites.
   - UTC.
6. Allow importing a simple JSON/CSV track.
7. Do not connect GPS RX by default.
8. Add indoor-fix uncertainty guidance.

## Tests

- Unit tests for TX-to-GPIO36 mapping and imported track parsing.
- E2E test switching fix state.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- GPS is receive oriented.
- GPIO36 input-only usage is correct.
- Imported/mock location data is labelled.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
