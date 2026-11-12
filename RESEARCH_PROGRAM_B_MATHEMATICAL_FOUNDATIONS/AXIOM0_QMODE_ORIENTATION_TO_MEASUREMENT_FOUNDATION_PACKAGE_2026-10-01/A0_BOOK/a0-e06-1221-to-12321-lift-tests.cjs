#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const checks = [];
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return Math.abs(a); };
const isPrime = n => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d += 1) if (n % d === 0) return false;
  return true;
};
const key = ([x, y]) => `${x}:${y}`;
const manhattan = ([x1, y1], [x2, y2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

function check(id, title, fn) {
  try {
    checks.push({ id, title, status: 'PASS', detail: fn() });
  } catch (error) {
    checks.push({ id, title, status: 'FAIL', detail: error.message });
  }
}

const vertices = [];
const horizontalEdges = [];
const verticalEdges = [];
for (let a = 0; a < 11; a += 1) {
  for (let b = 0; b < 111; b += 1) {
    vertices.push([a, b]);
    if (a < 10) horizontalEdges.push([[a, b], [a + 1, b]]);
    if (b < 110) verticalEdges.push([[a, b], [a, b + 1]]);
  }
}

const sourceJanus = ([a, b]) => [10 - a, 110 - b];
const targetJanus = ([u, v]) => [110 - u, 110 - v];

const candidates = {
  interval: {
    formula: 'L_interval(a,b)=(10a,b)',
    map: ([a, b]) => [10 * a, b],
    inverse: ([u, v]) => u % 10 === 0 && u <= 100 ? [u / 10, v] : null
  },
  stride11: {
    formula: 'L_stride11(a,b)=(11a,b)',
    map: ([a, b]) => [11 * a, b],
    inverse: ([u, v]) => u % 11 === 0 ? [u / 11, v] : null
  },
  address: {
    formula: 'L_address(a,b)=(a,b)',
    map: ([a, b]) => [a, b],
    inverse: ([u, v]) => u <= 10 ? [u, v] : null
  }
};

function profile(candidate) {
  const image = vertices.map(candidate.map);
  const unique = new Set(image.map(key)).size;
  const horizontalLengths = [...new Set(horizontalEdges.map(([x, y]) => manhattan(candidate.map(x), candidate.map(y))))];
  const verticalLengths = [...new Set(verticalEdges.map(([x, y]) => manhattan(candidate.map(x), candidate.map(y))))];
  const janusCommutes = vertices.every(vertex => key(candidate.map(sourceJanus(vertex))) === key(targetJanus(candidate.map(vertex))));
  const roundTrips = vertices.every(vertex => key(candidate.inverse(candidate.map(vertex))) === key(vertex));
  const uValues = image.map(([u]) => u);
  return {
    formula: candidate.formula,
    imageStates: unique,
    injective: unique === vertices.length,
    roundTrips,
    horizontalLengths,
    verticalLengths,
    unitAdjacency: horizontalLengths.length === 1 && horizontalLengths[0] === 1 && verticalLengths.length === 1 && verticalLengths[0] === 1,
    janusCommutes,
    targetEndpointCoverage: Math.min(...uValues) === 0 && Math.max(...uValues) === 110,
    uRange: [Math.min(...uValues), Math.max(...uValues)]
  };
}

const profiles = Object.fromEntries(Object.entries(candidates).map(([id, candidate]) => [id, profile(candidate)]));

check('A-01', 'The Seed-Junction-Field multiplicative bridge is exact', () => {
  assert.equal(121, 11 ** 2);
  assert.equal(1221, 11 * 111);
  assert.equal(12321, 111 ** 2);
  assert.equal(1221 ** 2, 121 * 12321);
  return { seed: 121, junction: 1221, field: 12321, identity: '1221^2=121*12321' };
});

check('A-02', 'The prime-palindrome address has exactly the declared factors', () => {
  assert.equal(17 * 23 * 31, 12121);
  assert.ok([17, 23, 31].every(isPrime));
  return { value: 12121, factors: [17, 23, 31], digitPalindrome: String(12121) === String(12121).split('').reverse().join('') };
});

check('A-03', 'The N-band return is the reduced rational 297/7', () => {
  assert.equal(gcd(297, 7), 1);
  assert.equal(Math.round((297 / 7) * 1000) / 1000, 42.429);
  assert.equal(297 / 7, 42 + 3 / 7);
  return { numerator: 297, denominator: 7, mixed: '42+3/7', decimal: 297 / 7, rounded3: 42.429 };
});

check('A-04', 'The N-band plate decomposes exactly as station 41, one full step and a three-sevenths residual', () => {
  const value = 297 / 7;
  const residual = 3 / 7;
  assert.equal(value, 41 + 1 + residual);
  assert.equal(Math.round(residual * 1000) / 1000, 0.429);
  return {
    exact: '297/7 = 42+3/7 = 41+1+3/7',
    baseStation: 41,
    fullSteps: 1,
    residual: '3/7',
    residualDecimal: residual,
    residualRounded3: 0.429
  };
});

check('A-05', 'The pi plate is a convergent ladder with 22/7 as the seven-step approximation', () => {
  const ladder = [[3, 1], [22, 7], [333, 106], [355, 113]];
  const errors = ladder.map(([p, q]) => Math.abs(p / q - Math.PI));
  assert.ok(errors.every((error, index) => index === 0 || error < errors[index - 1]));
  assert.equal(22 / 7, 3 + 1 / 7);
  return {
    ladder: ladder.map(([p, q]) => `${p}/${q}`),
    sevenStepPlate: '22/7 = 3+1/7',
    sevenPi: 7 * Math.PI,
    sevenPiTo22Residual: 22 - 7 * Math.PI,
    approximationError: 22 / 7 - Math.PI
  };
});

check('A-06', 'The phi plate is the Fibonacci-ratio ladder with 8/5 as the five-step approximation', () => {
  const phi = (1 + Math.sqrt(5)) / 2;
  const ladder = [[1, 1], [2, 1], [3, 2], [5, 3], [8, 5], [13, 8], [21, 13]];
  const errors = ladder.map(([p, q]) => Math.abs(p / q - phi));
  assert.ok(errors.every((error, index) => index === 0 || error < errors[index - 1]));
  assert.equal(8 / 5, 1 + 3 / 5);
  assert.ok(Math.abs(2 * Math.cos(Math.PI / 5) - phi) < 1e-14);
  return {
    ladder: ladder.map(([p, q]) => `${p}/${q}`),
    fiveStepPlate: '8/5 = 1+3/5',
    fivePhi: 5 * phi,
    fivePhiFrom8Residual: 5 * phi - 8,
    approximationError: phi - 8 / 5,
    exactMetricContract: '2cos(pi/5)=phi'
  };
});

check('A-07', 'The visual 41+1+1 notation is rejected as arithmetic and retained only as a typed three-slot view', () => {
  assert.equal(41 + 1 + 1, 43);
  assert.notEqual(41 + 1 + 1, 297 / 7);
  assert.equal(41 + 1 + 3 / 7, 297 / 7);
  return {
    rejectedEquality: '41+1+1 != 297/7',
    typedSlots: ['BASE_STATION_41', 'FULL_STEP_1', 'RESIDUAL_SLOT_3_OVER_7'],
    exactReplacement: '41+1+3/7 = 297/7'
  };
});

check('L-01', 'All three preregistered lifts are injective and exactly reversible on their images', () => {
  for (const value of Object.values(profiles)) {
    assert.equal(value.imageStates, 1221);
    assert.equal(value.injective, true);
    assert.equal(value.roundTrips, true);
  }
  return profiles;
});

check('L-02', 'Only the address lift preserves unit open-grid adjacency', () => {
  assert.equal(profiles.interval.unitAdjacency, false);
  assert.equal(profiles.stride11.unitAdjacency, false);
  assert.equal(profiles.address.unitAdjacency, true);
  return {
    interval: { horizontal: profiles.interval.horizontalLengths, vertical: profiles.interval.verticalLengths },
    stride11: { horizontal: profiles.stride11.horizontalLengths, vertical: profiles.stride11.verticalLengths },
    address: { horizontal: profiles.address.horizontalLengths, vertical: profiles.address.verticalLengths }
  };
});

check('L-03', 'Only the stride-11 lift commutes with the global Janus reflection', () => {
  assert.equal(profiles.interval.janusCommutes, false);
  assert.equal(profiles.stride11.janusCommutes, true);
  assert.equal(profiles.address.janusCommutes, false);
  return Object.fromEntries(Object.entries(profiles).map(([id, value]) => [id, value.janusCommutes]));
});

check('L-04', 'Only stride-11 reaches both target-axis endpoints', () => {
  assert.equal(profiles.interval.targetEndpointCoverage, false);
  assert.equal(profiles.stride11.targetEndpointCoverage, true);
  assert.equal(profiles.address.targetEndpointCoverage, false);
  return Object.fromEntries(Object.entries(profiles).map(([id, value]) => [id, { covered: value.targetEndpointCoverage, range: value.uRange }]));
});

check('L-05', 'Axis swap is a distinct equally exact graph embedding', () => {
  const swap = ([a, b]) => [b, a];
  const image = new Set(vertices.map(swap).map(key));
  assert.equal(image.size, 1221);
  assert.ok(horizontalEdges.every(([x, y]) => manhattan(swap(x), swap(y)) === 1));
  assert.ok(verticalEdges.every(([x, y]) => manhattan(swap(x), swap(y)) === 1));
  assert.ok(vertices.some(vertex => key(swap(vertex)) !== key(candidates.address.map(vertex))));
  return { injective: true, unitAdjacency: true, identicalToAddressLift: false, implication: 'embedding is not unique without an orientation witness' };
});

check('L-06', 'A deterministic scrambled injection fails the structure controls', () => {
  const scramble = ([a, b]) => {
    const n = 111 * a + b;
    const s = (17 * n + 5) % 12321;
    return [Math.floor(s / 111), s % 111];
  };
  const image = new Set(vertices.map(scramble).map(key));
  assert.equal(image.size, 1221);
  assert.ok(horizontalEdges.some(([x, y]) => manhattan(scramble(x), scramble(y)) !== 1));
  assert.ok(verticalEdges.some(([x, y]) => manhattan(scramble(x), scramble(y)) !== 1));
  assert.ok(vertices.some(vertex => key(scramble(sourceJanus(vertex))) !== key(targetJanus(scramble(vertex)))));
  return { injective: true, unitAdjacency: false, janusCommutes: false, classification: 'NEGATIVE_CONTROL' };
});

check('O-01', 'The six-sector phi/pi candidate closes and satisfies Kawasaki exactly', () => {
  const fifths = [1, 2, 2, 1, 2, 2];
  const total = fifths.reduce((sum, value) => sum + value, 0);
  const odd = fifths[0] + fifths[2] + fifths[4];
  const even = fifths[1] + fifths[3] + fifths[5];
  assert.equal(total, 10);
  assert.equal(odd, 5);
  assert.equal(even, 5);
  return { sectorsInPiFifths: fifths, total: '2pi', alternatingOdd: 'pi', alternatingEven: 'pi' };
});

check('O-02', 'The declared mountain-valley count satisfies Maekawa', () => {
  const M = 4;
  const V = 2;
  assert.equal(M + V, 6);
  assert.equal(Math.abs(M - V), 2);
  return { M, V, difference: M - V, assignmentGeometry: 'OPEN' };
});

check('O-03', 'The pentagonal metric relation reproduces phi', () => {
  const phi = (1 + Math.sqrt(5)) / 2;
  const metric = 2 * Math.cos(Math.PI / 5);
  assert.ok(Math.abs(phi - metric) < 1e-14);
  return { phi, twoCosPiOver5: metric, absoluteError: Math.abs(phi - metric) };
});

check('O-04', 'A closure-preserving perturbation is rejected by Kawasaki', () => {
  const fiveHundredths = [101, 200, 200, 100, 200, 199];
  const total = fiveHundredths.reduce((sum, value) => sum + value, 0);
  const odd = fiveHundredths[0] + fiveHundredths[2] + fiveHundredths[4];
  const even = fiveHundredths[1] + fiveHundredths[3] + fiveHundredths[5];
  assert.equal(total, 1000);
  assert.notEqual(odd, even);
  assert.deepEqual([odd, even], [501, 499]);
  return { total: '2pi', alternatingOdd: '501pi/500', alternatingEven: '499pi/500', classification: 'NEGATIVE_CONTROL' };
});

check('O-05', 'The twelve-stage month-knuckle word gives a concrete Maekawa assignment', () => {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const word = days.map(value => value === 31 ? 'M' : 'V');
  const M = word.filter(value => value === 'M').length;
  const V = word.filter(value => value === 'V').length;
  assert.deepEqual(word, ['M', 'V', 'M', 'V', 'M', 'V', 'M', 'M', 'V', 'M', 'V', 'M']);
  assert.equal(M + V, 12);
  assert.equal(M, 7);
  assert.equal(V, 5);
  assert.equal(M - V, 2);
  assert.deepEqual(word.slice(6, 8), ['M', 'M']);
  return {
    days,
    word: word.join(''),
    groupedWord: 'MVMVMVM|MVMVM',
    M,
    V,
    difference: M - V,
    backjumpWitness: 'JUL_M -> AUG_M',
    interpretation: '31=knuckle peak; 28/29/30=gap; month lengths are state labels, not sector angles'
  };
});

check('O-06', 'Equal twelve-sector geometry closes and satisfies Kawasaki independently of month lengths', () => {
  const sectors = Array(12).fill(30);
  const total = sectors.reduce((sum, value) => sum + value, 0);
  const odd = sectors.filter((_, index) => index % 2 === 0).reduce((sum, value) => sum + value, 0);
  const even = sectors.filter((_, index) => index % 2 === 1).reduce((sum, value) => sum + value, 0);
  assert.equal(total, 360);
  assert.equal(odd, 180);
  assert.equal(even, 180);
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const dayOdd = monthDays.filter((_, index) => index % 2 === 0).reduce((sum, value) => sum + value, 0);
  const dayEven = monthDays.filter((_, index) => index % 2 === 1).reduce((sum, value) => sum + value, 0);
  assert.notEqual(dayOdd, dayEven);
  assert.deepEqual([dayOdd, dayEven], [184, 181]);
  return {
    sectorsInDegrees: sectors,
    alternatingOdd: 180,
    alternatingEven: 180,
    monthDayNegativeControl: [dayOdd, dayEven],
    classification: 'EQUAL_SECTOR_KAWASAKI_PASS / DAY_PROPORTIONAL_ANGLE_REJECTED'
  };
});

check('O-07', 'Two phantom boundaries extend the address rail without adding creases or faces', () => {
  const carrier = { physicalCreases: 12, physicalFacesAddedByPhantoms: 0, phantomBoundaries: 2 };
  const addressedSlots = carrier.physicalCreases + carrier.phantomBoundaries;
  assert.equal(addressedSlots, 14);
  assert.equal(carrier.physicalCreases, 12);
  assert.equal(carrier.physicalFacesAddedByPhantoms, 0);
  return {
    addressWord: '-1_PHANTOM | 12_REAL_FOLDS | +1_PHANTOM',
    addressedSlots,
    physicalCreases: carrier.physicalCreases,
    phantomFaceDelta: carrier.physicalFacesAddedByPhantoms,
    classification: 'BOUNDARY_WITNESSES_NOT_CREASES'
  };
});

check('O-08', 'The five valleys may be typed as four ordinary valleys plus one return valley without changing Maekawa', () => {
  const M = 7;
  const ordinaryV = 4;
  const returnV = 1;
  const V = ordinaryV + returnV;
  assert.equal(V, 5);
  assert.equal(M - V, 2);
  return {
    M,
    V,
    partition: '5V = 4V + 1V_return',
    maekawaDifference: M - V,
    returnValleyIndex: 'OPEN',
    mechanicalMeaning: 'UNTESTED'
  };
});

check('O-09', 'Phase arithmetic, pi wrapping and phi geometry remain distinct', () => {
  const phi = (1 + Math.sqrt(5)) / 2;
  const sevenPi = 7 * Math.PI;
  const wrapped = ((sevenPi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  assert.notEqual(sevenPi, 3);
  assert.ok(Math.abs(wrapped - Math.PI) < 1e-14);
  assert.equal(7 % 4, 3);
  assert.ok(Math.abs(2 * Math.cos(Math.PI / 5) - phi) < 1e-14);
  return {
    sevenPi,
    claimSevenPiEqualsThree: false,
    sevenPiModuloTwoPi: 'pi',
    sevenModuloFour: 3,
    phiContract: '2cos(pi/5)=phi',
    classification: 'PHASE_INDEX / ANGLE / METRIC_RATIO KEPT SEPARATE'
  };
});

check('O-10', 'Return-wave and fold-flip terminology is explicitly bounded', () => {
  const typing = {
    counterWave: 'REFLECTION',
    persistentInterference: 'STANDING_WAVE_CANDIDATE',
    bistableFoldFlip: 'SNAP_THROUGH_CANDIDATE',
    shapePreservingNonlinearPulse: 'SOLITON_REQUIRES_SEPARATE_PDE_EVIDENCE'
  };
  assert.equal(typing.counterWave, 'REFLECTION');
  assert.match(typing.bistableFoldFlip, /^SNAP_THROUGH/);
  assert.match(typing.shapePreservingNonlinearPulse, /REQUIRES_SEPARATE_PDE_EVIDENCE/);
  return {
    ...typing,
    energyLandscapeMeasured: false,
    bistabilityEstablished: false,
    solitonEstablished: false
  };
});

check('V-01', 'Mathfield and thread protocol retain the declared view vocabulary and claim ceiling', () => {
  const mathfield = fs.readFileSync(path.join(__dirname, 'A0_MATHEMATICAL_JOINTS.html'), 'utf8');
  const protocol = fs.readFileSync(path.join(__dirname, 'A0_COMPLEX_FOLD_18X23_SPLINTER_THREAD_RETURN_2026-11-09.md'), 'utf8');
  for (const marker of ['Lamellenverschluss', 'White Ghost Snake', 'MUND·I·AL', 'NEW ID 0', 'FINDING 0']) assert.ok(mathfield.includes(marker), marker);
  for (const marker of ['i-axis', 'A→A′', 'White Ghost Snake', 'MUND·I·AL', 'not yet a completed origami result']) assert.ok(protocol.includes(marker), marker);
  return { vocabularyBound: true, physicalMechanismClaim: false, newFinding: false };
});

check('V-02', 'Science Desk and Findings workspace expose the candidate ledger without promotion', () => {
  const desk = fs.readFileSync(path.join(__dirname, 'A0_RESEARCH_DESK.html'), 'utf8');
  const findings = fs.readFileSync(path.join(__dirname, '..', '32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md'), 'utf8');
  for (const marker of ['scc-003-complex-fold-finding-candidate-ledger-20261110', 'FC-1 · Projection collapse', 'FC-2 · Phantom boundary', 'FC-3 · Return valley', 'CANDIDATE ≠ FINDING', 'FINDING 0']) assert.ok(desk.includes(marker), marker);
  for (const marker of ['FC-1 — finite projection collapse', 'FC-2 — phantom address without carrier growth', 'FC-3 — return-valley role', 'Known mathematical gates, not new findings', 'NO FINDING PROMOTION']) assert.ok(findings.includes(marker), marker);
  return { candidatesVisible: 3, findingPromoted: false, studyActivated: false, graphDelta: 0 };
});

const failures = checks.filter(item => item.status === 'FAIL');
const result = {
  schema: 'a0.e06-1221-to-12321-lift.engineering-result.v1',
  executionDate: '2026-11-10',
  authority: {
    kind: 'OWNER_AUTHORIZED_A0_ENGINEERING_TEST',
    reuses: ['G11', 'G111', 'E06', 'A0_11X111_GRID_ELEVATOR', 'SCC-003'],
    labRun: false,
    studyActivated: false,
    navigatorIdentityCreated: false,
    canonicalRelationCreated: false,
    findingPromoted: false,
    publicationAuthorized: false
  },
  status: failures.length ? 'FAIL' : 'PASS_CLASSIFIED_MIXED_LIFT_AND_FOLD_GATES',
  summary: {
    pass: checks.length - failures.length,
    fail: failures.length,
    sourceStates: vertices.length,
    targetStates: 111 * 111,
    liftCandidates: Object.keys(candidates).length,
    singleWinner: false
  },
  result: {
    arithmeticBridge: 'EXACT',
    plateApproximation: 'N_BAND_EXACT_41_PLUS_1_PLUS_3_OVER_7 / PI_CONVERGENT_22_OVER_7 / PHI_CONVERGENT_8_OVER_5 / COMMON_FORMAT_NOT_COMMON_IDENTITY',
    liftClassification: {
      interval: 'INJECTIVE_RETURN / COARSE_10_STEP / MISSES_GLOBAL_ENDPOINT / JANUS_FAIL',
      stride11: 'INJECTIVE_RETURN / COARSE_11_STEP / ENDPOINT_PASS / JANUS_PASS',
      address: 'INJECTIVE_RETURN / UNIT_ADJACENCY_PASS / NARROW_STRIP / GLOBAL_JANUS_FAIL'
    },
    foldCandidate: 'SIX_SECTOR_KAWASAKI_PASS / TWELVE_STAGE_MONTH_KNUCKLE_MV_WORD_PASS / EQUAL_12_SECTOR_KAWASAKI_PASS / DAY_PROPORTIONAL_ANGLES_REJECTED / TWO_ZERO_FACE_PHANTOM_BOUNDARIES / 5V_PARTITIONED_AS_4V_PLUS_1V_RETURN / SNAP_THROUGH_AND_SOLITON_UNTESTED / RIGID_FOLD_AND_LAYER_ORDER_OPEN',
    interpretation: 'No candidate preserves every requested structure; the lift requires an explicit choice of invariant and an orientation or seam witness.'
  },
  profiles,
  checks
};

const outputPath = path.join(__dirname, 'results/a0-e06-1221-to-12321-lift-result-2026-11-10.json');
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
process.exitCode = failures.length ? 1 : 0;
