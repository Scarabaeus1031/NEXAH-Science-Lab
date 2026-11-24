const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ecosystemRoot = path.resolve(__dirname, '../../../../..');
const sccRoot = path.join(
  ecosystemRoot,
  '10 NEXAH CORE/NEXAH/RESEARCH/NOTES/PASCAL_PENTAGON_D5_TEST_2026-10-10/SCC_003_REFERENCE'
);
const metricsPath = path.join(sccRoot, 'artifacts/expected_metrics.json');

assert.ok(fs.existsSync(metricsPath), 'canonical SCC-003 metrics must exist');
const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));

function pascalRow(n) {
  const row = [1];
  for (let k = 1; k <= n; k += 1) {
    row.push((row[k - 1] * (n - k + 1)) / k);
  }
  return row;
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0);
}

const row4 = pascalRow(4);
const row5 = pascalRow(5);
const row6 = pascalRow(6);
const depth3 = [pascalRow(0), pascalRow(1), pascalRow(2), pascalRow(3)];
const depth3Total = sum(depth3.flat());
const depth3Shell = depth3[0][0] + 2 * 3;
const depth3Core = depth3Total - depth3Shell;

assert.equal(depth3Total, 15);
assert.equal(depth3Shell, 7);
assert.equal(depth3Core, 8);
assert.deepEqual(depth3.flat().filter((_, index) => ![0,1,2,3,5,6,9].includes(index)), [2,3,3]);

assert.deepEqual(row4, [1, 4, 6, 4, 1]);
assert.equal(row4.join(''), '14641');
assert.equal(11 ** 4, 14641);
assert.equal(sum(row4), 2 ** 4);

assert.deepEqual(row5, [1, 5, 10, 10, 5, 1]);
assert.deepEqual(row6, [1, 6, 15, 20, 15, 6, 1]);
assert.equal(row5.length + row6.length, 13);
assert.equal(sum(row5), 32);
assert.equal(sum(row6), 64);
assert.equal(sum(row5) + sum(row6), 96);

assert.equal(metrics.parameters.depth, 6);
assert.equal(metrics.parameters.faces, 5);
assert.equal(metrics.counts.typed_automorphism_group_order, 10);
assert.equal(metrics.counts.quotient_nodes, 106);

// Rows five and six contain thirteen positions on one Pascal face. Across all
// five SCC-003 faces this is 65 raw face incidences. Cyclic seam gluing merges
// five side pairs at each of the two levels, leaving 55 quotient vertices.
const rawTwoLevelPositions = 5 * (row5.length + row6.length);
const twoLevelSeamMerges = 5 * 2;
const quotientTwoLevelVertices = rawTwoLevelPositions - twoLevelSeamMerges;
assert.equal(rawTwoLevelPositions, 65);
assert.equal(quotientTwoLevelVertices, 55);

// The face-incidence weight is retained per face. A quotient-only sum removes
// one duplicate weight-1 endpoint for every merged seam pair.
const faceIncidenceWeight = 5 * (sum(row5) + sum(row6));
const quotientWeight = faceIncidenceWeight - twoLevelSeamMerges;
assert.equal(faceIncidenceWeight, 480);
assert.equal(quotientWeight, 470);

// If 1-4-6-4-1 is wrapped directly around a five-cycle, only identity and one
// reflection preserve the weights. It therefore has C2 stabilizer, not the
// full typed D5 action of SCC-003. SCC-003's D5 acts on five whole Pascal faces;
// it does not identify the five positions of one Pascal row with those faces.
const mod5 = (value) => ((value % 5) + 5) % 5;
const actions = [];
for (let a = 0; a < 5; a += 1) {
  actions.push({ name: `r${a}`, map: (k) => mod5(k + a) });
  actions.push({ name: `m${a}`, map: (k) => mod5(a - k) });
}
const preservingActions = actions
  .filter(({ map }) => row4.every((weight, k) => weight === row4[map(k)]))
  .map(({ name }) => name);

assert.deepEqual(preservingActions, ['r0', 'm4']);
assert.equal(preservingActions.length, 2);

const result = {
  status: 'PASS',
  identity: 'SCC-003 / A0OE:PASCAL_PENTAGON_D5_TEST',
  disposition: 'LOCAL_FACEWISE_CROSSWALK_ONLY / D5_IDENTIFICATION_REJECTED',
  exact: {
    depth3_shell_core: '15 = 7 shell + 8 core; interior coefficients 2+3+3=8',
    row4,
    digit_readout: '14641 = 11^4',
    lower_rows: '6 + 7 = 13 positions on one face',
    lower_weight: '32 + 64 = 96 on one face'
  },
  scc003_projection: {
    raw_positions_levels_5_6: rawTwoLevelPositions,
    quotient_vertices_levels_5_6: quotientTwoLevelVertices,
    face_incidence_weight_levels_5_6: faceIncidenceWeight,
    quotient_weight_levels_5_6: quotientWeight,
    full_typed_group_order: metrics.counts.typed_automorphism_group_order,
    row4_weight_stabilizer_order: preservingActions.length,
    preserving_actions: preservingActions
  },
  boundary: 'The 13/96 signature is exact on one depth-six Pascal face. The five row-4 positions are not the five SCC-003 macro-faces, and their weighted cycle does not carry the full typed D5 action.'
};

console.log(JSON.stringify(result, null, 2));
