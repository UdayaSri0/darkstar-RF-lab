# Prompt Execution Matrix

Use `integration/esp32-3d-v0.2` as the integration branch. Each feature branch is merged only after its tests pass.

| Order | Work item | Branch | Depends on | v0.2 status |
|---:|---|---|---|---|
| 00 | Safety audit | chore/3d-00-safety-audit | None | Required |
| 01 | Multi-component schema V2 | feat/3d-01-multi-component-schema | 00 | Required |
| 02 | Registry and terminals | feat/3d-02-component-registry | 01 | Required |
| 03 | Placement tools | feat/3d-03-placement-tools | 01–02 | Required |
| 04 | Cable system | feat/3d-04-cable-system | 01–03 | Required |
| 05 | Electrical validation | feat/3d-05-electrical-validation | 01–04 | Required |
| 06 | Baseplate and mounting | feat/3d-06-baseplate-mounting | 01–03 | Required |
| 07 | ESP32-WROOM-32U | feat/3d-07-esp32-wroom-32u | 02–06 | Required |
| 08 | nRF24 variants | feat/3d-08-nrf24l01-variants | 02–06 | Required |
| 09 | Three nRF bank | feat/3d-09-nrf24-rf-bank | 04–08 | Required |
| 10 | CC1101 | feat/3d-10-cc1101 | 02–06 | Required |
| 11 | ILI9341 | feat/3d-11-ili9341 | 02–06 | Required |
| 12 | MicroSD | feat/3d-12-microsd | 02–06 | Required |
| 13 | MCP23017/buttons | feat/3d-13-mcp23017-controls | 02–06, 11 | Required |
| 14 | ADS1115 | feat/3d-14-ads1115 | 02–06 | Required |
| 15 | BME280 | feat/3d-15-bme280 | 02–06 | Required |
| 16 | NEO-6M | feat/3d-16-neo6m-gps | 02–06 | Required |
| 17 | TEMT6000 | feat/3d-17-temt6000 | 02–06, 14 | Required |
| 18 | MAX17043 | feat/3d-18-max17043 | 02–06 | Library only |
| 19 | ESP32-C5 | feat/3d-19-esp32-c5 | 02–06 | Required |
| 20 | 5 GHz front end | feat/3d-20-five-ghz-front-end | 02–06 | Required |
| 21 | AD8318/divider | feat/3d-21-ad8318-divider | 14, 20 | Required |
| 22 | Power system | feat/3d-22-power-system | 02–06 | Required |
| 23 | Optional status LED | feat/3d-23-optional-status-led | 02–06 | Library only |
| 24 | RF simulation/import | feat/3d-24-rf-simulation | 08–22 | Required |
| 25 | Full presets | feat/3d-25-full-project-presets | 01–24 | Required |
| 26 | Guided assembly | feat/3d-26-guided-assembly | 25 | Required |
| 27 | Migrations | feat/3d-27-project-migrations | 01–26 | Required |
| 28 | Integration and QA | release/3d-v0.2-integration | All required prompts | Required |
| 90 | Optional SDR | feat/3d-90-optional-sdr-workspace | After v0.2 | Deferred |
