# Prompt 13 — MCP23017 and Five-Way Navigation Controls

## Branch

```text
feat/3d-13-mcp23017-controls
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Add the I²C expander and five-button control panel used by the base project.

## Implementation requirements

1. Add a generic MCP23017 breakout with VCC, GND, SDA, SCL, RESET, A0–A2, GPA0–GPA7 and optional interrupt terminals.
2. Default A0/A1/A2 low for address `0x20`.
3. Map:
   - GPA0 Up.
   - GPA1 Down.
   - GPA2 Left.
   - GPA3 Right.
   - GPA4 Select.
   - GPA5 TFT reset.
4. Add five separate tactile-button components or a reusable five-button panel.
5. Buttons are active-low to common ground with pull-up metadata.
6. Add press animations and interactive mock menu navigation on the ILI9341.
7. Add debounce simulation setting.
8. Add reset pull-up guidance and I²C address validation.

## Tests

- Unit tests for address calculation and GPA allocation.
- E2E test pressing buttons and observing the mock display.
- Validation test for I²C address conflict.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- Five buttons are independently selectable and pressable.
- The expander mapping matches the documented allocation.
- TFT reset is not incorrectly connected to an ESP32 pin.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
