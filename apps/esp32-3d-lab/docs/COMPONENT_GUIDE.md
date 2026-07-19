# Component guide

## ESP32 development board

The version-one model represents the common 30-pin ESP32 DevKit V1 form factor. It includes a PCB, dual header rows, ESP32-WROOM shield, PCB antenna zone, Micro USB connector, USB-to-UART bridge, voltage regulator, contacts, and board details. It is intentionally procedural and lightweight rather than dimensionally exact CAD.

## Selection and inspection

Select the PCB or a major component to identify its role. Select a gold contact or header block to see the physical pin, GPIO, voltage, input/output direction, supported functions, peripheral capabilities, electrical warnings, current wire connections, and attached notes.

## Tools

- **Select:** inspect components and pins.
- **Rotate / Pan:** choose the left-drag camera behaviour. Wheel or trackpad scroll zooms.
- **Wire:** select two different header pins to create a routed wire.
- **Measure:** select two different header pins to record their straight-line separation.
- **Add note:** select a target, enter text in the inspector, and add the note.
- **Toggle labels:** show or hide component and GPIO labels.
- **Delete last:** remove the newest wire, measurement, or note.
- **Undo / Redo:** traverse up to 50 project changes.
- **Reset camera:** return to the default perspective.

Keyboard shortcuts are shown beside the tools. `Ctrl/Cmd+Z` undoes and `Ctrl/Cmd+Shift+Z` redoes.

## Visual modes

- **Realistic:** shaded engineering model.
- **Functional:** wireframe view for understanding geometry and alignment.
- **X-ray:** translucent materials for studying overlap and placement.

## Electrical responsibility

The inspector communicates common ESP32 constraints, including 3.3 V-only GPIO, input-only pins, reset/serial responsibilities, and strapping pins. It does not replace the exact board schematic, module datasheet, or a pre-power continuity and voltage check.
