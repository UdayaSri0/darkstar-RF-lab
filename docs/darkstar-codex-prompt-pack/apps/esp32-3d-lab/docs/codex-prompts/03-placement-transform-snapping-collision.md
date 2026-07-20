# Prompt 03 — Placement, Transform, Snapping and Collision Tools

## Branch

```text
feat/3d-03-placement-tools
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Allow users to place and organise multiple physical modules on the 300 × 220 mm baseplate.

## Implementation requirements

1. Add component-library and placement modes.
2. Support:
   - Drag in X/Z.
   - Raise/lower in Y.
   - Fixed rotation increments, default 15°.
   - Fine rotation, default 1°.
   - Duplicate.
   - Delete selected.
   - Lock/unlock.
   - Multi-select.
   - Group/ungroup.
   - Align left/right/front/back/centre.
   - Distribute evenly.
   - Grid snap with 5 mm default and 1 mm fine mode.
   - Mounting-hole snap.
3. Add transform gizmos or an equivalent accessible control system. Avoid accidental camera movement while dragging.
4. Compute component world-space bounding boxes and collision intersections.
5. Add non-blocking collision warnings. Do not silently prevent intentional overlap unless a strict-placement option is enabled.
6. Add mounting-point visualisation and fasteners as optional overlays.
7. Add undo/redo commands for every transform, duplicate, lock, group and delete operation.
8. Persist transforms and grouping.
9. Add keyboard movement with visible focus and millimetre increments.
10. Do not implement automatic layout optimisation.

## Tests

- Unit tests for transforms, snap calculations, alignment and distribution.
- Unit tests for lock behaviour and collision detection.
- E2E tests for placing, rotating, duplicating, locking, aligning and undoing.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- Multiple component instances can be positioned independently.
- All transforms survive save/load.
- Locked components cannot be moved through pointer or keyboard tools.
- Collision warnings identify both involved instance IDs.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
