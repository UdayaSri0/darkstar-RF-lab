# DarkStar RF Lab pin map

> [!CAUTION]
> This is a design allocation, not a prototype-validated schematic. Check the
> exact development-board revision, breakout circuitry and ESP32 boot states
> before assembly. The ESP32-C5 link remains conceptual.

## Main ESP32 RF SPI

| ESP32 pin | Project signal | Destination | Direction at ESP32 | Rule |
|---|---|---|---|---|
| GPIO18 | `RF_SCK` | nRF24L01 #1/#2/#3 and CC1101 SCK | Output | Shared clock |
| GPIO23 | `RF_MOSI` | All four RF modules MOSI | Output | Shared controller-to-peripheral data |
| GPIO19 | `RF_MISO` | All four RF modules MISO | Input | Inactive peripherals must release the line |
| GPIO16 | `NRF1_CE` | nRF #1 CE | Output | Dedicated radio enable |
| GPIO17 | `NRF1_CSN` | nRF #1 CSN | Output | Dedicated, active-low; idle high |
| GPIO25 | `NRF2_CE` | nRF #2 CE | Output | Dedicated radio enable |
| GPIO26 | `NRF2_CSN` | nRF #2 CSN | Output | Dedicated, active-low; idle high |
| GPIO32 | `NRF3_CE` | nRF #3 CE | Output | Dedicated radio enable |
| GPIO33 | `NRF3_CSN` | nRF #3 CSN | Output | Dedicated, active-low; idle high |
| GPIO27 | `CC_CSN` | CC1101 CSN | Output | Dedicated, active-low; idle high |
| GPIO34 | `CC_GDO0` | CC1101 GDO0 | Input | Interrupt/data-ready; GPIO34 is input-only |

## Main ESP32 UI SPI

| ESP32/expander pin | Project signal | Destination | Direction | Rule |
|---|---|---|---|---|
| GPIO14 | `UI_SCK` | ILI9341 and MicroSD SCK | Output | Shared clock |
| GPIO13 | `UI_MOSI` | ILI9341 and MicroSD MOSI | Output | Shared data |
| GPIO35 | `UI_MISO` | ILI9341 and MicroSD MISO | Input | GPIO35 is input-only; both breakouts must tri-state |
| GPIO4 | `TFT_CS` | ILI9341 CS | Output | Active-low; idle high |
| GPIO2 | `TFT_DC` | ILI9341 D/C | Output | Boot-strapping pin; check external pulls |
| GPIO5 | `SD_CS` | MicroSD CS | Output | Active-low; idle high; boot-state review required |
| MCP23017 GPA5 | `TFT_RST` | ILI9341 reset | Output | Keeps reset off the main GPIO allocation |

## I²C, UART and other signals

| Source pin | Signal | Destination | Electrical notes |
|---|---|---|---|
| ESP32 GPIO21 | `I2C_SDA` | MCP23017, BME280, MAX17043, ADS1115, conceptual ESP32-C5 SDA | Bidirectional open-drain, pulled to 3.3 V |
| ESP32 GPIO22 | `I2C_SCL` | Same I²C devices | Open-drain clock, pulled to 3.3 V |
| NEO-6M TX | `GPS_TX` | ESP32 GPIO36 RX | UART; GPIO36 is input-only and appropriate here |
| ESP32 GPIO15 | `LED_DATA` | 74AHCT125 input | GPIO15 is a boot-strapping pin; buffer to 5 V logic |
| 74AHCT125 output | `LED_DATA_5V` | WS2812B DIN through 330 Ω | Keep selected active-low OE asserted |
| TEMT6000 OUT | `AMBIENT_LIGHT` | ADS1115 A1 | Analogue voltage within ADC supply rails |
| AD8318 VOUT | `RF_DETECTOR_RAW` | 10 kΩ/20 kΩ scaling network | May approach 4.9 V; do not connect directly to 3.3 V ADC |
| Scaling output | `5G_RF_POWER` | ADS1115 A0 | Nominal maximum about 3.27 V; verify tolerances |

## MCP23017 allocation

| Expander pin | Function | Direction / idle state |
|---|---|---|
| GPA0–GPA4 | Up, down, left, right and select buttons | Inputs with pull-ups; pressed = low |
| GPA5 | TFT reset | Output; follow display reset timing |
| A0–A2 | Address selection | Planned low/low/low = `0x20` |
| RESET | Expander reset | Pull up to 3.3 V, typically 10 kΩ |

## ESP32-C5 conceptual link

| C5 DevKit signal | Main ESP32 | Status |
|---|---|---|
| GPIO2 / conceptual SDA | GPIO21 SDA | Pending exact-board and firmware verification |
| GPIO3 / conceptual SCL | GPIO22 SCL | Pending exact-board and firmware verification |
| 5 V | Protected 5 V rail | Separate DevKit input, not main ESP32 3.3 V pin |
| GND | Common ground | Required reference |

## Pin restrictions

- ESP32 GPIO34–GPIO39 are input-only. This is why GPIO35 is suitable for UI
  MISO and GPIO36 is suitable for GPS receive.
- GPIO2, GPIO5, GPIO12 and GPIO15 are associated with ESP32 boot strapping;
  review the exact module documentation and every external pull before build.
- Keep every inactive SPI CS/CSN high and require MISO high impedance.
- All ESP32-facing logic is 3.3 V. A breakout accepting 5 V power does not
  automatically make its logic outputs 3.3 V safe.

