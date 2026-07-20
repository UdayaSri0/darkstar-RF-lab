# Prompt 06 — Adjustable Baseplate and Mounting System

## Branch

```text
feat/3d-06-baseplate-mounting
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Model the intended modular prototype as boards mounted on a configurable acrylic or metal baseplate.

## Implementation requirements

1. Add a baseplate component with default dimensions 300 mm × 220 mm.
2. Support acrylic and metal visual materials.
3. Allow width, depth and thickness configuration.
4. Add:
   - 5 mm default grid.
   - Optional 10 mm mounting grid.
   - Drilled-hole overlay.
   - Edge margins.
   - Raised standoffs.
   - Screws and washers as optional visual elements.
5. Add baseplate zones and labels.
6. Add mounting-point snapping between component holes and standoff positions.
7. Add checks for:
   - Mounting hole outside the plate.
   - Standoff collision.
   - Component overhang.
   - Antenna too close to metal.
   - Connector blocked by plate edge or another component.
8. Allow a component to be marked as surface-mounted, standoff-mounted or free-standing.
9. Add top, bottom and mounting-plan camera views.
10. Preserve the existing neutral workbench as the world environment under the baseplate.

## Tests

- Unit tests for plate bounds, hole grid, overhang and mounting snap.
- E2E test for resizing the plate and retaining component positions.
- Visual/manual check for acrylic transparency and metal material.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The default project opens on a 300 × 220 mm plate.
- Components can snap to mounting positions.
- Antenna-to-metal keep-out warnings are available.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
