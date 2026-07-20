# Component registry contract

The component registry is the boundary between serialisable project instances and disposable Three.js runtime objects. `LabScene` asks the registry to create every instance; it does not import or branch on a specific hardware type.

## Definition model

A `ComponentDefinition` owns a stable type ID, display metadata, one or more variants, definition-local terminals, mounting metadata, keep-out zones, and evidence metadata. Variants own stable IDs, physical dimensions, evidence, and either procedural geometry or a local GLB path.

Terminal IDs need only be unique inside their component definition. Project references use `<instance-id>::<terminal-id>`, allowing different instances to reuse the same terminal IDs. Every terminal records:

- one or more functional or physical categories;
- direction and nominal voltage domain;
- compatible cable-end types;
- bus type, role, optional bus ID and sharing behavior;
- signal aliases and an evidence state.

The terminal taxonomy covers power input, power output, ground, digital GPIO, analogue, SPI, I²C, UART, USB, Dupont/header, SMA, U.FL/IPEX and passive two-terminal nodes. Connector-end types distinguish mating ends such as female/male Dupont, header pins, USB forms, SMA genders and U.FL/IPEX plug/jack ends.

Evidence states are `generic-concept`, `documented-allocation`, `exact-part-unverified`, or `hardware-validated`. The current ESP32 definition is `exact-part-unverified`: it preserves the original generic 30-pin board representation and does not claim revision-specific or physically validated accuracy.

## Registry APIs

- `getDefinition(typeId)` returns a registered definition.
- `getVariant(typeId, variantId)` resolves one definition variant.
- `createRuntime(instance)` creates a runtime through its registered factory.
- `getTerminal(instance, terminalId)` resolves a terminal only when the type and variant are installed.
- `listByCategory(category)` lists matching definitions.

Registration rejects duplicate component type IDs, duplicate variant IDs, duplicate terminal IDs, and remote or parent-traversing GLB paths.

## Runtime contract

A component factory receives the project instance, its definition, and resolved variant. It returns a runtime containing:

- a root `THREE.Group` and raycastable selection objects;
- definition-local terminal anchors and mounting points in millimetres;
- bounding-box and keep-out metadata;
- labels, visual-mode handling and optional simulation handling;
- readiness status, recoverable issues and a disposal function.

The ESP32 adapter wraps the existing `createEsp32Board` factory behind this contract. Geometry, labels, selectable pins and the original visible behavior remain unchanged.

## Missing hardware and assets

A valid project may contain a type or variant not present in the current build. The registry returns a selectable red placeholder with an explanatory label instead of throwing from the scene. Known component definitions still enforce their terminal IDs during project validation. Terminal semantics on an unknown definition cannot be validated until that definition is available.

GLB assets must ship with the application. Store base-relative paths in variant metadata and resolve them with `resolveLocalAssetUrl`; do not fetch component models from remote hosts at runtime.
