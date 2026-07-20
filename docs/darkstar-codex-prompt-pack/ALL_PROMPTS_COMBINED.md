---

# FILE: README.md

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


---

# FILE: SHARED_RULES.md

# DarkStar RF Lab — Shared Codex Rules

These rules apply to every prompt in this directory.

## Protected original application

The repository contains two separate systems:

1. `web-guide/index.html` — the original offline 2D circuit guide.
2. `apps/esp32-3d-lab/` — the standalone Vite + TypeScript + Three.js application.

Do not modify, move, reformat, replace, inject into, or depend on `web-guide/index.html`. Do not change the original guide's CSS, scripts, navigation, storage, tests or deployment behaviour. The 3D system must remain standalone at `/esp32-3d-lab/`.

Do not add a link to the original guide unless a later prompt explicitly authorises that exact change. None of the prompts in this pack authorises it.

## Repository and branch safety

Before changing code:

```bash
git status --short
git branch --show-current
git diff --stat
```

Preserve unrelated uncommitted work. Never discard user changes. Create the branch named by the prompt from the current integration branch.

Recommended integration branch:

```text
integration/esp32-3d-v0.2
```

Each feature prompt uses its own branch. After completing a prompt:

1. Run all required checks.
2. Review `git diff`.
3. Commit only the intended files.
4. Merge into the integration branch only when tests pass.
5. Never merge directly to `main`.
6. Do not push, open a pull request or merge remotely unless the user explicitly requests it.

## Current application constraints

The current application was built around one fixed ESP32 board, one `boardId`, pin-only selection and wires stored as `fromPinId`/`toPinId`. The first architecture prompts must replace this limitation safely with multiple component instances and terminal references while preserving old saved projects.

The current app already has:

- Standalone Vite/TypeScript/Three.js setup.
- A procedural ESP32 DevKit representation.
- Camera controls and quality modes.
- Selection and an inspector.
- Basic pin-to-pin wires.
- Measurements, notes, undo/redo.
- Local persistence, JSON import/export and screenshots.

Extend the existing application. Do not recreate it from scratch.

## Product and electrical accuracy

The repository's wiring is a documented design allocation, not a prototype-validated schematic.

Every component definition must include an evidence state:

```ts
type EvidenceState =
  | "generic-concept"
  | "documented-allocation"
  | "exact-part-unverified"
  | "hardware-validated";
```

The default full project must use `documented-allocation` and visibly state:

```text
Conceptual wiring — not hardware validated.
```

Never mark a component, pinout, dimension, supply capability or connection as hardware-validated without recorded physical evidence.

When obtaining new dimensions or pinouts, prefer manufacturer datasheets, official board documentation and official repositories. Record source title, revision, URL and access date in component metadata. Do not silently infer dimensions from marketplace photographs.

## Passive and authorised RF scope

DarkStar RF Lab is receive-only and educational. Do not add jamming, interference, packet injection, spoofing, unauthorised capture, transmit workflows or offensive RF functions.

RF simulation is synthetic or imported observation data. It must not claim physics-accurate field simulation or certified measurement accuracy.

## Chosen project decisions

- Main controller: ESP32-WROOM-32U development board with an external antenna connector.
- Default 2.4 GHz receivers: three nRF24L01+ PA/LNA modules with SMA antennas.
- Alternate nRF variant: compact PCB-antenna module.
- Generic breakout geometry is acceptable until exact product links or photographs are supplied.
- Construction model: modules mounted on an adjustable 300 mm × 220 mm acrylic/metal baseplate.
- Base system first; Raspberry Pi Zero 2 W and HackRF One are deferred to a separate optional workspace.
- Simulation levels: visual assembly, electrical validation and interactive mock behaviour.
- No ESP32 firmware emulation.
- One-click complete project and guided assembly are required.
- Default project has Functional, Bus and Signal-flow layouts.
- Hybrid procedural + optimised GLB asset strategy.
- Low, Medium and High rendering modes.
- Conceptual and validated-hardware project modes.
- USB power bank input, fuse, reverse-polarity protection, switch, power LED, protected 5 V distribution and a low-noise 3.3 V RF rail.

## Target project schema

Use stable component definitions and per-project instances.

```ts
interface ComponentDefinition {
  typeId: string;
  displayName: string;
  category: string;
  variants: ComponentVariantDefinition[];
  terminals: TerminalDefinition[];
  mounting: MountingDefinition;
  keepOutZones: KeepOutZoneDefinition[];
  evidence: EvidenceMetadata;
}

interface ComponentInstance {
  id: string;
  typeId: string;
  variantId: string;
  transform: {
    positionMm: [number, number, number];
    rotationDeg: [number, number, number];
    scale: [number, number, number];
  };
  locked: boolean;
  groupId?: string;
  userLabel?: string;
  properties: Record<string, unknown>;
}

interface TerminalRef {
  instanceId: string;
  terminalId: string;
}

interface CableConnection {
  id: string;
  from: TerminalRef;
  to: TerminalRef;
  cableTypeId: string;
  color: string;
  controlPointsMm: [number, number, number][];
  label?: string;
  bundleId?: string;
}

interface LabProjectV2 {
  version: 2;
  name: string;
  verificationMode: "conceptual" | "validated";
  layoutPresetId?: string;
  components: ComponentInstance[];
  cables: CableConnection[];
  measurements: Measurement[];
  notes: LabNote[];
  simulation: SimulationState;
  modifiedAt: string;
}
```

A terminal's globally unique runtime key is:

```text
<component-instance-id>::<terminal-id>
```

Never use a bare terminal ID as a project-wide identifier.

## Units and coordinates

- Store physical dimensions and positions in millimetres.
- Use Y as vertical height.
- Use the X/Z plane as the baseplate surface.
- Baseplate origin is its centre.
- Store rotations in degrees in serialisable state; convert to radians only in the renderer.
- Never mix scene units and millimetres.

## Component lifecycle and rendering

Every component factory must return a standard runtime contract containing:

- Root Three.js group.
- Selectable objects.
- Terminal anchors.
- Mounting points.
- Bounding box.
- Keep-out zones.
- Labels.
- Disposal function.
- Visual-mode handler.
- Optional simulation adapter.

Do not leak geometries, materials, textures or event listeners when components are deleted or replaced.

Use instancing or shared geometry for repeated hardware where practical.

## Required checks

Run from `apps/esp32-3d-lab/`:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Run browser tests when the prompt changes interaction, rendering, persistence or workflows:

```bash
npm run test:e2e
```

Report any unavailable browser runtime or environment limitation honestly.

## Final report format

Every prompt completion report must contain:

- Branch used.
- Files created.
- Files modified.
- Tests and build commands run.
- Results.
- Manual checks performed.
- Known limitations.
- Confirmation that `web-guide/index.html` was not changed.
- Confirmation that no direct merge to `main` occurred.


---

# FILE: PROMPT_EXECUTION_MATRIX.md

# Prompt Execution Matrix

Use `integration/esp32-3d-v0.2` as the integration branch. Each feature branch is merged only after its tests pass.

| Order | Work item | Branch | Depends on | v0.2 status |
|---:|---|---|---|---|
| 00 | Safety audit | chore/3d-00-safety-audit | None | Required |
| 01 | Multi-component schema V2 | feat/3d-01-multi-component-schema | 00 | Required |
| 02 | Registry and terminals | feat/3d-02-component-registry | 01 | Required |
| 03 | Placement tools | feat/3d-03-placement-tools | 01–02 | Required |
| 04 | Cable system | feat/3d-04-cable-system | 01–03 | Required |
| 05 | Electrical validation | feat/3d-05-electrical-validation | 01–04 | Required |
| 06 | Baseplate and mounting | feat/3d-06-baseplate-mounting | 01–03 | Required |
| 07 | ESP32-WROOM-32U | feat/3d-07-esp32-wroom-32u | 02–06 | Required |
| 08 | nRF24 variants | feat/3d-08-nrf24l01-variants | 02–06 | Required |
| 09 | Three nRF bank | feat/3d-09-nrf24-rf-bank | 04–08 | Required |
| 10 | CC1101 | feat/3d-10-cc1101 | 02–06 | Required |
| 11 | ILI9341 | feat/3d-11-ili9341 | 02–06 | Required |
| 12 | MicroSD | feat/3d-12-microsd | 02–06 | Required |
| 13 | MCP23017/buttons | feat/3d-13-mcp23017-controls | 02–06, 11 | Required |
| 14 | ADS1115 | feat/3d-14-ads1115 | 02–06 | Required |
| 15 | BME280 | feat/3d-15-bme280 | 02–06 | Required |
| 16 | NEO-6M | feat/3d-16-neo6m-gps | 02–06 | Required |
| 17 | TEMT6000 | feat/3d-17-temt6000 | 02–06, 14 | Required |
| 18 | MAX17043 | feat/3d-18-max17043 | 02–06 | Library only |
| 19 | ESP32-C5 | feat/3d-19-esp32-c5 | 02–06 | Required |
| 20 | 5 GHz front end | feat/3d-20-five-ghz-front-end | 02–06 | Required |
| 21 | AD8318/divider | feat/3d-21-ad8318-divider | 14, 20 | Required |
| 22 | Power system | feat/3d-22-power-system | 02–06 | Required |
| 23 | Optional status LED | feat/3d-23-optional-status-led | 02–06 | Library only |
| 24 | RF simulation/import | feat/3d-24-rf-simulation | 08–22 | Required |
| 25 | Full presets | feat/3d-25-full-project-presets | 01–24 | Required |
| 26 | Guided assembly | feat/3d-26-guided-assembly | 25 | Required |
| 27 | Migrations | feat/3d-27-project-migrations | 01–26 | Required |
| 28 | Integration and QA | release/3d-v0.2-integration | All required prompts | Required |
| 90 | Optional SDR | feat/3d-90-optional-sdr-workspace | After v0.2 | Deferred |


---

# FILE: 00-project-constraints-and-repository-safety.md

# Prompt 00 — Repository Safety, Baseline and Architecture Audit

## Branch

```text
chore/3d-00-safety-audit
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Establish a recorded baseline before the multi-component expansion. This prompt should make no functional product change except safe documentation and developer checks.

## Implementation requirements

1. Inspect the repository tree, the current branch, `git status`, package files, tests and the current `apps/esp32-3d-lab/src/` architecture.
2. Identify all existing features that must remain working.
3. Identify current limitations involving one fixed board, pin-only terminal IDs, fixed board creation and project schema version 1.
4. Create `docs/BASELINE_V0_1.md` inside the 3D app containing:
   - Current architecture map.
   - Existing features.
   - Protected original files.
   - Current project schema.
   - Current test commands.
   - Known technical debt.
   - Migration risks.
5. Create `docs/MULTI_COMPONENT_PLAN.md` containing the ordered implementation phases represented by prompts 01–28.
6. Add no new dependency.
7. Make no source-code behavioural change unless a broken baseline test requires a minimal, clearly documented repair.
8. Record the current build/test result without pretending failures are fixed.

## Tests

- Run typecheck, lint, unit tests and build.
- Run existing end-to-end tests when the browser runtime is available.
- Record exact results in the baseline document.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- Baseline and migration documents exist and match the actual repository.
- No original guide file changed.
- No unrelated formatting change occurred.
- Existing application behaviour remains unchanged.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 01-multi-component-project-schema.md

# Prompt 01 — Multi-Component Scene and Project Schema V2

## Branch

```text
feat/3d-01-multi-component-schema
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Replace the single-board project limitation with a backward-compatible multi-component project model.

## Implementation requirements

1. Introduce `LabProjectV2` based on the shared schema.
2. Add stable component instances with transforms, variant IDs, lock state, groups and custom properties.
3. Replace wire endpoints with `TerminalRef { instanceId, terminalId }`.
4. Add schema validators that reject malformed component IDs, duplicate instance IDs, invalid terminal references, non-finite transforms and unsupported versions.
5. Add an explicit migration from existing version-1 projects:
   - Create one main-controller instance using a stable ID such as `main-controller`.
   - Convert every old `fromPinId` and `toPinId` to terminal references on that instance.
   - Preserve notes, measurements, project name and modified time.
   - Never mutate the imported object in place.
6. Update local-storage loading and JSON import to migrate version 1 safely.
7. Export version 2 for every newly saved project.
8. Preserve the user's old project when migration fails; show a recoverable error.
9. Add project-level `verificationMode`, `layoutPresetId` and `simulation`.
10. Do not yet add all components or change the visual layout beyond what is needed to load one ESP32 instance through the new schema.

## Tests

- Unit tests for valid V2 projects.
- Unit tests for duplicate instance IDs.
- Unit tests for invalid terminal references.
- Unit tests for V1-to-V2 migration.
- Unit tests proving failed imports do not replace the current project.
- E2E test: existing V1 fixture loads and displays the ESP32 and its wires.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- Old saved projects continue to load.
- New exports use version 2.
- Two instances may legally use the same terminal IDs because references include instance IDs.
- All existing features still work with the migrated main-controller instance.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 02-component-registry-and-terminal-contract.md

# Prompt 02 — Component Registry, Variants and Terminal Contract

## Branch

```text
feat/3d-02-component-registry
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Create a typed registry that can instantiate multiple hardware definitions and expose uniform terminals, mounting metadata and evidence status.

## Implementation requirements

1. Create `src/components/registry/` with:
   - Component definition types.
   - Registry service.
   - Variant resolver.
   - Runtime component factory interface.
   - Terminal and connector taxonomies.
2. Define terminal categories for:
   - Power input/output.
   - Ground.
   - Digital GPIO.
   - Analogue.
   - SPI, I²C and UART.
   - USB.
   - Dupont/header.
   - SMA.
   - U.FL/IPEX.
   - Passive two-terminal nodes.
3. Terminal definitions must include direction, nominal voltage domain, allowed cable ends, bus metadata, signal aliases and evidence state.
4. Refactor the current ESP32 board factory behind the new component runtime contract without changing its visible behaviour yet.
5. Add registry APIs:
   - `getDefinition(typeId)`
   - `getVariant(typeId, variantId)`
   - `createRuntime(instance)`
   - `getTerminal(instance, terminalId)`
   - `listByCategory(category)`
6. Add clear placeholder/error rendering when a saved component type or variant is unavailable.
7. Do not load remote models at runtime. GLB assets must be local and base-path aware.

## Tests

- Unit tests for registry uniqueness.
- Unit tests for terminal uniqueness within each component definition.
- Unit tests for missing variants and unknown component types.
- E2E test: the ESP32 is created through the registry and remains selectable.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The renderer no longer directly assumes the only component is the ESP32.
- Component factories share one runtime contract.
- Unknown saved components fail visibly but do not crash the whole project.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 03-placement-transform-snapping-collision.md

# Prompt 03 — Placement, Transform, Snapping and Collision Tools

## Branch

```text
feat/3d-03-placement-tools
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Allow users to place and organise multiple physical modules on the 300 × 220 mm baseplate.

## Implementation requirements

1. Add component-library and placement modes.
2. Support:
   - Drag in X/Z.
   - Raise/lower in Y.
   - Fixed rotation increments, default 15°.
   - Fine rotation, default 1°.
   - Duplicate.
   - Delete selected.
   - Lock/unlock.
   - Multi-select.
   - Group/ungroup.
   - Align left/right/front/back/centre.
   - Distribute evenly.
   - Grid snap with 5 mm default and 1 mm fine mode.
   - Mounting-hole snap.
3. Add transform gizmos or an equivalent accessible control system. Avoid accidental camera movement while dragging.
4. Compute component world-space bounding boxes and collision intersections.
5. Add non-blocking collision warnings. Do not silently prevent intentional overlap unless a strict-placement option is enabled.
6. Add mounting-point visualisation and fasteners as optional overlays.
7. Add undo/redo commands for every transform, duplicate, lock, group and delete operation.
8. Persist transforms and grouping.
9. Add keyboard movement with visible focus and millimetre increments.
10. Do not implement automatic layout optimisation.

## Tests

- Unit tests for transforms, snap calculations, alignment and distribution.
- Unit tests for lock behaviour and collision detection.
- E2E tests for placing, rotating, duplicating, locking, aligning and undoing.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- Multiple component instances can be positioned independently.
- All transforms survive save/load.
- Locked components cannot be moved through pointer or keyboard tools.
- Collision warnings identify both involved instance IDs.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 04-cables-wires-routing-harnesses.md

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


---

# FILE: 05-electrical-validation-domains-and-rules.md

# Prompt 05 — Electrical Domains and Validation Engine

## Branch

```text
feat/3d-05-electrical-validation
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Create a rule engine that validates the conceptual circuit without claiming SPICE-level or firmware-level simulation.

## Implementation requirements

1. Create a graph from component terminals and cable connections.
2. Define voltage domains including:
   - USB 5 V input.
   - Protected switched 5 V.
   - 3.3 V digital.
   - Low-noise 3.3 V RF.
   - Ground.
   - Analogue detector output.
   - RF coax signal path.
3. Add severity levels: info, caution, error and blocking.
4. Implement checks for:
   - Direct power-to-ground shorts.
   - 5 V applied to 3.3 V-only logic.
   - Missing common ground.
   - Output-to-output contention.
   - Input-only ESP32 GPIO used as output.
   - Boot-strapping pin cautions.
   - SPI CS/CSN uniqueness and idle-high expectations.
   - Shared SPI MISO requirements.
   - I²C address conflicts.
   - Missing I²C pull-ups.
   - ADC input outside declared supply range.
   - Unpowered components with active signal connections.
   - Cable connector incompatibility.
   - RF coax connected to digital terminals.
5. Separate validation results by evidence:
   - Conceptual rule.
   - Exact-part rule.
   - Hardware-validated rule.
6. In conceptual mode, show uncertainty rather than converting it into a false error.
7. Validated mode must remain unavailable until a project contains recorded hardware evidence.
8. Add a validation panel, component badges, terminal badges and a “Validate project” command.
9. Export a readable validation report to JSON and Markdown.
10. Do not implement current flow, analogue solving, timing simulation or MCU emulation here.

## Tests

- Unit tests for every validation rule.
- Graph tests with branched buses and shared ground.
- E2E test that an intentional 5 V-to-GPIO connection is flagged.
- E2E test that conceptual uncertainty is clearly labelled.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- Errors identify exact component instances and terminals.
- Conceptual and validated modes are visibly distinct.
- The app never describes the project as electrically verified merely because validation reports no known rule violation.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 06-baseplate-workbench-mounting-system.md

# Prompt 06 — Adjustable Baseplate and Mounting System

## Branch

```text
feat/3d-06-baseplate-mounting
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Model the intended modular prototype as boards mounted on a configurable acrylic or metal baseplate.

## Implementation requirements

1. Add a baseplate component with default dimensions 300 mm × 220 mm.
2. Support acrylic and metal visual materials.
3. Allow width, depth and thickness configuration.
4. Add:
   - 5 mm default grid.
   - Optional 10 mm mounting grid.
   - Drilled-hole overlay.
   - Edge margins.
   - Raised standoffs.
   - Screws and washers as optional visual elements.
5. Add baseplate zones and labels.
6. Add mounting-point snapping between component holes and standoff positions.
7. Add checks for:
   - Mounting hole outside the plate.
   - Standoff collision.
   - Component overhang.
   - Antenna too close to metal.
   - Connector blocked by plate edge or another component.
8. Allow a component to be marked as surface-mounted, standoff-mounted or free-standing.
9. Add top, bottom and mounting-plan camera views.
10. Preserve the existing neutral workbench as the world environment under the baseplate.

## Tests

- Unit tests for plate bounds, hole grid, overhang and mounting snap.
- E2E test for resizing the plate and retaining component positions.
- Visual/manual check for acrylic transparency and metal material.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The default project opens on a 300 × 220 mm plate.
- Components can snap to mounting positions.
- Antenna-to-metal keep-out warnings are available.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 07-esp32-wroom-32u-controller-board.md

# Prompt 07 — ESP32-WROOM-32U Main Controller Board

## Branch

```text
feat/3d-07-esp32-wroom-32u
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Replace the temporary PCB-antenna DevKit representation with a generic ESP32-WROOM-32U development-board variant using an external antenna connector, while retaining the old board as a legacy selectable variant.

## Implementation requirements

1. Create a new controller definition and variant:
   - `esp32-wroom-32u-devkit-generic`.
   - External U.FL/IPEX antenna connector.
   - Generic USB connector, EN/BOOT controls, regulator and USB-UART section.
2. Keep the current 30-pin DevKit as a legacy educational variant; do not delete old saved support.
3. Use generic dimensions unless a verified exact board source is available. Mark them `generic-concept`.
4. Model:
   - PCB thickness and bevel.
   - Shield can.
   - External antenna connector and pigtail anchor.
   - Header pins as terminals.
   - USB connector.
   - Buttons and major chips.
   - Mounting holes if present in the chosen generic form.
5. Add antenna keep-out and cable bend zones.
6. Use the repository design allocation for signal aliases:
   - RF SPI: GPIO18, 23, 19.
   - nRF CE/CSN: 16/17, 25/26, 32/33.
   - CC1101: CSN 27, GDO0 34.
   - UI SPI: 14, 13, 35.
   - TFT: CS 4, D/C 2.
   - MicroSD CS 5.
   - I²C: 21/22.
   - GPS receive: GPIO36.
7. Record input-only and boot-strapping warnings.
8. Add U.FL-to-SMA pigtail and external antenna as separate placeable components, not baked permanently into the board.
9. Provide inspector data, pin search aliases and mounting metadata.

## Tests

- Unit tests for the expected terminal aliases and unique IDs.
- Tests for GPIO34/35/36 input-only metadata.
- Tests for boot-strapping cautions.
- E2E test for switching controller variants without losing compatible project data.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The default main controller is the generic external-antenna 32U development board.
- The old board remains loadable.
- External antenna components connect through a typed U.FL terminal.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 08-nrf24l01-variants.md

# Prompt 08 — nRF24L01 Receiver Variants

## Branch

```text
feat/3d-08-nrf24l01-variants
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Create reusable generic nRF24L01 receiver components with PA/LNA SMA and compact PCB-antenna variants.

## Implementation requirements

1. Add one component type with two variants:
   - Default `pa-lna-sma`.
   - Alternate `compact-pcb-antenna`.
2. Model GND, VCC, CE, CSN, SCK, MOSI, MISO and IRQ terminals.
3. Mark the logic and supply expectations as exact-part dependent where marketplace breakouts vary.
4. Model:
   - PCB.
   - 2×4 header.
   - RF shield/amplifier section for PA/LNA.
   - SMA connector and detachable antenna for PA/LNA.
   - Printed antenna and keep-out area for compact variant.
5. Add local-decoupling attachment points for 100 nF and 10 µF components.
6. Add antenna keep-outs, orientation arrow and minimum-separation guidance.
7. Add mock simulation state:
   - Channel.
   - RPD/activity state.
   - Scan segment.
   - Enabled/disabled.
8. Clearly state that RPD is coarse activity, not calibrated spectrum amplitude.
9. Make the model light enough to instantiate three copies.

## Tests

- Unit tests for terminal sets and variant resolution.
- E2E test for placing both variants.
- Performance check with three PA/LNA instances and antennas.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- Both variants are available.
- PA/LNA is the default.
- Antenna and electrical warnings are visible.
- The component exposes simulation inputs without implementing transmit behaviour.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 09-three-nrf24l01-rf-bank.md

# Prompt 09 — Three-Receiver nRF24L01 RF Bank

## Branch

```text
feat/3d-09-nrf24-rf-bank
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Create the reusable three-module 2.4 GHz receiver-bank assembly used by the DarkStar base preset.

## Implementation requirements

1. Instantiate three default PA/LNA nRF24L01 components with stable IDs.
2. Assign:
   - Receiver 1 CE GPIO16, CSN GPIO17.
   - Receiver 2 CE GPIO25, CSN GPIO26.
   - Receiver 3 CE GPIO32, CSN GPIO33.
3. Share RF SPI SCK/MOSI/MISO from GPIO18/GPIO23/GPIO19.
4. Power all three from the low-noise 3.3 V RF rail, not the ESP32 board's normal 3.3 V pin.
5. Add individual 100 nF and 10 µF decoupling placements.
6. Add 100–220 µF bulk capacitance near the bank.
7. Create a reusable component group/preset called `nrf24-three-way-bank`.
8. Place antennas along a baseplate edge with adjustable separation.
9. Add collision and keep-out guidance, not rigid RF-performance claims.
10. Add simulated channel ranges so the three receivers may display different scan segments.

## Tests

- Unit tests for stable instance IDs and connection map.
- Validation test proving three separate CSN/CE lines and shared SPI lines.
- E2E test loading and deleting the group as one action.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The bank loads as three distinguishable instances.
- Wires never confuse identical terminal IDs across modules.
- Shared-bus and dedicated-control wiring matches the documented allocation.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 10-cc1101-module.md

# Prompt 10 — Generic CC1101 Receive Module

## Branch

```text
feat/3d-10-cc1101
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Add a generic receive-only CC1101 module with selectable antenna style and documented project connections.

## Implementation requirements

1. Model a generic CC1101 breakout with VCC, GND, SCK, MOSI, MISO, CSN, GDO0 and optional GDO2 terminals.
2. Add antenna variants:
   - SMA connector.
   - Spring antenna.
   - External pigtail.
3. Use project mapping:
   - Shared RF SPI GPIO18/23/19.
   - CSN GPIO27.
   - GDO0 to input-only GPIO34.
4. Power it from the low-noise 3.3 V RF rail.
5. Add 100 nF and 10 µF decoupling positions.
6. Add configured-band metadata without claiming universal frequency coverage.
7. Add mock receive state:
   - Configured centre frequency.
   - Channel.
   - RSSI-like synthetic value.
   - Activity indication.
8. No transmit controls or packet injection features.

## Tests

- Unit tests for mapping and GPIO34 direction.
- E2E placement, wiring and antenna variant test.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The CC1101 participates in the shared RF SPI bus.
- Receive-only limitations are visible.
- Antenna and regional-band uncertainty are recorded.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 11-ili9341-display.md

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


---

# FILE: 12-microsd-module.md

# Prompt 12 — MicroSD Storage Module

## Branch

```text
feat/3d-12-microsd
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Add a generic MicroSD breakout and simulated logging state.

## Implementation requirements

1. Model PCB, socket, removable card, header and mounting holes.
2. Expose VCC, GND, SCK, MOSI, MISO and CS terminals.
3. Map UI SPI SCK/MOSI/MISO to GPIO14/13/35 and CS to GPIO5.
4. Add warnings about boot-state review on GPIO5 and exact breakout level shifting.
5. Add simulation:
   - Card inserted/removed.
   - Capacity label.
   - Mock logging active/inactive.
   - Imported/exported sample log files.
6. Add a card insertion animation and inspector control.
7. Add shared-SPI validation that inactive devices must release MISO.

## Tests

- Unit tests for mapping and card state.
- E2E test for insert/remove and logging indicator.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The module shares UI SPI correctly.
- GPIO5 warning is visible.
- Card state persists in the project.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 13-mcp23017-navigation-controls.md

# Prompt 13 — MCP23017 and Five-Way Navigation Controls

## Branch

```text
feat/3d-13-mcp23017-controls
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Add the I²C expander and five-button control panel used by the base project.

## Implementation requirements

1. Add a generic MCP23017 breakout with VCC, GND, SDA, SCL, RESET, A0–A2, GPA0–GPA7 and optional interrupt terminals.
2. Default A0/A1/A2 low for address `0x20`.
3. Map:
   - GPA0 Up.
   - GPA1 Down.
   - GPA2 Left.
   - GPA3 Right.
   - GPA4 Select.
   - GPA5 TFT reset.
4. Add five separate tactile-button components or a reusable five-button panel.
5. Buttons are active-low to common ground with pull-up metadata.
6. Add press animations and interactive mock menu navigation on the ILI9341.
7. Add debounce simulation setting.
8. Add reset pull-up guidance and I²C address validation.

## Tests

- Unit tests for address calculation and GPA allocation.
- E2E test pressing buttons and observing the mock display.
- Validation test for I²C address conflict.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- Five buttons are independently selectable and pressable.
- The expander mapping matches the documented allocation.
- TFT reset is not incorrectly connected to an ESP32 pin.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 14-ads1115-module.md

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


---

# FILE: 15-bme280-module.md

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


---

# FILE: 16-neo6m-gps.md

# Prompt 16 — NEO-6M GPS Module

## Branch

```text
feat/3d-16-neo6m-gps
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Add a generic NEO-6M GPS receiver module and antenna representation.

## Implementation requirements

1. Model the GPS breakout with VCC, GND, TX and optional RX.
2. Map GPS TX to main-controller GPIO36 receive.
3. Add patch-antenna and external-antenna variants.
4. Add sky-view/orientation keep-out guidance.
5. Add mock NMEA-derived state:
   - Fix/no fix.
   - Latitude/longitude.
   - Satellites.
   - UTC.
6. Allow importing a simple JSON/CSV track.
7. Do not connect GPS RX by default.
8. Add indoor-fix uncertainty guidance.

## Tests

- Unit tests for TX-to-GPIO36 mapping and imported track parsing.
- E2E test switching fix state.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- GPS is receive oriented.
- GPIO36 input-only usage is correct.
- Imported/mock location data is labelled.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 17-temt6000-ambient-light.md

# Prompt 17 — TEMT6000 Ambient-Light Module

## Branch

```text
feat/3d-17-temt6000
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Add a generic analogue light-sensor module connected through the ADS1115.

## Implementation requirements

1. Model VCC, GND and OUT.
2. Map OUT to ADS1115 A1.
3. Add configurable synthetic lux/voltage.
4. Validate that output remains inside the ADC rail.
5. Add optical keep-clear guidance and enclosure-aperture note.
6. Optionally bind the value to mock TFT brightness.

## Tests

- Unit tests for voltage conversion bounds.
- E2E test linking sensor value to mock display brightness.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The sensor connects to ADS1115 A1 rather than directly to an arbitrary ESP32 pin.
- Optical placement guidance is visible.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 18-max17043-fuel-gauge.md

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


---

# FILE: 19-esp32-c5-wifi-survey-board.md

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


---

# FILE: 20-five-ghz-rf-front-end.md

# Prompt 20 — 5 GHz Antenna, Band-Pass Filter and Fixed Attenuator

## Branch

```text
feat/3d-20-five-ghz-front-end
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Create the receive-only 50 Ω physical signal chain before the AD8318 detector.

## Implementation requirements

1. Add separate placeable components:
   - 5 GHz receive antenna.
   - SMA/U.FL pigtails where needed.
   - Generic 5 GHz band-pass filter.
   - Generic fixed attenuator.
2. Use SMA/coax terminals, never Dupont terminals, for the RF chain.
3. Add an ordered signal-path rule:
   `antenna → filter → attenuator → detector`.
4. Add configurable conceptual passband and attenuator value.
5. Mark exact passband, insertion loss and attenuation as unverified until exact parts are selected.
6. Add cable loss and component loss fields for future calibration metadata.
7. Add antenna keep-out, orientation, metal-clearance and bend-radius guidance.
8. Add animated receive-only signal-path pulses based on synthetic/imported activity.

## Tests

- Unit tests for allowed RF-chain order and connector compatibility.
- E2E test creating the full coax chain.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The chain is visibly 50 Ω/coax based.
- Exact RF performance is not claimed.
- Wrong ordering produces a validation warning.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 21-ad8318-and-divider.md

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


---

# FILE: 22-power-input-protection-and-rf-rail.md

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


---

# FILE: 23-optional-status-led-subsystem.md

# Prompt 23 — Optional 74AHCT125 and WS2812B Status LED

## Branch

```text
feat/3d-23-optional-status-led
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Add the optional buffered addressable-status-LED subsystem to the library, but do not enable it in the default base preset.

## Implementation requirements

1. Add 74AHCT125 and WS2812B components.
2. Map conceptual data:
   - Main ESP32 GPIO15 to buffer input.
   - Buffer output through 330 Ω to WS2812B DIN.
3. Add 5 V power, ground and local decoupling.
4. Add active-low output-enable metadata.
5. Add GPIO15 boot-strapping caution.
6. Add mock colour and brightness controls.
7. Keep the subsystem optional and disabled in the default project.

## Tests

- Unit tests for mapping and optional preset status.
- E2E test for LED colour and power state.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The optional subsystem is available without changing the base project's required parts.
- The buffer and series resistor are represented.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 24-rf-data-simulation-import-and-visualisation.md

# Prompt 24 — RF Mock Data, Import Adapters and Signal Visualisation

## Branch

```text
feat/3d-24-rf-simulation
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Implement simulation Level 3 for receive-only project behaviour using synthetic or imported data.

## Implementation requirements

1. Create a simulation adapter interface shared by nRF24, CC1101, ESP32-C5, AD8318, GPS, BME280 and TEMT6000.
2. Support data sources:
   - Manual values.
   - Deterministic synthetic generator with seed.
   - JSON import.
   - CSV import.
3. Reserve, but do not activate, future adapters:
   - Web Serial.
   - WebSocket.
4. Add timeline controls: play, pause, seek, speed and loop.
5. Add visualisations:
   - nRF activity bars by configured channel segment.
   - CC1101 tuned-channel activity.
   - ESP32-C5 Wi-Fi survey table.
   - AD8318 aggregate passband-power trace.
   - Animated signal paths.
   - TFT mock dashboard.
6. Clearly label source as synthetic, imported or future live.
7. Keep all RF behaviour receive-only.
8. Do not claim electromagnetic field simulation, calibrated amplitude or frequency-selective detector behaviour beyond the documented hardware.
9. Make simulation optional so placement remains responsive.

## Tests

- Parser tests for valid/invalid JSON and CSV.
- Deterministic-generator tests.
- E2E test loading a sample dataset and playing the timeline.
- Performance test in High quality with the complete base preset.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- Synthetic and imported data produce repeatable visual output.
- Data provenance is visible.
- Future live-data interfaces exist only as disabled adapters/contracts.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 25-full-circuit-presets.md

# Prompt 25 — One-Click Complete DarkStar Base Circuit and Layout Presets

## Branch

```text
feat/3d-25-full-project-presets
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Add one-click creation of the documented base system and three arrangement presets.

## Implementation requirements

1. Add a prominent action:
   `Load Complete DarkStar RF Lab`.
2. The default preset must include:
   - ESP32-WROOM-32U generic development board.
   - External antenna pigtail and antenna.
   - Three PA/LNA nRF24L01 modules and antennas.
   - CC1101 and antenna.
   - ILI9341.
   - MicroSD.
   - MCP23017 and five buttons.
   - ADS1115.
   - BME280.
   - NEO-6M and antenna.
   - TEMT6000.
   - ESP32-C5.
   - 5 GHz antenna, filter, attenuator, AD8318 and divider.
   - USB power bank, fuse, reverse protection, switch, power LED, 5 V star distribution and 3.3 V RF regulator.
   - Required decoupling and RF bulk capacitance.
3. Keep MAX17043 and 74AHCT125/WS2812B available but unplaced by default.
4. Keep Raspberry Pi and HackRF completely outside the base preset.
5. Create three presets on the 300 × 220 mm plate:
   - Functional zones.
   - Bus-oriented.
   - Signal-flow.
6. Functional zones should reserve:
   - Power.
   - Main controller.
   - RF receiver bank.
   - UI/storage.
   - Sensors.
   - 5 GHz receive path.
7. Keep antennas at suitable plate edges and expose keep-out zones.
8. Build the documented conceptual wiring:
   - RF SPI and dedicated control lines.
   - UI SPI and TFT/SD controls.
   - I²C bus.
   - GPS TX.
   - AD8318 divider to ADS1115 A0.
   - TEMT6000 to ADS1115 A1.
   - Protected power branches and common ground.
9. Show a confirmation summary before replacing a non-empty project.
10. After loading, run validation and show:
    `Conceptual wiring — not hardware validated.`
11. Add preset reset/reapply without losing user notes unless explicitly confirmed.

## Tests

- Unit tests for component counts, stable IDs and required connections.
- Snapshot-like schema test for the preset.
- Validation test confirming no known deliberate direct short.
- E2E test loading each layout and switching among them.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- One action creates the complete base system.
- All three layout modes contain the same electrical graph.
- Optional parts remain excluded as specified.
- The project is clearly conceptual.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 26-guided-assembly-mode.md

# Prompt 26 — Guided Build and Assembly Wizard

## Branch

```text
feat/3d-26-guided-assembly
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Create a step-by-step build mode for understanding placement, wiring and safe power-up order.

## Implementation requirements

1. Add a guided build entry beside the complete-preset action.
2. Use phases:
   1. Baseplate and mounting.
   2. Protected 5 V power path.
   3. Main controller.
   4. One RF receiver and RF rail verification.
   5. Remaining RF receivers and CC1101.
   6. Display and MicroSD.
   7. MCP23017 and buttons.
   8. Sensors and GPS.
   9. ESP32-C5.
   10. 5 GHz detector chain.
   11. Validation and mock power-up.
3. Each step must:
   - Highlight involved components.
   - Isolate related cables.
   - Explain the purpose.
   - Show warnings.
   - Offer next/back/exit.
   - Preserve the user's project.
4. Add a progress checklist.
5. Allow “apply this step” for an empty or partial project.
6. Do not represent the wizard as a substitute for a reviewed schematic or measured hardware test.
7. Include a passive-use reminder in RF steps.

## Tests

- Unit tests for step order and progress persistence.
- E2E test completing, exiting and resuming the wizard.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- The wizard guides rather than locks the user.
- The power system is built and checked before sensitive RF modules.
- Progress survives reload.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 27-project-migrations-backward-compatibility.md

# Prompt 27 — Project Migrations, Compatibility and Diagnostics

## Branch

```text
feat/3d-27-project-migrations
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Stabilise saved-project compatibility after all new component systems are present.

## Implementation requirements

1. Create a migration registry rather than one hard-coded migration.
2. Support:
   - V1 single-board projects.
   - V2 multi-component projects.
   - Future version detection.
3. Add import diagnostics listing:
   - Migrated fields.
   - Unknown component types.
   - Missing variants.
   - Missing terminals.
   - Repaired defaults.
   - Dropped unsupported data.
4. Never silently discard cables or components.
5. Add a read-only recovery view for partially loadable projects.
6. Add export manifest containing app version, project schema, component-definition versions and evidence states.
7. Add sample fixtures for previous releases.
8. Keep local-storage keys namespaced.

## Tests

- Migration-chain tests.
- Fixtures for V1 and V2.
- E2E test importing an old project and exporting the new schema.
- E2E test for a partially unknown component.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- Historical projects remain recoverable.
- Import diagnostics are understandable.
- Unsupported future versions do not overwrite current state.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 28-master-integration-qa-performance.md

# Prompt 28 — Master Integration, QA, Performance and Release Readiness

## Branch

```text
release/3d-v0.2-integration
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Integrate the feature branches into one stable standalone release candidate without changing the original web guide.

## Implementation requirements

1. Work only after prompts 01–27 have passed their own checks.
2. Merge completed branches into `integration/esp32-3d-v0.2` using non-destructive merges.
3. Resolve conflicts by preserving:
   - Multi-component schema.
   - Typed terminals.
   - Component registry.
   - Cable routes.
   - Validation graph.
   - Existing camera, inspector, notes and screenshots.
4. Perform a full audit:
   - No bare terminal IDs in project connections.
   - No component-specific logic hidden inside generic scene code.
   - No leaked Three.js resources.
   - No remote assets.
   - No false `hardware-validated` state.
   - No active RF/transmit features.
5. Performance targets:
   - Smooth complete preset on a typical desktop.
   - Low/Medium/High modes visibly change cost.
   - No unbounded texture or geometry recreation.
6. Add loading progress and graceful GLB fallback.
7. Complete accessibility:
   - Keyboard placement.
   - Focus states.
   - Labels independent of colour.
   - Reduced motion.
8. Add full E2E scenarios:
   - Load complete preset.
   - Switch layouts.
   - Move and lock components.
   - Create/edit cables.
   - Run validation.
   - Play imported simulation.
   - Save, reload and import/export.
   - Complete guided build.
9. Update version and release notes only inside the 3D app unless repository-level release changes are separately approved.
10. Produce `docs/RELEASE_READINESS_V0_2.md`.

## Tests

- Typecheck.
- Lint.
- All unit tests.
- Full Playwright suite.
- Production build.
- Manual Chromium check.
- Manual inspection of Low, Medium and High quality.
- Final `git diff --stat` and `git diff`.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- Complete preset and guided build work.
- All non-optional base components are integrated.
- Existing V1 projects migrate.
- No major console error occurs.
- Original guide is unchanged.
- Release-readiness report records any remaining limitations honestly.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 90-optional-sdr-future-scope.md

# Prompt 90 — Deferred Optional Raspberry Pi Zero 2 W and HackRF Workspace

## Branch

```text
feat/3d-90-optional-sdr-workspace
```

## Required reading

Read and obey:

- `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`
- `SHARED_RULES.md`

Do not begin implementation until the current repository state and the existing 3D application architecture have been inspected.

## Outcome

Define, but do not include in the v0.2 base release, a separate receive-only SDR workspace.

## Implementation requirements

This prompt is intentionally deferred until the base system is stable.

When authorised later:

1. Add Raspberry Pi Zero 2 W and HackRF One as separate optional components.
2. Use a dedicated 5 V supply branch suitable for the selected hardware.
3. Connect HackRF to the Raspberry Pi through USB OTG.
4. Keep the branch in a separate workspace or optional preset.
5. Support imported receive-only waterfall data.
6. Do not add transmit controls, jamming, injection or active interference.
7. Do not imply that the main ESP32 can process the HackRF sample stream directly.
8. Keep the base project unchanged.

## Tests

- Deferred until separately approved.
- Add tests when implementation begins.

## Documentation

- Update the closest existing application documentation.

## Acceptance criteria

- This file acts as future scope only and must not be executed by the v0.2 master prompt.

## Completion discipline

- Keep the implementation inside `apps/esp32-3d-lab/`.
- Do not modify `web-guide/index.html`.
- Do not delete or rewrite existing working functionality.
- Review the complete diff before committing.
- Commit only after the required checks pass.
- Merge only into `integration/esp32-3d-v0.2`, never directly into `main`.
- Use the final report format from `SHARED_RULES.md`.


---

# FILE: 99-master-codex-orchestrator.md

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
