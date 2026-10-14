const assert = require("node:assert/strict");
const api = require("./assets/a0-tessarec-fiber-geometry-v1.js");

const f = api.fiber("1111");
assert.equal(f.binaryInteger, 15);
assert.equal(f.decimalLabel, 1111);
assert.equal(f.totient, 1000);
assert.equal(f.totientGap, 111);
assert.equal(f.multiplicity, 3);
assert.deepEqual(f.layers.map((x) => x.frame), [10, 26, 42]);
assert.deepEqual(f.layers.map((x) => x.host), ["A0", "A7", "A5"]);

const p = api.pentagon(1);
assert.ok(Math.abs(p.diagonal - api.PHI) < 1e-12);
assert.ok(Math.abs(p.remainderToTriangle - api.PHI ** 2) < 1e-12);
assert.ok(Math.abs(p.triangleShare - (5 - Math.sqrt(5)) / 10) < 1e-12);

const cut = api.truncateApex(1 / api.PHI, 1);
assert.equal(cut.boundarySides, 6);
assert.equal(cut.equalCutEdge, true);
assert.ok(Math.abs(cut.cutEdge - 1) < 1e-12);
assert.ok(Math.abs(cut.triangleShare + cut.hexagonShare - 1) < 1e-12);
console.log("PASS a0-tessarec-fiber-geometry-tests");
