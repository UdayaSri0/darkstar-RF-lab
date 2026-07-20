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
