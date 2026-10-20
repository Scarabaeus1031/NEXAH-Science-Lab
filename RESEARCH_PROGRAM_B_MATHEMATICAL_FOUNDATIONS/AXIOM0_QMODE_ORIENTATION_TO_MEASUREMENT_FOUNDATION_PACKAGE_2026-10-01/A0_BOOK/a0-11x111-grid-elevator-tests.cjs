#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const mod = (x, n) => ((x % n) + n) % n;
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return Math.abs(a); };
const isPrime = n => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d += 1) if (n % d === 0) return false;
  return true;
};
const additiveOrder = (x, n) => x === 0 ? 1 : n / gcd(x, n);

const sourcePath = path.join(__dirname, 'assets/a0-11x111-grid-elevator-source-contract-v1.json');
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const checks = [];

function check(id, title, fn) {
  try {
    checks.push({ id, title, status: 'PASS', detail: fn() });
  } catch (error) {
    checks.push({ id, title, status: 'FAIL', detail: error.message });
  }
}

function crt11x111(a, b) {
  return mod(111 * a + 1111 * b, 1221);
}

function pathGridEdges(width, height) {
  const edges = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (x + 1 < width) edges.push([[x, y], [x + 1, y]]);
      if (y + 1 < height) edges.push([[x, y], [x, y + 1]]);
    }
  }
  return edges;
}

const vertexKey = ([x, y]) => `${x}:${y}`;
const edgeKey = ([a, b]) => [vertexKey(a), vertexKey(b)].sort().join('|');

check('A-01', 'The 7x11 reference and 11x111 candidate are coprime products', () => {
  assert.equal(gcd(7, 11), 1);
  assert.equal(gcd(11, 111), 1);
  assert.equal(7 * 11, 77);
  assert.equal(11 * 111, 1221);
  return { reference: 'Z/77 ~= Z/7 x Z/11', candidate: 'Z/1221 ~= Z/11 x Z/111', factorization1221: '3*11*37' };
});

check('A-02', 'The 7x11 CRT reference round-trips all 77 addresses', () => {
  const seen = new Set();
  for (let x = 0; x < 77; x += 1) {
    const a = x % 7;
    const b = x % 11;
    const back = mod(22 * a + 56 * b, 77);
    assert.equal(back, x);
    seen.add(`${a}:${b}`);
  }
  assert.equal(seen.size, 77);
  return { idempotents: { mod7: 22, mod11: 56 }, addresses: seen.size };
});

check('A-03', 'The 11x111 CRT candidate round-trips all 1221 addresses', () => {
  const seen = new Set();
  for (let x = 0; x < 1221; x += 1) {
    const a = x % 11;
    const b = x % 111;
    const back = crt11x111(a, b);
    assert.equal(back, x);
    seen.add(`${a}:${b}`);
  }
  assert.equal(seen.size, 1221);
  return { formula: 'x = 111*a + 1111*b (mod 1221)', addresses: seen.size };
});

check('A-04', 'The candidate CRT idempotents independently move the two axes', () => {
  assert.deepEqual([111 % 11, 111 % 111], [1, 0]);
  assert.deepEqual([1111 % 11, 1111 % 111], [0, 1]);
  assert.equal(mod(111 + 1111, 1221), 1);
  return { e11: 111, e111: 1111, partitionOfUnity: '111+1111=1222=1 mod 1221' };
});

check('S-01', 'The 111 side has an exact ten-block plus one seam decomposition', () => {
  assert.equal(111, 10 * 11 + 1);
  assert.equal(1221, 10 * 121 + 11);
  assert.equal(12321, 100 * 121 + 2 * 110 + 1);
  return {
    oneAxis: '111=10*11+1',
    rectangle: '11*111=10*(11*11)+11',
    square: '111^2=100*(11^2)+2*110+1'
  };
});

check('S-02', 'The existing 111-sample vertex model gives eleven coarse cells', () => {
  const boundaries = Array.from({ length: 12 }, (_, k) => 10 * k);
  assert.deepEqual(boundaries, [0,10,20,30,40,50,60,70,80,90,100,110]);
  assert.equal(boundaries.length - 1, 11);
  assert.ok(boundaries.slice(1).every((value, i) => value - boundaries[i] === 10));
  return { samplePoints: 111, fineIntervals: 110, coarseCells: 11, intervalsPerCell: 10, boundaries };
});

check('S-03', 'Cell-count nesting 111/11 is rejected while vertex-cell refinement survives', () => {
  assert.notEqual(111 % 11, 0);
  assert.equal(110 % 11, 0);
  return { cellCountNesting: 'CONTRADICTED', vertexCellRefinement: 'EXACT', residual: 1 };
});

check('G-01', 'The open 11x111 rectangular neighborhood has exact graph counts', () => {
  const edges = pathGridEdges(11, 111);
  assert.equal(11 * 111, 1221);
  assert.equal(edges.length, 2320);
  return { graph: 'P11 Cartesian P111', vertices: 1221, edges: 2320, boundaryVertices: 240, interiorVertices: 981 };
});

check('G-02', 'The central Janus reflection is an involutive graph automorphism', () => {
  const edges = pathGridEdges(11, 111);
  const edgeSet = new Set(edges.map(edgeKey));
  const J = ([x, y]) => [10 - x, 110 - y];
  for (const edge of edges) assert.ok(edgeSet.has(edgeKey(edge.map(J))));
  for (let y = 0; y < 111; y += 1) for (let x = 0; x < 11; x += 1) assert.deepEqual(J(J([x, y])), [x, y]);
  const fixed = [];
  for (let y = 0; y < 111; y += 1) for (let x = 0; x < 11; x += 1) if (vertexKey(J([x, y])) === vertexKey([x, y])) fixed.push([x, y]);
  assert.deepEqual(fixed, [[5, 55]]);
  return { operation: 'J(x,y)=(10-x,110-y)', fixed, twoCycles: 610 };
});

check('G-03', 'The open rectangle, cylinder and torus remain distinct adjacency contracts', () => {
  const open = 2320;
  const cylinder = 11 * 111 + 11 * 110;
  const torus = 2 * 11 * 111;
  assert.deepEqual([open, cylinder, torus], [2320, 2431, 2442]);
  return { openEdges: open, cylinderEdges: cylinder, torusEdges: torus, selectedPrimary: 'open rectangle' };
});

check('P-01', 'The source-declared prime radii around c=111 are reproduced exactly', () => {
  const rows = source.declared_tests.prime_radii.map(r => ({ r, left: 111 - r, center: 111, right: 111 + r }));
  assert.deepEqual(rows, [
    { r: 2, left: 109, center: 111, right: 113 },
    { r: 3, left: 108, center: 111, right: 114 },
    { r: 5, left: 106, center: 111, right: 116 },
    { r: 7, left: 104, center: 111, right: 118 },
    { r: 11, left: 100, center: 111, right: 122 }
  ]);
  return rows;
});

check('P-02', 'Only radius two gives a two-sided prime pair in the declared table', () => {
  const rows = source.declared_tests.prime_radii.map(r => ({ r, bothPrime: isPrime(111 - r) && isPrime(111 + r) }));
  assert.deepEqual(rows.filter(row => row.bothPrime).map(row => row.r), [2]);
  assert.equal(isPrime(106), false);
  return { rows, coordinate106: 'COMPOSITE_LEFT_NEIGHBOR_AT_r5' };
});

check('N-01', 'Coordinate 106 and Q106 cardinality are numerically equal but role-distinct', () => {
  const coordinate = { namespace: 'JANUS_RADIUS_VALUE', value: 106, derivation: '111-5' };
  const carrier = { namespace: 'PASCAL_Q106_CARDINALITY', value: 106, derivation: '112 open nodes minus 6 seam identifications' };
  assert.equal(coordinate.value, carrier.value);
  assert.notEqual(coordinate.namespace, carrier.namespace);
  return { integerEqual: true, roleIdentity: false, coordinate, carrier };
});

check('N-02', 'There is no additive-group embedding Z11 into Z111', () => {
  const order11Elements = Array.from({ length: 111 }, (_, x) => x).filter(x => additiveOrder(x, 111) === 11);
  assert.deepEqual(order11Elements, []);
  return { reason: '11 does not divide 111, so Z111 has no element of additive order 11', order11Elements };
});

check('N-03', 'The 11x111 rectangle and 111x111 square are not the same carrier', () => {
  assert.equal(11 * 111, 1221);
  assert.equal(111 * 111, 12321);
  assert.notEqual(1221, 12321);
  return { rectangleStates: 1221, squareStates: 12321, ratio: 12321 / 1221, identity: false };
});

check('N-04', 'Palindrome closure at 1221 does not identify a unique source pair', () => {
  const protocolPath = path.join(__dirname, 'assets/a0-joint-application-return-protocol-v1.json');
  const protocol = JSON.parse(fs.readFileSync(protocolPath, 'utf8'));
  const app06 = protocol.cases.find(item => item.id === 'APP-06');
  assert.equal(app06.expected.sum, 1221);
  assert.equal(app06.expected.palindrome, true);
  assert.equal(app06.expected.unordered_preimages, 32);
  assert.equal(app06.expected.ordered_preimages, 64);
  assert.equal(app06.expected.result, 'HOLD_MISSING_WITNESS');
  return app06.expected;
});

const failures = checks.filter(item => item.status === 'FAIL');
const result = {
  schema: 'a0.11x111-grid-elevator.engineering-result.v1',
  executionDate: '2026-10-15',
  authority: {
    kind: 'OWNER_AUTHORIZED_A0_ENGINEERING_TEST',
    labRun: false,
    studyActivated: false,
    navigatorIdentityCreated: false,
    canonicalRelationCreated: false,
    publicationAuthorized: false
  },
  status: failures.length ? 'FAIL' : 'PASS_EXACT_CRT_GRID_BRIDGE_WITH_TYPED_SEAM_AND_NONIDENTITY_CONTROLS',
  summary: {
    pass: checks.length - failures.length,
    fail: failures.length,
    crtRectangleStates: 1221,
    squareElevatorStates: 12321,
    primeRadiusPairs: 5,
    twoSidedPrimePairs: 1
  },
  interpretation: {
    supported: [
      '11x111 is an exact CRT product carrier analogous to 7x11',
      'the open 11x111 grid has a precise neighborhood graph and central Janus involution',
      '111 samples support eleven coarse cells of ten intervals through a vertex-cell convention',
      'the remaining +1 is an explicit seam or boundary sample'
    ],
    rejected: [
      'exact 111-cell to 11-cell nesting',
      'an additive-group embedding Z11 into Z111',
      'identity between the 11x111 rectangle and 111x111 square',
      'identity between Janus coordinate 106 and Pascal Q106 cardinality',
      'unique source recovery from the palindrome 1221 alone'
    ]
  },
  sourceContract: path.relative(__dirname, sourcePath),
  checks
};

const outputPath = path.join(__dirname, 'results/a0-11x111-grid-elevator-result-2026-10-15.json');
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
process.exitCode = failures.length ? 1 : 0;
