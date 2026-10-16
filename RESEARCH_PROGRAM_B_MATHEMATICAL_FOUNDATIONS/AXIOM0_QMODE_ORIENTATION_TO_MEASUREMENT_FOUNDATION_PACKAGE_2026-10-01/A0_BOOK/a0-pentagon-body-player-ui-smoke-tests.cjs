#!/usr/bin/env node
const assert = require("node:assert/strict");
const api = require("./assets/a0-pentagon-body-player-v1.js");

let assertions = 0;
const ok = (condition, message) => { assertions += 1; assert.ok(condition, message); };
const equal = (actual, expected, message) => { assertions += 1; assert.equal(actual, expected, message); };

class FakeClassList {
  constructor() { this.values = new Set(); }
  toggle(name, force) { if (force) this.values.add(name); else this.values.delete(name); }
  contains(name) { return this.values.has(name); }
}
class FakeNode {
  constructor(value = "") {
    this.value = value; this.checked = false; this.textContent = ""; this.innerHTML = ""; this.className = "";
    this.listeners = {}; this.attributes = {}; this.dataset = {}; this.classList = new FakeClassList();
  }
  addEventListener(type, listener) { this.listeners[type] = listener; }
  emit(type, event = {}) { this.listeners[type]?.({ target: this, clientX: 0, clientY: 0, pointerId: 1, preventDefault() {}, ...event }); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getBoundingClientRect() { return { width: 720, height: 440, left: 0, top: 0 }; }
}
class FakeCanvas extends FakeNode {
  constructor() { super(); this.width = 0; this.height = 0; this.drawCalls = 0; }
  getContext() {
    const canvas = this;
    return new Proxy({}, {
      get(target, prop) {
        if (prop in target) return target[prop];
        if (["setTransform", "clearRect", "beginPath", "moveTo", "lineTo", "stroke", "closePath", "fill", "fillText"].includes(prop)) return () => { canvas.drawCalls += 1; };
        return "";
      },
      set(target, prop, value) { target[prop] = value; return true; }
    });
  }
  setPointerCapture() {}
}

const nodes = {
  bodyPlayerCanvas: new FakeCanvas(), bodyLayerView: new FakeNode(), bodyHouseView: new FakeNode(), bodyLifeGrid: new FakeNode(), bodyTrace: new FakeNode(), bodyPlayerReceipt: new FakeNode(),
  bodyAddress: new FakeNode("0"), bodyAddressValue: new FakeNode(), bodySpeed: new FakeNode("620"), bodySpeedValue: new FakeNode(), bodyPlayerWitness: new FakeNode(),
  bodySequence: new FakeNode("layer1617"), bodyBlueCanvas: new FakeCanvas(), bodyBlueViewLabel: new FakeNode(),
  bodyPlayerPlay: new FakeNode(), bodyPlayerStep: new FakeNode(), bodyPlayerReset: new FakeNode()
};
nodes.bodyPlayerWitness.checked = true;
const addressMode = new FakeNode(), pulseMode = new FakeNode();
addressMode.dataset.bodyMode = "address"; pulseMode.dataset.bodyMode = "coupled";
const dayView = new FakeNode(), nightView = new FakeNode(), mirrorView = new FakeNode();
dayView.dataset.bodyView = "day"; nightView.dataset.bodyView = "night"; mirrorView.dataset.bodyView = "mirror";
const root = {
  querySelector: (selector) => nodes[selector.slice(1)] || null,
  querySelectorAll: (selector) => selector === "[data-body-mode]" ? [addressMode, pulseMode] : selector === "[data-body-view]" ? [dayView, nightView, mirrorView] : []
};

const controller = api.mount(root);
ok(controller && typeof controller.step === "function", "mount returns a player controller");
ok(nodes.bodyPlayerCanvas.drawCalls > 100, "3D canvas receives body draw calls");
ok(nodes.bodyBlueCanvas.drawCalls > 100, "Blue Body canvas receives shell draw calls");
ok(nodes.bodyLayerView.innerHTML.includes("P0") && nodes.bodyLayerView.innerHTML.includes("P2"), "triple-layer SVG is rendered");
ok(nodes.bodyHouseView.innerHTML.includes("HOUSE · LEDGER") && nodes.bodyHouseView.innerHTML.includes("0000"), "House view renders the Q4 distribution");
ok(nodes.bodyHouseView.innerHTML.includes("P0:0000↔P0:1111"), "House view exposes the selected complement pair");
ok(nodes.bodyHouseView.innerHTML.includes("pillar = vertex") && nodes.bodyHouseView.innerHTML.includes("channel = edge"), "House ledger types pillars as vertices and channels as edges");
ok(nodes.bodyHouseView.innerHTML.includes("KITE · A2 → 3-FOLD") && nodes.bodyHouseView.innerHTML.includes("HYPOTHESIS ONLY"), "House ledger exposes the bounded Kite triangle adapter");
equal((nodes.bodyLifeGrid.innerHTML.match(/body-life-cell/g) || []).length, 48, "LIFE view renders 48 cells");
ok(nodes.bodyAddressValue.textContent.includes("P0:0000"), "initial address is synchronized");
ok(nodes.bodyTrace.innerHTML.includes("Exact sequence console"), "initial trace identifies sequence mode");
ok(nodes.bodyTrace.innerHTML.includes("16/17 layer staircase"), "initial sequence is named in the trace");
ok(nodes.bodyPlayerReceipt.innerHTML.includes("PASS_CURRENT_FRAME_ADDRESS_RETURN"), "initial typed return passes");
equal(addressMode.classList.contains("active"), true, "address mode is active initially");

equal(controller.setSequence("ihara5"), true, "Ihara sequence can be selected through the controller");
ok(nodes.bodyTrace.innerHTML.includes("Ihara C5 inner-ring relay"), "Ihara sequence is visible in the trace");
nodes.bodyPlayerStep.emit("click");
ok(nodes.bodyAddressValue.textContent.includes("P0:0001"), "Ihara relay advances along the first directed C5");
equal(controller.setView("night"), true, "night display can be selected through the controller");
ok(nodes.bodyBlueViewLabel.textContent.includes("NIGHT · PINK"), "night display is visible on the Blue Body shell");
equal(nightView.classList.contains("active"), true, "night display styling is active");
equal(controller.setSequence("fibonacci"), true, "Fibonacci phi-rank sequence can be selected through the controller");
ok(nodes.bodyTrace.innerHTML.includes("uₖ=frac(k/φ)"), "Fibonacci contract is visible in the trace");
equal(controller.setSequence("fibonacciEuler7"), true, "Fibonacci-to-Euler +7 composition can be selected through the controller");
ok(nodes.bodyTrace.innerHTML.includes("exp(2πiuₖ)") && nodes.bodyTrace.innerHTML.includes("7·rank mod 48"), "typed Euler phase and finite +7 composition are visible in the trace");
equal(controller.setSequence("rose5"), true, "Rose C5 step-2 sequence can be selected through the controller");
ok(nodes.bodyTrace.innerHTML.includes("source-image labels only"), "Rose trace keeps provenance labels outside the exact operator");

pulseMode.emit("click");
ok(nodes.bodyTrace.innerHTML.includes("Three-layer B3/S23 pulse"), "pulse mode can be selected");
ok(nodes.bodyTrace.innerHTML.includes("P0:") && nodes.bodyTrace.innerHTML.includes("P1:") && nodes.bodyTrace.innerHTML.includes("P2:"), "pulse trace exposes all three layers");
equal((nodes.bodyLifeGrid.innerHTML.match(/ active/g) || []).length, 7, "pulse phase contains seven active cells");
equal(pulseMode.classList.contains("active"), true, "pulse mode styling is active");

nodes.bodyPlayerStep.emit("click");
ok(nodes.bodyAddressValue.textContent.includes("g1"), "step advances pulse generation");
equal((nodes.bodyLifeGrid.innerHTML.match(/ active/g) || []).length, 7, "period-2 phase 1 retains seven cells");

nodes.bodyPlayerWitness.checked = false;
nodes.bodyPlayerWitness.emit("input");
ok(nodes.bodyPlayerReceipt.innerHTML.includes("HOLD_HISTORY_WITNESS_WITHHELD"), "withheld history witness fails closed");
equal(nodes.bodyPlayerReceipt.className, "body-player-receipt hold", "HOLD styling is applied");

nodes.bodyPlayerReset.emit("click");
ok(nodes.bodyAddressValue.textContent.includes("g0"), "reset returns pulse to generation zero");
controller.stop();

console.log(JSON.stringify({
  status: "PASS",
  assertions,
  mounted: true,
  canvas: "body and Blue/Pink shell drawn",
  modes: ["address", "coupled"],
  sequences: ["Ihara C5 inner-ring relay", "Fibonacci phi-rank", "Fibonacci to Euler +7", "Rose C5 step-2"],
  views: ["day", "night", "view-mirror"],
  branches: ["PASS_CURRENT_FRAME_ADDRESS_RETURN", "HOLD_HISTORY_WITNESS_WITHHELD"]
}, null, 2));
