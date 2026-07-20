# Prompt 27 — Project Migrations, Compatibility and Diagnostics

## Branch

```text
feat/3d-27-project-migrations
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Stabilise saved-project compatibility after all new component systems are present.

## Implementation requirements

1. Create a migration registry rather than one hard-coded migration.
2. Support:
   - V1 single-board projects.
   - V2 multi-component projects.
   - Future version detection.
3. Add import diagnostics listing:
   - Migrated fields.
   - Unknown component types.
   - Missing variants.
   - Missing terminals.
   - Repaired defaults.
   - Dropped unsupported data.
4. Never silently discard cables or components.
5. Add a read-only recovery view for partially loadable projects.
6. Add export manifest containing app version, project schema, component-definition versions and evidence states.
7. Add sample fixtures for previous releases.
8. Keep local-storage keys namespaced.

## Tests

- Migration-chain tests.
- Fixtures for V1 and V2.
- E2E test importing an old project and exporting the new schema.
- E2E test for a partially unknown component.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- Historical projects remain recoverable.
- Import diagnostics are understandable.
- Unsupported future versions do not overwrite current state.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
