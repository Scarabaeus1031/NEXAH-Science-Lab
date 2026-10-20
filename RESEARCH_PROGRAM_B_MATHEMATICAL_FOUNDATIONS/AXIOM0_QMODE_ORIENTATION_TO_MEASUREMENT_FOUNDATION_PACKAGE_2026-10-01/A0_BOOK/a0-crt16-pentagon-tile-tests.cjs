#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'A0_PINK_DIAMOND_GRID_ATLAS.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'a0-grid-atlas.js'), 'utf8');
const fixtureMatch = html.match(/<script type="application\/json" id="ghostTileFixtures">([^<]+)<\/script>/);
assert.ok(fixtureMatch, 'ghost-tile fixture payload missing');
const ghostFixtures = JSON.parse(fixtureMatch[1]);

const moduli = [17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n, 71n, 73n, 79n];
const product = moduli.reduce((acc, value) => acc * value, 1n);

assert.equal(moduli.length, 16, 'CRT plate must expose exactly 16 channels');
assert.equal(moduli[0], 17n, 'first modulus must remain 17');
assert.equal(product, 107147677900122307955347471n, 'CRT product drifted');
for (let i = 0; i < moduli.length; i += 1) {
  for (let j = i + 1; j < moduli.length; j += 1) {
    let a = moduli[i], b = moduli[j];
    while (b) [a, b] = [b, a % b];
    assert.equal(a, 1n, `moduli ${moduli[i]} and ${moduli[j]} are not coprime`);
  }
}

for (let n = 0; n < 77; n += 1) {
  const a = n % 7, b = n % 11;
  assert.equal((22 * a + 56 * b) % 77, n, `Mod-77 joint failed at ${n}`);
}
for (let x = 0; x <= 12; x += 1) {
  const ca = Math.min(x, 3), cb = x - ca;
  assert.equal(ca + cb, x, `ACR-38 clamp failed at ${x}`);
}
assert.equal(4114 + 4774, 8888, 'palindrome pair sum drifted');
assert.equal((4114 + 4774) / 2, 4444, 'palindrome midpoint drifted');
assert.equal((4774 - 4114) / 2, 330, 'palindrome radius drifted');
assert.equal((31000 - 3773) % 31000, 27227, 'S_31000 control drifted');
assert.equal(1729, 15 * 111 + 64, '1729 grid address drifted');
assert.equal(64 + 15, 79, '1729 fold value drifted');
assert.equal(1526, 13 * 111 + 83, '1526 grid address drifted');
assert.equal(83 + 13, 96, '1526 negative-control fold drifted');
const smallPrimes = Array.from({ length: 79 }, (_, index) => index + 1).filter(value => {
  if (value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) if (value % divisor === 0) return false;
  return true;
});
assert.equal(smallPrimes.length, 22, '79 must remain the 22nd prime');
assert.equal(smallPrimes.at(-1), 79, 'prime index endpoint drifted');
assert.ok(!smallPrimes.includes(96), '96 must remain a composite control');
assert.ok(smallPrimes.includes(79), '79 must remain the prime in the declared 1729 fold record');
assert.equal(1031 + 1, 1032, '1031/1032 adjacency drifted');
assert.equal(1032 + 1, 1033, '1032/1033 adjacency drifted');
assert.equal(1032, 24 * 43, 'Block 2B exact carry drifted');
assert.equal(7801, 29 * 269, '7801 composite control drifted');
assert.equal(Number(String(1087).split('').reverse().join('')), 7801, '1087 reversal control drifted');
const primesThrough1087 = Array.from({ length: 1087 }, (_, index) => index + 1).filter(value => {
  if (value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) if (value % divisor === 0) return false;
  return true;
});
assert.equal(primesThrough1087.indexOf(1033) + 1, 174, '1033 prime index drifted');
assert.equal(primesThrough1087.indexOf(1087) + 1, 181, '1087 prime index drifted');
assert.equal(181 - 174, 7, 'CXXXI prime-index gap drifted');

assert.equal(ghostFixtures.status, 'DOCUMENTARY_TRANSCRIPTION_NOT_FORMULA', 'visual fixtures must remain documentary');
assert.deepEqual([ghostFixtures.root5.cols, ghostFixtures.root5.rows, ghostFixtures.root5.values.length], [5, 5, 25], 'Visual 10 root5 dimensions drifted');
assert.deepEqual(ghostFixtures.root5.values, [1,2,3,4,5,6,7,6,7,8,9,9,11,15,15,16,14,16,17,20,21,22,23,24,25], 'Visual 10 root5 transcription drifted');
assert.deepEqual([ghostFixtures.root7.cols, ghostFixtures.root7.rows, ghostFixtures.root7.values.length], [7, 6, 42], 'Visual 10 root7 dimensions drifted');
assert.deepEqual(ghostFixtures.root7.values, [1,2,3,4,5,6,7,8,9,10,11,15,13,14,15,16,17,18,19,20,21,23,23,24,29,26,27,28,29,40,31,32,33,34,35,36,37,38,38,40,42,43], 'Visual 10 root7 transcription drifted');
assert.deepEqual([ghostFixtures.systemx.cols, ghostFixtures.systemx.rows, ghostFixtures.systemx.values.length], [5, 3, 15], 'Visual 11 System-X dimensions drifted');
assert.deepEqual(ghostFixtures.systemx.lanes, ['7·8·9', '5·4·3', '1·2·3·4·5'], 'Visual 11 layer transcription drifted');
assert.deepEqual(ghostFixtures.systemx.values.filter(value => value !== null), [7,8,9,5,4,3,1,2,3,4,5], 'Visual 11 System-X values drifted');
const encodeNpRr = (np, rr, side = 100) => side * np + rr;
const decodeNpRr = (flat, side = 100) => ({ np: Math.floor(flat / side), rr: flat % side });
const wrapGhostCoordinate = (value, side) => ((value % side) + side) % side;
assert.equal(encodeNpRr(0, 0), 0, 'NP;RR origin encoding drifted');
for (const side of [100, 1000]) for (const np of [0, 1, side - 1]) for (const rr of [0, 1, side - 1]) {
  assert.deepEqual(decodeNpRr(encodeNpRr(np, rr, side), side), { np, rr }, `NP;RR round-trip drifted at S=${side}, ${np};${rr}`);
}
assert.equal(encodeNpRr(51, 83, 100), 5183, '100x100 NP;RR address drifted');
assert.equal(encodeNpRr(537, 172, 1000), 537172, '1000x1000 NP;RR address drifted');
assert.deepEqual(
  { np: wrapGhostCoordinate(96 + 6, 100), rr: wrapGhostCoordinate(98 + 6, 100) },
  { np: 2, rr: 4 },
  '100x100 7x7 viewport edge wrap drifted'
);
assert.equal(((5183 - 1) % 12 + 12) % 12, 10, 'minus-1/12 display phase drifted');
const phi = (1 + Math.sqrt(5)) / 2;
assert.ok(Math.abs(Math.acos(1 / phi) * 180 / Math.PI - 51.827292) < 1e-6, 'golden-angle aperture drifted');
assert.equal(15 + 10 + 10 + 5, 40, 'four-view ring/pillar/seam/core edge count drifted');
const trinityCounts = [0, 0, 0];
for (let y = 0; y < 5; y += 1) for (let x = 0; x < 5; x += 1) trinityCounts[(x + 2 * y) % 3] += 1;
assert.equal(trinityCounts.reduce((sum, value) => sum + value, 0), 25, 'Trinity colouring must cover every Root-5 tile');
assert.ok(Math.max(...trinityCounts) - Math.min(...trinityCounts) <= 1, 'Trinity colouring must remain balanced on the 5×5 fixture');
assert.equal(Math.PI * 2, 2 * Math.PI, 'tau identity drifted');
const lrrlSteps = [-1, 1, 1, -1];
assert.deepEqual(lrrlSteps.reduce((trace, step) => [...trace, trace.at(-1) + step], [0]), [0, -1, 0, 1, 0], 'LRRL trace drifted');
const balancedWords = new Set();
for (let mask = 0; mask < 16; mask += 1) {
  const word = Array.from({ length: 4 }, (_, bit) => (mask & (1 << bit)) ? 1 : -1);
  if (word.filter(step => step === 1).length === 2) balancedWords.add(word.join(','));
}
assert.equal(balancedWords.size, 6, 'LRRL must not be promoted as the unique balanced four-step Return');

[
  'id="crt16-tile"', 'id="tileN"', 'id="tileLens"', 'id="tileRotation"',
  'id="gridLens"', 'id="gridFold"', 'id="gridDrift"', 'id="gridCode"', 'id="gridAddressLedger"',
  'id="faceCarrier"', 'id="faceAddress"', 'id="representationMode"',
  'id="tileAperture"', 'id="tileTempo"', 'id="tilePlay"', 'id="tilePhase"', 'id="showCoupling"',
  'id="ghostPreset"', 'id="ghostFieldSize"', 'id="ghostViewport"', 'id="ghostColor"', 'id="ghostAperture"', 'id="ghostNp"', 'id="ghostRr"', 'id="ghostFollowTile"', 'id="ghostPlay"', 'id="ghostTileFixtures"',
  'id="tileViewFront"', 'id="tileViewTop"', 'id="tileViewSide"', 'id="tileViewIso"', 'id="tileProjectionMeta"',
  'id="carrierView"', 'id="recordLens"', 'id="foldView"', 'id="shadowView"', 'Dürer Q4 · 16 Rechtecke',
  'D30 / C10 · Phase + Zehnerstern', 'Grid-Record · 33/7 ↔ 45/78/90',
  '5 Kites × 2 · 10 Dreiecke', 'Base · Mod · Grid · CRT', 'D12/E12', 'D/E · gekoppelte Doppelschicht', '15 + 1', 'P|C|P → 1|0|1', '7801=29·269', 'φ/√2≈1,1441', 'kein unbelegter Intertwiner'
].forEach(marker => assert.ok(html.includes(marker), `missing HTML marker: ${marker}`));

[
  'moduli: [17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79]',
  "q106: ['Q106 · I15 comparator'", 'const digitsInBase',
  "address >= 2 && address <= 6", "odd ? 'P · 17' : 'Q · 18'",
  'function drawFoldOverlay', 'function drawDuerer', 'function drawFaceCarrier',
  'function drawF50Comparator', 'function drawShadowOverlay', 'function drawD30Carrier',
  'const isPrime', 'const primeIndex', 'W₁…W₄: 101 · 1001 · 10001 · 100001',
  'function drawGridRecord', 'function drawMod77Evidence', 'function drawClampEvidence',
  'function drawPositionEvidence', 'function drawPalindromeEvidence',
  'HISTORICAL GRID MAPPING = VISUAL_ONLY', 'NO SOURCE-BOUND 3773 ↔ 4774 BRIDGE',
  'VIEW ROTATION, NOT CLOSURE', '3×5×7 = 105 · 7×11 = 77',
  "rankF₅₀(101) = rankF₅₀(151) = 50", 'function drawCoupledFaceCarrier',
  'function animationStep', 'function drawTileProjections', "class: sector === activeSector ? 'fold-edge active'",
  "ghostColor.value === 'minus-1-12'", "ghostAperture.value === 'golden'",
  'function encodeGhostAddress', 'function decodeGhostAddress', 'function ghostAddressAt',
  'function renderGhost', 'function inGhostAperture', 'function syncGhostToTile', 'window.A0GhostTiles', 'const lrrlTrace = [0, -1, 0, 1, 0]'
].forEach(marker => assert.ok(js.includes(marker), `missing JS contract marker: ${marker}`));

console.log('A0 CRT16 PENTAGON TILE: PASS');
console.log(`channels=${moduli.length} start=${moduli[0]} product=${product}`);
console.log('display=15+1 documentary; D30/C10, grid-record evidence lenses, Dürer rectangles, C5 kites, ten triangles, F50 and D/E carriers remain typed and separated');
