# Prompt 11 — ILI9341 Display Module

## Branch

```text
feat/3d-11-ili9341
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Add a generic placeable ILI9341 TFT display with realistic screen behaviour and project-specific terminals.

## Implementation requirements

1. Model a generic breakout with PCB, display glass, bezel, header, mounting holes and backlight.
2. Expose terminals for VCC, GND, SCK, MOSI, MISO, CS, D/C, RESET and backlight.
3. Map conceptual project signals:
   - SCK GPIO14.
   - MOSI GPIO13.
   - MISO GPIO35.
   - CS GPIO4.
   - D/C GPIO2.
   - RESET from MCP23017 GPA5.
4. Treat breakout supply acceptance as exact-part dependent.
5. Add screen simulation:
   - Power-off black screen.
   - Boot splash.
   - Sample spectrum/activity view.
   - Menu view.
   - Warning view.
6. Render the screen efficiently using CanvasTexture or a controlled render target.
7. Add mounting and viewing-angle tools.
8. Add connector-access and cable-bend warnings.

## Tests

- Unit tests for terminal mapping.
- E2E test for screen modes and component selection.
- Performance test ensuring screen updates do not recreate textures every frame.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The display can show mock UI states.
- Reset is connected through the expander in the preset.
- Supply uncertainty is not hidden.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
