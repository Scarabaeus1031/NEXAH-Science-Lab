'use strict';

const assert = require('node:assert/strict');
const harmonic = require('./a0-harmonic-prime-grid37.js');
const scarab = require('./a0-scarab-origin.js');

let checks = 0;
const ok = (value, message) => { checks += 1; assert.ok(value, message); };
const equal = (actual, expected, message) => {
  checks += 1;
  assert.deepEqual(actual, expected, message);
};
const near = (actual, expected, epsilon = 1e-10) =>
  ok(Math.abs(actual - expected) <= epsilon, `${actual} ≈ ${expected}`);
const gcd = (a, b) => b === 0 ? Math.abs(a) : gcd(b, a % b);

// Prime carrier: p*pi/30 is a mod-60 angular address. Except for 2, 3 and 5,
// primes occupy exactly the 16 units of Z/60Z (Euler phi(60) = 16).
const primePoints = harmonic.primePoints();
const carrierPoints = primePoints.filter(({ p }) => p > 5);
const residues = [...new Set(carrierPoints.map(({ p }) => p % 60))].sort((a, b) => a - b);
const expectedResidues = [1, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 49, 53, 59];
equal(primePoints.length, 139, 'prime count through 797');
equal(carrierPoints.length, 136, 'carrier count after exceptional primes 2, 3, 5');
equal(residues, expectedResidues, 'the 16 reduced residue classes modulo 60');
equal(Array.from({ length: 60 }, (_, n) => n).filter(n => gcd(n, 60) === 1).length, 16, 'phi(60)');
ok(residues.every(r => gcd(r, 60) === 1), 'all carrier residues are coprime to 60');

const oppositePairs = residues
  .filter(r => r < 30)
  .map(r => [r, (r + 30) % 60]);
equal(oppositePairs, [[1, 31], [7, 37], [11, 41], [13, 43], [17, 47], [19, 49], [23, 53], [29, 59]], 'eight opposite ray pairs');

const cyclicGaps = residues.map((r, i) => {
  const next = residues[(i + 1) % residues.length] + (i === residues.length - 1 ? 60 : 0);
  return next - r;
});
equal(cyclicGaps, [6, 4, 2, 4, 2, 4, 6, 2, 6, 4, 2, 4, 2, 4, 6, 2], 'cyclic channel widths');
equal(
  cyclicGaps.reduce((histogram, gap) => ({ ...histogram, [gap]: (histogram[gap] || 0) + 1 }), {}),
  { 2: 6, 4: 6, 6: 4 },
  'four large, six medium and six narrow angular channels'
);
equal(
  residues.flatMap((r, i) => cyclicGaps[i] === 6 ? [[r, residues[(i + 1) % residues.length]]] : []),
  [[1, 7], [23, 29], [31, 37], [53, 59]],
  'the four largest invariant channels'
);
equal(carrierPoints.reduce((sum, point) => sum + Number(residues.includes(point.p % 60)), 0), 136, 'all carrier points land on a valid ray');

// Drift: the generator itself contains five radial pulses per turn and spans
// three turns. This supports a 5-fold harmonic carrier, not a literal polygon.
const drift = harmonic.drift();
const radii = drift.map(({ x, y }) => Math.hypot(x, y));
let radialMaxima = 0;
for (let i = 1; i < radii.length - 1; i += 1) {
  if (radii[i] > radii[i - 1] && radii[i] > radii[i + 1]) radialMaxima += 1;
}
equal(radialMaxima, 15, 'five radial maxima on each of three turns');
near(drift[0].z, -2);
near(drift.at(-1).z, 2);
ok(Math.min(...radii) >= 0.9 && Math.max(...radii) <= 1.1, 'drift radius remains in [0.9, 1.1]');

// Lilith: integer frequencies 3:4:5 share the fundamental return 2*pi.
const lilith = harmonic.lilith();
near(Math.hypot(
  lilith[0].x - lilith.at(-1).x,
  lilith[0].y - lilith.at(-1).y,
  lilith[0].z - lilith.at(-1).z
), 0);
equal(gcd(gcd(3, 4), 5), 1, '3:4:5 has one common fundamental closure');
ok(lilith.every(p => Math.abs(p.x) <= 1 && Math.abs(p.y) <= 1 && Math.abs(p.z) <= 0.3), 'Lilith coordinate bounds');

// The Scarab/Ramanujan carrier is an exact closed diamond (Caro) in z=0.2.
const diamond = scarab.ramanujan();
equal(diamond.length, 5, 'closed diamond has four vertices plus return');
equal(diamond[0], diamond.at(-1), 'diamond closes');
for (let i = 0; i < 4; i += 1) {
  near(Math.hypot(diamond[i + 1].x - diamond[i].x, diamond[i + 1].y - diamond[i].y), 2 * Math.SQRT2);
  near(diamond[i].z, 0.2);
}
near(Math.hypot(diamond[2].x - diamond[0].x, diamond[2].y - diamond[0].y), 4);
near(Math.hypot(diamond[3].x - diamond[1].x, diamond[3].y - diamond[1].y), 4);
const signedArea = diamond.slice(0, -1).reduce((sum, point, i) => {
  const next = diamond[(i + 1) % 4];
  return sum + point.x * next.y - next.x * point.y;
}, 0) / 2;
near(Math.abs(signedArea), 8);

// Grid 37 is one source-bound segment, not a second boomerang or a network.
const connector = harmonic.connector();
equal(connector.length, 2, 'one connector segment');
equal(connector[0], harmonic.primePoint(37), 'connector begins at p37');
equal(connector[1], lilith[11], 'connector ends at Lilith sample 11');

const grid37 = harmonic.grid37Address();
equal(grid37.index, 12, '37 is the twelfth prime');
equal(grid37.reverse, 73, 'digit reverse of 37');
equal(grid37.reverseIndex, 21, '73 is the twenty-first prime');
equal(grid37.positionReverse, 21, 'the decimal reverse of index 12 is 21');
equal(grid37.predecessor, { prime: 31, index: 11 }, '31 is the preceding indexed prime');
equal(grid37.middlePair, [{ prime: 19, index: 8 }, { prime: 67, index: 19 }], '19/67 address pair');
equal(grid37.loopCandidate, { prime: 109, index: 29 }, '109 address only; loop remains interpretive');
equal(grid37.repeated, [111, 222, 333, 444, 555, 666, 777, 888, 999], '37 times 3..27 repeated-digit ladder');

const harmonicAnalysis = harmonic.analyze();
const scarabAnalysis = scarab.analyze();
equal(harmonicAnalysis.identityReuse, ['ART:A0:MATHEMATICAL_JOINTS', 'MOD:ORIENTATION_DEMONSTRATORS']);
equal(scarabAnalysis.identityReuse, ['ART:A0:MATHEMATICAL_JOINTS', 'MOD:ORIENTATION_DEMONSTRATORS', 'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH']);
equal(harmonicAnalysis.newCanonicalIds, []);
equal(harmonicAnalysis.relationChanges, []);
equal(scarabAnalysis.newCanonicalIds, []);
equal(scarabAnalysis.relationChanges, []);

console.log(JSON.stringify({
  status: 'PASS',
  checks,
  invariant: {
    primeCarrier: { modulus: 60, rays: residues.length, oppositePairs: oppositePairs.length, gapHistogram: { 2: 6, 4: 6, 6: 4 } },
    drift: { turns: 3, radialHarmonic: 5, sampledMaxima: radialMaxima },
    lilith: { frequencies: [3, 4, 5], closed: true },
    diamond: { vertices: 4, area: Math.abs(signedArea) },
    grid37ConnectorSegments: 1
  },
  viewDependent: ['left/right/top/bottom channel placement', 'boomerang', 'butterfly'],
  unsupported: ['two violet connector boomerangs', 'physical channel interpretation'],
  newCanonicalIds: 0,
  relationChanges: 0
}));
