# Prompt 22 — USB Power Input, Protection, Distribution and RF Rail

## Branch

```text
feat/3d-22-power-system
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Create the complete base-system power path selected for the first prototype.

## Implementation requirements

1. Add placeable power components:
   - USB power-bank source.
   - Input connector/cable.
   - Replaceable fuse.
   - Reverse-polarity protection block.
   - Main power switch.
   - Power LED with resistor.
   - 5 V star-distribution block.
   - Low-noise 3.3 V RF regulator.
   - 100 nF, 10 µF and 100–220 µF capacitors.
   - Common-ground distribution.
2. Default path:
   `USB power bank → fuse → reverse protection → switch → protected 5 V star`.
3. Create separate 5 V branches for:
   - Main controller.
   - ESP32-C5.
   - AD8318.
   - Display or other exact-part-compatible loads.
   - RF regulator input.
4. Low-noise 3.3 V RF output powers the three nRF24 modules and CC1101.
5. Add power-state simulation:
   - Switch.
   - Fuse intact/blown.
   - Source connected/disconnected.
   - Rail voltage indicators.
   - Powered/unpowered component states.
6. Add validation:
   - Missing fuse/protection in the base preset.
   - Reversed source polarity.
   - 5 V on RF rail.
   - Missing ground return.
   - Powered signal into unpowered component.
7. Add current-budget fields but label them estimated until measured.
8. Do not model hazardous mains wiring.

## Tests

- Unit tests for power-state propagation and failure states.
- Validation tests for missing ground and wrong rail.
- E2E test toggling the switch and seeing components power up/down.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- One-click base project contains the selected protected USB-power-bank path.
- RF modules receive the dedicated 3.3 V RF rail.
- Power LED reflects switched 5 V state.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
