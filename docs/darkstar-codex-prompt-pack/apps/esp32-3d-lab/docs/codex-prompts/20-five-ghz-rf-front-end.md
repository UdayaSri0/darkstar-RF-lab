# Prompt 20 — 5 GHz Antenna, Band-Pass Filter and Fixed Attenuator

## Branch

```text
feat/3d-20-five-ghz-front-end
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Create the receive-only 50 Ω physical signal chain before the AD8318 detector.

## Implementation requirements

1. Add separate placeable components:
   - 5 GHz receive antenna.
   - SMA/U.FL pigtails where needed.
   - Generic 5 GHz band-pass filter.
   - Generic fixed attenuator.
2. Use SMA/coax terminals, never Dupont terminals, for the RF chain.
3. Add an ordered signal-path rule:
   `antenna → filter → attenuator → detector`.
4. Add configurable conceptual passband and attenuator value.
5. Mark exact passband, insertion loss and attenuation as unverified until exact parts are selected.
6. Add cable loss and component loss fields for future calibration metadata.
7. Add antenna keep-out, orientation, metal-clearance and bend-radius guidance.
8. Add animated receive-only signal-path pulses based on synthetic/imported activity.

## Tests

- Unit tests for allowed RF-chain order and connector compatibility.
- E2E test creating the full coax chain.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The chain is visibly 50 Ω/coax based.
- Exact RF performance is not claimed.
- Wrong ordering produces a validation warning.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
