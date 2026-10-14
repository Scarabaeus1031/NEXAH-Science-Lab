const assert = require("node:assert/strict");
const body = require("./assets/a0-tessarec-blue-body-v1.js");
const audit = require("./assets/a0-tessarec-spectral-audit-v1.js");

const shell = body.buildShell();
const result = audit.run(shell, { controlCount: 8 });
const replay = audit.replayA7Ensemble(body);

assert.equal(result.spectral.vertices, 48);
assert.equal(result.spectral.edges, 72);
assert.equal(result.spectral.degree, 3);
assert.equal(result.spectral.regular, true);
assert.equal(result.spectral.connected, true);
assert.equal(result.spectral.bipartite, false);
assert.equal(result.spectral.solver.converged, true);
assert.ok(Math.abs(result.spectral.trace) < 1e-9);
assert.ok(Math.abs(result.spectral.sumSquares - 144) < 1e-8);
assert.ok(result.spectral.maxNontrivial < 2 * Math.sqrt(2));
assert.equal(result.spectral.ramanujanNumericalPass, true);

const slices = audit.spectralDisplaySlices(result.spectral.eigenvalues, 8);
assert.equal(slices.mode, "INDEX_PACKING_NOT_SPECTRAL_COORDINATE");
assert.equal(slices.laneCount, 8);
assert.equal(slices.valueCount, 48);
assert.deepEqual(slices.lanes.map((lane) => lane.members.length), Array(8).fill(6));
assert.equal(slices.lanes[0].members[0].trivial, true);
assert.equal(slices.lanes[0].members[0].value, result.spectral.eigenvalues[0]);

assert.equal(result.curvature.chargeTotal, 12);
assert.ok(Math.abs(result.curvature.defectTotal - 4 * Math.PI) < 1e-10);
assert.deepEqual(Object.fromEntries(Object.entries(result.curvature.grouped).map(([k, v]) => [k, [v.count, v.totalCharge]])), {
  5: [16, 16],
  6: [8, 0],
  8: [2, -4]
});

assert.equal(result.ihara.nontrivialPoleCount, 94);
assert.equal(result.ihara.circleNumericalPass, true);
assert.ok(result.ihara.maxRadiusError < 1e-9);

assert.equal(result.a7.runs, 16);
assert.equal(result.a7.a7Count, 2);
assert.equal(result.a7.bestWirelength, 280);
assert.deepEqual(result.a7.bestSeeds, [7, 11]);
assert.deepEqual(result.a7.bestMiddleHosts, ["A7", "D4"]);
assert.equal(result.a7.invariant, false);
assert.deepEqual(replay, audit.A7_ENSEMBLE_120K);

assert.equal(result.controls.count, 8);
assert.ok(result.controls.records.every((record) => Number.isFinite(record.maxNontrivial)));

console.log(JSON.stringify({
  status: "PASS",
  assertions: 36,
  maxNontrivial: result.spectral.maxNontrivial,
  ramanujanBound: result.spectral.ramanujanBound,
  margin: result.spectral.margin,
  a7Rate: result.a7.a7Rate,
  curvatureCharge: result.curvature.chargeTotal,
  iharaRadius: result.ihara.targetRadius,
  controls: result.controls
}, null, 2));
