# Codex Prompt: DarkStar RF Lab Interactive Component Explorer

You are working in this repository:

- Repository: https://github.com/UdayaSri0/darkstar-RF-lab
- Project: DarkStar RF Lab
- Target branch: create `feature/interactive-component-explorer`

## Goal

Inspect the existing repository and upgrade the current circuit-guide website into a polished, educational, interactive component explorer for a passive multi-band RF analyser.

The site must teach users:

- what every component is;
- why it is included;
- what job it performs in this project;
- what voltage and communication interface it uses;
- which ESP32 pins connect to it;
- what each pin does;
- which pins are shared or dedicated;
- how components relate to one another;
- how power, RF, control, sensor, display, and storage paths work;
- what limitations and wiring precautions apply.

Do not replace useful existing work. Inspect the HTML, CSS, JavaScript, Canvas/SVG files, images, README, PDF documentation, and pin maps first. Reuse the current design and corrected wiring wherever possible.

## Safety and project scope

Present DarkStar RF Lab as a passive, receive-only RF observation and visualisation platform for education, electronics development, authorised laboratory testing, Wi-Fi surveying, channel-activity observation, environmental logging, GPS tagging, and receive-only SDR analysis.

Do not add or document jamming, deauthentication, packet injection, spoofing, replay attacks, active interference, forced disconnection, or offensive RF transmission.

Show a visible notice that this is not a certified laboratory instrument and must not be used for safety-critical measurements.

## Technical approach

Prefer a static, offline-capable implementation using HTML5, modern CSS, and JavaScript. Use the repository’s current approach when it is already suitable.

Prefer SVG for the main circuit graph because labels and wires remain sharp when zoomed. Keep the existing Canvas engine when it already works well and can be improved without unnecessary rewriting.

Avoid external CDNs. The website should run by opening `index.html` and should also be suitable for GitHub Pages.

Use structured data rather than hard-coding all descriptions inside drawing functions. Suggested records:

- `components`
- `pins`
- `connections`
- `buses`
- `signalPaths`
- `glossary`

Create a single source of truth for connections so the diagram, inspector, search, and documentation remain consistent.

## Required interface

Create a professional dark engineering interface with:

- DarkStar RF Lab branding
- Sub-GHz, 2.4 GHz, 5 GHz, and Passive/RX badges
- full interactive circuit workspace
- zoom in and out;
- mouse-wheel zoom;
- click-and-drag panning;
- touch support where practical;
- fit circuit;
- reset view;
- minimap;
- component search;
- layer visibility controls;
- pin-label toggle;
- wire-label toggle;
- grid toggle;
- export current view as PNG;
- printable wiring tables;
- responsive desktop, tablet, and mobile layouts.

Use clear colour groups:

- power: red;
- main controller: blue;
- 2.4 GHz RF: cyan/teal;
- sub-GHz RF: green;
- 5 GHz RF: magenta;
- UI/SPI: purple;
- sensors/I2C: yellow;
- optional SDR: orange;
- ground: grey.

Keep wires readable and avoid excessive crossings.

## Exploration modes

Add these selectable modes.

### Component mode

When a component is selected:

- highlight it;
- highlight directly connected components;
- highlight incoming and outgoing connections;
- highlight its power source and ground;
- dim unrelated components;
- open the inspector.

### Bus mode

Allow users to select:

- RF SPI;
- UI SPI;
- I2C;
- UART;
- ADC/analogue;
- GPIO;
- power;
- ground.

For a selected bus, highlight every participating component and pin. Explain the controller/master, shared lines, dedicated lines, voltage, pull-ups, chip-select behaviour, and important bus rules.

### Signal-path mode

Create guided paths for:

1. 2.4 GHz receive observation;
2. sub-GHz receive observation;
3. 5 GHz Wi-Fi survey;
4. 5 GHz RF-power detector;
5. display rendering;
6. MicroSD logging;
7. GPS tagging;
8. environmental sensing;
9. button input;
10. optional SDR receive.

Use subtle sequential highlighting with previous, next, and exit controls.

### Power mode

Show the regulated 5 V input, 5 V distribution, low-noise 3.3 V RF regulator, logic power, common ground, local decoupling capacitors, and optional independent Raspberry Pi supply.

### Learning mode

Add a guided beginner tour explaining:

1. the main controller;
2. communication buses;
3. why three nRF24L01 modules are used;
4. how shared SPI and separate chip-select pins work;
5. why RF power needs its own regulator;
6. Wi-Fi surveying versus spectrum analysis;
7. AD8318 power detection;
8. ADS1115 analogue conversion;
9. GPS and sensor metadata;
10. how the complete system works.

## Component inspector

Create a right-side inspector on desktop and a bottom drawer on mobile.

For each component show:

- name;
- manufacturer/family;
- category;
- required, optional, planned, or implemented status;
- short plain-English description;
- why it is included;
- exact role in this project;
- supply voltage;
- logic voltage;
- communication interface;
- related frequency band;
- connected components;
- important limitations;
- alternatives when useful;
- official datasheet links.

Add a pin table with:

| Module pin | Project signal | Controller pin | Direction | Electrical type | Purpose | Important note |

Explain whether every pin is power, ground, input, output, bidirectional, analogue, interrupt, chip select, shared bus, or dedicated signal. Explain idle states and restrictions where relevant.

## Components to explain

Create a separate structured record and detailed explanation for every item below.

### Main controller

**ESP32-WROOM-32U**

Explain its role as the central UI and RF coordinator, 3.3 V logic, external antenna connector, SPI/I2C/UART/ADC/GPIO responsibilities, input-only GPIO34–GPIO39 restrictions, why GPIO35 is suitable for MISO, why GPIO36 is suitable for GPS receive, and why boot-strapping pins require care.

### 2.4 GHz receive modules

**nRF24L01 #1, #2, and #3**

Explain passive 2.4 GHz channel-activity observation, shared SPI, independent CE and CSN, how three modules can divide scan work, RPD limitations, lack of calibrated amplitude measurements, PA/LNA power instability, local decoupling, and antenna spacing.

Do not describe interference generation.

### Sub-GHz receive module

**CC1101**

Explain passive sub-GHz observation, shared RF SPI, dedicated CSN, GDO0 interrupt/data-ready, antenna selection, configured frequency-band dependence, regional compliance, and measurement limitations.

### 5 GHz Wi-Fi survey

**ESP32-C5-DevKitC-1**

Explain 2.4/5 GHz Wi-Fi AP discovery, channel and RSSI reporting, optional security-mode reporting, communication with the main ESP32, separate 5 V development-board input, 3.3 V logic, common ground, and the difference between Wi-Fi surveying and raw spectrum analysis.

Mark its GPIO2/GPIO3 link as requiring verification against the exact board revision.

### 5 GHz detector chain

Document each block separately and as one signal chain:

`5 GHz receive antenna -> 5 GHz band-pass filter -> fixed attenuator -> AD8318 -> voltage divider -> ADS1115 A0 -> main ESP32`

Explain:

- 50-ohm antenna path;
- passband and insertion loss;
- attenuator protection and calibration;
- AD8318 logarithmic power-to-voltage conversion;
- 5 V AD8318 supply;
- aggregate power measurement inside the filter passband;
- inability to identify individual frequencies;
- calibration slope and intercept;
- output-voltage scaling;
- ADS1115 input limits and gain;
- why ADS1115 is used.

### Display and storage

**ILI9341 TFT**

Explain display rendering, UI SPI, CS, D/C, reset, breakout-dependent supply voltage, and backlight current.

**MicroSD**

Explain logging, configuration storage, shared UI SPI, independent CS, MISO tri-state requirements, level-shifter breakout problems, and why inactive CS must stay high.

### Controls and expansion

**MCP23017**

Explain I2C GPIO expansion, address pins, button inputs, TFT reset, pull-ups, reset pin, and why it reduces main ESP32 GPIO use.

**Five-way buttons**

Explain active-low wiring, common ground, pull-ups, debouncing, and menu navigation.

### Sensors

Explain each component individually:

- **BME280:** temperature, humidity, pressure, I2C, environmental metadata, possible addresses.
- **MAX17043:** battery state-of-charge, I2C, battery precautions, optional status.
- **NEO-6M GPS:** location tagging, GPS TX to ESP32 RX, normal receive-only wiring, antenna placement and time-to-first-fix.
- **TEMT6000:** analogue ambient-light signal, ADS1115 A1, screen brightness control.
- **74AHCT125:** 3.3 V to 5 V logic buffering for WS2812, output enable and series resistor.
- **WS2812B:** status indication, 5 V power, data input, local capacitor and brightness current.

### Power blocks

Explain:

- regulated 5 V input;
- input fuse and reverse-polarity protection;
- 5 V star distribution;
- bulk capacitance;
- dedicated low-noise 3.3 V RF regulator;
- why PA/LNA modules should not use the ESP32 3.3 V pin;
- common ground plane;
- short RF return paths;
- 100 nF and 10 uF near every RF module;
- 100–220 uF bulk capacitance near the RF group.

### Optional SDR branch

**Raspberry Pi Zero 2 W**

Explain optional Linux hosting, USB OTG, separate 5 V/2.5 A supply, processing role, and why the main ESP32 cannot directly process a full SDR stream.

**HackRF One**

Explain only receive-side use: wideband receive, frequency-selective spectrum/waterfall, USB connection to the Linux host, receive antenna and filtering.

Do not explain transmission.

## Corrected connection reference

Verify this against repository files before marking it final.

### RF SPI bus

| Main ESP32 pin | Signal | Destination |
|---|---|---|
| GPIO18 | RF_SCK | nRF #1/#2/#3 and CC1101 SCK |
| GPIO23 | RF_MOSI | nRF #1/#2/#3 and CC1101 MOSI |
| GPIO19 | RF_MISO | nRF #1/#2/#3 and CC1101 MISO |
| GPIO16 | NRF1_CE | nRF #1 CE |
| GPIO17 | NRF1_CSN | nRF #1 CSN |
| GPIO25 | NRF2_CE | nRF #2 CE |
| GPIO26 | NRF2_CSN | nRF #2 CSN |
| GPIO32 | NRF3_CE | nRF #3 CE |
| GPIO33 | NRF3_CSN | nRF #3 CSN |
| GPIO27 | CC_CSN | CC1101 CSN |
| GPIO34 | CC_GDO0 | CC1101 GDO0 |

### UI SPI bus

| Main ESP32 pin | Signal | Destination |
|---|---|---|
| GPIO14 | UI_SCK | ILI9341 and MicroSD SCK |
| GPIO13 | UI_MOSI | ILI9341 and MicroSD MOSI |
| GPIO35 | UI_MISO | ILI9341 and MicroSD MISO |
| GPIO4 | TFT_CS | ILI9341 CS |
| GPIO2 | TFT_DC | ILI9341 D/C |
| GPIO5 | SD_CS | MicroSD CS |
| MCP23017 GPA5 | TFT_RST | ILI9341 reset |

### I2C bus

| Main ESP32 pin | Signal | Devices |
|---|---|---|
| GPIO21 | I2C_SDA | MCP23017, BME280, MAX17043, ADS1115, ESP32-C5 |
| GPIO22 | I2C_SCL | MCP23017, BME280, MAX17043, ADS1115, ESP32-C5 |

### Other signals

| Source | Destination | Purpose |
|---|---|---|
| NEO-6M TX | ESP32 GPIO36 | GPS serial data |
| ESP32 GPIO15 | 74AHCT125 input | status LED data |
| 74AHCT125 output | WS2812B DIN through 330 ohm | buffered LED data |
| TEMT6000 OUT | ADS1115 A1 | ambient-light voltage |
| AD8318 VOUT | scaling network | detector output |
| scaling output | ADS1115 A0 | protected detector reading |

### ESP32-C5 conceptual link

| ESP32-C5 pin | Signal | Main ESP32 |
|---|---|---|
| GPIO2 | I2C SDA | GPIO21 |
| GPIO3 | I2C SCL | GPIO22 |
| 5V | power | regulated 5 V rail |
| GND | common reference | common ground |

Label this mapping as pending verification against the exact DevKit revision and firmware.

## Communication-bus learning page

Create an educational “Buses and Signals” view.

### SPI

Visually explain SCK, MOSI, MISO, CS/CSN, shared lines, unique chip selects, controller/peripheral roles, high idle CS state, MISO tri-state behaviour, and the difference between nRF CE and CSN.

Show separate RF SPI and UI SPI diagrams.

### I2C

Explain SDA, SCL, addressing, pull-ups, shared two-wire topology, 3.3 V logic, and common ground.

### UART

Explain TX-to-RX wiring, baud-rate agreement, common ground, and why GPS needs only its TX line for normal use.

### ADC/analogue

Explain voltage measurement, ADC conversion, ADS1115 channels, gain, input limits, scaling, and calibration.

### GPIO

Explain digital input/output, interrupts, active-high/active-low, pull-ups, input-only GPIO, and boot-strapping pins.

### Power

Explain supply voltage, logic voltage, current capacity, regulation, decoupling, star distribution, and return paths.

## Relationships and search

Search must match:

- component name;
- part number;
- GPIO;
- module pin;
- project signal;
- bus;
- purpose;
- frequency band;
- category.

Examples: `GPIO18`, `MISO`, `5 GHz`, `battery`, `GPS`, `SPI`, `ADC`, `RF power`.

Selecting a result must enable its layer, centre the view, zoom to a readable level, open the inspector, and highlight related wires.

Allow keyboard movement between connected components.

Suggested shortcuts:

- `+`: zoom in;
- `-`: zoom out;
- `0`: fit circuit;
- `/`: search;
- `Escape`: close inspector or tour;
- arrow keys: move through relationships.

## Comparison views

Add concise comparison panels for:

1. ESP32-WROOM-32U versus ESP32-C5;
2. nRF24L01 versus CC1101;
3. ESP32-C5 versus AD8318 versus HackRF.

Explain that Wi-Fi survey data, aggregate detector power, and frequency-selective SDR samples are different measurement types.

## Visual quality

Use a professional engineering-product style:

- graphite background;
- subtle grid;
- restrained neon accents;
- crisp typography;
- consistent spacing;
- readable component cards;
- accessible contrast;
- subtle shadows;
- restrained transitions;
- responsive panels.

Do not overuse glow, animation, or gradients.

## Accessibility

Implement:

- semantic HTML;
- keyboard navigation;
- visible focus states;
- ARIA labels;
- reduced-motion support;
- accessible contrast;
- labels in addition to colour;
- screen-reader text for icons;
- touch-friendly controls;
- horizontally scrollable tables on mobile.

## Documentation

Create or update, without unnecessary duplication:

- `README.md`
- `docs/COMPONENT_REFERENCE.md`
- `docs/PIN_MAP.md`
- `docs/COMMUNICATION_BUSES.md`
- `docs/POWER_DESIGN.md`
- `docs/ASSEMBLY_GUIDE.md`
- `docs/LEGAL_AND_SAFETY.md`

Update the README with the project overview, valid screenshots, current status, architecture, local launch instructions, GitHub Pages link when configured, limitations, roadmap, and receive-only legal notice.

Do not claim unbuilt hardware is completed. Mark content as Implemented, In progress, Planned, or Optional based on repository evidence.

## Quality checks

Before completion:

1. Run the website locally.
2. Test all zoom, pan, fit, reset, search, layer, inspector, minimap, guided-tour, export, and print controls.
3. Test desktop, tablet, and mobile layouts.
4. Test keyboard navigation.
5. Check the browser console.
6. Validate HTML and JavaScript.
7. Check every image and documentation link.
8. Confirm that data drives the diagram and inspector consistently.
9. Confirm that no offensive RF feature exists.
10. Confirm that conceptual pins and unbuilt hardware are labelled accurately.

## Git workflow

1. Check `git status`.
2. Fetch the latest remote state.
3. Create `feature/interactive-component-explorer`.
4. Do not force-push.
5. Do not delete unrelated files.
6. Use small logical commits, for example:

```text
feat: add structured RF component data
feat: add interactive component and bus explorer
docs: add component pin and bus documentation
style: refine responsive circuit guide interface
test: verify explorer controls and offline operation
```

7. Show the final diff.
8. Push the branch.
9. Open a pull request into `main`.
10. Include screenshots, tests, known limitations, and hardware details requiring verification in the pull-request description.

Do not commit secrets, temporary files, editor caches, dependency folders, broken images, or absolute local paths.

## Final report

Report:

- architecture selected;
- files created and modified;
- components documented;
- buses documented;
- exploration modes implemented;
- accessibility and responsive work;
- tests performed;
- branch;
- commits;
- pull-request URL;
- GitHub Pages URL, when configured;
- remaining details requiring hardware verification.

The task is complete only when a beginner can select every major component, understand why it exists, inspect its pins, trace its connections, explore its communication bus, and understand its contribution to the complete passive RF analyser.
