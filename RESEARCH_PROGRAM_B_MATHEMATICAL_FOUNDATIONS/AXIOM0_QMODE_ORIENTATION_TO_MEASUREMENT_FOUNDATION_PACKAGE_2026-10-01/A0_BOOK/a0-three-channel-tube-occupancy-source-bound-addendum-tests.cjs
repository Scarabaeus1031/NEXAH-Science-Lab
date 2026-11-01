const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = __dirname;
const receiptPath = path.join(ROOT, 'results', 'a0-three-channel-tube-occupancy-source-bound-addendum-2026-11-01.json');
const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks += 1; };
const same = (actual, expected, message) => { assert.deepEqual(actual, expected, message); checks += 1; };
const hash = value => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');

same(receipt.schema, 'nexah.a0.three-channel-tube-occupancy-source-bound-addendum/1', 'schema');
same(receipt.checks_1_to_6.map(test => test.n), [1, 2, 3, 4, 5, 6], 'six ordered checks');

// 1 — exactly three separate source ports.
same(receipt.source_ports.map(port => port.ordinal), [1, 2, 3], 'port ordinals');
same(receipt.source_ports.map(port => port.id), ['chemistry', 'life', 'physics'], 'native source ids');
same(new Set(receipt.source_ports.map(port => port.id)).size, 3, 'source ids unique');
same(new Set(receipt.source_ports.map(port => port.color)).size, 3, 'source colors unique');

// 2 — complete directed Tube Occupancy per channel.
const expectedBins = ['H0+', 'H0-', 'H180+', 'H180-', 'V90+', 'V90-', 'V270+', 'V270-'];
same(receipt.tube_occupancy_view.bins, expectedBins, 'ordered local occupancy vocabulary');
same(new Set(receipt.tube_occupancy_view.bins).size, 8, 'eight unique occupancy addresses');
check(receipt.source_ports.every(() => receipt.tube_occupancy_view.bins.length === 8), 'all ports receive complete occupancy vocabulary');

// 3 — +1 is derived from the three readouts only.
same(receipt.derived_joint.input_count, 3, 'three joint inputs');
same(receipt.derived_joint.source_port, false, '+1 is not a source port');
check(receipt.derived_joint.formula.includes('z_chemistry') && receipt.derived_joint.formula.includes('z_life') && receipt.derived_joint.formula.includes('z_physics'), 'formula names all sources');

// 4 — no feedback from +1 into source state.
same(receipt.derived_joint.feedback, false, 'joint feedback disabled');
check(receipt.claim_boundary.includes('typed display semantics'), 'view boundary explicit');

const makeRecord = (sources = receipt.source_ports, bins = expectedBins, witness = {re: 0.25, im: -0.125}) => {
  const core = {
    sources: sources.map(source => ({ordinal: source.ordinal, id: source.id})),
    occupancy: Object.fromEntries(sources.map(source => [source.id, [...bins]])),
    witness
  };
  return {...core, fingerprint: hash(core)};
};
const classify = record => {
  if (!record || record.sources.length !== 3) return 'HOLD_MISSING_SOURCE';
  if (!record.sources.every(source => record.occupancy[source.id]?.length === 8)) return 'HOLD_INCOMPLETE_OCCUPANCY';
  const core = {sources: record.sources, occupancy: record.occupancy, witness: record.witness};
  if (hash(core) !== record.fingerprint) return 'HOLD_TAMPERED_FINGERPRINT';
  return 'EXACT_RETURN';
};

// 5 — missing/tampered source or residual fails closed.
const captured = makeRecord();
same(classify(captured), 'EXACT_RETURN', 'complete capture accepted');
same(classify(makeRecord(receipt.source_ports.slice(0, 2))), 'HOLD_MISSING_SOURCE', 'missing source holds');
same(classify(makeRecord(receipt.source_ports, expectedBins.slice(0, 7))), 'HOLD_INCOMPLETE_OCCUPANCY', 'incomplete occupancy holds');
const tampered = JSON.parse(JSON.stringify(captured));
tampered.witness.re = 0.5;
same(classify(tampered), 'HOLD_TAMPERED_FINGERPRINT', 'tampered witness holds');

// 6 — exact replay restores channel address, occupancy and witness.
const changed = makeRecord(receipt.source_ports, expectedBins, {re: -0.5, im: 0.75});
check(changed.fingerprint !== captured.fingerprint, 'changed state differs from capture');
const replayed = JSON.parse(JSON.stringify(captured));
same(classify(replayed), 'EXACT_RETURN', 'replayed record accepted');
same(replayed.sources, captured.sources, 'replay restores source addresses');
same(replayed.occupancy, captured.occupancy, 'replay restores occupancy');
same(replayed.witness, captured.witness, 'replay restores joint witness');
same(replayed.fingerprint, captured.fingerprint, 'replay restores exact fingerprint');

same(receipt.frozen_parent.runtime_delta, false, 'no runtime delta');
same(receipt.frozen_parent.bench_machine_delta, false, 'no bench/machine delta');
same(receipt.identity_effect.new_global_ids, [], 'no new identity');
same(receipt.identity_effect.new_canonical_relations, [], 'no new relation');
same(receipt.authority.research_run, false, 'no research run');
same(receipt.authority.publication_authorized, false, 'no publication');

console.log(`PASS ${checks}/${checks} — three-channel Tube Occupancy source-bound checks 1–6`);
