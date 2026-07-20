# Prompt 05 — Electrical Domains and Validation Engine

## Branch

```text
feat/3d-05-electrical-validation
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Create a rule engine that validates the conceptual circuit without claiming SPICE-level or firmware-level simulation.

## Implementation requirements

1. Create a graph from component terminals and cable connections.
2. Define voltage domains including:
   - USB 5 V input.
   - Protected switched 5 V.
   - 3.3 V digital.
   - Low-noise 3.3 V RF.
   - Ground.
   - Analogue detector output.
   - RF coax signal path.
3. Add severity levels: info, caution, error and blocking.
4. Implement checks for:
   - Direct power-to-ground shorts.
   - 5 V applied to 3.3 V-only logic.
   - Missing common ground.
   - Output-to-output contention.
   - Input-only ESP32 GPIO used as output.
   - Boot-strapping pin cautions.
   - SPI CS/CSN uniqueness and idle-high expectations.
   - Shared SPI MISO requirements.
   - I²C address conflicts.
   - Missing I²C pull-ups.
   - ADC input outside declared supply range.
   - Unpowered components with active signal connections.
   - Cable connector incompatibility.
   - RF coax connected to digital terminals.
5. Separate validation results by evidence:
   - Conceptual rule.
   - Exact-part rule.
   - Hardware-validated rule.
6. In conceptual mode, show uncertainty rather than converting it into a false error.
7. Validated mode must remain unavailable until a project contains recorded hardware evidence.
8. Add a validation panel, component badges, terminal badges and a “Validate project” command.
9. Export a readable validation report to JSON and Markdown.
10. Do not implement current flow, analogue solving, timing simulation or MCU emulation here.

## Tests

- Unit tests for every validation rule.
- Graph tests with branched buses and shared ground.
- E2E test that an intentional 5 V-to-GPIO connection is flagged.
- E2E test that conceptual uncertainty is clearly labelled.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- Errors identify exact component instances and terminals.
- Conceptual and validated modes are visibly distinct.
- The app never describes the project as electrically verified merely because validation reports no known rule violation.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
