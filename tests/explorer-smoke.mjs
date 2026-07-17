import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const html = fs.readFileSync(new URL("../web-guide/index.html", import.meta.url), "utf8");
const script = html.match(/<script>\s*([\s\S]*?)\s*<\/script>/)?.[1];
assert(script, "inline explorer script exists");

class MockElement {
  constructor(id = "") {
    this.id = id;
    this.dataset = {};
    this.listeners = {};
    this.attributes = {};
    this.classList = { add() {}, remove() {} };
    this.hidden = false;
    this.innerHTML = "";
    this.textContent = "";
    this.value = "";
    this.checked = true;
    this.disabled = false;
    this.tagName = "DIV";
  }
  addEventListener(type, callback) { (this.listeners[type] ||= []).push(callback); }
  dispatch(type, event = {}) {
    for (const callback of this.listeners[type] || []) callback({ target: this, preventDefault() {}, ...event });
  }
  click() { this.dispatch("click"); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name]; }
  closest() { return this; }
  focus() { document.activeElement = this; }
  scrollIntoView() {}
  setPointerCapture() {}
  getBoundingClientRect() { return { left: 0, top: 0, width: 900, height: 720 }; }
  toDataURL() { return "data:image/png;base64,mock"; }
}

const context2d = new Proxy({ measureText: text => ({ width: String(text).length * 6 }) }, {
  get(target, property) {
    if (property in target) return target[property];
    return () => {};
  },
  set(target, property, value) { target[property] = value; return true; }
});

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const elements = Object.fromEntries(ids.map(id => [id, new MockElement(id)]));
elements.circuitCanvas.getContext = () => context2d;
elements.miniMap.getContext = () => context2d;
elements.miniMap.width = 260;
elements.miniMap.height = 150;

const modeButtons = [...html.matchAll(/<button[^>]+data-mode="([^"]+)"/g)].map(match => {
  const element = new MockElement();
  element.dataset.mode = match[1];
  return element;
});

const windowListeners = {};
const document = {
  activeElement: new MockElement(),
  getElementById(id) { return elements[id]; },
  querySelectorAll(selector) {
    if (selector === "[data-mode]") return modeButtons;
    return [];
  },
  querySelector(selector) {
    if (selector === ".workspace") return new MockElement();
    return null;
  },
  createElement() { return new MockElement(); }
};

const window = {
  devicePixelRatio: 1,
  addEventListener(type, callback) { (windowListeners[type] ||= []).push(callback); },
  print() {}
};

vm.runInNewContext(script, {
  document,
  window,
  requestAnimationFrame: callback => callback(),
  setTimeout: () => 1,
  clearTimeout() {},
  console,
  Math,
  Object,
  String,
  Number,
  Array,
  Set,
  Infinity
}, { filename: "web-guide/index.html" });

assert.match(elements.busLearningCards.innerHTML, /RF SPI/);
assert.match(elements.comparisonCards.innerHTML, /C5 vs AD8318 vs HackRF/);
assert.match(elements.learningCards.innerHTML, /Main controller/);
assert.match(elements.glossaryCards.innerHTML, /Aggregate power/);

const busButton = modeButtons.find(button => button.dataset.mode === "bus");
elements.modeControls.dispatch("click", { target: { closest: () => busButton } });
assert.equal(elements.busField.hidden, false);
assert.match(elements.modePanel.innerHTML, /RF SPI/);

elements.searchInput.value = "GPIO18";
elements.searchButton.click();
assert.equal(elements.componentTitle.textContent, "ESP32-WROOM-32U");
assert.match(elements.pinTableBody.innerHTML, /GPIO18 RF_SCK/);

const signalButton = modeButtons.find(button => button.dataset.mode === "signal");
elements.modeControls.dispatch("click", { target: { closest: () => signalButton } });
assert.equal(elements.guidePanel.hidden, false);
elements.guideNext.click();
assert.match(elements.guideTitle.textContent, /2\/4/);

for (const key of ["+", "-", "0", "Escape"]) {
  for (const callback of windowListeners.keydown || []) callback({ key, preventDefault() {} });
}

elements.exportPng.click();
elements.printGuide.click();

console.log("Explorer smoke test passed: data, modes, search, inspector, guide, keyboard, export and print handlers loaded.");
