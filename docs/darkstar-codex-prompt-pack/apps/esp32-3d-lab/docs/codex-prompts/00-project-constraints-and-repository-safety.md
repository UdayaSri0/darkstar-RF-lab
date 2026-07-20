# Prompt 00 — Repository Safety, Baseline and Architecture Audit

## Branch

```text
chore/3d-00-safety-audit
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Establish a recorded baseline before the multi-component expansion. This prompt should make no functional product change except safe documentation and developer checks.

## Implementation requirements

1. Inspect the repository tree, the current branch, `git status`, package files, tests and the current `apps/esp32-3d-lab/src/` architecture.
2. Identify all existing features that must remain working.
3. Identify current limitations involving one fixed board, pin-only terminal IDs, fixed board creation and project schema version 1.
4. Create `docs/BASELINE_V0_1.md` inside the 3D app containing:
   - Current architecture map.
   - Existing features.
   - Protected original files.
   - Current project schema.
   - Current test commands.
   - Known technical debt.
   - Migration risks.
5. Create `docs/MULTI_COMPONENT_PLAN.md` containing the ordered implementation phases represented by prompts 01–28.
6. Add no new dependency.
7. Make no source-code behavioural change unless a broken baseline test requires a minimal, clearly documented repair.
8. Record the current build/test result without pretending failures are fixed.

## Tests

- Run typecheck, lint, unit tests and build.
- Run existing end-to-end tests when the browser runtime is available.
- Record exact results in the baseline document.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- Baseline and migration documents exist and match the actual repository.
- No original guide file changed.
- No unrelated formatting change occurred.
- Existing application behaviour remains unchanged.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
