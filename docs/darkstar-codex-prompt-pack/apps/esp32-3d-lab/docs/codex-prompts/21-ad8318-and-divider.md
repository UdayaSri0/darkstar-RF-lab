# Prompt 21 — AD8318 Detector and Output Scaling Network

## Branch

```text
feat/3d-21-ad8318-divider
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Add the receive-only logarithmic detector module and a visible two-resistor divider feeding ADS1115 A0.

## Implementation requirements

1. Model a generic AD8318 breakout with 5 V, GND, RF input and VOUT.
2. Connect RF input from the fixed attenuator through SMA/coax.
3. Add two separate resistor components for a nominal 10 kΩ top and 20 kΩ bottom divider.
4. Represent the divider node as a real terminal/net.
5. Connect the scaled node to ADS1115 A0.
6. Validate:
   - Raw VOUT is not connected directly to a 3.3 V ADC.
   - Divider values are finite and positive.
   - Nominal scaling result is shown as an estimate.
7. Add synthetic detector behaviour:
   - User-adjustable input dBm.
   - Configurable slope/intercept.
   - Calculated raw and scaled voltage.
8. Support imported calibration points.
9. Clearly state aggregate in-band power only; no frequency identification.

## Tests

- Unit tests for divider calculation and invalid values.
- Validation test for direct raw VOUT-to-ADC connection.
- E2E test changing synthetic input and observing voltages.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The divider is physically and electrically visible.
- ADS1115 A0 receives the scaled node.
- Calibration uncertainty is explicit.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.
