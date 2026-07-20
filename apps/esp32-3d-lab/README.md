# DarkStar ESP32 3D Lab

This is a standalone 3D application.

It does not replace or modify the repository's original website.

The original root `index.html` is intentionally preserved. (This repository currently has no root `index.html`; the original entry point is `web-guide/index.html`, which is also intentionally preserved.)

The 3D laboratory uses its own `index.html`, build process, assets, styles, state, and deployment path.

## What is included

- A self-contained engineering GUI with top actions, tool palette, 3D viewport, inspector, and status bar.
- A procedural ESP32 DevKit V1 educational model with raycastable board components and 30 individually inspectable header pins.
- Realistic, functional wireframe, and X-ray visual modes.
- Perspective, top, front, and side cameras with orbit, pan, zoom, and camera-state persistence.
- Pin capability data covering voltage, direction, ADC, DAC, UART, SPI, I²C, touch, and electrical warnings.
- Wire routing, point-to-point measurement, object notes, undo/redo, local autosave, JSON project import/export, and PNG screenshots.
- Version-2 multi-component project data with instance-qualified terminal references and safe migration of version-1 saved projects.
- A typed component registry with variant resolution, uniform terminal/mounting/evidence metadata, reusable runtime factories, and visible fallbacks for unavailable saved hardware.
- Namespaced settings and project storage, responsive layouts, reduced-motion support, and accessible controls.

The model is an educational representation, not a manufacturing CAD model. Always verify the silk labels, board revision, electrical limits, and pin assignments against the exact hardware and manufacturer documentation before powering a circuit.

## Run locally

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
cd apps/esp32-3d-lab
npm install
npm run dev
```

Open `http://localhost:5174/esp32-3d-lab/`.

## Commands

```bash
npm run dev       # development server on port 5174
npm run build     # typecheck and production build to dist/
npm run preview   # preview the production build on port 5174
npm run typecheck # TypeScript validation
npm run lint      # ESLint validation
npm run test      # Vitest unit suite
npm run test:e2e  # Playwright browser suite
```

Install the Playwright Chromium runtime once before the first browser test when necessary:

```bash
npx playwright install chromium
```

## Project isolation

- Application root: `#esp32-3d-lab-root`
- CSS namespace: `.ds3d-*`
- Local-storage namespace: `darkstar.esp32-3d-lab.*`
- Development port: `5174`
- Vite base: `/esp32-3d-lab/`
- Build output: this directory's `dist/`

The application has no code, state, style, router, backend, or build dependency on the existing offline web guide. See [the integration guide](docs/INTEGRATION_GUIDE.md) for deliberately unapplied deployment options.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Version 0.1 baseline](docs/BASELINE_V0_1.md)
- [Board data format](docs/BOARD_DATA_FORMAT.md)
- [Component registry contract](docs/COMPONENT_REGISTRY.md)
- [Component guide](docs/COMPONENT_GUIDE.md)
- [Integration guide](docs/INTEGRATION_GUIDE.md)
- [Multi-component implementation plan](docs/MULTI_COMPONENT_PLAN.md)
- [Roadmap](docs/ROADMAP.md)
