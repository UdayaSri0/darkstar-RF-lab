# Prompt 07 — ESP32-WROOM-32U Main Controller Board

## Branch

```text
feat/3d-07-esp32-wroom-32u
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Replace the temporary PCB-antenna DevKit representation with a generic ESP32-WROOM-32U development-board variant using an external antenna connector, while retaining the old board as a legacy selectable variant.

## Implementation requirements

1. Create a new controller definition and variant:
   - `esp32-wroom-32u-devkit-generic`.
   - External U.FL/IPEX antenna connector.
   - Generic USB connector, EN/BOOT controls, regulator and USB-UART section.
2. Keep the current 30-pin DevKit as a legacy educational variant; do not delete old saved support.
3. Use generic dimensions unless a verified exact board source is available. Mark them `generic-concept`.
4. Model:
   - PCB thickness and bevel.
   - Shield can.
   - External antenna connector and pigtail anchor.
   - Header pins as terminals.
   - USB connector.
   - Buttons and major chips.
   - Mounting holes if present in the chosen generic form.
5. Add antenna keep-out and cable bend zones.
6. Use the repository design allocation for signal aliases:
   - RF SPI: GPIO18, 23, 19.
   - nRF CE/CSN: 16/17, 25/26, 32/33.
   - CC1101: CSN 27, GDO0 34.
   - UI SPI: 14, 13, 35.
   - TFT: CS 4, D/C 2.
   - MicroSD CS 5.
   - I²C: 21/22.
   - GPS receive: GPIO36.
7. Record input-only and boot-strapping warnings.
8. Add U.FL-to-SMA pigtail and external antenna as separate placeable components, not baked permanently into the board.
9. Provide inspector data, pin search aliases and mounting metadata.

## Tests

- Unit tests for the expected terminal aliases and unique IDs.
- Tests for GPIO34/35/36 input-only metadata.
- Tests for boot-strapping cautions.
- E2E test for switching controller variants without losing compatible project data.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The default main controller is the generic external-antenna 32U development board.
- The old board remains loadable.
- External antenna components connect through a typed U.FL terminal.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
