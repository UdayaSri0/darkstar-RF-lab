import type * as THREE from "three";
import { esp32DevKit, getPin } from "../data/esp32DevKit";
import { LabScene } from "../rendering/LabScene";
import { byId, escapeHtml } from "../ui/dom";
import { createShell } from "../ui/shell";
import { createId } from "../utilities/ids";
import {
  createEmptyProject,
  loadCamera,
  loadProjectResult,
  loadSettings,
  saveCamera,
  saveProject,
  saveSettings,
} from "./ProjectStore";
import { LEGACY_CABLE_TYPE_ID, MAIN_CONTROLLER_INSTANCE_ID, terminalKey, tryImportProject } from "./projectSchema";
import type {
  CameraView,
  LabProject,
  LabSettings,
  SelectionDetails,
  TerminalRef,
  ToolId,
  VisualMode,
} from "./types";

const defaultSettings: LabSettings = {
  quality: "high",
  labelsVisible: true,
  gridVisible: true,
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
};

const toolNames: Record<ToolId, string> = {
  select: "Select", rotate: "Rotate", pan: "Pan", wire: "Wire", measure: "Measure",
  note: "Add note", labels: "Toggle labels", delete: "Delete last", undo: "Undo",
  redo: "Redo", reset: "Reset camera",
};

export class LabApp {
  private scene: LabScene;
  private project: LabProject;
  private settings: LabSettings;
  private tool: ToolId = "select";
  private selection: SelectionDetails | null = null;
  private pendingTerminal: TerminalRef | null = null;
  private history: LabProject[] = [];
  private future: LabProject[] = [];
  private persistenceBlocked = false;
  private saveTimer = 0;
  private toastTimer = 0;

  constructor(private readonly root: HTMLElement) {
    root.innerHTML = createShell();
    this.settings = loadSettings(defaultSettings);
    const storedProject = loadProjectResult();
    this.project = storedProject.project ?? createEmptyProject();
    this.persistenceBlocked = Boolean(storedProject.error);
    const viewport = byId<HTMLElement>("ds3d-viewport");
    this.scene = new LabScene(viewport, esp32DevKit, {
      onSelect: (selection) => this.onSceneSelection(selection),
      onPointer: (position) => this.updatePointer(position),
      onFps: (fps) => { byId("ds3d-status-fps").textContent = String(fps); },
      onCameraChanged: (camera) => saveCamera(camera),
    });
    this.bindInterface();
    this.applySettings();
    const camera = loadCamera();
    if (camera) this.scene.restoreCamera(camera);
    this.scene.renderProject(this.project);
    this.renderInspector();
    viewport.querySelector(".ds3d-loading")?.remove();
    this.updateWarningCount();
    if (storedProject.error) {
      this.showToast(`Saved project left unchanged: ${storedProject.error}`);
    } else if (storedProject.migrated) {
      this.showToast("Version 1 project migrated safely to version 2.");
    }
  }

  private bindInterface(): void {
    this.root.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const toolButton = target.closest<HTMLButtonElement>("[data-tool]");
      if (toolButton) this.activateTool(toolButton.dataset.tool as ToolId);
      const actionButton = target.closest<HTMLButtonElement>("[data-action]");
      if (actionButton) this.runAction(actionButton.dataset.action ?? "");
    });

    byId<HTMLSelectElement>("ds3d-visual-mode").addEventListener("change", (event) => {
      this.scene.setVisualMode((event.target as HTMLSelectElement).value as VisualMode);
    });
    byId<HTMLSelectElement>("ds3d-camera-view").addEventListener("change", (event) => {
      const view = (event.target as HTMLSelectElement).value as CameraView;
      this.scene.setCameraView(view);
      byId("ds3d-status-camera").textContent = `${view[0]?.toUpperCase() ?? ""}${view.slice(1)}`;
    });
    byId<HTMLInputElement>("ds3d-project-file").addEventListener("change", (event) => void this.importProject(event));
    byId<HTMLSelectElement>("ds3d-quality").addEventListener("change", () => this.updateSettingsFromForm());
    byId<HTMLInputElement>("ds3d-labels-visible").addEventListener("change", () => this.updateSettingsFromForm());
    byId<HTMLInputElement>("ds3d-grid-visible").addEventListener("change", () => this.updateSettingsFromForm());
    byId<HTMLInputElement>("ds3d-reduced-motion").addEventListener("change", () => this.updateSettingsFromForm());
    window.addEventListener("keydown", (event) => this.handleKeyboard(event));
    window.addEventListener("beforeunload", () => {
      if (!this.persistenceBlocked) saveProject(this.project);
    });
  }

  private runAction(action: string): void {
    if (action === "new") this.newProject();
    if (action === "save") this.exportProject();
    if (action === "load") byId<HTMLInputElement>("ds3d-project-file").click();
    if (action === "screenshot") this.scene.exportScreenshot();
    if (action === "settings") byId<HTMLDialogElement>("ds3d-settings-dialog").showModal();
    if (action === "help") byId<HTMLDialogElement>("ds3d-help-dialog").showModal();
    if (action === "add-note") this.addNote();
    if (action === "reload") window.location.reload();
  }

  private activateTool(tool: ToolId): void {
    if (tool === "undo") return this.undo();
    if (tool === "redo") return this.redo();
    if (tool === "reset") {
      this.scene.resetCamera();
      this.showToast("Camera reset to perspective view.");
      return;
    }
    if (tool === "labels") {
      this.settings.labelsVisible = !this.settings.labelsVisible;
      this.applySettings();
      this.showToast(this.settings.labelsVisible ? "Labels enabled." : "Labels hidden.");
      return;
    }
    if (tool === "delete") {
      this.deleteLast();
      return;
    }
    this.tool = tool;
    this.pendingTerminal = null;
    this.scene.setInteractionMode(tool === "pan" ? "pan" : tool === "rotate" ? "rotate" : "select");
    this.root.querySelectorAll<HTMLButtonElement>("[data-tool]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.tool === tool));
    });
    byId("ds3d-status-tool").textContent = toolNames[tool];
    this.showToast(this.toolInstruction(tool));
  }

  private toolInstruction(tool: ToolId): string {
    if (tool === "wire") return "Wire: select the first header pin, then the second.";
    if (tool === "measure") return "Measure: select two header pins.";
    if (tool === "note") return "Note: select a target, then write in the inspector.";
    if (tool === "pan") return "Pan: drag the viewport to move across the bench.";
    if (tool === "rotate") return "Rotate: drag the viewport to orbit the board.";
    return "Select a component or header pin to inspect it.";
  }

  private onSceneSelection(selection: SelectionDetails | null): void {
    this.selection = selection;
    byId("ds3d-status-selection").textContent = selection?.name ?? "None";
    this.renderInspector();
    if (!selection) return;
    if ((this.tool === "wire" || this.tool === "measure") && selection.pin) {
      this.handleTwoPinTool({
        instanceId: selection.instanceId ?? MAIN_CONTROLLER_INSTANCE_ID,
        terminalId: selection.pin.id,
      });
    } else if ((this.tool === "wire" || this.tool === "measure") && !selection.pin) {
      this.showToast(`${toolNames[this.tool]} requires a header pin.`);
    } else if (this.tool === "note") {
      byId<HTMLTextAreaElement>("ds3d-note-input").focus();
    }
  }

  private handleTwoPinTool(terminal: TerminalRef): void {
    if (!this.pendingTerminal) {
      this.pendingTerminal = terminal;
      this.showToast(`${getPin(esp32DevKit, terminal.terminalId)?.name ?? terminal.terminalId} selected. Choose the second pin.`);
      return;
    }
    if (terminalKey(this.pendingTerminal) === terminalKey(terminal)) {
      this.showToast("Choose a different second pin.");
      return;
    }
    this.pushHistory();
    if (this.tool === "wire") {
      this.project.cables.push({
        id: createId("wire"),
        from: this.pendingTerminal,
        to: terminal,
        cableTypeId: LEGACY_CABLE_TYPE_ID,
        color: this.wireColor(this.project.cables.length),
        controlPointsMm: [],
        label: `${getPin(esp32DevKit, this.pendingTerminal.terminalId)?.name ?? this.pendingTerminal.terminalId} → ${getPin(esp32DevKit, terminal.terminalId)?.name ?? terminal.terminalId}`,
      });
      this.showToast("Wire connection added.");
    } else {
      const from = this.scene.getTerminalPosition(this.pendingTerminal);
      const to = this.scene.getTerminalPosition(terminal);
      if (from && to) {
        const distance = Math.hypot(to[0] - from[0], to[1] - from[1], to[2] - from[2]);
        this.project.measurements.push({ id: createId("measurement"), from, to, distanceMm: Number(distance.toFixed(1)) });
        this.showToast(`Measurement added: ${distance.toFixed(1)} mm.`);
      }
    }
    this.pendingTerminal = null;
    this.changed();
  }

  private wireColor(index: number): string {
    return ["#42c9ff", "#ffcf66", "#ff7285", "#76e6a4", "#c797ff"][index % 5] ?? "#42c9ff";
  }

  private renderInspector(): void {
    const selection = this.selection;
    byId("ds3d-selected-name").textContent = selection?.name ?? "Nothing selected";
    byId("ds3d-selection-badge").textContent = selection?.category ?? "—";
    byId("ds3d-selection-help").textContent = selection
      ? selection.pin ? "Header pin selected. Review every warning before making a physical connection." : "Component selected. Choose a gold header contact for detailed pin capabilities."
      : "Select the board, module, connector, or a header pin to inspect its engineering data.";
    const panel = byId("ds3d-pin-inspector");
    panel.hidden = !selection?.pin;
    if (selection?.pin) {
      const pin = selection.pin;
      byId("ds3d-pin-number").textContent = String(pin.pinNumber);
      byId("ds3d-gpio-number").textContent = pin.gpio === null ? "Not a GPIO" : `GPIO ${pin.gpio}`;
      byId("ds3d-voltage").textContent = pin.voltage;
      byId("ds3d-direction").textContent = [pin.capabilities.input && "Input", pin.capabilities.output && "Output"].filter(Boolean).join(" / ") || "Power";
      byId("ds3d-functions").innerHTML = pin.functions.map((value) => `<span>${escapeHtml(value)}</span>`).join("");
      const capabilities = Object.entries(pin.capabilities).filter(([, value]) => value && typeof value === "string");
      byId("ds3d-capabilities").innerHTML = capabilities.length
        ? capabilities.map(([key, value]) => `<div><dt>${escapeHtml(key.toUpperCase())}</dt><dd>${escapeHtml(String(value))}</dd></div>`).join("")
        : "<div><dd>No peripheral function recorded.</dd></div>";
      byId("ds3d-warnings").innerHTML = (pin.warnings.length ? pin.warnings : ["ESP32 GPIO uses 3.3 V logic and is not 5 V tolerant."])
        .map((warning) => `<p class="ds3d-warning">${escapeHtml(warning)}</p>`).join("");
      const instanceId = selection.instanceId ?? MAIN_CONTROLLER_INSTANCE_ID;
      const connections = this.project.cables.filter((cable) =>
        (cable.from.instanceId === instanceId && cable.from.terminalId === pin.id)
        || (cable.to.instanceId === instanceId && cable.to.terminalId === pin.id));
      byId("ds3d-connections").innerHTML = connections.length
        ? connections.map((cable) => `<span class="ds3d-connection"><i style="--ds3d-wire:${cable.color}"></i>${escapeHtml(cable.label ?? cable.id)}</span>`).join("")
        : "No wires connected.";
    }
    const noteInput = byId<HTMLTextAreaElement>("ds3d-note-input");
    const noteButton = this.root.querySelector<HTMLButtonElement>("[data-action='add-note']");
    noteInput.disabled = !selection;
    if (noteButton) noteButton.disabled = !selection;
    const notes = selection ? this.project.notes.filter((note) => note.targetId === selection.id) : [];
    byId("ds3d-note-list").innerHTML = notes.length
      ? notes.map((note) => `<article><p>${escapeHtml(note.text)}</p><time>${new Date(note.createdAt).toLocaleString()}</time></article>`).join("")
      : `<p class="ds3d-muted">${selection ? "No notes for this object." : "Select an object to attach notes."}</p>`;
  }

  private addNote(): void {
    const input = byId<HTMLTextAreaElement>("ds3d-note-input");
    const text = input.value.trim();
    if (!this.selection || !text) return;
    this.pushHistory();
    this.project.notes.push({ id: createId("note"), targetId: this.selection.id, text, createdAt: new Date().toISOString() });
    input.value = "";
    this.changed();
    this.showToast("Note added to the selected object.");
  }

  private updatePointer(position: THREE.Vector3 | null): void {
    byId("ds3d-status-coordinates").textContent = position
      ? `${position.x.toFixed(1)}, ${position.z.toFixed(1)} mm`
      : "—";
  }

  private pushHistory(): void {
    this.history.push(structuredClone(this.project));
    if (this.history.length > 50) this.history.shift();
    this.future = [];
  }

  private undo(): void {
    const previous = this.history.pop();
    if (!previous) return this.showToast("Nothing to undo.");
    this.future.push(structuredClone(this.project));
    this.project = previous;
    this.changed();
    this.showToast("Last project change undone.");
  }

  private redo(): void {
    const next = this.future.pop();
    if (!next) return this.showToast("Nothing to redo.");
    this.history.push(structuredClone(this.project));
    this.project = next;
    this.changed();
    this.showToast("Project change restored.");
  }

  private deleteLast(): void {
    if (!this.project.cables.length && !this.project.measurements.length && !this.project.notes.length) {
      return this.showToast("Nothing to delete.");
    }
    this.pushHistory();
    const lastWire = this.project.cables.at(-1)?.id ?? "";
    const lastMeasure = this.project.measurements.at(-1)?.id ?? "";
    const lastNote = this.project.notes.at(-1)?.id ?? "";
    const latest = [lastWire, lastMeasure, lastNote].sort().at(-1);
    if (latest === lastWire) this.project.cables.pop();
    else if (latest === lastMeasure) this.project.measurements.pop();
    else this.project.notes.pop();
    this.changed();
    this.showToast("Most recent project item deleted.");
  }

  private changed(): void {
    byId("ds3d-status-save").textContent = "Unsaved";
    this.scene.renderProject(this.project);
    this.renderInspector();
    this.updateWarningCount();
    window.clearTimeout(this.saveTimer);
    if (this.persistenceBlocked) {
      byId("ds3d-status-save").textContent = "Stored project preserved";
      return;
    }
    this.saveTimer = window.setTimeout(() => {
      this.project = saveProject(this.project);
      byId("ds3d-status-save").textContent = "Saved locally";
    }, 500);
  }

  private exportProject(): void {
    if (!this.persistenceBlocked) this.project = saveProject(this.project);
    const blob = new Blob([JSON.stringify(this.project, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "darkstar-esp32-lab-project.json";
    link.click();
    URL.revokeObjectURL(link.href);
    byId("ds3d-status-save").textContent = this.persistenceBlocked ? "Recovery preserved + exported" : "Saved + exported";
    this.showToast(this.persistenceBlocked
      ? "Project exported as version 2; the unreadable stored project remains untouched."
      : "Project saved locally and exported as JSON.");
  }

  private async importProject(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      const candidate = JSON.parse(await file.text()) as unknown;
      const result = tryImportProject(candidate, this.project);
      if (!result.ok) throw new Error(`Current project left unchanged: ${result.error}`);
      this.pushHistory();
      this.project = result.project;
      this.persistenceBlocked = false;
      this.changed();
      this.showToast(`Loaded “${this.project.name}”${result.migrated ? " and migrated it to version 2" : ""}.`);
    } catch (error) {
      this.showToast(error instanceof Error ? error.message : "Project could not be loaded.");
    } finally {
      input.value = "";
    }
  }

  private newProject(): void {
    if (!window.confirm("Create a new lab project? The current project remains in your exported file if you saved it.")) return;
    this.pushHistory();
    this.project = createEmptyProject();
    this.persistenceBlocked = false;
    this.selection = null;
    this.changed();
    this.showToast("New project created.");
  }

  private applySettings(): void {
    this.scene.setQuality(this.settings.quality);
    this.scene.setLabelsVisible(this.settings.labelsVisible);
    this.scene.setGridVisible(this.settings.gridVisible);
    this.root.classList.toggle("ds3d-reduced-motion", this.settings.reducedMotion);
    byId<HTMLSelectElement>("ds3d-quality").value = this.settings.quality;
    byId<HTMLInputElement>("ds3d-labels-visible").checked = this.settings.labelsVisible;
    byId<HTMLInputElement>("ds3d-grid-visible").checked = this.settings.gridVisible;
    byId<HTMLInputElement>("ds3d-reduced-motion").checked = this.settings.reducedMotion;
    byId("ds3d-status-quality").textContent = `${this.settings.quality[0]?.toUpperCase() ?? ""}${this.settings.quality.slice(1)}`;
    saveSettings(this.settings);
  }

  private updateSettingsFromForm(): void {
    this.settings = {
      quality: byId<HTMLSelectElement>("ds3d-quality").value as LabSettings["quality"],
      labelsVisible: byId<HTMLInputElement>("ds3d-labels-visible").checked,
      gridVisible: byId<HTMLInputElement>("ds3d-grid-visible").checked,
      reducedMotion: byId<HTMLInputElement>("ds3d-reduced-motion").checked,
    };
    this.applySettings();
  }

  private updateWarningCount(): void {
    const terminals = new Map(this.project.cables.flatMap((cable) => [cable.from, cable.to])
      .map((terminal) => [terminalKey(terminal), terminal]));
    const count = [...terminals.values()].reduce((total, terminal) =>
      total + (getPin(esp32DevKit, terminal.terminalId)?.warnings.length ?? 0), 0);
    byId("ds3d-status-warnings").textContent = String(count);
  }

  private handleKeyboard(event: KeyboardEvent): void {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
      event.preventDefault();
      if (event.shiftKey) this.redo(); else this.undo();
      return;
    }
    const shortcuts: Record<string, ToolId> = { v: "select", r: "rotate", p: "pan", w: "wire", m: "measure", n: "note", l: "labels", "0": "reset", Delete: "delete" };
    const tool = shortcuts[event.key.length === 1 ? event.key.toLowerCase() : event.key];
    if (tool) {
      event.preventDefault();
      this.activateTool(tool);
    }
  }

  private showToast(message: string): void {
    const toast = byId("ds3d-toast");
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => { toast.hidden = true; }, 3200);
  }
}
