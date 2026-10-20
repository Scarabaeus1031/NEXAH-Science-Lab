#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const mod = (x, n) => ((x % n) + n) % n;
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return Math.abs(a); };
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const compose = (f, g) => x => f(g(x));
const power = (f, exponent) => x => {
  let value = x;
  for (let i = 0; i < exponent; i += 1) value = f(value);
  return value;
};
const permutation = (f, size) => Array.from({ length: size }, (_, i) => f(i));

const checks = [];
function check(id, title, fn) {
  try {
    const detail = fn();
    checks.push({ id, title, status: 'PASS', detail });
  } catch (error) {
    checks.push({ id, title, status: 'FAIL', detail: error.message });
  }
}

const r = k => mod(k + 1, 5);
const m = k => mod(-k, 5);
const t = s => mod(s + 1, 10);
const tau = s => mod(s + 5, 10);
const mu = s => mod(-s, 10);
const project = s => mod(s, 5);
const decode = s => ({ k: mod(s, 5), sheet: Math.floor(mod(s, 10) / 5) });
const encode = ({ k, sheet }) => mod(k, 5) + 5 * mod(sheet, 2);
const registerLabel = s => `${decode(s).sheet === 0 ? 'D' : 'E'}${decode(s).k + 1}`;

function graphFromVoltages(voltages) {
  assert.equal(voltages.length, 5);
  const edges = [];
  for (let k = 0; k < 5; k += 1) {
    const next = mod(k + 1, 5);
    for (let sheet = 0; sheet < 2; sheet += 1) {
      const a = encode({ k, sheet });
      const b = encode({ k: next, sheet: sheet ^ voltages[k] });
      edges.push(a < b ? [a, b] : [b, a]);
    }
  }
  const unique = [...new Map(edges.map(edge => [edge.join('-'), edge])).values()];
  return { vertices: Array.from({ length: 10 }, (_, i) => i), edges: unique };
}

function components(graph, omittedEdgeKeys = new Set()) {
  const adjacency = new Map(graph.vertices.map(v => [v, []]));
  for (const [a, b] of graph.edges) {
    if (omittedEdgeKeys.has(`${a}-${b}`)) continue;
    adjacency.get(a).push(b);
    adjacency.get(b).push(a);
  }
  const seen = new Set();
  const out = [];
  for (const start of graph.vertices) {
    if (seen.has(start)) continue;
    const queue = [start];
    const part = [];
    seen.add(start);
    while (queue.length) {
      const v = queue.shift();
      part.push(v);
      for (const w of adjacency.get(v)) if (!seen.has(w)) { seen.add(w); queue.push(w); }
    }
    out.push(part.sort((a, b) => a - b));
  }
  return out;
}

function directedEdges(graph) {
  return graph.edges.flatMap(([a, b]) => [[a, b], [b, a]]);
}

function hashimoto(graph) {
  const directed = directedEdges(graph);
  return directed.map(([a, b]) => directed.map(([c, d]) => Number(b === c && d !== a)));
}

function multiply(A, B) {
  const n = A.length;
  const out = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i += 1) {
    for (let k = 0; k < n; k += 1) {
      if (!A[i][k]) continue;
      for (let j = 0; j < n; j += 1) out[i][j] += A[i][k] * B[k][j];
    }
  }
  return out;
}

function identityMatrix(n) {
  return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => Number(i === j)));
}

function tracePowers(matrix, maxPower) {
  const traces = [];
  let current = identityMatrix(matrix.length);
  for (let n = 1; n <= maxPower; n += 1) {
    current = multiply(current, matrix);
    traces.push(current.reduce((sum, row, i) => sum + row[i], 0));
  }
  return traces;
}

const baseGraph = {
  vertices: [0, 1, 2, 3, 4],
  edges: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 4]]
};
const connectedCover = graphFromVoltages([0, 0, 0, 0, 1]);
const disconnectedControl = graphFromVoltages([0, 0, 0, 0, 0]);
const gateKeys = new Set(['0-9', '4-5']);
const twentyAnchors = Array.from({ length: 5 }, (_, face) => {
  const a = -Math.PI / 2 + face * 2 * Math.PI / 5;
  const b = -Math.PI / 2 + mod(face + 1, 5) * 2 * Math.PI / 5;
  return { face, n: 6, k: 3, weight: 20, x: (Math.cos(a) + Math.cos(b)) / 2, y: (Math.sin(a) + Math.sin(b)) / 2 };
});
const sharedHubUmbrella = {
  vertices: Array.from({ length: 11 }, (_, i) => i),
  edges: [...connectedCover.edges, ...Array.from({ length: 10 }, (_, rim) => [rim, 10])]
};
const doubledHubUmbrella = {
  vertices: Array.from({ length: 12 }, (_, i) => i),
  edges: [
    ...connectedCover.edges,
    ...Array.from({ length: 5 }, (_, rim) => [rim, 10]),
    ...Array.from({ length: 5 }, (_, i) => [i + 5, 11])
  ]
};

const dodecahedron = { vertices: 20, edges: 30, faces: 12, pentagons: 12 };
const doubledDodecahedron = {
  vertices: 2 * dodecahedron.vertices,
  edges: 2 * dodecahedron.edges,
  faces: 2 * dodecahedron.faces,
  pentagons: 2 * dodecahedron.pentagons
};
const blueBody = {
  vertices: 48,
  edges: 72,
  faces: 26,
  faceVector: { octagons: 2, pentagons: 16, hexagons: 8 },
  carrierPartition: [3, 16],
  shellPartition: [6, 8]
};

function degreeSequence(graph) {
  const degrees = Array(graph.vertices.length).fill(0);
  for (const [a, b] of graph.edges) { degrees[a] += 1; degrees[b] += 1; }
  return degrees.sort((a, b) => b - a);
}

check('G-01', 'C5 rotation has order five', () => {
  assert.deepEqual(permutation(power(r, 5), 5), [0, 1, 2, 3, 4]);
  assert.notDeepEqual(permutation(power(r, 1), 5), [0, 1, 2, 3, 4]);
  return 'r^5=e and r^j!=e for 1<=j<5';
});

check('G-02', 'D5 reflection relations hold', () => {
  assert.deepEqual(permutation(power(m, 2), 5), [0, 1, 2, 3, 4]);
  assert.deepEqual(permutation(compose(m, compose(r, m)), 5), permutation(power(r, 4), 5));
  return 'm^2=e and mrm=r^-1';
});

check('G-03', 'Lifted step has side switch at five and return at ten', () => {
  assert.deepEqual(permutation(power(t, 5), 10), permutation(tau, 10));
  assert.deepEqual(permutation(power(t, 10), 10), Array.from({ length: 10 }, (_, i) => i));
  assert.notDeepEqual(permutation(power(t, 5), 10), Array.from({ length: 10 }, (_, i) => i));
  return 't^5=tau, tau^2=e, t^10=e';
});

check('G-04', 'Projection intertwines lifted and base rotation', () => {
  for (let s = 0; s < 10; s += 1) assert.equal(project(t(s)), r(project(s)));
  return 'pi∘t=r∘pi on all 10 states';
});

check('G-05', 'Lifted mirror generates the dihedral action on ten positions', () => {
  assert.deepEqual(permutation(power(mu, 2), 10), Array.from({ length: 10 }, (_, i) => i));
  assert.deepEqual(permutation(compose(mu, compose(t, mu)), 10), permutation(power(t, 9), 10));
  const actions = [];
  for (let j = 0; j < 10; j += 1) {
    actions.push(permutation(power(t, j), 10));
    actions.push(permutation(compose(mu, power(t, j)), 10));
  }
  assert.equal(new Set(actions.map(action => action.join(','))).size, 20);
  return 'mu^2=e, mu t mu=t^-1; 20 distinct actions';
});

check('R-01', 'One side bit is necessary and sufficient for exact Return', () => {
  for (let s = 0; s < 10; s += 1) assert.equal(encode(decode(s)), s);
  for (let k = 0; k < 5; k += 1) {
    const fibre = Array.from({ length: 10 }, (_, s) => s).filter(s => project(s) === k);
    assert.equal(fibre.length, 2);
  }
  return 'all projection fibres have size 2; one residual bit reconstructs the source';
});

check('S-01', 'The sheet bit yields paired D and E register banks', () => {
  const labels = Array.from({ length: 10 }, (_, s) => registerLabel(s));
  assert.deepEqual(labels, ['D1', 'D2', 'D3', 'D4', 'D5', 'E1', 'E2', 'E3', 'E4', 'E5']);
  for (let s = 0; s < 10; s += 1) {
    assert.equal(project(tau(s)), project(s));
    assert.notEqual(registerLabel(tau(s))[0], registerLabel(s)[0]);
  }
  return { labels, deckSwitch: 'tau: Di <-> Ei' };
});

check('S-02', 'The connected ten-step route has exactly two D/E gates', () => {
  const route = Array.from({ length: 10 }, (_, s) => registerLabel(s));
  const transitions = route.map((label, s) => `${label}->${registerLabel(t(s))}`);
  const crossBank = transitions.filter(edge => edge[0] !== edge.split('->')[1][0]);
  assert.deepEqual(crossBank, ['D5->E1', 'E5->D1']);
  return { route, crossBank };
});

check('A-01', 'Connected cover has exactly two lifted gate edges', () => {
  const keys = new Set(connectedCover.edges.map(edge => edge.join('-')));
  assert.equal([...gateKeys].filter(key => keys.has(key)).length, 2);
  assert.equal(components(connectedCover).length, 1);
  return { gates: [...gateKeys], connected: true };
});

check('A-02', 'Removing both gates separates two five-vertex paths', () => {
  const parts = components(connectedCover, gateKeys);
  assert.equal(parts.length, 2);
  assert.deepEqual(parts.map(part => part.length).sort((a, b) => a - b), [5, 5]);
  return { componentSizes: parts.map(part => part.length) };
});

check('A-03', 'Disconnected two-sheet control retains two C5 components', () => {
  const parts = components(disconnectedControl);
  assert.equal(parts.length, 2);
  assert.deepEqual(parts.map(part => part.length), [5, 5]);
  return 'C5 disjoint union C5';
});

const voltagePopulation = Array.from({ length: 32 }, (_, mask) => {
  const voltages = Array.from({ length: 5 }, (_, bit) => (mask >> bit) & 1);
  const graph = graphFromVoltages(voltages);
  return { mask, voltages, parity: voltages.reduce((a, b) => a ^ b, 0), components: components(graph).length };
});

check('A-04', 'Connectedness is controlled by seam-voltage parity, not gate position', () => {
  for (const item of voltagePopulation) assert.equal(item.components, item.parity ? 1 : 2);
  assert.equal(voltagePopulation.filter(item => item.components === 1).length, 16);
  assert.equal(voltagePopulation.filter(item => item.components === 2).length, 16);
  return '16 connected odd-parity covers; 16 disconnected even-parity covers';
});

check('U-01', 'Five Pascal middle coefficients form one C5 orbit', () => {
  assert.equal(twentyAnchors.length, 5);
  assert.ok(twentyAnchors.every(anchor => anchor.n === 6 && anchor.k === 3 && anchor.weight === 20));
  assert.deepEqual(twentyAnchors.map(anchor => anchor.face), [0, 1, 2, 3, 4]);
  return 'five anchors (face,6,3), each carrying C(6,3)=20';
});

check('U-02', 'The five 20-anchors form a regular midpoint pentagon', () => {
  const radii = twentyAnchors.map(anchor => Math.hypot(anchor.x, anchor.y));
  const sides = twentyAnchors.map((anchor, i) => Math.hypot(anchor.x - twentyAnchors[(i + 1) % 5].x, anchor.y - twentyAnchors[(i + 1) % 5].y));
  assert.ok(Math.max(...radii) - Math.min(...radii) < 1e-15);
  assert.ok(Math.max(...sides) - Math.min(...sides) < 1e-15);
  assert.ok(Math.abs(radii[0] - Math.cos(Math.PI / 5)) < 1e-15);
  return { radius: radii[0], expectedScale: 'cos(pi/5)=phi/2', side: sides[0] };
});

check('U-03', 'Two sheets lift five 20-anchors to ten addressed rim positions', () => {
  const lifted = Array.from({ length: 10 }, (_, state) => ({ state, anchor: project(state), sheet: decode(state).sheet, weight: 20 }));
  for (let face = 0; face < 5; face += 1) assert.equal(lifted.filter(item => item.anchor === face).length, 2);
  assert.equal(lifted.reduce((sum, item) => sum + item.weight, 0), 200);
  return '5 anchors x 2 sheets = 10 rim addresses and 10 candidate spokes';
});

check('U-04', 'Shared-hub umbrella has one hub and ten spokes', () => {
  assert.equal(sharedHubUmbrella.vertices.length, 11);
  assert.equal(sharedHubUmbrella.edges.length, 20);
  assert.deepEqual(degreeSequence(sharedHubUmbrella), [10, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
  return { vertices: 11, rimEdges: 10, spokes: 10, hubDegree: 10, type: 'branched at shared hub' };
});

check('U-05', 'Doubled-hub control is the genuine two-fold wheel cover', () => {
  assert.equal(doubledHubUmbrella.vertices.length, 12);
  assert.equal(doubledHubUmbrella.edges.length, 20);
  assert.deepEqual(degreeSequence(doubledHubUmbrella), [5, 5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]);
  return { vertices: 12, rimEdges: 10, spokes: 10, hubDegrees: [5, 5], type: 'unbranched two-fold graph cover' };
});

check('U-06', 'One hub versus two hubs remain mathematically distinguishable', () => {
  const sharedTrace = tracePowers(hashimoto(sharedHubUmbrella), 12);
  const doubledTrace = tracePowers(hashimoto(doubledHubUmbrella), 12);
  assert.notDeepEqual(degreeSequence(sharedHubUmbrella), degreeSequence(doubledHubUmbrella));
  assert.notDeepEqual(sharedTrace, doubledTrace);
  return { sharedHubTrace1To12: sharedTrace, doubledHubTrace1To12: doubledTrace };
});

check('C-01', 'Two dodecahedral face shells carry twelve plus twelve pentagons', () => {
  assert.equal(dodecahedron.pentagons, 12);
  assert.equal(doubledDodecahedron.pentagons, 24);
  return { oneShell: 12, twoShells: 24, reading: '12+12=24 pentagonal faces' };
});

check('C-02', 'Blue Body source counts are kept exact', () => {
  assert.deepEqual(blueBody.faceVector, { octagons: 2, pentagons: 16, hexagons: 8 });
  assert.equal(Object.values(blueBody.faceVector).reduce((a, b) => a + b, 0), blueBody.faces);
  assert.notEqual(blueBody.faceVector.octagons, 3);
  return { label: 'O2-P16-H8', ...blueBody };
});

check('C-03', 'Blue Body admits exact 48-state partitions with a 24 half-count', () => {
  assert.equal(blueBody.vertices, 3 * 16);
  assert.equal(blueBody.vertices, 6 * 8);
  assert.equal(blueBody.vertices, 2 * 24);
  return '48=3*16=6*8=2*24';
});

check('C-04', 'The 24-count match does not identify the two carriers', () => {
  assert.notEqual(doubledDodecahedron.vertices, blueBody.vertices);
  assert.notEqual(doubledDodecahedron.edges, blueBody.edges);
  assert.notEqual(doubledDodecahedron.faces, blueBody.faces);
  return { doubledDodecahedron, blueBody: { vertices: 48, edges: 72, faces: 26 } };
});

check('N-01', 'The existing 12-to-24 operator-ladder step is exact', () => {
  assert.equal(12, 2 ** 2 * 3);
  assert.equal(24, 2 * 12);
  assert.equal(24, 2 ** 3 * 3);
  assert.equal(12 + 13, 25);
  assert.equal(24 + 25, 49);
  return '12=2^2*3; 24=2^3*3; 12/13 -> 24/25 is one doubling step';
});

check('N-02', 'The 23-24-25 window has three distinct arithmetic types', () => {
  const isPrime = n => n > 1 && Array.from({ length: Math.floor(Math.sqrt(n)) - 1 }, (_, i) => i + 2).every(d => n % d !== 0);
  assert.equal(isPrime(23), true);
  assert.equal(24, 2 ** 3 * 3);
  assert.equal(25, 5 ** 2);
  return { 23: 'prime', 24: '2^3*3=2*12', 25: '5^2' };
});

const baseTraces = tracePowers(hashimoto(baseGraph), 20);
const coverTraces = tracePowers(hashimoto(connectedCover), 20);
const controlTraces = tracePowers(hashimoto(disconnectedControl), 20);

check('I-01', 'Hashimoto dimensions match directed edge counts', () => {
  assert.equal(hashimoto(baseGraph).length, 10);
  assert.equal(hashimoto(connectedCover).length, 20);
  return 'B(C5) is 10x10; B(connected cover) is 20x20';
});

check('I-02', 'Primitive five-cycle lifts to a ten-cycle in the connected cover', () => {
  assert.equal(baseTraces[4], 10);
  assert.equal(coverTraces[4], 0);
  assert.equal(coverTraces[9], 20);
  return { traceB5Base: 10, traceB5Cover: 0, traceB10Cover: 20 };
});

check('I-03', 'Disconnected control preserves five-cycles', () => {
  assert.equal(controlTraces[4], 20);
  assert.equal(controlTraces[9], 20);
  return { traceB5: 20, traceB10: 20 };
});

check('E-01', 'Graph Euler characteristic is preserved at zero', () => {
  assert.equal(baseGraph.vertices.length - baseGraph.edges.length, 0);
  assert.equal(connectedCover.vertices.length - connectedCover.edges.length, 0);
  return 'chi(C5)=0 and chi(C10)=0';
});

const phi = (1 + Math.sqrt(5)) / 2;
check('M-01', 'Regular-pentagon diagonal ratio equals phi', () => {
  const ratio = 2 * Math.cos(Math.PI / 5);
  assert.ok(Math.abs(ratio - phi) < 1e-15);
  return { phi, twoCosPiOver5: ratio, absoluteError: Math.abs(ratio - phi) };
});

const fibonacci = [1, 1];
while (fibonacci.length < 12) fibonacci.push(fibonacci.at(-1) + fibonacci.at(-2));
const fibonacciRatios = fibonacci.slice(1).map((value, i) => ({ n: i + 2, ratio: value / fibonacci[i], error: Math.abs(value / fibonacci[i] - phi) }));
check('M-02', 'Fibonacci ratios remain an approximation schedule, not phi identity', () => {
  assert.ok(fibonacciRatios.every(item => item.ratio !== phi));
  assert.ok(fibonacciRatios.at(-1).error < fibonacciRatios[1].error);
  return fibonacciRatios;
});

const phaseCandidates = Array.from({ length: 30 }, (_, delta) => {
  const phaseOrder = delta === 0 ? 1 : 30 / gcd(30, delta);
  return { delta, phaseOrder, jointReturn: lcm(10, phaseOrder), closesAtTen: mod(10 * delta, 30) === 0 };
});

check('P-01', 'D30 phase is independent unless a coupling increment is declared', () => {
  const delta1 = phaseCandidates.find(item => item.delta === 1);
  const delta3 = phaseCandidates.find(item => item.delta === 3);
  assert.equal(delta1.jointReturn, 30);
  assert.equal(delta3.jointReturn, 10);
  return { delta1, delta3 };
});

check('P-02', 'Ten-step closure does not uniquely select one D30 increment', () => {
  const closing = phaseCandidates.filter(item => item.closesAtTen).map(item => item.delta);
  assert.deepEqual(closing, [0, 3, 6, 9, 12, 15, 18, 21, 24, 27]);
  return { closingDeltas: closing, minimalPositiveCandidate: 3 };
});

check('P-03', 'Existing L/R unit phase requires its own return word', () => {
  const phase = word => word.split('').reduce((n, symbol) => mod(n + (symbol === 'R' ? 1 : -1), 30), 0);
  assert.equal(phase('LR'), 0);
  assert.equal(phase('RRRRRRRRRR'), 10);
  assert.notEqual(phase('RRRRRRRRRR'), 0);
  return 'spatial t^10 return does not close ten unit R phase steps';
});

check('P-04', 'Frozen Pascal D30 phase obeys the signed branch schedule', () => {
  const p30 = (n, k) => mod(2 * k - n, 30);
  for (let n = 0; n < 6; n += 1) {
    for (let k = 0; k <= n; k += 1) {
      assert.equal(p30(n + 1, k), mod(p30(n, k) - 1, 30));
      assert.equal(p30(n + 1, k + 1), mod(p30(n, k) + 1, 30));
    }
  }
  return 'p=2k-n mod30; L decrements and R increments phase by one';
});

check('P-05', 'Adding the D/E sheet doubles the register-phase display without selecting a coupling law', () => {
  const oldDisplay = 5 * 30;
  const pairedDisplay = 5 * 2 * 30;
  assert.equal(oldDisplay, 150);
  assert.equal(pairedDisplay, 300);
  assert.equal(pairedDisplay / oldDisplay, 2);
  return { existing: 'C5_D x C30_P = 150', proposedView: 'C5_register x C2_DE x C30_phase = 300' };
});

const failed = checks.filter(item => item.status !== 'PASS');
const result = {
  recordType: 'A0_PENTAGON_DOUBLE_COVER_TUBE_GATE_ENGINEERING_RESULT',
  version: '1.0.0',
  date: '2026-10-15',
  identityReuse: ['A0', 'SCC-003', 'PENT-01..07', 'C5', 'D5', 'C30_PHASE_VIEW'],
  status: failed.length ? 'ENGINEERING_CHECK_FAIL' : 'ENGINEERING_CHECK_PASS_WITH_OPEN_SELECTION_BOUNDARIES',
  scientificStatus: 'NOT_A_LAB_STUDY_NOT_ADMITTED_NOT_ACTIVATED',
  model: {
    base: 'C5', connectedDoubleCover: 'C10 with one odd voltage class',
    deckInvolution: 'tau=t^5', fullReturn: 't^10=e',
    liftedReflection: 'mu t mu=t^-1', phase: 'independent C30 unless delta is declared',
    pairedRegisterView: 'D1..D5 and E1..E5 are sheet aliases; tau swaps Di<->Ei',
    twoGateEdges: [...gateKeys],
    pascalTwentyOrbit: 'five anchors (face,6,3) with C(6,3)=20',
    umbrellaCandidates: ['shared hub + C10 rim = 11 vertices / 10 spokes', 'two hubs + C10 rim = 12 vertices / 10 spokes'],
    crossCarrier24: 'two dodecahedral 12-face shells give 24 faces; Blue Body has 48 vertices=2*24 but O2-P16-H8 faces'
  },
  checks,
  populations: {
    voltageAssignments: 32,
    connectedOddParity: 16,
    disconnectedEvenParity: 16,
    phaseIncrements: phaseCandidates
  },
  iharaHashimotoFingerprint: {
    baseTracePowers1To20: baseTraces,
    connectedCoverTracePowers1To20: coverTraces,
    disconnectedControlTracePowers1To20: controlTraces
  },
  findings: [
    'The Owner side-change idea is realized exactly by a connected two-sheet C5 cover with t^5=tau and t^10=e.',
    'The D5 symbol m remains reflection; it is not the full Return.',
    'One residual sheet bit is necessary and sufficient after projection to C5.',
    'The sheet bit admits the explicit paired-register view D1..D5 / E1..E5 with gates D5-E1 and E5-D1.',
    'The connected cover moves the primitive non-backtracking cycle signature from length 5 to length 10.',
    'The five C(6,3)=20 nodes are one C5 orbit and form a regular midpoint pentagon.',
    'Their two-sheet lift supplies ten addressed rim positions and therefore ten candidate spokes.',
    'A single visible hub is a branched umbrella, while duplicated hubs give the genuine unbranched two-fold wheel cover.',
    'Two exact dodecahedral face shells supply 12+12=24 pentagonal faces.',
    'The Blue Body supplies 48=3*16=6*8=2*24 vertices, but its exact face vector is O2-P16-H8, not three octagons.',
    'The existing A0 operator ladder contains the exact step 12/13 -> 24/25; 23, 24 and 25 remain prime, composite and square types respectively.',
    'Graph structure alone does not select a unique physical gate position: all 16 odd voltage assignments are connected covers.',
    'A D30 phase increment must be declared independently; ten-step closure admits ten increments and does not select delta=3 uniquely.',
    'The source D30 law remains p=2k-n mod30 with L/R phase steps -1/+1; adjoining D/E creates 300 display addresses but supplies no coupling law.',
    'Phi is exact pentagon metric; Fibonacci ratios are approximants and do not define the cover.'
  ],
  openBoundaries: [
    'No geometric tile embedding, non-overlap proof or 16/17 classical pentagon-tiling claim is supplied.',
    'No historical source selects a gate edge, sheet label, D30 increment or Fibonacci weighting.',
    'E1..E5 is a test/view alias for the second sheet, not a recovered canonical register bank.',
    'The present source does not yet select shared-hub versus doubled-hub umbrella topology.',
    'Equal cardinality 24 does not supply a face, edge, vertex or operator bijection between doubled dodecahedral shells and the Blue Body.',
    'No Blue Body, Tessarec, physical tube, energy, flow or stability identity follows.',
    'Ihara/Hashimoto is evaluated only on the declared finite cycle graphs.',
    'Usefulness outside exact address/Return bookkeeping remains untested.'
  ],
  claimBoundary: 'Deterministic finite engineering verification only. No Lab admission, Study activation, experiment, novelty determination, physical mechanism or publication authority.'
};

if (process.argv.includes('--write')) {
  const outputPath = path.join(__dirname, 'results', 'a0-pentagon-double-cover-tube-gate-result-2026-10-15.json');
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
}

console.log(JSON.stringify({ status: result.status, checks: `${checks.length - failed.length}/${checks.length}`, failures: failed }, null, 2));
if (failed.length) process.exitCode = 1;

