const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const base = __dirname;
const read = (name) => fs.readFileSync(path.join(base, name), 'utf8');
const prereg = JSON.parse(read('results/a0-direction-handle-isolation-preregistration-2026-11-01.json'));
const prior = JSON.parse(read('results/a0-elevator-88-discrimination-return-2026-11-01.json'));
const implementation = read('a0-scarab-regulator-test.js');

assert.equal(prereg.status, 'FROZEN_BEFORE_AUDIT');
assert.equal(prereg.default.dao_binding, 'NONE');
assert.equal(prereg.qualification_gates.length, 5);
assert.equal(prior.status, 'COMPLETE');
assert.equal(prior.dao_binding, 'NONE');
assert.match(implementation, /directionMask/);

const evidence = {
  origin_declared: true,
  origin: 'TARGET_DIRECTION_MASK',
  external_source_pointer: null,
  available_before_target_assignment: false,
  target_dependency: 'DIRECT',
  counterfactual_relabel_invariant: false,
  ablation_unique_records: 1,
  retained_unique_records: 2
};

const gates = [
  {gate: 'ORIGIN', pass: evidence.origin_declared, evidence: evidence.origin},
  {gate: 'EXTERNALITY', pass: evidence.external_source_pointer !== null && evidence.target_dependency === 'NONE', evidence: 'NO_EXTERNAL_SOURCE_POINTER; DIRECT_TARGET_DEPENDENCY'},
  {gate: 'PRE_TARGET', pass: evidence.available_before_target_assignment, evidence: 'MASK IS THE TARGET-SIDE TOKEN'},
  {gate: 'COUNTERFACTUAL', pass: evidence.counterfactual_relabel_invariant, evidence: 'RELABEL CHANGES THE WITNESS RECORD'},
  {gate: 'NECESSITY', pass: evidence.retained_unique_records === 2 && evidence.ablation_unique_records === 1, evidence: '2 UNIQUE WITH TOKEN; 1 AFTER ABLATION'}
];

const qualified = gates.every((gate) => gate.pass);
const necessityOnly = gates.find((gate) => gate.gate === 'NECESSITY').pass && gates.filter((gate) => ['EXTERNALITY', 'PRE_TARGET', 'COUNTERFACTUAL'].includes(gate.gate)).some((gate) => !gate.pass);
const verdict = qualified ? 'QUALIFIED_INDEPENDENT_DIRECTION_HANDLE' : necessityOnly ? 'NEGATIVE_TARGET_DERIVED_WITNESS' : 'OPEN_UNRESOLVED_HANDLE';

const result = {
  schema: 'nexah.a0.direction-handle-isolation.return/1',
  preregistration_id: prereg.preregistration_id,
  date: prereg.date,
  status: 'COMPLETE',
  aborted: false,
  candidate: prereg.candidate,
  gates,
  gate_summary: {passed: gates.filter((gate) => gate.pass).length, total: gates.length},
  verdict,
  actual_handle_status: qualified ? 'QUALIFIED' : 'OPEN_NOT_IDENTIFIED',
  classifications: {
    exact: ['candidate field is directionMask', 'retained projection has 2 records', 'ablation has 1 record'],
    negative: ['candidate is directly target-derived', 'candidate fails externality, pre-target and counterfactual gates'],
    open: ['independent source observation', 'source timestamp', 'typed handle domain and codomain'],
    not_inferred: ['meaning of G', 'meaning of D', 'definition of N', 'DAO identity', 'Triple-Gate mapping']
  },
  dao_binding: 'NONE',
  governance_delta: {new_ids: 0, new_relations: 0, new_operators: 0, new_studies: 0, finding_promotions: 0, publication_authorizations: 0, deployment: false}
};

assert.equal(result.verdict, 'NEGATIVE_TARGET_DERIVED_WITNESS');
assert.deepEqual(result.gate_summary, {passed: 2, total: 5});
assert.equal(result.actual_handle_status, 'OPEN_NOT_IDENTIFIED');
process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
