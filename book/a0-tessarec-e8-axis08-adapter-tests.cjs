const assert = require("node:assert/strict");
const body = require("./assets/a0-tessarec-blue-body-v1.js");
const spectral = require("./assets/a0-tessarec-spectral-audit-v1.js");
const adapter = require("./assets/a0-tessarec-e8-axis08-adapter-v1.js");
const axisCore = require("../../../SCIENCE_LAB/CASE_STUDIES/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/REPAIR_R1/e8_axis08_core.js");

const eigenvalues = spectral.spectralAudit(body.buildShell()).eigenvalues;
const result = adapter.run(eigenvalues, axisCore, { pairStart: 3 });

assert.equal(result.schema, adapter.SCHEMA);
assert.equal(result.status, "CROSS_LENS_NOT_IDENTITY");
assert.equal(result.source.laneMeans.length, 8);
assert.equal(result.axis08.quotientCoordinates.length, 7);
assert.deepEqual(result.axis08.pairDisplay, [4, 5]);
assert.equal(result.axis08.result, "EXACT_RETURN_WITH_RESIDUAL");
assert.ok(result.axis08.reconstructionError < 1e-12);
assert.equal(result.e8.referenceAudit.pass, true);
assert.equal(result.e8.referenceAudit.count, 240);
assert.ok(result.e8.distance >= 0);
assert.ok(result.e8.returnError < 1e-12);
assert.equal(adapter.run(eigenvalues, axisCore, { pairStart: 0 }).axis08.quotientCoordinates.length, 7);
assert.equal(adapter.run(eigenvalues, axisCore, { pairStart: 6 }).axis08.quotientCoordinates.length, 7);
assert.throws(() => adapter.run(eigenvalues, axisCore, { pairStart: 7 }), /pairStart/);

console.log(JSON.stringify({
  status: "PASS",
  assertions: 13,
  pair: result.axis08.pairDisplay,
  laneMeans: result.source.laneMeans,
  e8NearestRoot: result.e8.nearestRootIndex,
  e8Family: result.e8.nearestRootFamily,
  e8Distance: result.e8.distance,
  reconstructionError: result.axis08.reconstructionError,
  boundary: result.claimBoundary
}, null, 2));
