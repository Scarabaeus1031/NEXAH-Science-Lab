'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const crystal = require('./a0-breathing-crystal-bench.js');
const udf = require('./a0-udf-orientation-return-profile.cjs');
const baseline = require('./a0-udf-orientation-return-prov-rocrate-baseline.cjs');

const sourcePath = 'a0-breathing-crystal-bench.js';
const sourceHash = crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname, sourcePath))).digest('hex');
const makeUdf = (phase, pair) => udf.createPackage({orientation: crystal.orientationLedger(phase, pair), sourcePath, sourceHash});
const projectUdf = record => ({
  source: record.source,
  target: record.target,
  frame: record.frame,
  comparators: record.comparators,
  return: record.return,
  new_canonical_ids: record.new_canonical_ids,
  relation_changes: record.relation_changes,
  claim_boundary: record.claim_boundary
});

const checks = [];
function check(id, run) {
  const detail = run();
  checks.push({id, udf: 'PASS', prov_rocrate: 'PASS', result: 'TIE', detail});
}

const referenceUdf = makeUdf(.25, 'ab');
const referenceBaseline = baseline.createBaseline(referenceUdf);

check('01_EQUAL_INFORMATION_INPUT', () => {
  assert.deepEqual(baseline.semanticView(referenceBaseline), projectUdf(referenceUdf));
  return 'Both records expose the same source, target, frame, comparator, Return and boundary information.';
});

check('02_DETERMINISTIC_SERIALIZATION_AND_DIGEST', () => {
  assert.equal(udf.serialize(referenceUdf), udf.serialize(makeUdf(.25, 'ab')));
  assert.equal(baseline.serialize(referenceBaseline), baseline.serialize(baseline.createBaseline(makeUdf(.25, 'ab'))));
  assert.match(udf.digest(referenceUdf), /^[a-f0-9]{64}$/);
  assert.match(baseline.digest(referenceBaseline), /^[a-f0-9]{64}$/);
  return 'Both encodings serialize and hash deterministically.';
});

check('03_SOURCE_TARGET_AND_PROVENANCE_RECOVERY', () => {
  const udfLoaded = udf.parse(udf.serialize(referenceUdf));
  const baselineLoaded = baseline.semanticView(baseline.parse(baseline.serialize(referenceBaseline)));
  assert.deepEqual(baselineLoaded.source, udfLoaded.source);
  assert.deepEqual(baselineLoaded.target, udfLoaded.target);
  return 'Both recover source identity, source contract, path, hash, target identity and target contract.';
});

check('04_ORIENTATION_ROLES_AND_NUMERIC_ROUNDTRIP', () => {
  for (const pair of ['ab', 'bc', 'ca']) {
    for (const phase of [0, .125, .25, .375, .5, .875, 1]) {
      const udfRecord = udf.parse(udf.serialize(makeUdf(phase, pair)));
      const baselineRecord = baseline.semanticView(baseline.parse(baseline.serialize(baseline.createBaseline(udfRecord))));
      assert.equal(baselineRecord.frame.pair, udfRecord.frame.pair);
      assert.deepEqual(baselineRecord.frame.pin, udfRecord.frame.pin);
      assert.deepEqual(baselineRecord.frame.horizontal_axis, udfRecord.frame.horizontal_axis);
      assert.deepEqual(baselineRecord.frame.vertical_axis, udfRecord.frame.vertical_axis);
      assert.ok(Math.abs(baselineRecord.frame.theta_degrees - udfRecord.frame.theta_degrees) < 1e-12);
      assert.ok(Math.abs(baselineRecord.frame.radius - udfRecord.frame.radius) < 1e-12);
      assert.equal(baselineRecord.frame.winding, udfRecord.frame.winding);
      assert.equal(baselineRecord.frame.direction, udfRecord.frame.direction);
    }
  }
  return 'Both preserve AB/BC/CA role assignments and 21 sampled frames within 1e-12.';
});

check('05_COMPARATOR_RETURN_AND_NON_IDENTITY_RECOVERY', () => {
  const baselineView = baseline.semanticView(referenceBaseline);
  assert.deepEqual(baselineView.comparators, referenceUdf.comparators);
  assert.deepEqual(baselineView.return, referenceUdf.return);
  assert.deepEqual(baselineView.new_canonical_ids, []);
  assert.deepEqual(baselineView.relation_changes, []);
  assert.notEqual(baselineView.comparators.exit.role, baselineView.comparators.return.role);
  return 'Both keep the Crystal vector, RE Exit, DO-prime Return, source mutation and identity boundaries separate.';
});

check('06_MATCHED_LOSS_LOCALIZATION_AND_REJECTION', () => {
  const udfBroken = JSON.parse(udf.serialize(referenceUdf));
  delete udfBroken.frame.vertical_axis;
  assert.throws(() => udf.validate(udfBroken), /UDF_VERTICAL_NODE_INVALID/);
  const baselineBroken = JSON.parse(baseline.serialize(referenceBaseline));
  delete baselineBroken['@graph'].find(item => item['@id'] === '#frame')['a0:verticalAxisNode'];
  assert.throws(() => baseline.validate(baselineBroken), /BASELINE_VERTICAL_NODE_INVALID/);
  return 'Both localize the matched missing vertical-axis node; neither gains by receiving more information.';
});

const udfBytes = Buffer.byteLength(udf.serialize(referenceUdf));
const baselineBytes = Buffer.byteLength(baseline.serialize(referenceBaseline));
const receipt = {
  schema: 'nexah.a0.udf-orientation-return-baseline-benchmark/1.0.0',
  date: '2026-10-30',
  status: checks.every(item => item.result === 'TIE') ? 'TIE_6_OF_6_NO_INCREMENTAL_INFORMATION_ADVANTAGE_ESTABLISHED' : 'REVIEW',
  scope: 'T6_PROVENANCE_INCREMENT_ENGINEERING_PREFLIGHT_NOT_ACTIVE_RESEARCH',
  candidate: {profile: udf.SCHEMA, bytes: udfBytes, digest: udf.digest(referenceUdf)},
  baseline: {
    profile: baseline.PROFILE,
    standards: ['RO-Crate 1.2 context', 'W3C PROV-O', 'Schema.org', 'A0 domain extension'],
    bytes: baselineBytes,
    digest: baseline.digest(referenceBaseline),
    fairness: 'EQUAL_INFORMATION_AND_EQUAL_DOMAIN_EXTENSION_PERMISSION'
  },
  checks,
  summary: {
    udf_wins: checks.filter(item => item.result === 'UDF_WIN').length,
    baseline_wins: checks.filter(item => item.result === 'BASELINE_WIN').length,
    ties: checks.filter(item => item.result === 'TIE').length,
    representation_result: 'NO_INCREMENTAL_INFORMATION_ADVANTAGE_FOR_UDF_IN_THIS_SINGLE_PROFILE_CASE',
    engineering_result: 'UDF_IS_MORE_COMPACT_AND_DOMAIN_DIRECT;_BASELINE_IS_STANDARD_PROVENANCE_CONTAINER_WITH_DOMAIN_EXTENSION',
    next_evidence_gate: 'SECOND_GENUINELY_DIFFERENT_SOURCE_INSTRUMENT_OR_INDEPENDENT_HUMAN_RECONSTRUCTION_TEST'
  },
  new_canonical_ids: [],
  relation_changes: [],
  capability_status: 'NOT_ASSIGNED',
  science_disposition: 'VALIDATED_NEGATIVE_OR_NULL_ENGINEERING_PREFLIGHT_NOT_F_A0_FINDING',
  claim_boundary: 'This equal-information benchmark shows no informational or reconstruction advantage over a strong RO-Crate/W3C PROV-style baseline for one orientation profile. It does not establish novelty, inferiority, universal interchange, independent utility, a Study result, product capability or publication state.'
};

fs.writeFileSync(path.join(__dirname, 'results/a0-udf-orientation-return-baseline-benchmark-2026-10-30.json'), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt));
