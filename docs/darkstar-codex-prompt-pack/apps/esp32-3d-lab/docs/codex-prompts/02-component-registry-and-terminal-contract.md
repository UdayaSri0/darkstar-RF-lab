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
