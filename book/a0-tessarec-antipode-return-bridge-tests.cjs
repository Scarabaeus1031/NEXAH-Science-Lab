"use strict";

const assert = require("node:assert/strict");
const core = require("../../../SCIENCE_LAB/CASE_STUDIES/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/REPAIR_R1/e8_axis08_core.js");
const body = require("./assets/a0-tessarec-blue-body-v1.js");
const adapter = require("./assets/a0-tessarec-e8-axis08-adapter-v1.js");
const bridge = require("./assets/a0-tessarec-antipode-return-bridge-v1.js");
const spectral = require("./assets/a0-tessarec-spectral-audit-v1.js");

let passed = 0;
function check(name, fn) {
  fn();
  passed += 1;
  console.log(`PASS ${name}`);
}

const roots = core.constructE8Roots();
const cross = adapter.run(spectral.spectralAudit(body.buildShell()).eigenvalues, core, { pairStart: 3 });
const axes = bridge.buildAxes(roots);
const record = bridge.decompose(cross.e8.normalized, roots);

check("schema is versioned", () => assert.equal(record.schema, "A0_TESSAREC_ANTIPODE_RETURN_BRIDGE_V1"));
check("240 reference roots are retained", () => assert.equal(record.rootCount, 240));
check("roots form 120 axes", () => assert.equal(axes.length, 120));
check("every axis has two distinct root indices", () => assert.ok(axes.every((axis) => axis.positiveIndex !== axis.negativeIndex)));
check("every representative has an exact antipode", () => assert.ok(axes.every((axis) => roots[axis.negativeIndex].every((value, i) => Math.abs(value + roots[axis.positiveIndex][i]) < 1e-12))));
check("source dimension is eight", () => assert.equal(record.sourceDimension, 8));
check("orientation is typed", () => assert.ok(record.sign === -1 || record.sign === 1));
check("residual has eight components", () => assert.equal(record.residualVector.length, 8));
check("return is exact", () => assert.ok(record.reconstructionError < 1e-12));
check("return reconstructs source vector", () => assert.ok(record.reconstruction.every((value, i) => Math.abs(value - cross.e8.normalized[i]) < 1e-12)));
check("specificity negative is retained", () => assert.equal(record.specificity, "NO_E8_ANTIPODAL_SPECIFICITY_RETAINED"));
check("Janus display flip keeps exact return", () => assert.ok(bridge.reorient(record, -record.sign).reconstructionError < 1e-12));
check("Janus display flip changes the typed sign", () => assert.equal(bridge.reorient(record, -record.sign).sign, -record.sign));
check("AXIS08 pair remains separate metadata", () => assert.deepEqual(cross.axis08.pairDisplay, [4, 5]));

console.log(`${passed}/14 antipode-return bridge checks passed`);
