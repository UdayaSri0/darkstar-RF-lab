# Prompt 15 — BME280 Environmental Sensor

## Branch

```text
feat/3d-15-bme280
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Add a generic BME280 I²C sensor with configurable mock environment values.

## Implementation requirements

1. Model a compact breakout with VCC, GND, SDA, SCL and optional address-select terminal.
2. Support addresses `0x76` and `0x77`.
3. Add mock temperature, humidity and pressure values.
4. Support JSON/CSV imported time series through the shared simulation adapter.
5. Add enclosure-heating and airflow caution text.
6. Add compact mounting and keep-clear metadata.

## Tests

- Unit tests for address selection and imported values.
- E2E test adjusting environmental readings.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The sensor joins the I²C bus.
- Mock values are visibly synthetic/imported.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
