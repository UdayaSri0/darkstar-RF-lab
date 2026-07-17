# Legal, safety and responsible use

DarkStar RF Lab is a design-stage educational platform for passive,
receive-only RF observation, electronics development, authorised laboratory
testing, Wi-Fi surveying, channel-activity observation, environmental logging,
GPS tagging and optional receive-only SDR analysis.

## Excluded scope

The project does not document or support jamming, deauthentication, packet
injection, spoofing, replay attacks, forced disconnection, active interference
or offensive RF transmission. Optional HackRF documentation is receive-side
only.

## Operator responsibilities

- Observe only signals, systems and environments you are authorised to examine.
- Follow local radio, privacy, data-protection and telecommunications law.
- Avoid logging identifiers or location-linked observations without a lawful,
  documented purpose.
- Use suitable RF filtering, antennas, attenuators and ESD precautions.
- Follow cell-manufacturer and power-system requirements if adding a battery.
- Stop testing if a module, regulator, cable or battery becomes hot, unstable
  or damaged.

## Measurement notice

> [!IMPORTANT]
> DarkStar RF Lab is not a certified laboratory instrument. The repository
> contains no validated prototype, published accuracy, uncertainty budget,
> EMC assessment or safety certification. Do not use it for safety-critical,
> medical, regulatory, compliance or protective measurements.

nRF24L01 RPD is coarse activity indication. ESP32-C5 provides Wi-Fi survey
metadata. AD8318 provides aggregate power in the selected filter passband.
HackRF may provide frequency-selective receive samples through a host. These
measurement types are different and cannot be presented as equivalent.
