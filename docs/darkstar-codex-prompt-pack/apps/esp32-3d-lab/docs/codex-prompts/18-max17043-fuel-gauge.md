# Prompt 18 — MAX17043 Fuel-Gauge Module

## Branch

```text
feat/3d-18-max17043
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Add the MAX17043 to the component library but keep it out of the default USB-power-bank preset until a compatible single-cell battery design is approved.

## Implementation requirements

1. Model a generic MAX17043 breakout with battery, VCC, GND, SDA, SCL and optional alert terminals as appropriate to the generic board.
2. Add strong metadata that this is not a charger or protection circuit.
3. Add mock cell voltage and state-of-charge.
4. Join the I²C bus only in an optional battery-project variant.
5. The default base preset must show the component as unplaced/optional because the selected source is a USB power bank.
6. Add validation preventing the app from implying that a USB power bank is a directly monitored single Li-ion cell.

## Tests

- Unit tests for optional-preset behaviour.
- Validation test for incompatible source description.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- Component exists in the library.
- It is not wired into the default USB-power-bank project.
- Its limitation is explicit.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
