#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const mod = (x, n) => ((x % n) + n) % n;
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return Math.abs(a); };
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const digitSum = (n, base = 10) => {
  let x = Math.abs(n);
  let sum = 0;
  while (x) { sum += x % base; x = Math.floor(x / base); }
  return sum;
};
const isPrime = n => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d += 1) if (n % d === 0) return false;
  return true;
};
const primesThrough = limit => Array.from({ length: Math.max(0, limit - 1) }, (_, i) => i + 2).filter(isPrime);
const primeIndex = n => {
  assert.ok(isPrime(n), `${n} is not prime`);
  return primesThrough(n).length;
};

const checks = [];
const openGates = [];
function check(id, title, fn) {
  try {
    const detail = fn();
    checks.push({ id, title, status: 'PASS', detail });
  } catch (error) {
    checks.push({ id, title, status: 'FAIL', detail: error.message });
  }
}
function hold(id, title, reason, requiredInput) {
  openGates.push({ id, title, status: 'HOLD', reason, requiredInput });
}

function degreeSequence(vertexCount, edges) {
  const degree = Array(vertexCount).fill(0);
  for (const [a, b] of edges) { degree[a] += 1; degree[b] += 1; }
  return degree.sort((a, b) => b - a);
}

function graphComponents(vertexCount, edges) {
  const adjacency = Array.from({ length: vertexCount }, () => []);
  for (const [a, b] of edges) { adjacency[a].push(b); adjacency[b].push(a); }
  const seen = new Set();
  const sizes = [];
  for (let start = 0; start < vertexCount; start += 1) {
    if (seen.has(start)) continue;
    const queue = [start];
    seen.add(start);
    let size = 0;
    while (queue.length) {
      const v = queue.shift();
      size += 1;
      for (const w of adjacency[v]) if (!seen.has(w)) { seen.add(w); queue.push(w); }
    }
    sizes.push(size);
  }
  return sizes.sort((a, b) => b - a);
}

function quotientClassCount(leftCount, rightCount, pairs) {
  const total = leftCount + rightCount;
  const parent = Array.from({ length: total }, (_, i) => i);
  const find = x => parent[x] === x ? x : (parent[x] = find(parent[x]));
  const union = (a, b) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[rb] = ra;
  };
  for (const [left, right] of pairs) union(left, leftCount + right);
  return new Set(parent.map((_, i) => find(i))).size;
}

const zither = n => {
  const x = (n + 7) + (n + 1) / 10;
  const b = n + 0.5;
  const value = x + b;
  const scaled = Math.round(10 * value);
  return { n, x, b, value, scaled, integerChannel: Math.floor(value + 1e-12) };
};

check('Z-01', 'Affine zither operator reproduces the extended four-row sequence', () => {
  const rows = [4, 5, 6, 7].map(zither);
  assert.deepEqual(rows.map(row => row.scaled), [160, 181, 202, 223]);
  assert.deepEqual(rows.map(row => row.value), [16, 18.1, 20.2, 22.3]);
  for (const row of rows) assert.equal(row.scaled, 21 * row.n + 76);
  return rows;
});

check('Z-02', 'Declared integer-channel projection yields the even boundary skeleton', () => {
  const skeleton = [4, 5, 6, 7].map(n => zither(n).integerChannel);
  assert.deepEqual(skeleton, [16, 18, 20, 22]);
  return { operator: 'I(x)=floor(x)', skeleton, lostTenths: [0, 0.1, 0.2, 0.3] };
});

check('Z-03', 'Successive boundary midpoints expose twin-prime and composite controls', () => {
  const boundaries = [16, 18, 20, 22];
  const centers = boundaries.slice(0, -1).map((v, i) => (v + boundaries[i + 1]) / 2);
  assert.deepEqual(centers, [17, 19, 21]);
  assert.deepEqual(centers.map(isPrime), [true, true, false]);
  assert.equal(19 - 17, 2);
  return { centers, primeMask: centers.map(isPrime), twinPair: [17, 19], negativeControl: 21 };
});

check('Z-04', 'The two prime tubes share exactly one seam', () => {
  const t17 = new Set([16, 17, 18]);
  const t19 = new Set([18, 19, 20]);
  const intersection = [...t17].filter(x => t19.has(x));
  const union = [...new Set([...t17, ...t19])].sort((a, b) => a - b);
  assert.deepEqual(intersection, [18]);
  assert.deepEqual(union, [16, 17, 18, 19, 20]);
  return { T17: [...t17], T19: [...t19], seam: intersection, hull: union };
});

check('Z-05', 'Equal-width tube geometry does not imply a prime centre', () => {
  const control = { boundary: [20, 22], centre: 21, width: 2 };
  assert.equal(control.width, 2);
  assert.equal(isPrime(control.centre), false);
  return control;
});

check('L-01', 'LRRL is a balanced C30 phase word with exact return', () => {
  const word = 'LRRL';
  const phases = [0];
  for (const letter of word) phases.push(mod(phases.at(-1) + (letter === 'L' ? -1 : 1), 30));
  assert.deepEqual(phases, [0, 29, 0, 1, 0]);
  return { word, phases, signedPhases: [0, -1, 0, 1, 0] };
});

check('L-02', 'LRRL consists of two opposite closed two-step excursions', () => {
  const excursions = ['LR', 'RL'].map(word => [...word].reduce((p, c) => p + (c === 'L' ? -1 : 1), 0));
  assert.deepEqual(excursions, [0, 0]);
  return { decomposition: ['LR', 'RL'], net: excursions };
});

check('L-03', 'Return alone does not uniquely select LRRL', () => {
  const words = [];
  for (let mask = 0; mask < 16; mask += 1) {
    const word = Array.from({ length: 4 }, (_, i) => ((mask >> i) & 1) ? 'R' : 'L').join('');
    const net = [...word].reduce((p, c) => p + (c === 'L' ? -1 : 1), 0);
    if (net === 0) words.push(word);
  }
  assert.equal(words.length, 6);
  assert.ok(words.includes('LRRL'));
  return { balancedLengthFourWords: words, selection: 'LRRL requires a source rule beyond return' };
});

check('Q-01', 'Four independent D/E identifications reduce 24 addresses to 20', () => {
  const pairs = [[0, 0], [1, 1], [2, 2], [3, 3]];
  assert.equal(quotientClassCount(12, 12, pairs), 20);
  return { prequotient: 24, identifications: pairs.length, quotient: 20 };
});

check('Q-02', 'Three and five independent identifications are exact cardinality controls', () => {
  const q3 = quotientClassCount(12, 12, [[0, 0], [1, 1], [2, 2]]);
  const q5 = quotientClassCount(12, 12, [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]]);
  assert.deepEqual([q3, q5], [21, 19]);
  return { threeSeams: q3, fourSeams: 20, fiveSeams: q5 };
});

check('Q-03', 'Choosing one open point among five produces five equally sized candidates', () => {
  const candidates = Array.from({ length: 5 }, (_, open) => {
    const pairs = Array.from({ length: 5 }, (_, i) => i).filter(i => i !== open).map(i => [i, i]);
    return { open, quotient: quotientClassCount(12, 12, pairs) };
  });
  assert.ok(candidates.every(item => item.quotient === 20));
  return { candidates, selection: 'cardinality does not select the static gate' };
});

check('Q-04', 'One open anchor breaks C5 rotation symmetry to a two-element stabilizer', () => {
  const open = 0;
  const actions = [];
  for (let k = 0; k < 5; k += 1) {
    actions.push({ name: `r${k}`, map: i => mod(i + k, 5) });
    actions.push({ name: `m-r${k}`, map: i => mod(-i + k, 5) });
  }
  const stabilizer = actions.filter(action => action.map(open) === open).map(action => action.name);
  assert.equal(stabilizer.length, 2);
  return { openAnchor: open, stabilizer, conclusion: 'marked gate is not C5-invariant' };
});

check('Q-05', 'A literal 12-cycle has no order-five graph automorphism', () => {
  const permutations = [];
  for (let k = 0; k < 12; k += 1) {
    permutations.push(Array.from({ length: 12 }, (_, i) => mod(i + k, 12)));
    permutations.push(Array.from({ length: 12 }, (_, i) => mod(-i + k, 12)));
  }
  const order = permutation => {
    let current = Array.from({ length: 12 }, (_, i) => i);
    for (let n = 1; n <= 24; n += 1) {
      current = current.map(i => permutation[i]);
      if (current.every((v, i) => v === i)) return n;
    }
    return null;
  };
  const orders = [...new Set(permutations.map(order))].sort((a, b) => a - b);
  assert.ok(!orders.includes(5));
  return { automorphismGroup: 'D12', orders, boundary: 'D12/E12 labels cannot be treated as two literal C12 rings if C5 symmetry is required' };
});

check('S-01', 'The 4:3:2:1 schedule partitions both C30 and C60 exactly', () => {
  const c30 = [12, 9, 6, 3];
  const c60 = [24, 18, 12, 6];
  assert.equal(c30.reduce((a, b) => a + b, 0), 30);
  assert.equal(c60.reduce((a, b) => a + b, 0), 60);
  assert.deepEqual(c60, c30.map(x => 2 * x));
  return { ratio: [4, 3, 2, 1], C30: c30, C60: c60 };
});

check('S-02', 'Normalized phase angles agree across the C30/C60 schedule', () => {
  const a30 = [12, 9, 6, 3].map(x => 360 * x / 30);
  const a60 = [24, 18, 12, 6].map(x => 360 * x / 60);
  assert.deepEqual(a30, [144, 108, 72, 36]);
  assert.deepEqual(a60, a30);
  return { degrees: a30 };
});

check('S-03', '17/13 and 29/31 are additive inverse pairs on their declared carriers', () => {
  assert.equal(mod(17 + 13, 30), 0);
  assert.equal(mod(29 + 31, 60), 0);
  return { C30: [17, 13], C60: [29, 31] };
});

check('S-04', 'The canonical doubling lift does not produce the selected C60 pair', () => {
  const lifted = [17, 13].map(x => mod(2 * x, 60));
  assert.deepEqual(lifted, [34, 26]);
  assert.notDeepEqual(lifted, [29, 31]);
  return { lift: 'x -> 2x mod 60', image: lifted, selected: [29, 31], result: 'REJECT_SIMPLE_DOUBLING' };
});

check('S-05', 'No affine map mod 60 sends ordered 17/13 to ordered 29/31', () => {
  const maps = [];
  for (let a = 0; a < 60; a += 1) for (let b = 0; b < 60; b += 1) {
    if (mod(a * 17 + b, 60) === 29 && mod(a * 13 + b, 60) === 31) maps.push([a, b]);
  }
  assert.equal(maps.length, 0);
  return { candidateAffineMaps: 3600, solutions: maps, result: 'REJECT_AFFINE_LIFT' };
});

check('S-06', 'The ordered pair increments select 12 and 18 but not the full schedule', () => {
  const increments = [29 - 17, 31 - 13];
  assert.deepEqual(increments, [12, 18]);
  assert.ok([24, 18, 12, 6].includes(increments[0]));
  assert.ok([24, 18, 12, 6].includes(increments[1]));
  return { increments, fullSchedule: [24, 18, 12, 6], unaccountedSegments: [24, 6] };
});

check('C-01', 'Prime indices and boundary relations are exact', () => {
  const values = { p8: 19, p10: 29, p11: 31, p13: 41, p18: 61, p20: 71 };
  for (const [label, value] of Object.entries(values)) assert.equal(primeIndex(value), Number(label.slice(1)));
  assert.equal(29, 30 - 1);
  assert.equal(31, 30 + 1);
  assert.equal(61, 60 + 1);
  return values;
});

check('C-02', 'The existing 2501 CRT carrier has an exact width-20 channel', () => {
  assert.equal(41 * 61, 2501);
  assert.equal(61 - 41, 20);
  assert.equal(gcd(41, 61), 1);
  return { factorization: '2501=41*61', channel: [41, 61], gap: 20 };
});

check('C-03', 'Prime gap 20 is not unique', () => {
  const primes = primesThrough(1000);
  const pairs = primes.filter(p => isPrime(p + 20)).map(p => [p, p + 20]);
  assert.ok(pairs.length > 1);
  assert.ok(pairs.some(([a, b]) => a === 41 && b === 61));
  return { range: [2, 1000], pairCount: pairs.length, firstPairs: pairs.slice(0, 12) };
});

check('C-04', 'The 6+1 readout is decimal and not base invariant', () => {
  assert.equal(digitSum(61, 10), 7);
  assert.equal(digitSum(16, 10), 7);
  assert.equal(digitSum(61, 2), 5);
  const sameDigitSumPrimes = primesThrough(200).filter(p => digitSum(p, 10) === 7);
  assert.ok(sameDigitSumPrimes.length > 1);
  return { decimal: '61 -> 6+1=7', reverse: '16 -> 1+6=7', binary: `61=${(61).toString(2)} -> digit sum 5`, sameDigitSumPrimes };
});

check('C-05', 'The typed boundary chain preserves distinct roles', () => {
  const chain = [
    { value: 29, role: 'C30 left representative / p10' },
    { value: 30, role: 'C30 modulus / seam' },
    { value: 31, role: 'C30 right representative / p11' },
    { value: 60, role: 'C60 modulus / T60 return' },
    { value: 61, role: 'C60 +1 representative / p18 / CRT factor' }
  ];
  assert.equal(new Set(chain.map(item => item.role)).size, chain.length);
  return chain;
});

check('G-01', 'Six outside plus one centre has three non-identical graph realizations', () => {
  const ring = Array.from({ length: 6 }, (_, i) => [i, mod(i + 1, 6)]).map(([a, b]) => a < b ? [a, b] : [b, a]);
  const uniqueRing = [...new Map(ring.map(edge => [edge.join('-'), edge])).values()];
  const spokes = Array.from({ length: 6 }, (_, i) => [i, 6]);
  const disconnected = uniqueRing;
  const star = spokes;
  const wheel = [...uniqueRing, ...spokes];
  assert.deepEqual(graphComponents(7, disconnected), [6, 1]);
  assert.deepEqual(graphComponents(7, star), [7]);
  assert.deepEqual(graphComponents(7, wheel), [7]);
  assert.deepEqual(degreeSequence(7, disconnected), [2, 2, 2, 2, 2, 2, 0]);
  assert.deepEqual(degreeSequence(7, star), [6, 1, 1, 1, 1, 1, 1]);
  assert.deepEqual(degreeSequence(7, wheel), [6, 3, 3, 3, 3, 3, 3]);
  return { disconnectedEdges: 6, starEdges: 6, wheelEdges: 12, selection: '6+1 count alone does not select a graph' };
});

check('G-02', 'Additive 2+3 and nested C2xC3 have different cardinalities', () => {
  assert.equal(2 + 3, 5);
  assert.equal(2 * 3, 6);
  const residues = [];
  for (let x = 0; x < 6; x += 1) residues.push([x % 2, x % 3]);
  assert.equal(new Set(residues.map(pair => pair.join(','))).size, 6);
  return { visibleRoles: 5, nestedProductStates: 6, CRT: 'C2 x C3 ~= C6' };
});

check('G-03', 'The 1+1 phase channel is one binary residual coordinate', () => {
  const phase = [-1, 1];
  assert.equal(phase.length, 2);
  assert.equal(new Set(phase.map(x => mod(x, 2))).size, 1, 'signed labels collapse mod 2 without an orientation bit');
  return { signedLabels: phase, carrierSize: 2, boundary: 'the sign/orientation label must be retained explicitly' };
});

check('D-01', 'Independent, gate-only and every-step sheet laws are trajectory-distinguishable', () => {
  const independent = [0, 0, 0, 0, 0];
  const gateOnly = [0, 1, 1, 1, 0];
  const everyStep = [0, 1, 0, 1, 0];
  assert.equal(new Set([independent, gateOnly, everyStep].map(x => x.join(','))).size, 3);
  assert.ok([independent, gateOnly, everyStep].every(x => x.at(-1) === 0));
  return { independent, gateOnly, everyStep, conclusion: 'endpoint return does not select the coupling law' };
});

check('D-02', 'Independent D/E x C30 display extension has the expected size', () => {
  assert.equal(5 * 2 * 30, 300);
  assert.equal(20 * 30, 600);
  return { existingRegisterSheetPhase: 300, proposedX20PhaseProduct: 600, boundary: 'product size is bookkeeping, not an admitted coupling' };
});

check('X-01', 'Existing Navigator binder preserves the missing X20 source contract', () => {
  const binderPath = path.resolve(__dirname, '../../../SCIENCE_LAB/NAVIGATION/EVIDENCE/MRB_ACR_NCS_Q106_RETURN_CROSSWALK_2026-10-11/MRB_ACR_NCS_Q106_RETURN_CROSSWALK_BINDER_V1_2026-10-11.json');
  const binder = JSON.parse(fs.readFileSync(binderPath, 'utf8'));
  const text = JSON.stringify(binder);
  assert.match(text, /"x20_edge_set":null/);
  assert.match(text, /"typed_x20_to_q106_intertwiner":null/);
  return { binder: path.relative(path.resolve(__dirname, '../../..'), binderPath), x20EdgeSet: null, typedIntertwiner: null };
});

check('X-02', 'Existing Q106 target interface retains twenty internal edges', () => {
  const binderPath = path.resolve(__dirname, '../../../SCIENCE_LAB/NAVIGATION/EVIDENCE/MRB_ACR_NCS_Q106_RETURN_CROSSWALK_2026-10-11/MRB_ACR_NCS_Q106_RETURN_CROSSWALK_BINDER_V1_2026-10-11.json');
  const binder = JSON.parse(fs.readFileSync(binderPath, 'utf8'));
  const text = JSON.stringify(binder);
  assert.match(text, /"undirected_internal_edges":20/);
  return { targetNodes: 20, undirectedInternalEdges: 20, sourceAdjacencyAvailable: false };
});

hold('D-03', 'Select a D/E-to-phase coupling law', 'All three declared laws return but have distinct intermediate traces.', 'Independent source semantics or a preregistered selection rule.');
hold('X-03', 'Execute the X20-to-Q106 adjacency-preserving intertwiner test', 'The source X20 edge set and edge types remain null in the canonical binder.', 'An independently declared X20 adjacency and typed edge semantics.');
hold('R-01', 'Geometric realization of D12/E12, dodecahedral plates and Blue Body', 'Shared cardinalities do not supply an incidence-preserving map.', 'Explicit face/address bijection, incidence table and orientation rule.');
hold('U-01', 'External usefulness comparison', 'No frozen task, comparator, metric or user workload has been supplied.', 'Preregistered baseline, task set, collision/return/time metrics and STOP threshold.');
hold('N-01', 'Select 61 or the 41/61 gap-20 channel as a privileged seam address', 'Prime index, decimal readout and gap arithmetic are exact but non-unique.', 'Selection rule that beats prime-gap and digit-sum comparison classes.');

const failed = checks.filter(item => item.status === 'FAIL');
const result = {
  schema: 'a0.twin-prime-tube-phase-x20.engineering-result.v1',
  executionDate: '2026-10-15',
  authority: {
    kind: 'OWNER_AUTHORIZED_A0_ENGINEERING_DERIVATION',
    labRun: false,
    studyActivated: false,
    navigatorIdentityCreated: false,
    publicationAuthorized: false
  },
  status: failed.length ? 'ENGINEERING_CHECK_FAIL' : 'PASS_BOUNDED_FORMAL_WITH_NEGATIVE_CONTROLS_AND_OPEN_GATES',
  summary: { pass: checks.length - failed.length, fail: failed.length, hold: openGates.length, totalRecords: checks.length + openGates.length },
  checks,
  openGates,
  claimBoundary: [
    'The twin-prime tube is a declared finite interval construction, not a theorem about all twin primes.',
    'The 24-to-20 result is cardinality accounting until adjacency and incidence are independently declared.',
    'Decimal digit readings are representation-dependent.',
    'Equal values or gaps do not identify carriers.',
    'No physical tube, resonance, Riemann, Ihara, E8, geometric realization, novelty or usefulness claim is established.'
  ]
};

if (process.argv.includes('--write')) {
  const output = path.join(__dirname, 'results', 'a0-twin-prime-tube-phase-x20-result-2026-10-15.json');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
}

console.log(JSON.stringify(result, null, 2));
process.exitCode = failed.length ? 1 : 0;
