'use strict';

const fs = require('fs');
const path = require('path');

let checks = 0;
function ok(condition, message) {
  checks += 1;
  if (!condition) throw new Error(`FAIL ${checks}: ${message}`);
}

const values = [-1, 0, 1];
const vectors = [];
for (const x of values) for (const y of values) for (const z of values) vectors.push([x, y, z]);
const nonZero = (vector) => vector.filter(Boolean).length;
const same = (a, b) => a.every((value, index) => value === b[index]);
const vectorKey = (vector) => vector.join(',');
const faceletKey = (facelet) => `${vectorKey(facelet.position)}|${vectorKey(facelet.normal)}`;

const core = vectors.filter((vector) => nonZero(vector) === 0);
const centers = vectors.filter((vector) => nonZero(vector) === 1);
const edges = vectors.filter((vector) => nonZero(vector) === 2);
const corners = vectors.filter((vector) => nonZero(vector) === 3);
const movable = [...corners, ...edges];

ok(vectors.length === 27, '3^3 enumerates 27 spatial positions');
ok(core.length === 1, 'one core position');
ok(centers.length === 6, 'six fixed center positions');
ok(edges.length === 12, 'twelve edge positions');
ok(corners.length === 8, 'eight corner positions');
ok(movable.length === 20, 'twenty movable cubies');
ok(movable.length + centers.length + core.length === 27, '20 + 6 + 1 reconstructs 3^3');

const facelets = [];
for (const position of [...corners, ...edges, ...centers]) {
  position.forEach((coordinate, axis) => {
    if (!coordinate) return;
    const normal = [0, 0, 0];
    normal[axis] = coordinate;
    facelets.push({
      position,
      normal,
      type: nonZero(position) === 3 ? 'corner' : nonZero(position) === 2 ? 'edge' : 'center'
    });
  });
}

const cornerFacelets = facelets.filter((facelet) => facelet.type === 'corner');
const edgeFacelets = facelets.filter((facelet) => facelet.type === 'edge');
const centerFacelets = facelets.filter((facelet) => facelet.type === 'center');
ok(facelets.length === 54, 'cube exposes 54 facelets');
ok(cornerFacelets.length === 24, 'corners expose 24 facelets');
ok(edgeFacelets.length === 24, 'edges expose 24 facelets');
ok(centerFacelets.length === 6, 'centers expose six facelets');
ok(cornerFacelets.length + edgeFacelets.length + centerFacelets.length === 6 * 9, '24 + 24 + 6 equals 6 x 9');

const suits = ['S', 'H', 'D', 'C'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const deck = suits.flatMap((suit) => ranks.map((rank) => `${rank}${suit}`));
const jokers = ['JB', 'JR'];
const cards = [...deck, ...jokers];
const anchors = [...suits.map((suit) => `A${suit}`), ...jokers];
const ordinary = cards.filter((card) => !anchors.includes(card));
ok(deck.length === 52, 'standard deck contains 52 cards');
ok(cards.length === 54, 'deck plus two jokers contains 54 cards');
ok(anchors.length === 6, 'four aces plus two jokers form six anchors');
ok(ordinary.length === 48, 'non-anchor cards number 48');

const slotOrder = [...cornerFacelets, ...edgeFacelets, ...centerFacelets];
const cardOrder = [...ordinary, ...anchors];
const cardBySlot = new Map(slotOrder.map((slot, index) => [faceletKey(slot), cardOrder[index]]));
ok(cardBySlot.size === 54, 'card-to-facelet mapping is bijective');
ok(new Set(cardBySlot.values()).size === 54, 'every mapped card is unique');
ok(centerFacelets.every((slot) => anchors.includes(cardBySlot.get(faceletKey(slot)))), 'all six anchors map to center facelets');
ok([...cornerFacelets, ...edgeFacelets].every((slot) => ordinary.includes(cardBySlot.get(faceletKey(slot)))), 'all ordinary cards map to moving facelets');
ok(cornerFacelets.every((slot) => ordinary.slice(0, 24).includes(cardBySlot.get(faceletKey(slot)))), 'first 24 ordinary cards map to corner facelets by declared ordering');
ok(edgeFacelets.every((slot) => ordinary.slice(24).includes(cardBySlot.get(faceletKey(slot)))), 'second 24 ordinary cards map to edge facelets by declared ordering');

const rotate = (vector, axis, turns) => {
  let [x, y, z] = vector;
  const count = ((turns % 4) + 4) % 4;
  for (let index = 0; index < count; index += 1) {
    if (axis === 0) [y, z] = [-z, y];
    if (axis === 1) [x, z] = [z, -x];
    if (axis === 2) [x, y] = [-y, x];
  }
  return [x, y, z];
};

const moves = {
  R: { axis: 0, layer: 1, turns: 1 },
  L: { axis: 0, layer: -1, turns: -1 },
  U: { axis: 1, layer: 1, turns: 1 },
  D: { axis: 1, layer: -1, turns: -1 },
  F: { axis: 2, layer: 1, turns: 1 },
  B: { axis: 2, layer: -1, turns: -1 }
};

const turnFacelet = (facelet, move) => facelet.position[move.axis] === move.layer ? {
  ...facelet,
  position: rotate(facelet.position, move.axis, move.turns),
  normal: rotate(facelet.normal, move.axis, move.turns)
} : facelet;

const validSlots = new Set(facelets.map(faceletKey));
for (const [name, move] of Object.entries(moves)) {
  const turned = facelets.map((facelet) => turnFacelet(facelet, move));
  const turnedKeys = turned.map(faceletKey);
  ok(new Set(turnedKeys).size === 54 && turnedKeys.every((key) => validSlots.has(key)), `${name} is a permutation of all 54 facelets`);
  const movedCount = facelets.filter((facelet, index) => faceletKey(facelet) !== turnedKeys[index]).length;
  ok(movedCount === 20, `${name} moves 20 facelets and leaves the active center fixed`);
  ok(centerFacelets.every((slot) => {
    const moved = turnFacelet(slot, move);
    return faceletKey(moved) === faceletKey(slot) && anchors.includes(cardBySlot.get(faceletKey(slot)));
  }), `${name} keeps all ace/joker center anchors fixed`);
  let returned = facelets;
  for (let count = 0; count < 4; count += 1) returned = returned.map((facelet) => turnFacelet(facelet, move));
  ok(returned.every((facelet, index) => faceletKey(facelet) === faceletKey(facelets[index])), `${name}^4 returns every card slot exactly`);
}

const partition911 = { left: movable.slice(0, 9), right: movable.slice(9) };
const swapPartition = ({ left, right }) => ({ left: right, right: left });
const swapped = swapPartition(partition911);
const returnedPartition = swapPartition(swapped);
ok(partition911.left.length === 9 && partition911.right.length === 11, 'declared ordered partition has size 9|11');
ok(swapped.left.length === 11 && swapped.right.length === 9, 'side swap yields 11|9');
ok(returnedPartition.left.every((item, index) => same(item, partition911.left[index])) && returnedPartition.right.every((item, index) => same(item, partition911.right[index])), 'side swap is an exact involution');
const typePreserving = [partition911.left.length, partition911.right.length].sort((a, b) => a - b).join('|') === [corners.length, edges.length].sort((a, b) => a - b).join('|');
ok(typePreserving === false, '9|11 is not the standard type partition 8|12');
const minimumTypeCrossings = Math.abs(partition911.left.length - corners.length);
ok(minimumTypeCrossings === 1, 'at least one cubie crosses the standard corner/edge type boundary');

ok(3 * 11 === 33, '33 is the exact 3 x 11 bridge count');
ok((3 ** 3) + 33 + (11 ** 2) === 181, 'plain additive reading equals 181');

const isPrime = (number) => {
  if (!Number.isInteger(number) || number < 2) return false;
  for (let divisor = 2; divisor * divisor <= number; divisor += 1) {
    if (number % divisor === 0) return false;
  }
  return true;
};
const primeIndex = (prime) => {
  let index = 0;
  for (let candidate = 2; candidate <= prime; candidate += 1) {
    if (isPrime(candidate)) index += 1;
  }
  return index;
};

const cube13 = 13 ** 3;
const cube23 = 23 ** 3;
ok(cube13 === 2197, '13^3 equals 2197');
ok(cube13.toString(12) === '1331', '2197 decimal returns 1331 in base 12');
ok(21 === 3 * 7 && primeIndex(7) === 4, '21 parses as 3 times p4');
ok(isPrime(97) && primeIndex(97) === 25, '97 is p25');
ok([2, 19, 7].every(isPrime), '2|19|7 contains three primes');
const firstIndices = [2, 19, 7].map(primeIndex);
ok(firstIndices.join('') === '184', 'prime indices of 2|19|7 concatenate to 184');
ok(184 - 101 === 83 && isPrime(83) && primeIndex(83) === 23, '184-101 equals p23');
ok(cube23 === 12167, '23^3 equals 12167');
ok(cube23.toString(16).toUpperCase() === '2F87', '12167 decimal returns 2F87 in base 16');
ok(isPrime(67) && primeIndex(67) === 19, '67 is p19');
ok(primeIndex(67) === 19 && [2, 19, 7][1] === 19, 'second cube returns the middle prime value address 19');
ok(cube23 - cube13 === 9970, 'cube capacity delta equals 9970');
ok(9970 === 10 * 997 && isPrime(997) && primeIndex(997) === 168, '9970 equals 10 times p168');

const twelveZeroPacks = [
  { inner: 3, outer: 4 },
  { inner: 4, outer: 3 },
  { inner: 2, outer: 6 },
  { inner: 6, outer: 2 }
];
for (const { inner, outer } of twelveZeroPacks) {
  ok((10 ** inner) ** outer === 10 ** 12, `(${inner},${outer}) pack equals 10^12`);
}
ok(new Set(twelveZeroPacks.map(({ inner, outer }) => `${inner},${outer}`)).size === 4, 'four ordered twelve-zero pack records remain distinct');

const suffixPrimeHits = [];
for (let n = 2; n <= 100; n += 1) {
  const decimalCube = String(n ** 3);
  let matched = false;
  for (let split = 1; split < decimalCube.length - 1; split += 1) {
    if (decimalCube[split] !== '1' || decimalCube[split + 1] === '0') continue;
    if (isPrime(Number(decimalCube.slice(split + 1)))) matched = true;
  }
  if (matched) suffixPrimeHits.push(n);
}
ok(suffixPrimeHits.join(',') === '8,13,17,23,49,58,73,83', 'frozen n=2..100 decimal suffix-prime census has the expected eight hits');
ok(suffixPrimeHits.length === 8, 'selected 13/23 pair is not unique under the wider suffix-prime rule');
ok(1 + 3 + 3 + 1 === 8, 'binomial exploded view has eight typed components');

const h4Route = [0, 2, 4, 1, 3];
ok(h4Route.length === 5 && new Set(h4Route).size === 5, 'H4 local witness visits all five C5 vertices exactly once');
ok(h4Route.every((vertex, index) => (h4Route[(index + 1) % 5] - vertex + 5) % 5 === 2), 'H4 local witness is the declared +2 mod 5 route');
ok(h4Route.length * 2 === 10, 'C5 has ten directed edge states');
const h5Candidates = [13, 17, 23, 21];
ok(h5Candidates.slice(0, 3).every(isPrime), 'H5 display contains three declared prime candidates');
ok(!isPrime(h5Candidates[3]), 'H5 display contains the declared composite control 21');
const coupledStates = Array.from({ length: 20 }, (_, tick) => `${tick % 5}|${tick % 4}`);
ok(new Set(coupledStates).size === 20, 'coprime H4/H5 display periods enumerate twenty distinct coupled states');
ok(20 % 5 === 0 && 20 % 4 === 0, 'both display hands return after twenty coupled ticks');
ok(!Array.from({ length: 19 }, (_, index) => index + 1).some((tick) => tick % 5 === 0 && tick % 4 === 0), 'no earlier positive joint return exists');
ok(fs.existsSync(path.join(__dirname, 'A0_ORIENTATION_CONTROLLER_BENCH.html')), 'H4 source instrument exists');
ok(fs.existsSync(path.join(__dirname, 'A0_TESSAREC_BLUE_BODY_LAB.html')), 'H5 source instrument exists');
ok(fs.existsSync(path.join(__dirname, 'A0_CURSOR_HANDOFF_CLICKDUMMY.html')), 'H8 record-deck source instrument exists');
ok(fs.existsSync(path.join(__dirname, 'DRAFTS', 'A0_FAMILY_NAVIGATOR_DEMO.html')), 'H8 Club and Control Room source instrument exists');
const h8ModeCounts = { vinyl: 3, shellac: 2, digital: 1 };
ok(Object.values(h8ModeCounts).reduce((sum, value) => sum + value, 0) === 6, 'H8 declared 3+2+1 stack contains six typed display positions');
const deckSource = fs.readFileSync(path.join(__dirname, 'A0_CURSOR_HANDOFF_CLICKDUMMY.html'), 'utf8');
ok(['turntable', 'gramophone', 'digital'].every((profile) => deckSource.includes(`data-profile="${profile}"`)), 'H8 source deck exposes turntable, gramophone and digital profiles');
ok(['lp', 'single', 'shellac'].every((preset) => deckSource.includes(`data-preset="${preset}"`)), 'H8 source deck exposes LP, single and shellac presets');
ok(['newton', 'leibniz', 'goethe'].every((lens) => deckSource.includes(`data-deck-lens="${lens}"`)), 'H8 source deck exposes the three independent observer lenses');
const clubSource = fs.readFileSync(path.join(__dirname, 'DRAFTS', 'A0_FAMILY_NAVIGATOR_DEMO.html'), 'utf8');
ok(clubSource.includes('A0_CURSOR_HANDOFF_CLICKDUMMY.html') && clubSource.includes('id="control-room"'), 'H8 Club reuses the deck source and retains a separate Control Room');
const benchSource = fs.readFileSync(path.join(__dirname, 'A0_ORIENTATION_CONTROLLER_BENCH.html'), 'utf8');
ok(benchSource.includes('EP → SI → LP → SH → RT → RETURN'), 'H8 cross-check preserves the separate six-plate Aperture Stack legend');

const html = fs.readFileSync(path.join(__dirname, 'DRAFTS', 'A0_IOI_LEAF_FOLD_RETURN_2026-11-02.html'), 'utf8');
for (const token of [
  'id=&quot;deck-cube-ledger&quot;',
  '52 + 2J = 54',
  '9|11 ↔ 11|9',
  'EXPECTED NON-IDENTITY',
  'id=&quot;base-prime-address-lens&quot;',
  '13³ = 2197₁₀ = 1331₁₂',
  'FINITE CENSUS · EXPECTED NON-UNIQUENESS',
  'id=&quot;twelve-zero-pack&quot;',
  'OBS-30',
  'OBS-31',
  'OBS-32',
  'OBS-33',
  'H32',
  'H33',
  'id=&quot;h4-h5-two-hand-bridge&quot;',
  'H4 × H5 · Two Hands Turn One Cube',
  'A0_ORIENTATION_CONTROLLER_BENCH.html',
  'A0_TESSAREC_BLUE_BODY_LAB.html',
  'JOINT RETURN · LCM(5,4)=20',
  'twoHandTick = 20; renderTwoHands(false);',
  'OFFEN · LOCAL C5 WITNESS',
  'OFFEN · PREREGISTRATION GATE',
  'id=&quot;h8-record-deck-mode-lens&quot;',
  'H8 · Record Deck / Club Mode Stack',
  '3 VINYL + 2 SHELLAC + 1 DIGITAL',
  'SOURCE-BOUND MODE LENS',
  'Α → Λ → Ω',
  'EP–SI–LP–SH–RT–RETURN',
  'BLOCK RETURN · DOCUMENTARY CLOSE'
]) {
  ok(html.includes(token), `HTML contains ${token}`);
}

console.log(JSON.stringify({
  status: 'PASS_WITH_EXPECTED_NON_IDENTITY_POST_HOC_ADDRESS_OPEN_H4_H5_AND_SOURCE_BOUND_H8',
  checks,
  exact: {
    cubies: '27 = 20 + 6 + 1',
    facelets: '54 = 24 + 24 + 6',
    cards: '54 = 48 + (4A + 2J)',
    return: 'six quarter-turn generators each return exactly after four turns',
    ordered_partition: '9|11 -> 11|9 -> 9|11',
    base_translation: '13^3 = 2197_10 = 1331_12; 23^3 = 12167_10 = 2F87_16',
    prime_address_chain: '2|19|7 -> 1|8|4 -> 184-101 = p23 -> 23^3 -> 12|1|p19',
    twelve_zero_pack: '(10^3)^4 = (10^4)^3 = (10^2)^6 = (10^6)^2 = 10^12',
    two_hand_display_return: 'C5 period 5 x declared candidate display period 4 -> joint period 20',
    h8_mode_stack: '3 vinyl display positions + 2 shellac/gramophone display positions + 1 digital class = 6 typed positions'
  },
  negative: [
    '9|11 is not type-identical to the standard 8-corner|12-edge partition; minimum one cubie crosses the type boundary',
    'the selected 13/23 address pair is not unique: the frozen n=2..100 decimal suffix-prime census contains eight hits',
    'the six H8 deck positions have no automatic row map to the separate EP|SI|LP|SH|RT|RETURN Aperture Stack'
  ],
  unresolved: [
    '33_r has an exact count 3x11=33 but no cube-move operator semantics in this audit',
    'decimal splitting and subtraction by 101 are declared post-hoc address operators, not a basis-invariant prime mechanism',
    '1+3+3+1=8 is a component-count echo, not tesseract geometry',
    'H4 remains open beyond the declared local C5 non-backtracking witness',
    'H5 remains open because P13/P17/P23/C21 is a declared display sequence, not a preregistered predictive Prime-Folding rule'
  ]
}));
