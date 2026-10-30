'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const crystal = require('./a0-breathing-crystal-bench.js');
const panelV = require('./a0-lantern-panel-v-control-lens.js');
const udf = require('./a0-udf-orientation-return-profile.cjs');
const baseline = require('./a0-udf-orientation-return-prov-rocrate-baseline.cjs');
const lenses = require('./a0-udf-orientation-return-lens-suite.cjs');

const sourcePath = 'a0-breathing-crystal-bench.js';
const sourceHash = crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname, sourcePath))).digest('hex');
const makeUdf = (phase=.25, pair='ab') => udf.createPackage({orientation: crystal.orientationLedger(phase, pair), sourcePath, sourceHash});
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
const clone = value => structuredClone(value);
const find = (crate, id) => crate['@graph'].find(item => item['@id'] === id);
const referenceUdf = makeUdf();
const referenceBaseline = baseline.createBaseline(referenceUdf);
const referenceBaselineView = baseline.semanticView(referenceBaseline);
const udfStack = lenses.createStack(projectUdf(referenceUdf), 'UDF_A0');
const baselineStack = lenses.createStack(referenceBaselineView, 'PROV_ROCRATE');

function compressedSizes(text) {
  return {
    raw: Buffer.byteLength(text),
    gzip: zlib.gzipSync(text, {level: 9}).byteLength,
    brotli: zlib.brotliCompressSync(text, {params: {[zlib.constants.BROTLI_PARAM_QUALITY]: 11}}).byteLength
  };
}

const udfSizes = compressedSizes(udf.serialize(referenceUdf));
const baselineSizes = compressedSizes(baseline.serialize(referenceBaseline));
const compression = {
  status: 'PASS_MEASURED_NOT_INTERPRETED_AS_NOVELTY',
  semantic_queries: Object.keys(lenses.QUERY_DEPENDENCIES).length,
  udf: udfSizes,
  prov_rocrate: baselineSizes,
  udf_percent_of_baseline: Object.fromEntries(Object.keys(udfSizes).map(key => [key, Number((100 * udfSizes[key] / baselineSizes[key]).toFixed(2))])),
  note: 'Raw compactness is an engineering property. Gzip and Brotli reduce repeated JSON-LD vocabulary and are the fairer transport comparison.'
};

assert.deepEqual(lenses.auditAblation(udfStack), lenses.auditAblation(baselineStack));
const ablationRows = lenses.auditAblation(udfStack);
assert.ok(ablationRows.every(row => row.isolated));
const ablation = {
  status: 'PASS_7_OF_7_LENSES_ISOLATED',
  rows: ablationRows,
  loss_lens_state: udfStack.loss_lens.state,
  finding: 'The seven implemented lenses have isolated query consequences. Explicit retained/lost/added/unresolved semantics are not yet declared in the profile.'
};

const mutations = [
  ['01_PROFILE_OR_SCHEMA', u => { u.schema = 'bad'; }, b => { find(b, './').conformsTo['@id'] = 'bad'; }, /UDF_SCHEMA_UNSUPPORTED/, /BASELINE_PROFILE_INVALID/],
  ['02_PROFILE_STATE_OR_CONTEXT', u => { u.profile_state = 'FROZEN'; }, b => { b['@context'] = []; }, /UDF_PROFILE_STATE_INVALID/, /BASELINE_RO_CRATE_CONTEXT_REQUIRED/],
  ['03_SOURCE_IDENTITY', u => { u.source.identity = 'bad'; }, b => { find(b, '#source').identifier = 'bad'; }, /UDF_SOURCE_IDENTITY_INVALID/, /BASELINE_SOURCE_IDENTITY_INVALID/],
  ['04_SOURCE_CONTRACT', u => { u.source.contract = 'bad'; }, b => { find(b, '#source').additionalType = 'bad'; }, /UDF_SOURCE_CONTRACT_INVALID/, /BASELINE_SOURCE_CONTRACT_INVALID/],
  ['05_SOURCE_HASH', u => { u.source.sha256 = 'bad'; }, b => { find(b, '#source').sha256 = 'bad'; }, /UDF_SOURCE_HASH_INVALID/, /BASELINE_SOURCE_HASH_INVALID/],
  ['06_TARGET_IDENTITY', u => { u.target.identity = 'bad'; }, b => { find(b, '#target').identifier = 'bad'; }, /UDF_TARGET_IDENTITY_INVALID/, /BASELINE_TARGET_IDENTITY_INVALID/],
  ['07_TARGET_CONTRACT', u => { u.target.contract = 'bad'; }, b => { find(b, '#target').additionalType = 'bad'; }, /UDF_TARGET_CONTRACT_INVALID/, /BASELINE_TARGET_CONTRACT_INVALID/],
  ['08_PAIR', u => { u.frame.pair = 'zz'; }, b => { find(b, '#frame')['a0:pair'] = 'zz'; }, /UDF_PAIR_INVALID/, /BASELINE_PAIR_INVALID/],
  ['09_PIN_ROLE', u => { u.frame.pin.role = 'MOVING'; }, b => { find(b, '#frame')['a0:pinRole'] = 'MOVING'; }, /UDF_PIN_INVALID/, /BASELINE_PIN_ROLE_INVALID/],
  ['10_HORIZONTAL_NODE', u => { u.frame.horizontal_axis.node = 'bad'; }, b => { find(b, '#frame')['a0:horizontalAxisNode'] = 'bad'; }, /UDF_HORIZONTAL_NODE_INVALID/, /BASELINE_HORIZONTAL_NODE_INVALID/],
  ['11_VERTICAL_NODE', u => { u.frame.vertical_axis.node = 'bad'; }, b => { find(b, '#frame')['a0:verticalAxisNode'] = 'bad'; }, /UDF_VERTICAL_NODE_INVALID/, /BASELINE_VERTICAL_NODE_INVALID/],
  ['12_THETA', u => { u.frame.theta_degrees = null; }, b => { find(b, '#frame')['a0:thetaDegrees'] = null; }, /UDF_THETA_INVALID/, /BASELINE_THETA_INVALID/],
  ['13_RADIUS', u => { u.frame.radius = 2; }, b => { find(b, '#frame')['a0:radius'] = 2; }, /UDF_RADIUS_INVALID/, /BASELINE_RADIUS_INVALID/],
  ['14_WINDING', u => { u.frame.winding = 0; }, b => { find(b, '#frame')['a0:winding'] = 0; }, /UDF_WINDING_INVALID/, /BASELINE_WINDING_INVALID/],
  ['15_DIRECTION', u => { u.frame.direction = 'CCW'; }, b => { find(b, '#frame')['a0:direction'] = 'CCW'; }, /UDF_DIRECTION_INVALID/, /BASELINE_DIRECTION_INVALID/],
  ['16_EXIT_COMPARATOR', u => { u.comparators.exit.angle_degrees = 46; }, b => { find(b, '#exit').value = 46; }, /UDF_EXIT_COMPARATOR_INVALID/, /BASELINE_EXIT_COMPARATOR_INVALID/],
  ['17_RETURN_COMPARATOR', u => { u.comparators.return.angle_degrees = 359; }, b => { find(b, '#return-axis').value = 359; }, /UDF_RETURN_COMPARATOR_INVALID/, /BASELINE_RETURN_COMPARATOR_INVALID/],
  ['18_RETURN_TARGET', u => { u.return.target = 'bad'; }, b => { find(b, '#return').target = 'bad'; }, /UDF_RETURN_INVALID/, /BASELINE_RETURN_INVALID/],
  ['19_SOURCE_MUTATION', u => { u.return.source_mutation = true; }, b => { find(b, '#return')['a0:sourceMutation'] = true; }, /UDF_RETURN_INVALID/, /BASELINE_RETURN_INVALID/],
  ['20_NEW_CANONICAL_ID', u => { u.new_canonical_ids.push('NEW'); }, b => { find(b, '#return')['a0:newCanonicalIds'].push('NEW'); }, /UDF_NEW_ID_FORBIDDEN/, /BASELINE_NEW_ID_FORBIDDEN/],
  ['21_RELATION_CHANGE', u => { u.relation_changes.push('NEW'); }, b => { find(b, '#return')['a0:relationChanges'].push('NEW'); }, /UDF_RELATION_CHANGE_FORBIDDEN/, /BASELINE_RELATION_CHANGE_FORBIDDEN/]
];

const errorRows = mutations.map(([id, mutateUdf, mutateBaseline, udfPattern, baselinePattern]) => {
  const u = clone(referenceUdf), b = clone(referenceBaseline);
  mutateUdf(u); mutateBaseline(b);
  assert.throws(() => udf.validate(u), udfPattern);
  assert.throws(() => baseline.validate(b), baselinePattern);
  return {id, udf: 'REJECT_PRECISE', prov_rocrate: 'REJECT_PRECISE', result: 'TIE'};
});
assert.throws(() => udf.parse('{'), /UDF_JSON_INVALID/);
assert.throws(() => baseline.parse('{'), /BASELINE_JSON_INVALID/);
errorRows.push({id: '22_INVALID_JSON', udf: 'REJECT_PRECISE', prov_rocrate: 'REJECT_PRECISE', result: 'TIE'});
const errorBattery = {status: 'PASS_22_OF_22_MATCHED_REJECTIONS', rows: errorRows, udf_wins: 0, baseline_wins: 0, ties: 22};

const udfConsistency = lenses.consistency(udfStack);
const baselineConsistency = lenses.consistency(baselineStack);
assert.equal(udfConsistency.status, 'PASS_LENS_CONSISTENCY');
assert.deepEqual(udfConsistency, baselineConsistency);
const consistency = {status: 'PASS_7_OF_7_CROSS_LENS_CONSISTENCY', udf: udfConsistency, prov_rocrate: baselineConsistency};

const panelSequence = [0, .125, .375, .5, .625, .875, 1].map(progress => panelV.sample('CERTIFIED_147_5', progress));
const panelReceipt = panelV.receipt('CERTIFIED_147_5', panelSequence);
assert.equal(panelReceipt.exactReturn, true);
let panelError = null;
try {
  udf.createPackage({orientation: panelReceipt, sourcePath: 'a0-lantern-panel-v-control-lens.js', sourceHash});
} catch (error) {
  panelError = error.message;
}
assert.equal(panelError, 'UDF_ORIENTATION_LEDGER_REQUIRED');
const secondInstrument = {
  status: 'FAIL_CLOSED_CURRENT_PROFILE_NOT_PORTABLE',
  source: 'A0_PANEL_V_CONTROL_LENS_RETURN_V1',
  source_shape: {channels: panelReceipt.channels.length, events: panelReceipt.events.length, target_degrees: panelReceipt.targetDegrees, exact_return: panelReceipt.exactReturn},
  rejection: panelError,
  interpretation: 'Panel V is a genuinely different five-channel outbound/return event sequence. Reusing the Crystal-specific plane-orientation profile would require a semantic profile extension and is therefore correctly rejected.',
  new_profile_authorized: false
};

const incompleteCases = [
  ['UNKNOWN_VERTICAL_NODE', u => { u.frame.vertical_axis.node = null; }, b => { find(b, '#frame')['a0:verticalAxisNode'] = null; }],
  ['UNOBSERVED_THETA', u => { u.frame.theta_degrees = null; }, b => { find(b, '#frame')['a0:thetaDegrees'] = null; }],
  ['UNRESOLVED_WINDING', u => { u.frame.winding = 'UNRESOLVED'; }, b => { find(b, '#frame')['a0:winding'] = 'UNRESOLVED'; }],
  ['UNKNOWN_RETURN_TARGET', u => { u.return.target = null; }, b => { find(b, '#return').target = null; }],
  ['UNOBSERVED_SOURCE_HASH', u => { u.source.sha256 = null; }, b => { find(b, '#source').sha256 = null; }]
];
const incompleteRows = incompleteCases.map(([id, mutateUdf, mutateBaseline]) => {
  const u = clone(referenceUdf), b = clone(referenceBaseline);
  mutateUdf(u); mutateBaseline(b);
  assert.throws(() => udf.validate(u));
  assert.throws(() => baseline.validate(b));
  return {id, udf: 'REJECT', prov_rocrate: 'REJECT', explicit_state_preserved: false};
});
const incompleteStates = {
  status: 'FAIL_CLOSED_5_OF_5_NULL_CASES_BUT_STATE_VOCABULARY_ABSENT',
  rows: incompleteRows,
  finding: 'Both validators fail closed, but neither current profile distinguishes UNKNOWN, UNOBSERVED, UNRESOLVED and NOT_APPLICABLE as first-class values.'
};

const fixtureA = baseline.parse(baseline.serialize(referenceBaseline));
const fixtureB = udf.parse(udf.serialize(referenceUdf));
const questionnaire = [
  {id: 'H01', prompt: 'Name the source identity.', gold: referenceUdf.source.identity, points: 1},
  {id: 'H02', prompt: 'Name the source contract and SHA-256.', gold: {contract: referenceUdf.source.contract, sha256: referenceUdf.source.sha256}, points: 2},
  {id: 'H03', prompt: 'Name horizontal and vertical carrier nodes.', gold: {horizontal: referenceUdf.frame.horizontal_axis.node, vertical: referenceUdf.frame.vertical_axis.node}, points: 2},
  {id: 'H04', prompt: 'Report theta, radius, direction and winding.', gold: {theta_degrees: referenceUdf.frame.theta_degrees, radius: referenceUdf.frame.radius, direction: referenceUdf.frame.direction, winding: referenceUdf.frame.winding}, tolerance: 1e-12, points: 4},
  {id: 'H05', prompt: 'Are the Crystal vector, RE Exit and DO-prime Return identical?', gold: false, points: 1},
  {id: 'H06', prompt: 'Name the exact Return target and anchor.', gold: {target: referenceUdf.return.target, anchor: referenceUdf.return.anchor}, points: 2},
  {id: 'H07', prompt: 'Does the record mutate the source?', gold: false, points: 1},
  {id: 'H08', prompt: 'Name one prohibited inference from the claim boundary.', gold_rule: 'Any one of universal schema, capability, shared mechanism, GLB mutation, Study, Finding or publication.', points: 1}
];
const humanProtocol = {
  schema: 'nexah.a0.udf-orientation-return-human-reconstruction-protocol/1.0.0',
  date: '2026-10-30',
  state: 'READY_NOT_RUN_NO_HUMAN_RESULT',
  design: 'WITHIN_SUBJECT_COUNTERBALANCED_SINGLE_BLIND_TO_HYPOTHESIS',
  fixtures: ['a0-udf-human-reconstruction-fixture-a-2026-10-30.json', 'a0-udf-human-reconstruction-fixture-b-2026-10-30.json'],
  custody_key_file: 'a0-udf-human-reconstruction-custody-key-2026-10-30.json',
  measures: ['exact_score_0_to_14', 'completion_seconds', 'false_identity_count', 'false_release_count', 'unnecessary_stop_count', 'confidence_1_to_5'],
  questionnaire,
  counterbalance: 'Odd participant IDs receive A then B; even participant IDs receive B then A.',
  stop_rule: 'No claim from fewer than 8 completed participants; stop superiority language on tie, worse UDF result, unblinding, unequal instructions or missing timing.',
  claim_boundary: 'Protocol preparation is not an independent Human test, utility result or scientific activation.'
};

const resultDir = path.join(__dirname, 'results');
fs.writeFileSync(path.join(resultDir, 'a0-udf-human-reconstruction-fixture-a-2026-10-30.json'), baseline.serialize(fixtureA));
fs.writeFileSync(path.join(resultDir, 'a0-udf-human-reconstruction-fixture-b-2026-10-30.json'), udf.serialize(fixtureB));
fs.writeFileSync(path.join(resultDir, 'a0-udf-human-reconstruction-custody-key-2026-10-30.json'), `${JSON.stringify({
  schema: 'nexah.a0.udf-orientation-return-human-reconstruction-custody-key/1.0.0',
  state: 'CUSTODY_ONLY_WITHHOLD_FROM_PARTICIPANTS_UNTIL_SCORING',
  fixture_a: 'PROV_ROCRATE_BASELINE',
  fixture_b: 'UDF_A0',
  hypothesis: 'UDF_A0 may reduce reconstruction time or errors without increasing false release or unnecessary STOP.'
}, null, 2)}\n`);
fs.writeFileSync(path.join(resultDir, 'a0-udf-orientation-return-human-reconstruction-protocol-2026-10-30.json'), `${JSON.stringify(humanProtocol, null, 2)}\n`);

const receipt = {
  schema: 'nexah.a0.udf-orientation-return-lens-campaign/1.0.0',
  date: '2026-10-30',
  status: 'COMPLETE_6_ENGINEERING_TESTS_PLUS_1_HUMAN_PROTOCOL_READY_NOT_RUN',
  scope: 'BOUNDED_REPRODUCIBILITY_AND_DESIGN_FEASIBILITY_NO_STUDY_ACTIVATION',
  identity_reuse: ['NEXAH:INSTRUMENT:BREATHING_PRIME_CRYSTAL:V1', 'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH', 'ART:A0:MATHEMATICAL_JOINTS', 'MOD:TESSAREC'],
  tests: {
    '01_compression': compression,
    '02_lens_ablation': ablation,
    '03_error_battery': errorBattery,
    '04_cross_lens_consistency': consistency,
    '05_second_instrument': secondInstrument,
    '06_incomplete_states': incompleteStates,
    '07_human_reconstruction': {state: humanProtocol.state, protocol: 'results/a0-udf-orientation-return-human-reconstruction-protocol-2026-10-30.json', result: null}
  },
  overall_findings: [
    'UDF is materially smaller in raw form; transport compression narrows the advantage and must be reported separately.',
    'Seven current lenses are query-separable and internally consistent for the Crystal case.',
    'The strong baseline matches all 22 corruption rejections when given an equally explicit profile.',
    'The current UDF profile is not portable to Panel V and correctly fails closed.',
    'The current UDF profile lacks first-class UNKNOWN/UNOBSERVED/UNRESOLVED/NOT_APPLICABLE semantics.',
    'No Human reconstruction result exists until the prepared protocol is independently run.'
  ],
  new_canonical_ids: [],
  relation_changes: [],
  capability_status: 'NOT_ASSIGNED',
  science_disposition: 'ENGINEERING_EVIDENCE_AND_GAP_LOCALIZATION_NOT_F_A0_FINDING',
  next_permitted_design_question: 'Define, but do not yet freeze, a minimal profile-family core separating common source/return/claim lenses from instrument-specific orientation or event-sequence profiles.',
  claim_boundary: 'This campaign tests one implemented profile and prepares one Human protocol. It establishes no novelty, superiority, general UDF format, cross-instrument portability, independent utility, Study result, product capability or publication state.'
};

fs.writeFileSync(path.join(resultDir, 'a0-udf-orientation-return-lens-campaign-2026-10-30.json'), `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify(receipt));
