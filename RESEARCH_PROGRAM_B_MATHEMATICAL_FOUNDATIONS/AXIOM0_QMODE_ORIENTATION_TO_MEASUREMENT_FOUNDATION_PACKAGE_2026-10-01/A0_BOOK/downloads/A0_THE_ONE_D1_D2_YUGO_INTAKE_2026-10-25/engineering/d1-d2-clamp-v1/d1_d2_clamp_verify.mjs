import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const result = JSON.parse(readFileSync(join(here, 'D1_D2_CLAMP_TEST_RESULTS.json'), 'utf8'));
let checks = 0;
const check = (condition, message) => { checks += 1; assert.ok(condition, message); };
const equal = (actual, expected, message) => { checks += 1; assert.deepEqual(actual, expected, message); };

equal(result.schema, 'nexah.a0.d1-d2-clamp-engineering-test/1', 'schema');
equal(result.classification, 'BOUNDED_SOURCE_BOUND_ENGINEERING_TEST / NO SCIENCE RUN', 'classification');
equal(result.identity.newCanonicalIds, [], 'no new canonical IDs');
equal(result.identity.relationChanges, [], 'no relation changes');
equal(result.parameters.bearingX, [-0.16, 0.16], 'received D1/D2 locations retained');
equal([result.parameters.angleMinDeg, result.parameters.angleMaxDeg], [-34, 34], 'bounded angle range');
equal(result.method.sampleCount, 1361, 'complete 0.05 degree sample set');
equal(result.rows.length, 1361, 'one record per angle sample');
equal([result.rows[0].angleDeg, result.rows.at(-1).angleDeg], [-34, 34], 'both path endpoints included');
check(result.method.betweenSamplePointMotionBound > 0, 'between-sample bound declared');
equal(result.method.formalIntervalCertification, false, 'not represented as formal interval proof');
equal(result.negativeBaseline.status, 'COLLISION', 'closed-ring negative retained');
equal(result.negativeBaseline.affectedSamples, 1361, 'closed-ring collision spans whole sampled path');
equal(result.candidate.status, 'PASS_BOUNDED_GEOMETRIC_CLEARANCE', 'C-open candidate status');
check(result.candidate.openingMargin.sampledDeg > 0, 'C-opening angular margin positive');
check(result.candidate.shaftBoreRadialClearance > 0, 'shaft/bore clearance positive');
check(result.candidate.bearingToMovingSleeveAxialGap > 0, 'sleeve/bearing axial gap positive');
for (const [name, reading] of Object.entries(result.candidate.pathBounds)) {
  check(reading.continuousLowerBound > result.parameters.numericTolerance, `${name} continuous lower bound positive`);
}
check(result.candidate.minimumHardwareExternalGap > 0, 'hardware external clearance positive');
equal(result.forceBoundary.resultantVerticalForce, '0 under received 3x1 - 2x1.5 scaling', 'received force balance retained');
check(Math.abs(result.forceBoundary.hingeMomentAtMinus34) > 0, 'negative-angle hinge moment remains non-zero');
check(Math.abs(result.forceBoundary.hingeMomentAtPlus34) > 0, 'positive-angle hinge moment remains non-zero');
equal(result.geometry.crownState, 'FIXED_AT_HALF_CONTACT_FOLD', 'crown fixed');
equal(result.geometry.lidState, 'FIXED / NO ADDED LID BODY', 'lid fixed; no extra axis');

const glb = readFileSync(join(here, 'NEXAH_D1_D2_CLAMP_CANDIDATE_2026-10-25.glb'));
equal(glb.subarray(0, 4).toString('ascii'), 'glTF', 'GLB magic');
equal(glb.readUInt32LE(4), 2, 'GLB version');
equal(glb.readUInt32LE(8), glb.length, 'GLB declared length');
check(statSync(join(here, 'D1_D2_CLAMP_VISUAL.svg')).size > 1000, 'SVG visual exists');
check(statSync(join(here, 'D1_D2_CLAMP_VISUAL.png')).size > 1000, 'PNG visual exists');

console.log(JSON.stringify({
  status: 'PASS',
  checks,
  result: result.candidate.status,
  negativeBaseline: result.negativeBaseline.status,
  sampleCount: result.method.sampleCount,
  angleRangeDeg: [result.parameters.angleMinDeg, result.parameters.angleMaxDeg],
  scope: 'bounded D1-D2 fixed-frame clamp geometry; no science run'
}));
