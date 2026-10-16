#!/usr/bin/env node
const assert = require("node:assert/strict");
const fs = require("node:fs");
const blue = require("./assets/a0-blue-body-interior-crt16-v1.js");
const transfer = require("./assets/a0-blue-body-life-transfer-v1.js");
const api = require("./assets/a0-pentagon-body-player-v1.js");

let assertions = 0;
const equal = (actual, expected, message) => { assertions += 1; assert.equal(actual, expected, message); };
const ok = (condition, message) => { assertions += 1; assert.ok(condition, message); };

const body = api.buildBody();
equal(body.nodes.length, 48, "body must contain 48 address nodes");
equal(new Set(body.nodes.map((node) => node.sourceKey)).size, 48, "body source keys must be unique");
equal(body.edges.length, 122, "body must expose the frozen view-edge scaffold");
for (let layer = 0; layer < 3; layer += 1) {
  equal(body.nodes.filter((node) => node.layer === layer).length, 16, `P${layer} must contain 16 nodes`);
  equal(body.nodes.filter((node) => node.layer === layer && node.channel < 15).length, 15, `P${layer} must contain triple-pentagon nodes`);
  equal(body.nodes.filter((node) => node.layer === layer && node.channel === 15).length, 1, `P${layer} must contain one aperture node`);
}
for (const node of body.nodes) {
  ok(Number.isFinite(node.x) && Number.isFinite(node.y) && Number.isFinite(node.z), `${node.sourceKey} must have finite 3D coordinates`);
  equal(blue.unbind(node.sourceKey).sourceKey, node.sourceKey, `${node.sourceKey} must retain its exact source address`);
  const cell = transfer.sourceToCell(node.sourceKey);
  equal(transfer.cellToSource(cell).sourceKey, node.sourceKey, `${node.sourceKey} must round-trip through LIFE coordinates`);
}
for (const edge of body.edges) {
  ok(body.nodes.some((node) => node.sourceKey === edge.a), `edge source ${edge.a} must exist`);
  ok(body.nodes.some((node) => node.sourceKey === edge.b), `edge target ${edge.b} must exist`);
}

const sequences = api.validateSequences();
equal(api.SEQUENCE_IDS.length, 11, "console must expose eleven declared sequences");
for (const id of api.SEQUENCE_IDS) {
  equal(sequences[id].length, 48, `${id} must contain 48 ticks`);
  equal(sequences[id].unique, 48, `${id} must visit 48 unique addresses`);
  equal(sequences[id].complete, true, `${id} must be a complete carrier permutation`);
}
equal(api.buildSequence("layer1617").slice(0, 6).join(","), "0,16,32,1,17,33", "16/17 staircase must couple layers by channel");
equal(api.buildSequence("gray").slice(0, 8).join(","), "0,1,3,2,6,7,5,4", "Gray schedule must follow the Hamming path");
equal(api.buildSequence("ihara5").slice(0, 16).join(","), "0,1,2,3,4,9,8,7,6,5,10,11,12,13,14,15", "Ihara relay must use three oriented C5 blocks and one aperture seam");
equal(api.buildSequence("fibonacci").slice(0, 12).join(","), "0,30,12,41,23,5,34,16,45,27,9,38", "Fibonacci schedule must preserve the frozen phi-rank quantization");
equal(api.buildSequence("fibonacciEuler7").slice(0, 16).join(","), "0,18,36,47,17,35,46,16,27,45,15,26,44,14,32,2", "Fibonacci-Euler coupling must compose phi rank with multiplication by seven mod 48");
equal(api.fibonacciEulerCoupling(1).angleDegrees.toFixed(6), "222.492236", "Euler phase must expose the exact Fibonacci angular step");
equal(api.fibonacciEulerCoupling(1).eulerAddress, 18, "Euler address must map Fibonacci rank 30 through times seven mod 48");
equal(api.fibonacciEulerCoupling(1).completePermutationReason, "gcd(7,48)=1", "coupling must expose its finite permutation witness");
equal(api.buildSequence("rose5").slice(0, 16).join(","), "0,2,4,1,3,5,7,9,6,8,10,12,14,11,13,15", "Rose schedule must traverse every C5 ring by +2 and retain the aperture seam");
ok(api.SEQUENCE_NOTES.fibonacci.includes("no natural Fibonacci law"), "Fibonacci schedule must retain its non-physical claim boundary");
ok(api.SEQUENCE_NOTES.rose5.includes("source-image labels only"), "Rose schedule must separate visual provenance labels from the operator");
equal(api.buildSequence("euler7").slice(0, 5).join(","), "0,7,14,21,28", "Euler schedule must use +7 mod 48");
equal(api.buildSequence("prime17").slice(0, 5).join(","), "0,17,34,3,20", "prime schedule must use +17 mod 48");

const p0 = api.pulseFrame(0), p1 = api.pulseFrame(1), p2 = api.pulseFrame(2);
equal(p0.cells.length, 7, "pulse phase 0 must contain seven cells");
equal(p1.cells.length, 7, "pulse phase 1 must contain seven cells");
equal(transfer.signature(p0.cells), transfer.signature(p2.cells), "pulse must return after two B3/S23 steps");
ok(transfer.signature(p0.cells) !== transfer.signature(p1.cells), "pulse phases must remain visually distinct");
equal(new Set(api.activeSources(p0.cells).map((source) => source.sourceKey)).size, 7, "phase 0 addresses must be unique");
equal(new Set(api.activeSources(p1.cells).map((source) => source.sourceKey)).size, 7, "phase 1 addresses must be unique");
equal(api.layerCounts(p0.cells).every((count) => count > 0), true, "phase 0 must touch all three layers");
equal(api.layerCounts(p1.cells).every((count) => count > 0), true, "phase 1 must touch all three layers");
equal(p0.receipt.status, "PASS_CURRENT_FRAME_ADDRESS_RETURN", "typed current-frame return must pass");
equal(api.patternReceipt(p0.cells, 0, false).status, "HOLD_HISTORY_WITNESS_WITHHELD", "history return without witness must hold");

const validation = api.validatePlayer();
equal(validation.nodes, 48, "validator must expose 48 nodes");
equal(validation.uniqueSourceKeys, 48, "validator must expose 48 unique source keys");
equal(validation.edges, 122, "validator must expose 122 view edges");
equal(validation.pulsePeriod, 2, "validator must confirm the period-2 fixture");

const html = fs.readFileSync("./A0_TESSAREC_BLUE_BODY_LAB.html", "utf8");
for (const id of ["pentagon-body-player", "bodyPlayerCanvas", "bodyLayerView", "bodyHouseView", "bodyLifeGrid", "bodyTrace", "bodyPlayerReceipt", "bodyAddress", "bodySequence", "bodyPlayerPlay", "bodyPlayerStep", "bodyPlayerReset", "bodyPlayerWitness", "bodyBlueCanvas", "bodyBlueViewLabel", "fibEulerCouple", "fibEulerStep", "fibEulerComplex", "fibEulerAddress"]) {
  ok(html.includes(`id="${id}"`), `HTML must contain #${id}`);
}
for (const id of ["guided-test", "expert-index", "expertModeToggle", "expert-mode-note"]) {
  ok(html.includes(`id="${id}"`), `guided reading HTML must contain #${id}`);
}
equal((html.match(/class="section expert-section"/g) || []).length, 5, "five specialist comparisons must be disclosed as expert sections");
ok(html.includes('href="A0_RESEARCH_DESK.html#tests"'), "guided instrument must return to the Science Desk");
ok(html.includes("16/17-Schichttreppe"), "guided copy must name one fixed first walkthrough");
ok(html.indexOf('<script src="assets/a0-blue-body-life-transfer-v1.js">') < html.indexOf('<script src="assets/a0-pentagon-body-player-v1.js">'), "LIFE transfer dependency must load before body player");
ok(html.includes("assets/a0-pentagon-body-player-v1.json"), "HTML must link the machine record");
ok(html.includes("104_A0_PENTAGON_BODY_PLAYER"), "HTML must link Check 104");

console.log(JSON.stringify({
  status: "PASS",
  assertions,
  body: "48 source-bound 3D nodes / 3 x (15+1)",
  views: ["rotatable-3d", "triple-pentagon", "life-8x6", "typed-return-trace", "blue-pink-shell", "house-q4-distribution"],
  sequences: api.SEQUENCE_IDS,
  pulse: "7-cell period-2 finite-dead B3/S23 fixture touching P0 P1 P2 in both phases",
  boundary: api.CLAIM_BOUNDARY
}, null, 2));
