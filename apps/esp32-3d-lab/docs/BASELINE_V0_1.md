# Version 0.1 baseline

Audit date: 2026-07-20

Audit branch: `chore/3d-00-safety-audit`

Baseline commit: `d12d86c` (`main` at branch creation)

This document records the standalone ESP32 3D Lab before the multi-component expansion. It describes the code and checks as found; it does not claim that the known limitations have been repaired.

## Repository safety state

The requested local integration branch did not exist at audit start. A local `integration/esp32-3d-v0.2` branch was created at `main`, and this audit branch was created from it. On the older starting feature branch, the working tree showed a modified root `README.md` and an untracked `docs/darkstar-codex-prompt-pack/` directory. They were preserved and are not part of this audit. While the audit was in progress, the matching upstream task branch advanced to `6bddcf4`, which tracks that pre-existing root documentation; it made no change to the protected guide, the 3D application source, tests or package files.

The two rule files named by Prompt 00, `SHARED_RULES.md` and `apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`, were not present at the baseline commit. The audit followed the available copy at `docs/darkstar-codex-prompt-pack/apps/esp32-3d-lab/docs/codex-prompts/SHARED_RULES.md`; it was untracked at audit start and was subsequently tracked by the upstream update described above. The prompt pack is unchanged by this audit commit.

## Current architecture map

```text
apps/esp32-3d-lab/
├── index.html                         standalone DOM entry point
├── src/main.ts                        guarded application startup
├── src/app/
│   ├── LabApp.ts                      commands, UI events, project state and history
│   ├── ProjectStore.ts                namespaced localStorage persistence
│   └── types.ts                       v1 project, board, pin and UI contracts
├── src/ui/
│   ├── shell.ts                       application shell and controls
│   └── dom.ts                         required-element and HTML-escaping helpers
├── src/rendering/LabScene.ts          Three.js scene, camera, input and overlays
├── src/boards/createEsp32Board.ts      fixed procedural ESP32 board factory
├── src/data/esp32DevKit.ts             singleton board and 30-pin data
├── src/circuit/electricalRules.ts      per-pin informational rules
├── src/utilities/ids.ts                project-item ID generation
├── src/styles/main.css                 isolated responsive application styles
└── tests/
    ├── unit/                           board-data and persistence tests
    └── browser/                        Playwright shell and interaction smoke tests
```

Runtime flow:

```text
index.html
  -> main.ts
    -> LabApp
      -> createShell
      -> ProjectStore
      -> LabScene(esp32DevKit)
        -> createEsp32Board(esp32DevKit)
        -> wire and measurement overlays
```

`LabApp` owns serialisable project state, a 50-entry undo history, autosave, commands and inspector updates. `LabScene` owns the WebGL renderer, CSS labels, camera controls, raycasting and regenerated project overlays. The data module exports a one-item `boards` array and the single `esp32DevKit` definition. Three.js objects are not stored in project JSON.

The package is independent of the repository root and the offline web guide. It uses Vite with base path `/esp32-3d-lab/`, output directory `dist/`, development port `5174`, and local-storage keys under `darkstar.esp32-3d-lab.*`.

## Existing features to preserve

- Standalone Vite, strict TypeScript and Three.js application with no dependency on the offline guide.
- Responsive engineering shell with top actions, tool palette, viewport, inspector, status bar, settings, help and recoverable startup error UI.
- Procedural educational ESP32 DevKit V1 30-pin model with PCB, module shield, PCB antenna, USB connector, regulator, UART bridge, header contacts and labels.
- Raycast selection and highlighting for the board, major onboard parts and all 30 header pins.
- Pin inspection for physical number, GPIO, voltage, direction, functions, ADC/DAC/UART/SPI/I2C/touch capabilities, warnings and current connections.
- Perspective, top, front and side camera views; orbit, pan, zoom, reset and persisted camera position.
- Realistic, functional wireframe and X-ray visual modes.
- Low, medium and high render quality, optional grid and labels, FPS reporting and reduced-motion controls.
- Basic two-pin wire creation with generated colour and label, rendered as a quadratic tube.
- Point-to-point pin measurements with stored millimetre coordinates and dashed overlays.
- Notes attached to selected object IDs and displayed in the inspector.
- Bounded undo/redo for project mutations, delete-last behaviour and keyboard shortcuts.
- Debounced local project autosave, separate settings/camera persistence, new project, JSON import/export and PNG screenshots.
- Safe fallback for invalid stored JSON and unsupported imported project files.
- Namespaced CSS, storage and DOM identifiers; visible keyboard focus, skip link and accessible control labels.
- Unit coverage for the board data, pin guidance and persistence, plus Playwright smoke coverage for startup, tools/settings and storage isolation.

## Protected original files

The original offline application and its supporting files are outside this package and must not be modified by the 3D expansion:

- `web-guide/index.html` (explicitly protected)
- `web-guide/README.md`
- `tests/explorer-smoke.mjs`
- root repository files, including `.gitattributes`, `README.md` and `CONTRIBUTING.md`
- pre-existing root `docs/` content

For this baseline-only prompt, all existing application source, tests, configuration, package manifests and working documentation are also behaviourally protected. The only intended changes are this document, `MULTI_COMPONENT_PLAN.md`, and documentation links in the application `README.md`.

## Current project schema

The persisted and exported format is version 1:

```ts
interface LabProject {
  version: 1;
  name: string;
  boardId: string;
  wires: Array<{
    id: string;
    fromPinId: string;
    toPinId: string;
    color: string;
    label: string;
  }>;
  measurements: Array<{
    id: string;
    from: [number, number, number];
    to: [number, number, number];
    distanceMm: number;
  }>;
  notes: Array<{
    id: string;
    targetId: string;
    text: string;
    createdAt: string;
  }>;
  modifiedAt: string;
}
```

`createEmptyProject()` always selects `esp32-devkit-v1-30p`. `loadProject()` accepts only version 1 with array-shaped `wires` and `notes`, then shallowly merges it over the default. JSON import additionally requires a known `boardId` and an array-shaped `wires`. New saves overwrite the namespaced project key and update `modifiedAt`.

### Fixed single-board limitations

- `LabApp` passes the imported `esp32DevKit` singleton directly to `LabScene`; saved `boardId` does not drive scene construction.
- `LabScene` constructs exactly one board through `createEsp32Board()` and keeps one `BoardModel`.
- The board selector contains one hard-coded option and has no change handler.
- The board factory returns board-specific `pinPositions`, labels and selectables rather than a general component runtime contract.
- Wires identify endpoints only by bare `fromPinId` and `toPinId`. IDs such as `pin-21` are unique only inside the one board and would collide across component instances.
- Notes also use bare selection IDs, and measurements store fixed world coordinates instead of instance/terminal references.
- Project version 1 has one `boardId` and no components, instance transforms, variants, terminal references, cables, verification mode, layout preset or simulation state.

## Current commands and recorded results

Environment used: Node.js `v22.22.1`, npm `9.2.0`. Installed packages satisfied the lockfile and `npm ls --depth=0` completed successfully. No dependency was added or updated.

The following commands were run from `apps/esp32-3d-lab/` on the untouched application baseline:

| Command | Result |
| --- | --- |
| `npm run typecheck` | Passed; `tsc --noEmit` exited 0. |
| `npm run lint` | Passed; `eslint .` exited 0. |
| `npm run test` | Passed; 2 Vitest files and 7 tests passed. |
| `npm run build` | Passed; 16 modules transformed and production assets built. Vite reported an existing chunk-size warning for the 550.49 kB minified JavaScript bundle (140.10 kB gzip). |
| `npm run test:e2e` | Passed; the installed Chromium runtime ran all 3 Playwright tests successfully. |

The browser suite produced non-failing worker warnings that `NO_COLOR` was ignored because `FORCE_COLOR` was set. No baseline failure was repaired or suppressed.

## Known technical debt

- Project and settings validation is shallow; nested values, finite coordinates, duplicate IDs and referenced pins are not comprehensively validated.
- There is no project migration framework or backward-compatible schema dispatcher.
- Board, pin lookup, warning counts, wire tools and rendering all depend directly on the singleton ESP32 definition.
- `evaluatePin()` is limited to per-pin guidance and is not a connection/domain validation engine.
- Project overlays are cleared and rebuilt without explicitly disposing their geometries and materials, which can leak GPU resources as editing continues.
- The procedural board runtime has no disposal callback, bounding box, keep-out zones, mounting points, terminal anchors or simulation adapter.
- Global window listeners and the running scene are not connected to an application-level teardown lifecycle.
- The fixed workbench is 180 × 130 scene units; the selected 300 × 220 mm configurable baseplate does not exist.
- Board geometry contains fixed dimensions and positions rather than variant-driven geometry; `dimensionsMm` does not drive the factory.
- Delete-last compares generated ID strings across item types, so it does not reliably identify chronological recency when UUIDs are used.
- Measurements are static coordinate snapshots and will not follow future component movement.
- Existing automated coverage is intentionally small: it does not exercise wiring, measurement, notes, undo/redo, JSON import/export, camera persistence, visual modes or resource disposal.
- The production build is functional but exceeds Vite's default 500 kB chunk warning threshold.

## Migration risks

- Version-1 projects must be migrated without mutating or overwriting the original saved payload, especially when validation fails.
- Every v1 pin endpoint must map to a stable main-controller instance and become an `<instance-id>::<terminal-id>` runtime identity. Bare IDs cannot remain project-global.
- Legacy note target IDs and absolute measurement coordinates need an explicit preservation policy so existing annotations are not silently lost.
- Singleton assumptions span UI tools, warnings, inspector lookup, rendering and persistence; changing only the TypeScript schema would leave inconsistent behaviour.
- The current PCB-antenna DevKit must remain loadable as a legacy variant when the ESP32-WROOM-32U external-antenna controller becomes the default.
- Rebuilding many components and cables with the current disposal gaps would amplify memory and GPU-resource leaks.
- Component transforms must consistently preserve the existing millimetre convention, Y-up coordinates and X/Z work surface.
- Unknown component types or variants must render recoverable placeholders rather than crashing a whole imported project.
- Multi-instance selection and notes require stable instance-qualified object identities, not only terminal qualification.
- Validation must distinguish conceptual/documented allocations from hardware-validated evidence and must not upgrade evidence claims during migration.
- Expanding browser workflows substantially beyond the three current smoke tests raises regression risk around autosave, history, input focus and camera gestures.
