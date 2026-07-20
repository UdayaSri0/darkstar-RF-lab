# Prompt 19 — ESP32-C5 Wi-Fi Survey Coprocessor

## Branch

```text
feat/3d-19-esp32-c5
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Add a generic ESP32-C5-DevKitC-1 representation for 2.4/5 GHz Wi-Fi survey metadata.

## Implementation requirements

1. Model a generic C5 development board with USB, headers, module, antenna region and mounting metadata.
2. Add a conceptual I²C link:
   - Main ESP32 GPIO21 SDA.
   - Main ESP32 GPIO22 SCL.
   - C5-side GPIO2/GPIO3 only as conceptual aliases pending exact-board verification.
3. Power through its own protected 5 V branch and common ground.
4. Add simulated survey results:
   - SSID placeholder.
   - Channel.
   - Band.
   - RSSI.
   - Security mode.
5. Support JSON/CSV imported survey records.
6. Add an adapter boundary for future serial/WebSocket live input, disabled by default.
7. Clearly state this is Wi-Fi survey metadata, not raw wideband spectrum.

## Tests

- Unit tests for conceptual-link evidence state.
- E2E test rendering imported survey records.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- Conceptual pins are not marked validated.
- 5 V power is not taken from the main ESP32 3.3 V pin.
- No packet injection or active offensive function exists.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
