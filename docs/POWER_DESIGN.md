# Power design

> [!WARNING]
> This is a design-stage allocation, not a validated schematic. Select parts,
> conductor sizes, protection and thermal margins from measured loads and the
> exact module documentation.

## Distribution

```text
protected regulated 5 V input
  ├─ main ESP32 VIN / development-board input
  ├─ display, optional LED buffer and WS2812B
  ├─ ESP32-C5 development-board 5 V input
  ├─ AD8318 5 V detector supply
  └─ low-noise 3.3 V RF regulator
       ├─ nRF24L01 #1
       ├─ nRF24L01 #2
       ├─ nRF24L01 #3
       └─ CC1101

independent regulated 5 V / 2.5 A
  └─ optional Raspberry Pi Zero 2 W and USB-hosted receive SDR
```

Place a fuse and reverse-polarity protection before the main 5 V star point.
Use adequately rated connectors and conductors. The `≥3 A` base-system label
is a design target, not a measured requirement.

## Dedicated RF rail

nRF24L01 PA/LNA variants can draw fast current pulses. Do not power the RF
group from the main ESP32 board's 3.3 V pin. Use a low-noise 3.3 V regulator
with at least 1 A design capacity, adequate transient response and thermal
margin; finalise the part only after load testing.

At every RF module place:

- 100 nF ceramic close to VCC/GND;
- 10 µF low-ESR close to the module; and
- short, low-impedance power and return connections.

Place 100–220 µF bulk capacitance near the RF group. A separate bulk capacitor
at the 5 V star point may also be appropriate after stability review.

## Ground and return paths

All base-system modules share common ground. Prefer a ground plane or planned
star return over long daisy-chained jumpers. Keep antenna/filter/detector RF
returns short. Do not route TFT backlight, MicroSD or WS2812 current through
sensitive RF ground paths.

The optional Raspberry Pi receives an independent supply because its load and
USB SDR processing are materially different. If data crosses between it and
the base system, design a safe common reference or isolated interface.

## Supply voltage versus logic voltage

A development board accepting 5 V at VIN may still expose 3.3 V-only GPIO.
Check each breakout for regulators, level shifters and back-power paths. The
ESP32 buses are 3.3 V. Use the 74AHCT125 for a 5 V WS2812 data input rather
than assuming a 3.3 V high is reliable.

## Bring-up checks

1. With modules disconnected, verify polarity, 5 V and 3.3 V set points.
2. Measure current limit and protection behaviour with a safe dummy load.
3. Check regulator temperature, ripple and start-up/turn-off behaviour.
4. Add one RF receiver and verify local voltage during activity.
5. Add receivers individually, then noisy UI/storage loads.
6. Confirm every ADC input remains within ground and ADC VDD.
7. Record measured peak and steady loads before finalising ratings.

