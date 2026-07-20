# Master Codex Orchestrator — DarkStar ESP32 3D Lab v0.2

You are the integration lead for the standalone application at:

```text
apps/esp32-3d-lab/
```

Your task is to implement the complete receive-only DarkStar RF Lab 3D base system by executing the prompt pack in numeric order.

## Absolute protection rule

Do not modify `web-guide/index.html` or convert the original offline guide. The 3D application stays independent.

## Read first

1. `SHARED_RULES.md`
2. `PROMPT_EXECUTION_MATRIX.md`
3. `project-decisions.json`
4. Every numbered prompt from `00` through `28`

Do not execute prompt `90` in this release.

## Integration workflow

1. Inspect the current repository and preserve uncommitted work.
2. Create or switch to:

```text
integration/esp32-3d-v0.2
```

3. Execute prompt `00`.
4. For each prompt `01`–`27`:
   - Create the branch named in that prompt from the latest integration branch.
   - Implement only that prompt's scope.
   - Run required checks.
   - Review the diff.
   - Commit the focused change.
   - Return to the integration branch.
   - Merge the feature branch only when its checks pass.
   - Stop and report instead of merging a failing branch.
5. Execute prompt `28` on the release integration branch.
6. Do not merge into `main`.
7. Do not push or create remote pull requests without explicit approval.

## Required product result

The application must support:

- A generic ESP32-WROOM-32U development board with external antenna hardware.
- Multiple component instances.
- Typed terminals and connector-aware cables.
- A 300 × 220 mm adjustable modular baseplate.
- Placement, rotation, grouping, alignment, snapping, locking and collision warnings.
- Three nRF24L01+ PA/LNA modules by default and a compact alternate variant.
- CC1101.
- ILI9341.
- MicroSD.
- MCP23017 and five buttons.
- ADS1115.
- BME280.
- NEO-6M.
- TEMT6000.
- ESP32-C5.
- 5 GHz antenna, filter, attenuator, AD8318 and divider.
- USB power bank, fuse, reverse-polarity protection, switch, power LED, 5 V distribution and low-noise 3.3 V RF rail.
- Manual editable 3D cable routes, labels, lengths, harnesses and intersection warnings.
- Conceptual electrical validation.
- Synthetic/JSON/CSV receive-only simulation.
- Functional, Bus and Signal-flow layouts.
- One-click complete project.
- Guided build mode.
- Backward compatibility with the existing version-1 ESP32 project format.
- Low, Medium and High quality modes.

MAX17043 and the 74AHCT125/WS2812B subsystem belong in the library but are not placed in the default USB-power-bank project.

Raspberry Pi Zero 2 W and HackRF One are deferred and must not be implemented by this orchestrator.

## Required conceptual wiring

### RF SPI

- Main GPIO18 → SCK on nRF #1, #2, #3 and CC1101.
- Main GPIO23 → MOSI on all four RF modules.
- Main GPIO19 ← MISO from all four RF modules.
- GPIO16 → nRF #1 CE.
- GPIO17 → nRF #1 CSN.
- GPIO25 → nRF #2 CE.
- GPIO26 → nRF #2 CSN.
- GPIO32 → nRF #3 CE.
- GPIO33 → nRF #3 CSN.
- GPIO27 → CC1101 CSN.
- CC1101 GDO0 → input-only GPIO34.

### UI SPI

- GPIO14 → ILI9341 and MicroSD SCK.
- GPIO13 → ILI9341 and MicroSD MOSI.
- GPIO35 ← ILI9341 and MicroSD MISO.
- GPIO4 → TFT CS.
- GPIO2 → TFT D/C.
- GPIO5 → MicroSD CS.
- MCP23017 GPA5 → TFT RESET.

### I²C and sensors

- GPIO21 SDA and GPIO22 SCL → MCP23017, BME280, ADS1115 and conceptual ESP32-C5 link.
- MAX17043 is optional and unplaced in the default USB-power-bank project.
- NEO-6M TX → GPIO36.
- TEMT6000 OUT → ADS1115 A1.

### 5 GHz receive path

```text
5 GHz antenna → band-pass filter → fixed attenuator → AD8318 RF input
AD8318 VOUT → 10 kΩ / 20 kΩ divider → ADS1115 A0
```

### Power

```text
USB power bank
  → fuse
  → reverse-polarity protection
  → main switch
  → protected 5 V star distribution
```

Protected 5 V powers approved 5 V branches and the low-noise RF regulator. The low-noise 3.3 V RF rail powers all three nRF24L01 modules and CC1101. All base-system grounds share a common reference.

Breakout supply compatibility remains conceptual until exact modules are chosen.

## Stop conditions

Stop and report rather than continuing when:

- A migration would destroy or silently discard old project data.
- The original web guide is modified.
- A component needs an exact pinout that cannot be represented honestly as generic.
- Tests fail and the failure cannot be safely fixed inside the current prompt.
- A merge conflict would remove previously tested behaviour.
- A requested feature would introduce transmit, jamming, injection or offensive RF behaviour.
- A dependency requires remote runtime assets.

## Final checks

From `apps/esp32-3d-lab/` run:

```bash
npm run typecheck
npm run lint
npm run test
npm run test:e2e
npm run build
```

Then review:

```bash
git status --short
git diff --stat main...HEAD
```

Provide:

- Integration branch name.
- Feature branches completed and merged.
- Failed or skipped prompts.
- Complete file summary.
- Test/build results.
- Manual test results.
- Performance observations.
- Remaining generic/unverified hardware assumptions.
- Confirmation that `web-guide/index.html` remains unchanged.
- Confirmation that nothing was merged directly to `main`.
