# DarkStar RF Lab interactive component explorer

The guide is a self-contained offline application built with HTML, CSS,
JavaScript, and HTML5 Canvas.

## Open the guide

Open [`index.html`](index.html) in a modern desktop browser. No Node.js
installation, dependency download, build step, or web server is required.

On Linux, from the repository root:

```bash
xdg-open web-guide/index.html
```

## Exploration modes

- **Component:** inspect a block, its direct relationships, power context and
  complete pin table.
- **Bus:** highlight RF SPI, UI SPI, I²C, UART, ADC/analogue, GPIO, power or
  ground and read the associated electrical rules.
- **Signal path:** step through ten receive, UI, logging and metadata flows.
- **Power:** isolate protected 5 V distribution, the low-noise RF rail and
  common-ground context.
- **Learning:** follow a ten-step beginner explanation of the architecture.

## Controls

- Use the mouse wheel or the **+** and **−** buttons to zoom.
- Drag the diagram to pan.
- Click a component to open its inspector.
- Search by component, part, GPIO, module pin, project signal, bus, purpose,
  frequency band or category.
- Toggle system layers, pin labels, wire labels, and the background grid.
- Use the minimap to understand the current viewport.
- Export the current view as PNG or print the wiring tables.
- Use `+`, `-`, `0`, `/`, Escape and arrow keys for keyboard operation.

The guide documents a design-stage, passive receive-only architecture. It is
not evidence of assembled hardware or validated measurements.
