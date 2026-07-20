# Prompt 90 — Deferred Optional Raspberry Pi Zero 2 W and HackRF Workspace

## Branch

```text
feat/3d-90-optional-sdr-workspace
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Define, but do not include in the v0.2 base release, a separate receive-only SDR workspace.

## Implementation requirements

This prompt is intentionally deferred until the base system is stable.

When authorised later:

1. Add Raspberry Pi Zero 2 W and HackRF One as separate optional components.
2. Use a dedicated 5 V supply branch suitable for the selected hardware.
3. Connect HackRF to the Raspberry Pi through USB OTG.
4. Keep the branch in a separate workspace or optional preset.
5. Support imported receive-only waterfall data.
6. Do not add transmit controls, jamming, injection or active interference.
7. Do not imply that the main ESP32 can process the HackRF sample stream directly.
8. Keep the base project unchanged.

## Tests

- Deferred until separately approved.
- Add tests when implementation begins.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- This file acts as future scope only and must not be executed by the v0.2 master prompt.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
