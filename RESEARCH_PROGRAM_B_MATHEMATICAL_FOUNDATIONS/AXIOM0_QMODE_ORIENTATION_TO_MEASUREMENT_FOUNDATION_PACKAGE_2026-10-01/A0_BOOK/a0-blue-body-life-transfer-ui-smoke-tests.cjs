#!/usr/bin/env node
const assert = require("node:assert/strict");
const fs = require("node:fs");
const api = require("./assets/a0-blue-body-life-transfer-v1.js");

let assertions = 0;
const ok = (condition, message) => { assertions += 1; assert.ok(condition, message); };
const equal = (actual, expected, message) => { assertions += 1; assert.equal(actual, expected, message); };

class FakeNode {
  constructor(value = "") {
    this.value = value;
    this.checked = false;
    this.textContent = "";
    this.innerHTML = "";
    this.className = "";
    this.attributes = {};
    this.listeners = {};
  }
  addEventListener(type, listener) { this.listeners[type] = listener; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  emit(type) { this.listeners[type]?.({ target: this }); }
}

const nodes = {
  transferChannel: new FakeNode("0"),
  transferLayer: new FakeNode("0"),
  transferStage: new FakeNode(),
  transferWitness: new FakeNode(),
  transferCycle: new FakeNode(),
  transferSourceView: new FakeNode(),
  transferPreGrid: new FakeNode(),
  transferPostGrid: new FakeNode(),
  transferReceipt: new FakeNode(),
  transferReadout: new FakeNode(),
  transferChannelValue: new FakeNode(),
  transferLayerValue: new FakeNode()
};
nodes.transferWitness.checked = true;
const root = { querySelector: (selector) => nodes[selector.slice(1)] || null };
global.document = {};

const controller = api.mount(root);
ok(controller && typeof controller.render === "function", "mount returns a render controller");
ok(nodes.transferReceipt.innerHTML.includes("PASS_TYPED_TRANSPORT_RETURN"), "initial typed witness passes");
ok(nodes.transferReadout.textContent.includes("P0:0000"), "initial source key is visible");
ok(nodes.transferReadout.textContent.includes("EMPTY"), "generation-1 collapse is visible");
equal(nodes.transferStage.textContent, "Return to g0", "stage control describes inverse view");
equal(nodes.transferChannelValue.textContent.startsWith("1/16"), true, "channel readout is synchronized");
equal(nodes.transferLayerValue.textContent, "P0", "layer readout is synchronized");
equal((nodes.transferPreGrid.innerHTML.match(/transfer-cell/g) || []).length, 48, "pre-grid renders 48 cells");
equal((nodes.transferPostGrid.innerHTML.match(/transfer-cell/g) || []).length, 48, "post-grid renders 48 cells");

nodes.transferWitness.checked = false;
nodes.transferWitness.emit("input");
ok(nodes.transferReceipt.innerHTML.includes("HOLD_DYNAMICS_ONLY_AMBIGUOUS"), "witness ablation holds");
ok(nodes.transferReceipt.innerHTML.includes("candidate count 48"), "ablation exposes 48 candidates");
equal(nodes.transferReceipt.className, "transfer-receipt hold", "HOLD styling is applied");

nodes.transferStage.emit("click");
ok(nodes.transferReceipt.innerHTML.includes("PASS_PRE_DYNAMICS_COORDINATE_RETURN"), "g0 coordinate inverse passes without sidecar");
equal(nodes.transferStage.textContent, "Apply B3/S23 step", "stage button exposes next operation");

nodes.transferChannel.value = "13";
nodes.transferLayer.value = "2";
nodes.transferChannel.emit("input");
ok(nodes.transferReadout.textContent.includes("P2:1111"), "terminal cell source key can be selected");
ok(nodes.transferReadout.textContent.includes("(7,5)"), "terminal source maps to final 8x6 cell");
equal(nodes.transferChannelValue.textContent.startsWith("14/16"), true, "Gray-ring channel readout is synchronized");
equal(nodes.transferLayerValue.textContent, "P2", "terminal layer readout is synchronized");

const html = fs.readFileSync("./A0_GAME_4_LIFE_PLUS_1.html", "utf8");
for (const id of Object.keys(nodes)) ok(html.includes(`id="${id}"`), `HTML contains #${id}`);
ok(html.indexOf('<script src="assets/a0-blue-body-interior-crt16-v1.js">') < html.indexOf('<script src="assets/a0-blue-body-life-transfer-v1.js">'), "dependency loads before transfer module");
ok(html.includes("A0_LIVING_BLUEPRINT.html#integration-crosswalk"), "transfer returns to A0 Crosswalk");
ok(html.includes("103_A0_BLUE_BODY_GAME4LIFE_TRANSFER_CONTROL"), "transfer links Check 103");
ok(html.includes('id="lifeTransitionObservatory"'), "source workbench iframe has a stable bridge target");
ok(html.includes('data-public-src="../previews/numbers-return-20261019/book/assets/game-of-worlds-play/index.html'), "public source bridge targets the deployed source-owned projection");
ok(html.includes("location.hostname.endsWith('github.io')"), "public bridge activates only on GitHub Pages");
ok(html.includes('id="lifeTransitionFull"'), "full-instrument link shares the public bridge");
ok(html.includes('id="lifeZAdapterRecord"'), "Z adapter record has a stable public bridge target");
ok(html.includes('data-public-href="../previews/numbers-return-20261019/core/APPLICATIONS/game4life_plus1/05_TEMPORAL_Z_VIEW_ADAPTER_2026-10-13.html"'), "Z adapter record points to the browser-readable public source projection");
ok(html.includes('id="lifeThreeDomainMontage"'), "three-domain montage has a stable public bridge target");
ok(html.includes('three-domain-transition-test/index.html?rev=life-public-return-20261019'), "montage points to the deployed source-owned projection");
ok(html.includes('id="lifeReplicationMatrix"'), "replication matrix has a stable public bridge target");
ok(html.includes('replication-matrix/index.html?rev=life-public-return-20261019'), "replication matrix points to the deployed source-owned projection");

controller.stop();
delete global.document;

console.log(JSON.stringify({
  status: "PASS",
  assertions,
  mountedSource: "P0:0000",
  selectedTerminalSource: "P2:1111",
  typedBranch: "PASS_TYPED_TRANSPORT_RETURN",
  ablatedBranch: "HOLD_DYNAMICS_ONLY_AMBIGUOUS",
  coordinateBranch: "PASS_PRE_DYNAMICS_COORDINATE_RETURN"
}, null, 2));
