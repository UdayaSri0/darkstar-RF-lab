# Multi-component implementation plan

This is the ordered implementation sequence represented by Prompts 01–28. Each phase builds on the merged result of the previous phase and must preserve version-1 projects, standalone deployment and the protected offline guide.

1. **Multi-component scene and project schema V2** — introduce component instances, transforms and instance-qualified terminal references, with safe version-1 migration and version-2 exports.
2. **Component registry, variants and terminal contract** — add typed definitions, evidence metadata, terminal taxonomy, variant resolution and a uniform disposable runtime factory contract.
3. **Placement, transform, snapping and collision tools** — place and organise multiple instances on a 300 × 220 mm surface with accessible transforms, grouping, alignment, locking, snapping and warnings.
4. **Realistic cable, wire, connector and harness system** — replace pin-only tubes with typed terminal cables, editable routes, cable lengths, compatible ends, bundles and routing diagnostics.
5. **Electrical domains and validation engine** — validate conceptual voltage, current, grounding, contention, bus, strapping and connector rules without claiming circuit or firmware emulation.
6. **Adjustable baseplate and mounting system** — model configurable acrylic/metal baseplates, hole patterns, mounting hardware, clearances and mounting validation.
7. **ESP32-WROOM-32U main controller board** — add the external-antenna controller as the preferred variant while retaining the current PCB-antenna DevKit for legacy projects.
8. **nRF24L01 receiver variants** — add generic PA/LNA SMA and compact PCB-antenna receiver variants with shared logical terminals and honest evidence states.
9. **Three-receiver nRF24L01 RF bank** — compose the reusable three-module 2.4 GHz receiver bank and its project allocations.
10. **Generic CC1101 receive module** — add a receive-only sub-GHz module with selectable antenna style and documented connections.
11. **ILI9341 display module** — add the placeable TFT, terminals and realistic mock screen behaviour.
12. **MicroSD storage module** — add the breakout, shared-bus representation and simulated logging state.
13. **MCP23017 and five-way navigation controls** — add the I2C expander and button-control assembly used by the base project.
14. **ADS1115 ADC module** — add the I2C ADC for detector and ambient-light inputs.
15. **BME280 environmental sensor** — add the I2C sensor and configurable mock environmental readings.
16. **NEO-6M GPS module** — add the GPS receiver, serial terminals and antenna representation.
17. **TEMT6000 ambient-light module** — add the analogue light sensor and ADS1115 connection path.
18. **MAX17043 fuel-gauge module** — add the fuel gauge to the library but exclude it from the default USB-power-bank preset until a compatible cell design is approved.
19. **ESP32-C5 Wi-Fi survey coprocessor** — add a generic 2.4/5 GHz survey board for receive/observation metadata.
20. **5 GHz antenna, band-pass filter and fixed attenuator** — model the passive receive-only 50-ohm chain preceding the detector.
21. **AD8318 detector and output scaling network** — add the logarithmic detector and visible resistor divider feeding ADS1115 A0.
22. **USB power input, protection, distribution and RF rail** — implement the selected input protection, switching, indication, protected 5 V distribution and low-noise 3.3 V RF supply path.
23. **Optional 74AHCT125 and WS2812B status LED** — add the buffered indicator subsystem to the library while keeping it disabled in the default base preset.
24. **RF mock data, import adapters and signal visualisation** — provide synthetic/imported receive-only observations and clearly bounded visual simulation.
25. **One-click complete base circuit and layout presets** — create the documented system and Functional, Bus and Signal-flow layouts from reproducible preset data.
26. **Guided build and assembly wizard** — add ordered placement, wiring, inspection and safe-power-up guidance.
27. **Project migrations, compatibility and diagnostics** — consolidate migrations and import/export diagnostics once all component systems and persisted fields are known.
28. **Master integration, QA, performance and release readiness** — integrate, regression-test, profile, document and prepare the standalone release candidate without changing the original guide.

## Sequencing gates

- Phases 01–06 establish the data, runtime, editing, cable, validation and physical-workbench foundations before adding the hardware catalogue.
- Phases 07–23 add controller, receiver, peripheral, RF-chain and power components against those stable contracts.
- Phases 24–26 add simulation, complete presets and guided workflows after the full component graph is available.
- Phase 27 hardens compatibility after the persisted feature set is complete; Phase 28 is the final integration and release gate.
- Each prompt uses its named feature branch from `integration/esp32-3d-v0.2`, runs its required checks, commits only its intended app files, and merges only after checks pass. No phase merges directly to `main` or changes `web-guide/index.html`.
