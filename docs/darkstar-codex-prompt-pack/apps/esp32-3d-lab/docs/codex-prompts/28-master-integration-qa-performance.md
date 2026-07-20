# Prompt 28 — Master Integration, QA, Performance and Release Readiness

## Branch

```text
release/3d-v0.2-integration
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Integrate the feature branches into one stable standalone release candidate without changing the original web guide.

## Implementation requirements

1. Work only after prompts 01–27 have passed their own checks.
2. Merge completed branches into `integration/esp32-3d-v0.2` using non-destructive merges.
3. Resolve conflicts by preserving:
   - Multi-component schema.
   - Typed terminals.
   - Component registry.
   - Cable routes.
   - Validation graph.
   - Existing camera, inspector, notes and screenshots.
4. Perform a full audit:
   - No bare terminal IDs in project connections.
   - No component-specific logic hidden inside generic scene code.
   - No leaked Three.js resources.
   - No remote assets.
   - No false `hardware-validated` state.
   - No active RF/transmit features.
5. Performance targets:
   - Smooth complete preset on a typical desktop.
   - Low/Medium/High modes visibly change cost.
   - No unbounded texture or geometry recreation.
6. Add loading progress and graceful GLB fallback.
7. Complete accessibility:
   - Keyboard placement.
   - Focus states.
   - Labels independent of colour.
   - Reduced motion.
8. Add full E2E scenarios:
   - Load complete preset.
   - Switch layouts.
   - Move and lock components.
   - Create/edit cables.
   - Run validation.
   - Play imported simulation.
   - Save, reload and import/export.
   - Complete guided build.
9. Update version and release notes only inside the 3D app unless repository-level release changes are separately approved.
10. Produce `docs/RELEASE_READINESS_V0_2.md`.

## Tests

- Typecheck.
- Lint.
- All unit tests.
- Full Playwright suite.
- Production build.
- Manual Chromium check.
- Manual inspection of Low, Medium and High quality.
- Final `git diff --stat` and `git diff`.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- Complete preset and guided build work.
- All non-optional base components are integrated.
- Existing V1 projects migrate.
- No major console error occurs.
- Original guide is unchanged.
- Release-readiness report records any remaining limitations honestly.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
