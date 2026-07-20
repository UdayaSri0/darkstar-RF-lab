# Prompt 04 — Realistic Cable, Wire, Connector and Harness System

## Branch

```text
feat/3d-04-cable-system
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Replace the current basic pin-to-pin tube with a typed terminal-to-terminal cable system suitable for the complete circuit.

## Implementation requirements

1. Create a cable-type registry supporting:
   - Female-to-female Dupont.
   - Male-to-female Dupont.
   - Male-to-male breadboard jumper.
   - Ribbon cable.
   - Power wire.
   - Ground wire.
   - I²C, SPI and UART logical styles.
   - USB cable.
   - SMA coaxial cable.
   - U.FL/IPEX pigtail.
2. Each cable type must define:
   - Physical diameter.
   - Material and roughness.
   - Supported connector ends.
   - Minimum bend radius.
   - Default colour rules.
   - Whether bundling is allowed.
3. Connect any compatible `TerminalRef` pair across different component instances.
4. Add editable manual control points:
   - Add point.
   - Move point.
   - Delete point.
   - Reset route.
5. Add cable selection, targeted deletion, label editing, colour editing and route editing.
6. Calculate cable length in millimetres.
7. Add harness bundles with shared labels and bundle IDs.
8. Detect:
   - Cable/component intersections.
   - Bend-radius violations.
   - Unsupported connector pairing.
   - Duplicate connection warnings.
9. Keep current automatic simple curve as the initial route, but do not implement automatic obstacle avoidance.
10. Dispose old TubeGeometry/materials when routes are rebuilt.
11. Persist cable types, endpoints, labels, colours, bundles and control points.

## Tests

- Unit tests for compatibility, route serialisation, length and bend radius.
- Unit tests proving duplicate terminal IDs across instances remain unambiguous.
- E2E tests for creating, editing, labelling, bundling and deleting cables.
- Performance test with at least 100 visible cables.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- A cable can connect terminals on two different instances.
- SMA/U.FL/USB connections use correct cable profiles rather than Dupont wire.
- User control points survive save/load.
- Invalid connector combinations produce actionable warnings.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
