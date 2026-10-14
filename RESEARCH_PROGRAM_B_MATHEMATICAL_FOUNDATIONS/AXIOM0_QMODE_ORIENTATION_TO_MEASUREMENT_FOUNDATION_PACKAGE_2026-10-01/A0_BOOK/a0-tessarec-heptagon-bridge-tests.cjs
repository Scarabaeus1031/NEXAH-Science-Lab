const assert = require("node:assert/strict");
const api = require("./assets/a0-tessarec-heptagon-bridge-v1.js");
const record = require("./assets/a0-tessarec-heptagon-bridge-v1.json");

const ledger = api.exactLedger();
assert.deepEqual(ledger.disjoint, { vertices: 96, edges: 144, faces: 52, euler: 4, faceVector: { octagons: 4, pentagons: 32, hexagons: 16, heptagons: 0 }, wirelength: 560 });
assert.deepEqual(ledger.connected, { vertices: 96, edges: 144, faces: 50, euler: 2, faceVector: { octagons: 4, pentagons: 32, hexagons: 2, heptagons: 12 } });
assert.equal(ledger.seam.removedHexagons * 6, 84);
assert.equal(ledger.seam.insertedHeptagons * 7, 84);
assert.equal(ledger.curvature.connectedCharge, 12);
assert.equal(ledger.carrierOptions.disjoint.wirelength, 560);

const comparator = api.seamWordComparator();
assert.deepEqual(comparator.typedWord.tokens, [4, 7, 7, 4]);
assert.equal(comparator.typedWord.decimalConcatenation, 4774);
assert.equal(comparator.typedWord.palindrome, true);
assert.equal(comparator.typedWord.digitSum, 22);
assert.deepEqual(comparator.typedWord.factorization, [2, 7, 11, 31]);
assert.equal(comparator.primeAddress.four, "2^2");
assert.equal(comparator.primeAddress.seven, "p4");
assert.equal(comparator.primeAddress.seventeen, "p7");
assert.equal(comparator.primeAddress.thirtyFour, "p1*p7");
assert.equal(comparator.sigma34.step, 17);
assert.equal(comparator.sigma34.additiveOrder, 2);
assert.equal(comparator.sigma34.plusEqualsMinus, true);
assert.equal(comparator.sigma34.verdict, "PASS_EXACT_HALF_TURN");
assert.equal(comparator.sigma40.quotientIsInteger, false);
assert.equal(comparator.sigma40.gcdDivisorModulus, 1);
assert.equal(comparator.sigma40.nonzeroOrderThreeExists, false);
assert.equal(comparator.sigma40.verdict, "HOLD_SCALAR_ONLY_NOT_DISCRETE_THIRDS");
assert.deepEqual(comparator.root40.coordinates, [2, 2, 4, 4]);
assert.equal(comparator.root40.normSquared, 40);
assert.equal(comparator.root40.imaginaryTotal, 36);
assert.equal(comparator.root40.imaginaryMean, 12);
assert.equal(comparator.root40.imaginaryEqual, false);

const m7 = api.m7GridSwitch();
assert.deepEqual(m7.order, ["duerer34", "seam4774", "ratio432", "return440"]);
assert.equal(new Set(m7.order).size, 4);
for (const id of m7.order) {
  assert.equal(m7.views[id].id, id);
  assert.equal(m7.views[id].values.length, 16);
}
const durer = m7.views.duerer34.values;
assert.deepEqual([...durer].sort((a, b) => a - b), Array.from({ length: 16 }, (_, i) => i + 1));
for (let row = 0; row < 4; row += 1) assert.equal(durer.slice(row * 4, row * 4 + 4).reduce((a, b) => a + b, 0), 34);
for (let column = 0; column < 4; column += 1) assert.equal([0, 1, 2, 3].reduce((sum, row) => sum + durer[row * 4 + column], 0), 34);
assert.equal([0, 5, 10, 15].reduce((sum, index) => sum + durer[index], 0), 34);
assert.equal([3, 6, 9, 12].reduce((sum, index) => sum + durer[index], 0), 34);
assert.deepEqual(m7.views.seam4774.values.slice(0, 4), [4, 7, 7, 4]);
assert.equal(m7.views.seam4774.status, "TYPED_VIEW");
assert.equal(m7.views.ratio432.status, "SCHEMATIC_VIEW");
assert.equal(m7.views.return440.status, "SCHEMATIC_VIEW");
assert.match(m7.claimBoundary, /M7 is not H7/);
assert.match(m7.claimBoundary, /twelve heptagon/);
assert.equal(record.version, "1.2.0");
assert.deepEqual(record.m7GridSwitch.order, m7.order);
for (const id of m7.order) {
  assert.equal(record.m7GridSwitch.views[id].status, m7.views[id].status);
  assert.deepEqual(record.m7GridSwitch.views[id].values, m7.views[id].values);
}
assert.match(record.m7GridSwitch.claimBoundary, /not H7/);

const run = api.search({ seed: 7080, iterations: 600000 });
assert.equal(run.found, true);
assert.equal(run.score, 0);
assert.deepEqual(run.validation.degreeHistogram, { 5: 32, 6: 2, 7: 12, 8: 4 });
assert.equal(run.validation.vertices, 50);
assert.equal(run.validation.edges, 144);
assert.equal(run.validation.faces, 96);
assert.equal(run.validation.euler, 2);
assert.equal(run.validation.manifold, true);
assert.equal(run.validation.distinctFaces, true);
console.log("PASS a0-tessarec-heptagon-bridge-tests");
