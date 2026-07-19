# Board data format

Board definitions live in `src/data/` and conform to `BoardDefinition` in `src/app/types.ts`.

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

Each pin has a stable ID, physical number, optional GPIO number, header side, named functions, voltage statement, capability flags, and zero or more warnings. Stable IDs are used by project wires and must not be changed after a board definition ships.

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

## Adding a board

1. Add a typed module under `src/data/`.
2. Use a new stable board ID and stable unique pin IDs.
3. Add the definition to the exported `boards` array.
4. Add a procedural model factory or a base-aware GLB loader.
5. Add unit tests for pin count, unique IDs, power pins, and key bus functions.
6. Add the board selector option and verify old project files still load.

Pin data is educational. Record revision-specific uncertainty explicitly and link future data provenance in the board module rather than presenting assumptions as verified electrical facts.
