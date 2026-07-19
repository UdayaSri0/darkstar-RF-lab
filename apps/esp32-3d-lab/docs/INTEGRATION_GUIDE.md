# Integration guide

## Implemented integration

No integration with the existing website is implemented. The laboratory runs directly from its own Vite server and builds independently with the base path `/esp32-3d-lab/`. It does not import original application code, share state, register a service worker, inject an iframe, or change existing navigation.

## Proposed integration

### Method A: direct URL (preferred)

Run `npm run build`, then deploy the contents of this application's `dist/` directory at:

```text
/esp32-3d-lab/
```

For a combined static host, copy the completed build to `deployment-root/esp32-3d-lab/`. Confirm the target first; no deployment directory is overwritten by this repository implementation.

### Method B: separate subdomain

Build the same package and deploy it at a dedicated origin such as:

```text
lab.example.com
```

For a subdomain root, set Vite's `base` to `/` for that deployment environment. This provides complete route, cache, and runtime isolation.

### Method C: optional website link

The project owner can manually add a normal link in a future approved change:

```html
<a href="/esp32-3d-lab/">Open ESP32 3D Lab</a>
```

This link has **not** been inserted into `web-guide/index.html` or any repository-level document.

## Optional future integration

A future release could define a versioned `postMessage` launch protocol, an iframe with a narrowly scoped origin policy, or a web component. None is needed for direct access and none exists in version one.

## Changes requiring user approval

- Editing the existing `web-guide/index.html` or its navigation.
- Adding repository-level scripts, workspaces, redirects, or deployment automation.
- Copying `dist/` into an existing deployment root.
- Adding an iframe, cross-application messaging, shared APIs, or shared state.
- Registering any service worker.

Proposed integration must not be described as deployed until the owner approves and applies the appropriate hosting change.
