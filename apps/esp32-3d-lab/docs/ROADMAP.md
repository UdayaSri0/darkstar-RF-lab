# Roadmap

## Version 0.1 — standalone foundation

- Independent Vite/TypeScript/Three.js build and engineering GUI.
- Procedural 30-pin ESP32 DevKit model and pin inspector.
- Camera controls, labels, visual modes, wiring, measurements, notes, history, save/load, screenshots, tests, and isolation documentation.

## Version 0.2 — circuit authoring

- Add breadboard, power supply, sensors, RF modules, and common passives as placeable components.
- Add terminal-to-terminal wiring with wire selection, color/route editing, and targeted deletion.
- Validate voltage domains, output contention, missing grounds, strapping-pin use, and current-budget estimates.
- Add connector snapping and an orthographic measurement workflow.

## Version 0.3 — board fidelity and education

- Add revision-specific board definitions with source citations.
- Add optimised GLB board models and optional exploded views.
- Add guided lessons for GPIO, ADC, SPI, I²C, UART, grounding, and safe power-up.
- Add a pin-search and signal-highlighting mode.

## Version 0.4 — project collaboration

- Add schema migrations and richer import diagnostics.
- Add shareable read-only project packages and printable wiring schedules.
- Add optional, versioned launch messaging only after an integration contract is approved.

## Performance targets

- Maintain 60 FPS on typical desktop integrated graphics and 30 FPS on supported mobile hardware.
- Keep static model draw calls bounded through instancing and merged geometry.
- Load the core laboratory interactively without remote model assets.
- Add automated accessibility and visual-regression coverage.
