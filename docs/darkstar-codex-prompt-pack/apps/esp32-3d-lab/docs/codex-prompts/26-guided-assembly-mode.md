# Prompt 26 — Guided Build and Assembly Wizard

## Branch

```text
feat/3d-26-guided-assembly
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Create a step-by-step build mode for understanding placement, wiring and safe power-up order.

## Implementation requirements

1. Add a guided build entry beside the complete-preset action.
2. Use phases:
   1. Baseplate and mounting.
   2. Protected 5 V power path.
   3. Main controller.
   4. One RF receiver and RF rail verification.
   5. Remaining RF receivers and CC1101.
   6. Display and MicroSD.
   7. MCP23017 and buttons.
   8. Sensors and GPS.
   9. ESP32-C5.
   10. 5 GHz detector chain.
   11. Validation and mock power-up.
3. Each step must:
   - Highlight involved components.
   - Isolate related cables.
   - Explain the purpose.
   - Show warnings.
   - Offer next/back/exit.
   - Preserve the user's project.
4. Add a progress checklist.
5. Allow “apply this step” for an empty or partial project.
6. Do not represent the wizard as a substitute for a reviewed schematic or measured hardware test.
7. Include a passive-use reminder in RF steps.

## Tests

- Unit tests for step order and progress persistence.
- E2E test completing, exiting and resuming the wizard.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The wizard guides rather than locks the user.
- The power system is built and checked before sensitive RF modules.
- Progress survives reload.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
