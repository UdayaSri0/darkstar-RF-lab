# Component reference

Statuses reflect repository evidence: the offline explorer is implemented;
physical hardware, firmware and measurement validation are not present. Unless
marked optional, hardware below is **planned**.

## Main control

### ESP32-WROOM-32U — planned

The central 3.3 V-logic controller coordinates RF receivers, UI, storage,
sensors and the Wi-Fi survey coprocessor. It operates the RF and UI SPI buses,
I²C, GPS UART receive, GPIO and ADC-related data flow. GPIO34–GPIO39 are
input-only: GPIO35 is therefore well suited to MISO and GPIO36 to GPS receive.
Boot-strapping pins, especially allocated GPIO2, GPIO5 and GPIO15, require
careful external-pull and reset-state review. The `-32U` module's external
antenna connector also requires correct antenna selection and placement.
Espressif currently marks the ESP32-WROOM-32D/32U family not recommended for
new designs (NRND), so availability and a current external-antenna alternative
should be reviewed before turning this allocation into hardware.

## Passive 2.4 GHz observation

### nRF24L01 #1 — planned

The first receiver observes coarse activity/RPD in one configured portion of
the 2.4 GHz channel set. It shares SCK/MOSI/MISO but has GPIO16 CE and GPIO17
CSN. RPD is a threshold indication, not calibrated RF amplitude.

### nRF24L01 #2 — planned

The second receiver can scan another portion in parallel. It shares RF SPI but
uses GPIO25 CE and GPIO26 CSN. Keep the antenna spaced from other RF modules
and fit 100 nF plus 10 µF locally.

### nRF24L01 #3 — planned

The third receiver uses GPIO32 CE and GPIO33 CSN, completing the planned
three-way coarse scanner. PA/LNA versions can have difficult current
transients, so they need the dedicated RF rail and 100–220 µF bulk capacitance
near the group. None of these receivers is a calibrated spectrum analyser.

## Passive sub-GHz observation

### CC1101 — planned

CC1101 adds a tuned sub-GHz receive path. It shares RF SPI, uses GPIO27 CSN and
drives data-ready/interrupt information into GPIO34 GDO0. Actual coverage
depends on chip configuration, module matching network and antenna. Choose the
correct regional band and comply with local rules; the project uses receive
observation only.

## 5 GHz Wi-Fi survey

### ESP32-C5-DevKitC-1 — planned

The C5 discovers 2.4/5 GHz Wi-Fi APs and may report channel, RSSI and security
mode. It is not a raw spectrum analyser. The development board takes its own
5 V input, uses 3.3 V logic and shares ground with the main ESP32. The proposed
C5 GPIO2 SDA/GPIO3 SCL link to main GPIO21/GPIO22 is conceptual and must be
verified against the exact board revision and firmware.

## Filtered 5 GHz detector chain

The planned path is:

`50 Ω antenna → band-pass filter → fixed attenuator → AD8318 → divider → ADS1115 A0 → ESP32`

### 5 GHz receive antenna — planned

The antenna couples received energy into a 50 Ω path. Its bandwidth, pattern,
cable and connector loss affect every reading and must be recorded during
calibration.

### 5 GHz band-pass filter — planned, exact part not selected

The filter limits which frequencies contribute to detector power. Its actual
passband and insertion loss, not the diagram label alone, define the
measurement. Characterise it with the rest of the receive path.

### Fixed attenuator — planned, value not final

The shown 10 dB pad protects the detector, improves impedance consistency and
extends the useful input range. Its measured loss and tolerance are part of
the calibration. Select value and power rating from expected maximum input.

### AD8318 — planned

AD8318 is a 5 V logarithmic RF detector. It converts the aggregate RF power
inside the upstream filter passband into a voltage; it cannot reveal which
individual frequencies produced that power. Convert VOUT to an input estimate
only after measuring slope and intercept and accounting for filter,
attenuator, cable and antenna effects.

### VOUT scaling network — planned

A nominal 10 kΩ top/20 kΩ bottom divider scales a possible 4.9 V output to
about 3.27 V. Verify resistor tolerances and worst-case voltage before
connecting ADS1115 A0.

### ADS1115 — planned

The 16-bit I²C ADC measures detector voltage on A0 and ambient light on A1.
Its programmable gain improves resolution compared with the internal ESP32
ADC, but an input must still remain between GND and VDD. Select gain for the
maximum scaled voltage and include ADC offset/gain in calibration.

## Display, storage and controls

### ILI9341 TFT — planned

The TFT renders menus, observations and status over UI SPI. It has independent
CS and D/C plus MCP23017-driven reset. Breakout input voltage, level shifters
and backlight current differ; check the exact board rather than assuming all
ILI9341 modules accept the same power.

### MicroSD — planned

MicroSD stores configuration, observation and calibration records. It shares
UI SPI but has an independent GPIO5 CS that must idle high. The card/breakout
must tri-state MISO while inactive; some resistor or MOSFET level-shifter
boards prevent reliable sharing.

### MCP23017 — planned

The 3.3 V I²C expander reduces main-ESP32 pin use. A0–A2 are planned low for
address `0x20`; RESET is pulled high. GPA0–GPA4 read active-low buttons with
pull-ups and GPA5 drives TFT reset.

### Five-way buttons — planned

Up, down, left, right and select each connect an MCP23017 input to common
ground. Pull-ups make the idle state high and pressed state low. Debounce in
hardware or firmware before using presses for menu navigation.

## Sensors and indication

### BME280 — planned

BME280 supplies temperature, humidity and pressure metadata over I²C at
`0x76` or `0x77`. Board heating and enclosure airflow affect readings; it does
not measure RF conditions directly.

### MAX17043 — optional

The fuel gauge can estimate a compatible single-cell battery's voltage and
state of charge over I²C. It is not battery protection or a charger. Verify
the cell, breakout and complete protected power path before use.

### NEO-6M GPS — planned

GPS tags logs with position and time. Module TX connects to input-only GPIO36;
normal use needs no GPS RX connection. Antenna placement, sky view and stored
almanac affect time-to-first-fix, and indoor operation may not fix.

### TEMT6000 — planned

This analogue ambient-light sensor feeds ADS1115 A1 so firmware can adapt
screen brightness. Its output is approximate and depends on resistor, optics
and enclosure; keep it within the 3.3 V ADC rails.

### 74AHCT125 — optional

The buffer converts ESP32 GPIO15's 3.3 V data to a strong 5 V-compatible
WS2812 signal. Connect the selected active-low output-enable correctly, avoid
floating unused inputs and add the planned series resistor.

### WS2812B — optional

The 5 V addressable LED provides status indications. DIN receives buffered
data through 330 Ω. Add local decoupling/bulk capacitance and limit brightness
because maximum colour values can draw significant current.

## Power blocks

### Protected regulated 5 V input — planned

The base system starts at a regulated 5 V source sized from measured peak
load. Add an input fuse, reverse-polarity protection and suitable connector.

### 5 V star distribution — planned

Separate branches reduce shared voltage drop between controller, display, C5,
detector and the RF regulator. Place bulk capacitance at the distribution point.

### Low-noise 3.3 V RF regulator — planned, exact part not selected

This rail supplies the three nRF24L01 modules and CC1101 instead of loading the
ESP32 3.3 V pin. Fit 100 nF and 10 µF at every RF module and 100–220 µF near
the group.

### Common ground plane — planned

All base-system signals require a shared low-impedance reference. Keep RF
return paths short and avoid passing display/backlight/LED current through RF
ground traces.

## Optional receive-only SDR branch

### Raspberry Pi Zero 2 W — optional

The Linux host runs SDR acquisition and waterfall processing because the main
ESP32 cannot process a full HackRF USB sample stream. Connect HackRF by USB OTG
and use a separate regulated 5 V/2.5 A supply branch.

### HackRF One — optional, receive use only

HackRF adds wideband, frequency-selective receive samples for a spectrum or
waterfall on the Linux host. Use a receive antenna and suitable filtering.
Transmit operation is outside this project's documentation and scope.

## Measurement types are not interchangeable

- ESP32-C5 reports decoded Wi-Fi survey metadata.
- nRF24L01 reports coarse 2.4 GHz activity.
- CC1101 observes a configured sub-GHz receive channel/band.
- AD8318 reports aggregate power inside the selected filter passband.
- HackRF plus Linux can report frequency-selective receive samples.

None of the planned paths is presented as a certified instrument.
