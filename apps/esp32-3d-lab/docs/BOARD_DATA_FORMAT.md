# Board data format

The original ESP32 pin source remains in `src/data/` and conforms to `BoardDefinition` in `src/app/types.ts`. It now feeds the ESP32 component definition and runtime adapter rather than being constructed directly by the renderer.

```ts
interface BoardDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  dimensionsMm: [number, number, number];
  pins: PinDefinition[];
}
```

Each pin has a stable ID, physical number, optional GPIO number, header side, named functions, voltage statement, capability flags, and zero or more warnings. Pin IDs are stable within their component definition and must not be changed after a board definition ships.

```ts
interface PinDefinition {
  id: string;
  name: string;
  pinNumber: number;
  gpio: number | null;
  side: "left" | "right";
  functions: string[];
  voltage: string;
  capabilities: {
    input: boolean;
    output: boolean;
    adc?: string;
    dac?: string;
    uart?: string;
    spi?: string;
    i2c?: string;
    touch?: string;
  };
  warnings: string[];
}
```

Project cables do not use a bare pin ID as a global identifier. They qualify the definition-local pin with its component instance:

```ts
interface TerminalRef {
  instanceId: string;
  terminalId: string;
}
```

For example, `main-controller::pin-21` and `aux-controller::pin-21` are distinct runtime terminals even though both component instances use the same board definition.

## Adding a board

1. Add the source data under `src/data/` when a board-specific data layer is useful.
2. Define a stable component type, variants, terminals, mounting data, keep-out zones, and evidence metadata under `src/components/`.
3. Implement the shared runtime factory contract and register it in `src/components/registry/defaultRegistry.ts`.
4. Keep GLB assets local and resolve their URLs with the base-aware registry helper; runtime network model loading is prohibited.
5. Add unit tests for component, variant and terminal uniqueness, electrical metadata, and factory output.
6. Verify project loading, selection, visual modes and old migrations through browser tests.

Pin data is educational. Record revision-specific uncertainty explicitly and link future data provenance in the board module rather than presenting assumptions as verified electrical facts.
