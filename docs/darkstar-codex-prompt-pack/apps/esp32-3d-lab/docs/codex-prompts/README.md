# DarkStar RF Lab Codex Prompt Pack

This folder contains the implementation prompts for expanding the existing standalone ESP32 3D Lab into a multi-component visual circuit-planning and receive-only mock-simulation system.

## Confirmed direction

- Main controller: generic ESP32-WROOM-32U development board with external antenna connector.
- Default nRF hardware: three PA/LNA SMA modules; compact PCB-antenna variant also available.
- Generic module models first; exact variants later from product links or photographs.
- 300 × 220 mm adjustable acrylic/metal mounting plate.
- Complete base system first.
- Raspberry Pi Zero 2 W and HackRF One deferred.
- Visual assembly + validation + interactive mock simulation.
- No firmware emulation.
- One-click complete project and guided build.
- Functional, Bus and Signal-flow layouts.
- Standalone 3D app; original web guide remains unchanged.
- Separate feature branch per prompt; merge only after tests pass.

## How to use the pack

### Controlled sequential method

1. Copy this folder into:
   `apps/esp32-3d-lab/docs/codex-prompts/`
2. Give Codex `00-project-constraints-and-repository-safety.md`.
3. Continue in the order shown in `PROMPT_EXECUTION_MATRIX.md`.
4. Review and merge each branch only after its checks pass.

This is the safest approach.

### Master orchestration method

Give Codex:

```text
Read apps/esp32-3d-lab/docs/codex-prompts/99-master-codex-orchestrator.md and execute it exactly.
```

The master prompt tells Codex to create a branch per feature and stop when a check fails. It does not authorise merging to `main`.

## Important files

- `SHARED_RULES.md` — non-negotiable repository, safety and architecture rules.
- `project-decisions.json` — the approved design choices.
- `PROMPT_EXECUTION_MATRIX.md` — dependency and branch order.
- `00`–`28` — implementation prompts.
- `90` — deferred SDR scope; not part of v0.2.
- `99` — master orchestrator.

## Exact module replacement later

When actual parts are purchased, add clear top and bottom photographs, product links and dimensions. Create a new exact variant rather than silently changing the generic component used by saved projects.

## Meaning of simulation

The planned system visualises placement, wiring, electrical rules and receive-only mock/imported data. It is not SPICE, an RF field solver, a certified analyser or an ESP32 firmware emulator.
