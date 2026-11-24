const assert = require("node:assert/strict");

const body = require("./assets/a0-tessarec-blue-body-v1.js");
const spectralApi = require("./assets/a0-tessarec-spectral-audit-v1.js");
const adapter = require("./assets/a0-tessarec-e8-axis08-adapter-v1.js");
const axisCore = require("../../../SCIENCE_LAB/CASE_STUDIES/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/REPAIR_R1/e8_axis08_core.js");

const EPSILON = 1e-12;

function phi(value) {
  let result = value;
  let remainder = value;
  for (let factor = 2; factor * factor <= remainder; factor += 1) {
    if (remainder % factor !== 0) continue;
    while (remainder % factor === 0) remainder /= factor;
    result -= result / factor;
  }
  if (remainder > 1) result -= result / remainder;
  return result;
}

function doubledKey(vector) {
  return vector.map((value) => Math.round(value * 2)).join(",");
}

function canonicalAxisKey(vector) {
  const positive = doubledKey(vector);
  const negative = doubledKey(vector.map((value) => -value));
  return positive < negative ? positive : negative;
}

const shell = body.buildShell();
const spectral = spectralApi.spectralAudit(shell);
const ihara = spectralApi.iharaAudit(spectral);

assert.equal(shell.vertices.length, 48);
assert.equal(shell.edgeOwners.size, 72);
assert.equal(spectral.degree, 3);
assert.equal(spectral.regular, true);
assert.equal(spectral.connected, true);
assert.equal(spectral.bipartite, false);
assert.equal(spectral.solver.converged, true);
assert.ok(Math.abs(spectral.maxNontrivial - 2.7313013160030897) < EPSILON);
assert.ok(Math.abs(spectral.ramanujanBound - 2 * Math.sqrt(2)) < EPSILON);
assert.ok(Math.abs(spectral.margin - 0.09712580874310062) < EPSILON);
assert.equal(spectral.ramanujanNumericalPass, true);
assert.equal(ihara.nontrivialPoleCount, 94);
assert.ok(Math.abs(ihara.targetRadius - 1 / Math.sqrt(2)) < EPSILON);
assert.ok(ihara.maxRadiusError < EPSILON);
assert.equal(ihara.circleNumericalPass, true);

for (const [vertex, neighbors] of shell.adjacency) {
  assert.equal(neighbors.size, 3);
  for (const neighbor of neighbors) assert.equal(shell.adjacency.get(neighbor).has(vertex), true);
}

// Same cardinality is not a carrier identity: the audited graph is the named
// A0 shell; the reduced residue system modulo 210 is a separate finite set.
assert.equal(phi(210), 48);
assert.equal(shell.vertices.every((vertex) => /^[ABCE DF][0-7]$/.test(vertex.replace(" ", ""))), true);
assert.equal(shell.vertices.some((vertex) => /^\d+$/.test(vertex)), false);

const roots = axisCore.constructE8Roots();
const e8 = axisCore.validateE8(roots);
const axes = new Map();
for (const root of roots) {
  const key = canonicalAxisKey(root);
  if (!axes.has(key)) axes.set(key, []);
  axes.get(key).push(root);
}
assert.equal(e8.pass, true);
assert.equal(e8.count, 240);
assert.equal(axes.size, 120);
assert.equal([...axes.values()].every((pair) => pair.length === 2), true);
assert.equal([...axes.values()].every(([left, right]) => left.every((value, index) => value === -right[index])), true);

const crossLens = adapter.run(spectral.eigenvalues, axisCore, { pairStart: 3 });
assert.equal(crossLens.status, "CROSS_LENS_NOT_IDENTITY");
assert.equal(crossLens.axis08.quotientCoordinates.length, 7);
assert.deepEqual(crossLens.axis08.pairDisplay, [4, 5]);
assert.equal(crossLens.axis08.result, "EXACT_RETURN_WITH_RESIDUAL");
assert.ok(crossLens.axis08.reconstructionError < EPSILON);
assert.equal(crossLens.e8.referenceAudit.count, 240);
assert.ok(crossLens.e8.returnError < EPSILON);

// Vector-valued AXIS08: the residual is componentwise, not one universal
// scalar. Equal weights make q=(x7+x8)/2 and r=(x7-x8)/2.
const poles = Array.from({ length: 8 }, (_, lane) => [lane + 0.25, lane * lane - 3, 2 * lane + 1]);
const quotient = axisCore.weightedAxis08(poles, [1, 1]);
const residual = poles[6].map((value, axis) => (value - poles[7][axis]) / 2);
const leftReturn = quotient.coupled.map((value, axis) => value + residual[axis]);
const rightReturn = quotient.coupled.map((value, axis) => value - residual[axis]);
assert.deepEqual(leftReturn, poles[6]);
assert.deepEqual(rightReturn, poles[7]);
assert.equal(residual.length, 3);

console.log(JSON.stringify({
  status: "PASS",
  assertions: 35,
  graphCarrier: "O2-P16-H8 Blue Body shell",
  graph: { vertices: 48, edges: 72, degree: 3, connected: true, bipartite: false },
  maxNontrivialAbsEigenvalue: spectral.maxNontrivial,
  ramanujanBound: spectral.ramanujanBound,
  margin: spectral.margin,
  ihara: {
    nontrivialPoleCount: ihara.nontrivialPoleCount,
    targetRadius: ihara.targetRadius,
    maxRadiusError: ihara.maxRadiusError
  },
  modulo210: { phi: phi(210), relation: "CARDINALITY_CROSS_LENS_ONLY" },
  e8: { roots: roots.length, antipodalAxes: axes.size },
  axis08: {
    scalarLaneReturnError: crossLens.axis08.reconstructionError,
    vectorResidualDimension: residual.length,
    result: "EXACT_RETURN_WITH_COMPONENTWISE_RESIDUAL"
  },
  claimBoundary: "Finite graph spectrum and invertible coordinate adapter only; no Riemann-zeta, E8 identity, physical field, resonance, novelty or modulo-210 carrier-identity claim."
}, null, 2));

