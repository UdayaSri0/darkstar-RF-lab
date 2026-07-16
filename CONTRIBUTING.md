# Contributing to DarkStar RF Lab

Thank you for helping improve DarkStar RF Lab. Contributions must remain
consistent with the project's passive, receive-only scope.

## Before starting

- Check that the proposed change does not add active interference, jamming,
  spoofing, packet injection, or unauthorised monitoring functionality.
- Open an issue first for changes that materially alter the hardware
  architecture, pin allocation, power design, or repository structure.
- Base technical claims on a datasheet, source file, reproducible calculation,
  or recorded receive-only test.

## Workflow

1. Fork the repository.
2. Create a focused branch:

   ```bash
   git switch -c feature/short-description
   ```

3. Make the smallest coherent change.
4. Test affected documentation or web-guide behaviour.
5. Check links, spelling, and Markdown rendering.
6. Commit with a concise description.
7. Open a pull request against `main`.

## Documentation standards

- Use professional British English.
- Clearly label implemented, planned, optional, and conceptual work.
- Do not report unverified measurements or imply prototype validation.
- Do not add image links unless the referenced file is committed.
- Do not add credentials, personal data, local paths, or sensitive
  configuration.
- Keep the responsible-use notice accurate and visible.

## Web-guide changes

The guide is intentionally self-contained and offline. Open
`web-guide/index.html` directly in a modern browser and test:

- canvas rendering;
- zooming and panning;
- component selection and search;
- layer and label controls;
- the minimap;
- PNG export; and
- printable tables.

Document browser-specific limitations in the pull request.

## Hardware documentation

Hardware contributions should state whether they are:

- a design proposal;
- checked against component documentation;
- simulated;
- assembled; or
- measured on physical hardware.

Include supply limits, logic levels, connector orientation, and test conditions
where relevant. A documented design allocation must not be presented as a
prototype-validated pin-out.
