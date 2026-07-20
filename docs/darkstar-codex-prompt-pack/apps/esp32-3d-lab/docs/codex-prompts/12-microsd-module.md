# Prompt 12 — MicroSD Storage Module

## Branch

```text
feat/3d-12-microsd
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Add a generic MicroSD breakout and simulated logging state.

## Implementation requirements

1. Model PCB, socket, removable card, header and mounting holes.
2. Expose VCC, GND, SCK, MOSI, MISO and CS terminals.
3. Map UI SPI SCK/MOSI/MISO to GPIO14/13/35 and CS to GPIO5.
4. Add warnings about boot-state review on GPIO5 and exact breakout level shifting.
5. Add simulation:
   - Card inserted/removed.
   - Capacity label.
   - Mock logging active/inactive.
   - Imported/exported sample log files.
6. Add a card insertion animation and inspector control.
7. Add shared-SPI validation that inactive devices must release MISO.

## Tests

- Unit tests for mapping and card state.
- E2E test for insert/remove and logging indicator.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The module shares UI SPI correctly.
- GPIO5 warning is visible.
- Card state persists in the project.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
