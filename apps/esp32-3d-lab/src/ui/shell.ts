const tools = [
  ["select", "Select", "V"],
  ["rotate", "Rotate", "R"],
  ["pan", "Pan", "P"],
  ["wire", "Wire", "W"],
  ["measure", "Measure", "M"],
  ["note", "Add note", "N"],
  ["labels", "Toggle labels", "L"],
  ["delete", "Delete last", "Del"],
  ["undo", "Undo", "⌘Z"],
  ["redo", "Redo", "⇧⌘Z"],
  ["reset", "Reset camera", "0"],
] as const;

export function createShell(): string {
  return `
    <div class="ds3d-app">
      <a class="ds3d-skip-link" href="#ds3d-viewport">Skip to 3D viewport</a>
      <header class="ds3d-topbar">
        <div class="ds3d-brand" aria-label="DarkStar ESP32 3D Lab">
          <span class="ds3d-brand__mark" aria-hidden="true">DS</span>
          <span><strong>DarkStar</strong><small>ESP32 3D Lab</small></span>
        </div>
        <div class="ds3d-topbar__group">
          <label class="ds3d-field ds3d-field--inline">Board
            <select id="ds3d-board-select" aria-label="Board selector">
              <option value="esp32-devkit-v1-30p">ESP32 DevKit V1 · 30 pin</option>
            </select>
          </label>
          <button class="ds3d-button" data-action="new">New</button>
          <button class="ds3d-button" data-action="save">Save</button>
          <button class="ds3d-button" data-action="load">Load</button>
          <input id="ds3d-project-file" class="ds3d-visually-hidden" type="file" accept="application/json,.json" />
          <button class="ds3d-button" data-action="screenshot">Screenshot</button>
        </div>
        <div class="ds3d-topbar__group ds3d-topbar__group--views">
          <label class="ds3d-field ds3d-field--inline">Mode
            <select id="ds3d-visual-mode" aria-label="Visual mode">
              <option value="realistic">Realistic</option>
              <option value="functional">Functional</option>
              <option value="xray">X-ray</option>
            </select>
          </label>
          <label class="ds3d-field ds3d-field--inline">View
            <select id="ds3d-camera-view" aria-label="Camera view">
              <option value="perspective">Perspective</option>
              <option value="top">Top</option>
              <option value="front">Front</option>
              <option value="side">Side</option>
            </select>
          </label>
          <button class="ds3d-icon-button" data-action="settings" aria-label="Open settings" title="Settings">⚙</button>
          <button class="ds3d-icon-button" data-action="help" aria-label="Open help" title="Help">?</button>
        </div>
      </header>

      <main class="ds3d-workspace">
        <aside class="ds3d-toolbar" aria-label="Laboratory tools">
          <h2>Tools</h2>
          ${tools.map(([id, name, shortcut]) => `
            <button class="ds3d-tool" data-tool="${id}" aria-pressed="${id === "select"}">
              <span class="ds3d-tool__icon" aria-hidden="true">${toolIcon(id)}</span>
              <span class="ds3d-tool__name">${name}</span>
              <kbd>${shortcut}</kbd>
            </button>`).join("")}
        </aside>

        <section id="ds3d-viewport" class="ds3d-viewport" aria-label="3D viewport">
          <div class="ds3d-loading" role="status"><span></span>Preparing 3D workbench…</div>
          <div class="ds3d-viewport__hint">Drag to orbit · Wheel to zoom · Click a pin to inspect</div>
          <div id="ds3d-toast" class="ds3d-toast" role="status" aria-live="polite" hidden></div>
        </section>

        <aside class="ds3d-inspector" aria-label="Object inspector">
          <div class="ds3d-inspector__heading">
            <div><span class="ds3d-eyebrow">Inspector</span><h2 id="ds3d-selected-name">Nothing selected</h2></div>
            <span id="ds3d-selection-badge" class="ds3d-badge">—</span>
          </div>
          <p id="ds3d-selection-help" class="ds3d-muted">Select the board, module, connector, or a header pin to inspect its engineering data.</p>
          <div id="ds3d-pin-inspector" hidden>
            <dl class="ds3d-detail-grid">
              <div><dt>Physical pin</dt><dd id="ds3d-pin-number">—</dd></div>
              <div><dt>GPIO</dt><dd id="ds3d-gpio-number">—</dd></div>
              <div><dt>Voltage</dt><dd id="ds3d-voltage">—</dd></div>
              <div><dt>Direction</dt><dd id="ds3d-direction">—</dd></div>
            </dl>
            <section class="ds3d-inspector-section"><h3>Supported functions</h3><div id="ds3d-functions" class="ds3d-chip-list"></div></section>
            <section class="ds3d-inspector-section"><h3>Peripheral capabilities</h3><dl id="ds3d-capabilities" class="ds3d-capability-list"></dl></section>
            <section class="ds3d-inspector-section"><h3>Electrical warnings</h3><div id="ds3d-warnings"></div></section>
            <section class="ds3d-inspector-section"><h3>Current connections</h3><div id="ds3d-connections" class="ds3d-muted">No wires connected.</div></section>
          </div>
          <section class="ds3d-inspector-section ds3d-notes"><h3>Notes</h3>
            <div id="ds3d-note-list" class="ds3d-note-list"><p class="ds3d-muted">Select an object to attach notes.</p></div>
            <label class="ds3d-field">New note<textarea id="ds3d-note-input" rows="3" placeholder="Record an observation…" disabled></textarea></label>
            <button class="ds3d-button ds3d-button--primary" data-action="add-note" disabled>Add note</button>
          </section>
        </aside>
      </main>

      <footer class="ds3d-statusbar" aria-label="Application status">
        <span><i class="ds3d-status-dot"></i><b>Tool</b> <span id="ds3d-status-tool">Select</span></span>
        <span><b>Selected</b> <span id="ds3d-status-selection">None</span></span>
        <span><b>Camera</b> <span id="ds3d-status-camera">Perspective</span></span>
        <span><b>Pointer</b> <span id="ds3d-status-coordinates">—</span></span>
        <span><b>Quality</b> <span id="ds3d-status-quality">High</span></span>
        <span><b>FPS</b> <span id="ds3d-status-fps">—</span></span>
        <span><b>Save</b> <span id="ds3d-status-save">Ready</span></span>
        <span class="ds3d-statusbar__warnings"><b>Warnings</b> <span id="ds3d-status-warnings">0</span></span>
      </footer>

      <dialog id="ds3d-settings-dialog" class="ds3d-dialog">
        <form method="dialog">
          <header><h2>Laboratory settings</h2><button value="cancel" aria-label="Close settings">×</button></header>
          <label class="ds3d-field">Rendering quality<select id="ds3d-quality"><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label>
          <label class="ds3d-check"><input id="ds3d-labels-visible" type="checkbox" checked /> Show component and pin labels</label>
          <label class="ds3d-check"><input id="ds3d-grid-visible" type="checkbox" checked /> Show engineering grid</label>
          <label class="ds3d-check"><input id="ds3d-reduced-motion" type="checkbox" /> Reduce interface motion</label>
          <footer><button class="ds3d-button ds3d-button--primary" value="default">Done</button></footer>
        </form>
      </dialog>

      <dialog id="ds3d-help-dialog" class="ds3d-dialog ds3d-dialog--wide">
        <form method="dialog">
          <header><div><span class="ds3d-eyebrow">Quick start</span><h2>Explore safely</h2></div><button value="cancel" aria-label="Close help">×</button></header>
          <div class="ds3d-help-grid">
            <section><h3>Inspect</h3><p>Choose Select and click the board, RF module, USB connector, or a gold header contact. Pin data and warnings appear in the inspector.</p></section>
            <section><h3>Wire</h3><p>Choose Wire, then select two header pins. The lab draws a routed wire and records the connection in your project.</p></section>
            <section><h3>Measure</h3><p>Choose Measure and select two header pins. The straight-line distance is added to the project overlay.</p></section>
          </div>
          <p class="ds3d-callout"><strong>Educational model:</strong> pin assignments and electrical limits vary by board revision. Confirm every connection against the manufacturer documentation before powering hardware.</p>
          <footer><button class="ds3d-button ds3d-button--primary" value="default">Start exploring</button></footer>
        </form>
      </dialog>

      <div id="ds3d-fatal-error" class="ds3d-error" role="alert" hidden>
        <strong>The 3D laboratory could not start.</strong><span id="ds3d-error-message"></span><button data-action="reload">Reload</button>
      </div>
    </div>`;
}

function toolIcon(id: string): string {
  const icons: Record<string, string> = {
    select: "↖", rotate: "⟳", pan: "✥", wire: "⌁", measure: "↔", note: "▤",
    labels: "Aa", delete: "⌫", undo: "↶", redo: "↷", reset: "⌂",
  };
  return icons[id] ?? "·";
}
