# ESP32 Multi-Band RF Signal Analyzer
## Corrected Analyzer-Only Wiring Reference

This design is for passive RF spectrum observation and receive-only experimentation on equipment and signals you are authorised to test. Active interference or jamming functions are intentionally excluded.

---

## 1. System Block Diagram

```text
                           +-----------------------------+
                           |       USER INTERFACE        |
                           | ILI9341 TFT + MicroSD + Keys |
                           +---------------+-------------+
                                           |
                                  Display SPI + I2C
                                           |
+------------------+              +--------v---------+              +------------------+
| NEO-6M GPS       | UART RX      |                  | I2C          | BME280           |
| TX only to ESP32 +------------->| ESP32-WROOM-32U |<------------>| Environmental    |
+------------------+              |  Main Controller |              +------------------+
                                  |                  |
+------------------+ ADC          |                  | I2C          +------------------+
| TEMT6000 Light   +------------->|                  |<------------>| MAX17043         |
| Sensor           |              +--------+---------+              | Battery Gauge    |
+------------------+                       |                        +------------------+
                                           |
                                        RF SPI
                                           |
            +------------------------------+-----------------------------+
            |                              |                             |
     +------v------+                +------v------+               +------v------+
     | nRF24L01 #1|                | nRF24L01 #2|               | nRF24L01 #3|
     | 2.4 GHz RX |                | 2.4 GHz RX |               | 2.4 GHz RX |
     +-------------+                +-------------+               +-------------+
                                           |
                                    +------v------+
                                    | CC1101      |
                                    | Sub-GHz RX  |
                                    +-------------+
```

---

## 2. Power Distribution

```text
                  +--------------------------------+
                  | REGULATED 5 V INPUT, >= 2 A   |
                  | USB supply or protected power |
                  +---------------+----------------+
                                  |
                    +-------------+-------------+
                    |                           |
                    v                           v
          +-------------------+       +-----------------------+
          | ESP32 VIN / 5 V   |       | TFT VCC              |
          | On-board 3.3 V    |       | Check breakout input |
          | regulator         |       | voltage requirement  |
          +-------------------+       +-----------------------+
                    |
                    | 5 V
                    v
          +--------------------------------------+
          | DEDICATED 3.3 V RF REGULATOR         |
          | Low-noise, >= 1 A recommended        |
          +----+------------+------------+--------+
               |            |            |
               v            v            v
            nRF #1       nRF #2       nRF #3
               |
               +-------------------------------> CC1101

All grounds must join at a common ground plane.
Do not power PA/LNA RF modules from the ESP32 3.3 V pin.
```

### Local RF decoupling for every module

```text
3V3_RF ----+-------------------------------> RF MODULE VCC
           |
           +----||---- GND     100 nF ceramic
           |
           +----||---- GND      10 uF low-ESR
           |
           +----||---- GND     100-220 uF bulk capacitor
                                  near the RF module group
```

---

## 3. Corrected ESP32 Pin Assignment

### RF SPI bus

```text
ESP32 GPIO18  -------------------- RF_SCK  -------------------+
ESP32 GPIO23  -------------------- RF_MOSI -------------------+--> nRF #1
ESP32 GPIO19  <------------------- RF_MISO -------------------+--> nRF #2
                                                             +--> nRF #3
                                                             +--> CC1101

ESP32 GPIO16  -------------------- NRF1_CE
ESP32 GPIO17  -------------------- NRF1_CSN

ESP32 GPIO25  -------------------- NRF2_CE
ESP32 GPIO26  -------------------- NRF2_CSN

ESP32 GPIO32  -------------------- NRF3_CE
ESP32 GPIO33  -------------------- NRF3_CSN

ESP32 GPIO27  -------------------- CC1101_CSN
ESP32 GPIO34  <------------------- CC1101_GDO0
```

### Display and MicroSD SPI bus

```text
ESP32 GPIO14  -------------------- UI_SCK  --------------------+
ESP32 GPIO13  -------------------- UI_MOSI --------------------+--> ILI9341 TFT
ESP32 GPIO35  <------------------- UI_MISO --------------------+--> MicroSD

ESP32 GPIO4   -------------------- TFT_CS
ESP32 GPIO2   -------------------- TFT_DC
MCP23017 GPA5 -------------------- TFT_RST
ESP32 GPIO5   -------------------- SD_CS
```

GPIO35 is input-only, which is suitable for SPI MISO.

### I2C bus

```text
ESP32 GPIO21  <------------------> I2C_SDA --------------------+
ESP32 GPIO22  -------------------> I2C_SCL --------------------+
                                                              +--> BME280
                                                              +--> MAX17043
                                                              +--> MCP23017
```

Use approximately 4.7 kOhm pull-up resistors from SDA and SCL to 3.3 V if they are not already fitted on the modules.

### GPS, light sensor and optional indicator

```text
NEO-6M TX     -------------------> ESP32 GPIO36
NEO-6M RX     -------------------  Not connected for receive-only GPS

TEMT6000 OUT  -------------------> ESP32 GPIO39 ADC

Optional WS2812 DIN <------------- ESP32 GPIO15 through 330 Ohm
```

GPIO36 and GPIO39 are input-only, which is correct for GPS RX and analogue sensing. If a 5 V WS2812 is used, place a proper 3.3 V-to-5 V logic-level buffer between GPIO15 and DIN.

---

## 4. MCP23017 Button Expander

```text
                     +----------------------+
3.3 V -------------->| VDD       MCP23017  |
GND ---------------->| VSS                  |
GPIO21 <------------>| SDA                  |
GPIO22 ------------->| SCL                  |
3.3 V --10 kOhm----->| RESET                |
GND ---------------->| A0, A1, A2           |  Address = 0x20
                     |                      |
Button UP -----------| GPA0                 |
Button DOWN ---------| GPA1                 |
Button LEFT ---------| GPA2                 |
Button RIGHT --------| GPA3                 |
Button SELECT -------| GPA4                 |
TFT RESET <----------| GPA5                 |
Status LED 1 <-------| GPA6 -- resistor     |
Status LED 2 <-------| GPA7 -- resistor     |
                     +----------------------+
```

Wire each button between its MCP23017 input and GND, then enable the expander's internal pull-up resistor.

---

## 5. Module Connection Table

| Module | Module Pin | Connection |
|---|---|---|
| nRF24L01 #1 | SCK/MOSI/MISO | GPIO18 / GPIO23 / GPIO19 |
| nRF24L01 #1 | CE / CSN | GPIO16 / GPIO17 |
| nRF24L01 #2 | SCK/MOSI/MISO | GPIO18 / GPIO23 / GPIO19 |
| nRF24L01 #2 | CE / CSN | GPIO25 / GPIO26 |
| nRF24L01 #3 | SCK/MOSI/MISO | GPIO18 / GPIO23 / GPIO19 |
| nRF24L01 #3 | CE / CSN | GPIO32 / GPIO33 |
| CC1101 | SCK/MOSI/MISO | GPIO18 / GPIO23 / GPIO19 |
| CC1101 | CSN / GDO0 | GPIO27 / GPIO34 |
| ILI9341 TFT | SCK/MOSI/MISO | GPIO14 / GPIO13 / GPIO35 |
| ILI9341 TFT | CS / D-C / RESET | GPIO4 / GPIO2 / MCP23017 GPA5 |
| MicroSD | SCK/MOSI/MISO | GPIO14 / GPIO13 / GPIO35 |
| MicroSD | CS | GPIO5 |
| BME280 | SDA / SCL | GPIO21 / GPIO22 |
| MAX17043 | SDA / SCL | GPIO21 / GPIO22 |
| MCP23017 | SDA / SCL | GPIO21 / GPIO22 |
| NEO-6M | TX | GPIO36 |
| TEMT6000 | OUT | GPIO39 |
| Optional WS2812 | DIN | GPIO15 through 330 Ohm |

---

## 6. Important Corrections to the Original Draft

The original pin table contained several electrical conflicts:

1. GPIO21 was allocated to the CC1101 CSN, TFT D/C and BME280 SDA.
2. GPIO22 was allocated to the CC1101 GDO0, TFT reset and BME280 SCL.
3. GPIO15 was allocated to both nRF24L01 #3 CE and TFT CS.
4. GPIO23 and GPIO19 were described as belonging to two separate SPI buses at the same time.
5. GPIO35 was assigned as an ESP32 transmit output for GPS, but GPIO35 is input-only.
6. A single-cell Li-ion battery cannot be stepped up to 5 V using an MP1584 buck-only converter.

The corrected map above separates the RF bus from the display/storage bus and uses an MCP23017 I/O expander for buttons and TFT reset.

---

## 7. Assembly Order

1. Build and test the 5 V and dedicated 3.3 V RF power rails.
2. Connect one nRF24L01 module and confirm receive-only scanning.
3. Add the remaining nRF24L01 modules one at a time.
4. Add the CC1101 in receive-only mode.
5. Connect the TFT, then the MicroSD card.
6. Add the I2C sensors and MCP23017.
7. Add GPS and the analogue light sensor.
8. Enable one peripheral at a time in firmware and verify that every unused CSN/CS line remains HIGH.
