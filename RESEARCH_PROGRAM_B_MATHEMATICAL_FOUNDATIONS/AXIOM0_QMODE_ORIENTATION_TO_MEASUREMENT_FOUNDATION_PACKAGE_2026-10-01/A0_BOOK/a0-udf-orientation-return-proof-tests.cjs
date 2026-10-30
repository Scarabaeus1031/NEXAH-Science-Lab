'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const crystal = require('./a0-breathing-crystal-bench.js');
const spin = require('./a0-spin-to-bloom-measurement.js');
const udf = require('./a0-udf-orientation-return-profile.cjs');

const sourcePath = 'a0-breathing-crystal-bench.js';
const sourceHash = crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname, sourcePath))).digest('hex');
const make = (phase, pair) => udf.createPackage({orientation: crystal.orientationLedger(phase, pair), sourcePath, sourceHash});
const proofs = [];
const proof = (id, run) => {
  run();
  proofs.push({id, status: 'PASS'});
};

proof('01_DETERMINISTIC_SERIALIZATION_AND_HASH', () => {
  const first = make(.25, 'ab');
  const second = make(.25, 'ab');
  assert.equal(udf.serialize(first), udf.serialize(second));
  assert.equal(udf.digest(first), udf.digest(second));
  assert.match(udf.digest(first), /^[a-f0-9]{64}$/);
});

proof('02_LOSSLESS_CRYSTAL_UDF_V12_LEDGER_ROUNDTRIP', () => {
  const before = make(.25, 'ab');
  const loaded = udf.parse(udf.serialize(before));
  const adapter = spin.v12CrystalOrientationAdapter(udf.toAdapterInput(loaded));
  assert.equal(adapter.pair, before.frame.pair);
  assert.equal(adapter.mapping.horizontalAxis.source, before.frame.horizontal_axis.node);
  assert.equal(adapter.mapping.verticalAxis.source, before.frame.vertical_axis.node);
  assert.ok(Math.abs(adapter.mapping.currentVector.thetaDegrees - before.frame.theta_degrees) < 1e-12);
  assert.equal(adapter.mapping.currentVector.radius, before.frame.radius);
  assert.equal(adapter.mapping.currentVector.winding, before.frame.winding);
  assert.equal(adapter.mapping.currentVector.direction, before.frame.direction);
  assert.equal(loaded.return.target, 'CRYSTAL_ORIENTATION_LEDGER');
  assert.equal(loaded.return.source_mutation, false);
});

proof('03_AB_BC_CA_PROFILE_INVARIANCE', () => {
  const expected = {ab: ['BAND_0.429', 'BAND_0.456'], bc: ['BAND_0.456', 'BAND_0.487'], ca: ['BAND_0.487', 'BAND_0.429']};
  for (const pair of Object.keys(expected)) {
    const record = udf.parse(udf.serialize(make(.375, pair)));
    assert.equal(record.frame.pair, pair);
    assert.deepEqual([record.frame.horizontal_axis.node, record.frame.vertical_axis.node], expected[pair]);
    assert.equal(record.schema, udf.SCHEMA);
  }
});

proof('04_NEGATIVE_AND_MALFORMED_INPUT_REJECTION', () => {
  const base = JSON.parse(udf.serialize(make(.25, 'ab')));
  const cases = [
    [record => { record.source.sha256 = 'bad'; }, /UDF_SOURCE_HASH_INVALID/],
    [record => { record.frame.pair = 'zz'; }, /UDF_PAIR_INVALID/],
    [record => { delete record.frame.vertical_axis; }, /UDF_VERTICAL_NODE_INVALID/],
    [record => { record.frame.winding = 0; }, /UDF_WINDING_INVALID/],
    [record => { record.comparators.exit.angle_degrees = 46; }, /UDF_EXIT_COMPARATOR_INVALID/]
  ];
  for (const [mutate, pattern] of cases) {
    const candidate = structuredClone(base);
    mutate(candidate);
    assert.throws(() => udf.validate(candidate), pattern);
  }
  assert.throws(() => udf.parse('{'), /UDF_JSON_INVALID/);
});

proof('05_SEMANTIC_AXIS_AND_VECTOR_SEPARATION', () => {
  const record = make(.25, 'ab');
  const adapter = spin.v12CrystalOrientationAdapter(udf.toAdapterInput(record));
  assert.equal(record.comparators.exit.role, 'V12_FIXED_EXIT_COMPARATOR');
  assert.equal(record.comparators.return.role, 'V12_FIXED_RETURN_COMPARATOR');
  assert.notEqual(record.comparators.exit.role, record.comparators.return.role);
  assert.notEqual(adapter.mapping.currentVector.thetaDegrees, record.comparators.exit.angle_degrees);
  assert.notEqual(adapter.mapping.currentVector.thetaDegrees, record.comparators.return.angle_degrees);
  assert.equal(adapter.sharedMechanismEstablished, false);
  assert.deepEqual(record.new_canonical_ids, []);
  assert.deepEqual(record.relation_changes, []);
});

const reference = make(.25, 'ab');
const receipt = {
  schema: 'nexah.a0.udf-orientation-return-proof/1.0.0',
  date: '2026-10-30',
  status: proofs.every(item => item.status === 'PASS') ? 'PASS_5_OF_5_BOUNDED_UDF_ORIENTATION_RETURN_PROOFS' : 'FAIL',
  profile: udf.SCHEMA,
  profile_state: 'EXPERIMENTAL_NOT_FROZEN',
  source_identity: reference.source.identity,
  target_identity: reference.target.identity,
  reference_digest: udf.digest(reference),
  proofs,
  tested_pairs: Object.keys(udf.PAIR_NODES),
  new_canonical_ids: [],
  relation_changes: [],
  capability_status: 'NOT_ASSIGNED',
  science_disposition: 'IMPLEMENTATION_EVIDENCE_NOT_F_A0_FINDING',
  claim_boundary: reference.claim_boundary
};
fs.writeFileSync(path.join(__dirname, 'results/a0-udf-orientation-return-proof-2026-10-30.json'), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt));
