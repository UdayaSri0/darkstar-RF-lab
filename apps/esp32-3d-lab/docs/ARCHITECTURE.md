# Architecture

## Isolation plan

The repository's original application is the zero-build offline component explorer at `web-guide/index.html`. Its application file, documentation, images, tests, and repository-level files are protected and are not imported, modified, moved, or reformatted by this application.

The laboratory is an independent Vite package rooted at `apps/esp32-3d-lab/`. It owns its HTML entry point, dependency graph, TypeScript configuration, rendering pipeline, UI, data, tests, output directory, and documentation. No workspace or root build configuration is required.

## Runtime layers

```text
index.html (#esp32-3d-lab-root)
  └─ main.ts (startup guard)
      └─ LabApp (commands, state, persistence, inspector)
          ├─ LabScene (Three.js, CSS labels, camera, raycasting)
          │   └─ createEsp32Board (procedural geometry)
          ├─ Project schema (validation and version-1 migration)
          ├─ Board data (typed pin and capability definitions)
          ├─ Circuit rules (electrical guidance)
          └─ Namespaced ProjectStore (localStorage)
```

`LabApp` owns user intent and serialisable project state. `LabScene` owns disposable Three.js objects. The project format never serialises raw Three.js objects, which keeps saved projects stable and testable.

## Rendering

The renderer uses ACES tone mapping, sRGB output, soft shadows, hemisphere/key/rim lighting, fog, and a procedural ESD workbench. The ESP32 board is assembled from Three.js primitives so version one does not require an external GLB. Labels use `CSS2DRenderer`, and selection uses a dedicated raycaster list rather than scanning every scene object.

Rendering quality controls pixel ratio and shadows. The low-quality mode limits GPU work; medium renders at device-independent resolution; high uses up to 2× device pixel ratio.

## Project schema and migration

New and exported projects use schema version 2. Project state contains stable component instances, millimetre transforms, instance-qualified terminal references, cables, measurements, notes, verification mode, an optional layout preset, and serialisable simulation state. A terminal's project-wide runtime key is `<instance-id>::<terminal-id>`, so multiple instances may reuse definition-local terminal IDs safely.

Version-1 documents are parsed through an explicit non-mutating migration. The legacy board becomes the `main-controller` component instance and every `fromPinId`/`toPinId` becomes a terminal reference on that instance. Project name, modified time, measurements and notes are preserved. Invalid or unsupported documents do not replace the current in-memory project or overwrite the stored source.

The Prompt 01 renderer deliberately retains one procedural ESP32 runtime. It selects that board from `project.components`, applies its serialised transform, and resolves cable endpoints through the rendered instance ID. The schema permits multiple instances now; rendering all registered component types and simultaneous runtimes belongs to the component-registry phase.

Mutating operations copy the previous serialisable version-2 state into a bounded 50-entry undo history, rebuild project overlays, and autosave after a short debounce. Camera and UI settings use independent keys.

No state is attached to `window`, and no service worker or cross-application messaging is registered.

## Error handling

Startup is guarded in `main.ts`. A missing DOM prerequisite or WebGL startup error replaces the root with a recoverable error panel. Invalid stored data remains untouched and produces a recoverable notification. Invalid imported project files fail without changing the current project. Successful version-1 loads and imports notify the user that migration occurred.

## Protected original files

At implementation start, the tracked original system consisted of:

- `.gitattributes`, `README.md`, and `CONTRIBUTING.md`
- `web-guide/index.html` and `web-guide/README.md`
- `tests/explorer-smoke.mjs`
- all pre-existing content under root `docs/`

These files are outside the new application and remain protected.
