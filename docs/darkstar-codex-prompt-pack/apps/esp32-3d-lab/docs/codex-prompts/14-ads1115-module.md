# Prompt 14 — ADS1115 ADC Module

## Branch

```text
feat/3d-14-ads1115
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Add a generic ADS1115 I²C ADC used for the 5 GHz detector output and ambient-light input.

## Implementation requirements

1. Model a generic breakout with VDD, GND, SDA, SCL, ADDR, ALERT/RDY and A0–A3.
2. Add configurable I²C address with conflict validation.
3. Map:
   - A0 to the scaled AD8318 detector output.
   - A1 to TEMT6000 output.
4. Add configurable PGA range and sample rate as mock settings.
5. Validate declared analogue inputs against VDD and configured PGA assumptions.
6. Add live mock voltage display in the inspector.
7. Make A2/A3 available as spare terminals.

## Tests

- Unit tests for address, channel mapping and range warnings.
- E2E test showing mock A0/A1 values.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- A0 and A1 are clearly distinguished.
- Out-of-range inputs produce warnings.
- Exact calibration is not implied.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
