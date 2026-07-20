# Prompt 01 — Multi-Component Scene and Project Schema V2

## Branch

```text
feat/3d-01-multi-component-schema
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Replace the single-board project limitation with a backward-compatible multi-component project model.

## Implementation requirements

1. Introduce `LabProjectV2` based on the shared schema.
2. Add stable component instances with transforms, variant IDs, lock state, groups and custom properties.
3. Replace wire endpoints with `TerminalRef { instanceId, terminalId }`.
4. Add schema validators that reject malformed component IDs, duplicate instance IDs, invalid terminal references, non-finite transforms and unsupported versions.
5. Add an explicit migration from existing version-1 projects:
   - Create one main-controller instance using a stable ID such as `main-controller`.
   - Convert every old `fromPinId` and `toPinId` to terminal references on that instance.
   - Preserve notes, measurements, project name and modified time.
   - Never mutate the imported object in place.
6. Update local-storage loading and JSON import to migrate version 1 safely.
7. Export version 2 for every newly saved project.
8. Preserve the user's old project when migration fails; show a recoverable error.
9. Add project-level `verificationMode`, `layoutPresetId` and `simulation`.
10. Do not yet add all components or change the visual layout beyond what is needed to load one ESP32 instance through the new schema.

## Tests

- Unit tests for valid V2 projects.
- Unit tests for duplicate instance IDs.
- Unit tests for invalid terminal references.
- Unit tests for V1-to-V2 migration.
- Unit tests proving failed imports do not replace the current project.
- E2E test: existing V1 fixture loads and displays the ESP32 and its wires.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- Old saved projects continue to load.
- New exports use version 2.
- Two instances may legally use the same terminal IDs because references include instance IDs.
- All existing features still work with the migrated main-controller instance.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
