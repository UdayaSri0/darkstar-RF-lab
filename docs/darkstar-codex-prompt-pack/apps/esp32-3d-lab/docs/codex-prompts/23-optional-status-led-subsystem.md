# Prompt 23 — Optional 74AHCT125 and WS2812B Status LED

## Branch

```text
feat/3d-23-optional-status-led
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Add the optional buffered addressable-status-LED subsystem to the library, but do not enable it in the default base preset.

## Implementation requirements

1. Add 74AHCT125 and WS2812B components.
2. Map conceptual data:
   - Main ESP32 GPIO15 to buffer input.
   - Buffer output through 330 Ω to WS2812B DIN.
3. Add 5 V power, ground and local decoupling.
4. Add active-low output-enable metadata.
5. Add GPIO15 boot-strapping caution.
6. Add mock colour and brightness controls.
7. Keep the subsystem optional and disabled in the default project.

## Tests

- Unit tests for mapping and optional preset status.
- E2E test for LED colour and power state.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The optional subsystem is available without changing the base project's required parts.
- The buffer and series resistor are represented.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
