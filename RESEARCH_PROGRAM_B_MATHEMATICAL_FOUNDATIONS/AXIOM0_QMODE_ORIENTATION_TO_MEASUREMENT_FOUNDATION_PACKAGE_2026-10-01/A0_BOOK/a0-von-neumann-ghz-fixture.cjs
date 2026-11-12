#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const EPS = 1e-12;
const I2 = [[1, 0], [0, 1]];
const X = [[0, 1], [1, 0]];
const Z = [[1, 0], [0, -1]];

const clean = value => Math.abs(value) < EPS ? 0 : Number(value.toFixed(12));
const add = (a, b) => a.map((row, i) => row.map((value, j) => value + b[i][j]));
const sub = (a, b) => a.map((row, i) => row.map((value, j) => value - b[i][j]));
const scale = (a, scalar) => a.map(row => row.map(value => value * scalar));
const multiply = (a, b) => a.map((row, i) => b[0].map((_, j) => row.reduce((sum, value, k) => sum + value * b[k][j], 0)));
const same = (a, b) => a.length === b.length && a.every((row, i) => row.every((value, j) => Math.abs(value - b[i][j]) < EPS));
const zeros = n => Array.from({length: n}, () => Array(n).fill(0));
const identity = n => Array.from({length: n}, (_, i) => Array.from({length: n}, (_, j) => i === j ? 1 : 0));
const commutator = (a, b) => sub(multiply(a, b), multiply(b, a));
const anticommutator = (a, b) => add(multiply(a, b), multiply(b, a));
const kron = (a, b) => a.flatMap(rowA => b.map(rowB => rowA.flatMap(valueA => rowB.map(valueB => valueA * valueB))));
const apply = (matrix, vector) => matrix.map(row => row.reduce((sum, value, i) => sum + value * vector[i], 0));
const dot = (a, b) => a.reduce((sum, value, i) => sum + value * b[i], 0);
const expectation = (vector, matrix) => dot(vector, apply(matrix, vector));
const eigenvaluesSymmetric2 = matrix => {
  const trace = matrix[0][0] + matrix[1][1];
  const delta = Math.sqrt((matrix[0][0] - matrix[1][1]) ** 2 + 4 * matrix[0][1] ** 2);
  return [(trace - delta) / 2, (trace + delta) / 2].map(clean);
};
const rotatedObservable = degrees => {
  const radians = degrees * Math.PI / 180;
  return add(scale(Z, Math.cos(radians)), scale(X, Math.sin(radians)));
};
const verifyEigenpair = (matrix, value, vector) => apply(matrix, vector).every((entry, i) => Math.abs(entry - value * vector[i]) < EPS);

function ghzAudit() {
  let satisfyingAssignments = 0;
  let maximumContextsSatisfied = 0;
  let assignmentsAtMaximum = 0;
  for (let mask = 0; mask < 64; mask += 1) {
    const bit = index => (mask >> index) & 1;
    const contexts = [
      (bit(0) ^ bit(1) ^ bit(2)) === 1, // X1 X2 X3
      (bit(0) ^ bit(4) ^ bit(5)) === 0, // X1 Z2 Z3
      (bit(3) ^ bit(1) ^ bit(5)) === 0, // Z1 X2 Z3
      (bit(3) ^ bit(4) ^ bit(2)) === 0  // Z1 Z2 X3
    ];
    const satisfied = contexts.filter(Boolean).length;
    if (satisfied === 4) satisfyingAssignments += 1;
    if (satisfied > maximumContextsSatisfied) {
      maximumContextsSatisfied = satisfied;
      assignmentsAtMaximum = 1;
    } else if (satisfied === maximumContextsSatisfied) {
      assignmentsAtMaximum += 1;
    }
  }
  return {assignmentsChecked: 64, satisfyingAssignments, maximumContextsSatisfied, assignmentsAtMaximum};
}

function buildReceipt() {
  const sameQubitSum = add(Z, X);
  const diagonal = scale(sub(Z, X), 1 / Math.sqrt(2));
  const commutingA = kron(Z, I2);
  const commutingB = kron(I2, X);
  const commutingSum = add(commutingA, commutingB);
  const ket0 = [1, 0];
  const ghz = ghzAudit();
  const outcomeSums = [...new Set([-1, 1].flatMap(a => [-1, 1].map(b => a + b)))].sort((a, b) => a - b);
  const commutingSpectrum = [-2, 0, 0, 2];
  const rootHalf = 1 / Math.sqrt(2);
  const rotationSamples = [-90, -45, 0, 45, 90];
  const rotatedMinus45 = rotatedObservable(-45);
  const rotatedPlus45 = rotatedObservable(45);
  const commutingEigenpairs = [
    {value: 2, vector: [rootHalf, rootHalf, 0, 0]},
    {value: 0, vector: [rootHalf, -rootHalf, 0, 0]},
    {value: 0, vector: [0, 0, rootHalf, rootHalf]},
    {value: -2, vector: [0, 0, rootHalf, -rootHalf]}
  ];

  const checks = [
    ['P01', same(multiply(Z, Z), I2) && same(multiply(X, X), I2), 'Pauli involutions: Z²=X²=I'],
    ['P02', same(anticommutator(Z, X), zeros(2)), 'Same-qubit anticommutator vanishes'],
    ['P03', !same(commutator(Z, X), zeros(2)), 'Same-qubit observables do not commute'],
    ['P04', same(multiply(sameQubitSum, sameQubitSum), scale(I2, 2)), '(Z+X)²=2I'],
    ['P05', same(scale(multiply(diagonal, diagonal), 1), I2), 'D=(Z−X)/√2 has D²=I'],
    ['P06', JSON.stringify(eigenvaluesSymmetric2(sameQubitSum)) === JSON.stringify([-clean(Math.sqrt(2)), clean(Math.sqrt(2))]), 'spec(Z+X)={−√2,+√2}'],
    ['P07', JSON.stringify(eigenvaluesSymmetric2(diagonal)) === JSON.stringify([-1, 1]), 'spec(D)={−1,+1}'],
    ['P08', JSON.stringify(outcomeSums) === JSON.stringify([-2, 0, 2]), 'Context-free ±1 outcome sums are only −2,0,+2'],
    ['P09', Math.abs(expectation(ket0, sameQubitSum) - (expectation(ket0, Z) + expectation(ket0, X))) < EPS, 'Expectation values remain linear'],
    ['P10', same(commutator(commutingA, commutingB), zeros(4)), 'Two-subsystem control observables commute'],
    ['P11', commutingEigenpairs.every(pair => verifyEigenpair(commutingSum, pair.value, pair.vector)), 'Commuting control spectrum is −2,0,0,+2'],
    ['R01', rotationSamples.every(degrees => same(multiply(rotatedObservable(degrees), rotatedObservable(degrees)), I2)), 'Every sampled M_B(beta) is an involution'],
    ['R02', same(rotatedObservable(0), Z) && same(rotatedObservable(90), X), 'Rotation endpoints recover A=Z and B=X'],
    ['R03', same(rotatedMinus45, diagonal), 'M_B(−45°) recovers D=(Z−X)/sqrt(2)'],
    ['R04', same(anticommutator(rotatedMinus45, rotatedPlus45), zeros(2)) && !same(commutator(rotatedMinus45, rotatedPlus45), zeros(2)), 'Opposite diagonal contexts anticommute and remain distinct'],
    ['G01', ghz.satisfyingAssignments === 0 && ghz.maximumContextsSatisfied === 3, 'No deterministic local assignment satisfies all four GHZ parity contexts']
  ].map(([id, pass, statement]) => ({id, pass, statement}));

  assert.equal(checks.every(check => check.pass), true, 'finite fixture contains a failed assertion');

  return {
    schema: 'a0.finite-math-fixture.return.v1',
    fixtureId: 'A0-MATH-VN-GHZ-01',
    date: '2026-11-11',
    authority: 'HUMAN_OWNER_AUTHORIZED_BOUNDED_ENGINEERING_VERIFICATION',
    classification: 'DETERMINISTIC_FINITE_MATH_FIXTURE / NOT_A_LAB_RUN / NOT_ADMITTED',
    reproducibility: 'LOCAL_EXECUTABLE_CHECK / LAB_R_CLASS_NOT_APPLICABLE',
    identityDisposition: 'REUSES_A0_FIELD_NOTES_AND_EXISTING_A0_ORIENTATION_EVIDENCE_LINEAGE',
    claimCeiling: 'KNOWN_PAULI_AND_GHZ_MATHEMATICS / TYPED_A0_CONTEXT_ADAPTER / NO_NEW_PHYSICS',
    operatorOutcome: {
      A: 'sigma_z',
      B: 'sigma_x',
      commutator: commutator(Z, X).map(row => row.map(clean)),
      anticommutator: anticommutator(Z, X).map(row => row.map(clean)),
      sameQubitSumSpectrum: eigenvaluesSymmetric2(sameQubitSum),
      contextFreeOutcomeSums: outcomeSums,
      diagonalObservable: '(sigma_z-sigma_x)/sqrt(2)',
      diagonalSpectrum: eigenvaluesSymmetric2(diagonal),
      expectationLinearityWitness: {state: '|0>', left: clean(expectation(ket0, sameQubitSum)), right: clean(expectation(ket0, Z) + expectation(ket0, X))}
    },
    rotationAdapter: {
      definition: 'M_B(beta)=cos(beta)*sigma_z+sin(beta)*sigma_x',
      samplesDegrees: rotationSamples,
      sampleSpectra: Object.fromEntries(rotationSamples.map(degrees => [String(degrees), eigenvaluesSymmetric2(rotatedObservable(degrees))])),
      diagonalControl: {degrees: -45, observable: '(sigma_z-sigma_x)/sqrt(2)', matchesD: same(rotatedMinus45, diagonal)},
      typedRoles: {carrier: 'OIL path', apparatus: 'Q_B lens', displayPose: 'RIS', observable: 'M_B(beta)'},
      boundary: 'Q_B is not M_B; visible RIS rotation does not by itself establish physical implementation of U_y(beta).'
    },
    commutingControl: {
      observables: ['sigma_z tensor I', 'I tensor sigma_x'],
      commutatorIsZero: same(commutator(commutingA, commutingB), zeros(4)),
      sumSpectrum: commutingSpectrum
    },
    ghzParity: {
      variables: ['X1', 'X2', 'X3', 'Z1', 'Z2', 'Z3'],
      contexts: ['X1 xor X2 xor X3 = 1', 'X1 xor Z2 xor Z3 = 0', 'Z1 xor X2 xor Z3 = 0', 'Z1 xor Z2 xor X3 = 0'],
      leftXor: 0,
      rightXor: 1,
      ...ghz
    },
    checks,
    summary: {checksPassed: checks.length, checksTotal: checks.length, graphDelta: {identities: 0, relations: 0, aliases: 0, studies: 0, findings: 0, promotions: 0}},
    stop: 'No hidden-variable solution, Bell/GHZ/locality fix, measurement-model completion, experiment, Study activation or publication claim.'
  };
}

function verifyReceipt() {
  const receiptPath = path.join(__dirname, 'results', 'a0-von-neumann-ghz-fixture-return-2026-11-11.json');
  const recorded = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
  assert.deepEqual(recorded, buildReceipt());
  return receiptPath;
}

if (require.main === module) {
  if (process.argv.includes('--verify-receipt')) {
    const receiptPath = verifyReceipt();
    console.log(`PASS A0-MATH-VN-GHZ-01 · 16/16 · ${receiptPath}`);
  } else {
    console.log(JSON.stringify(buildReceipt(), null, 2));
  }
}

module.exports = {buildReceipt, verifyReceipt, ghzAudit};
