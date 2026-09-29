#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const PACKAGE_DIR = __dirname;
const REPO_ROOT = path.resolve(PACKAGE_DIR, '../../..');
const BUNDLE_DIR = '/Users/tho2020/Documents/NEXAH ECOSYSTEM/00 EXECUTIVE/NEXAH-Mission-Control/ROEDELHEIM_OBSERVATORY_BUNDLE';
const OUTPUT_PATH = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(PACKAGE_DIR, 'h_q_state_update_source_audit_01_results.json');

const FILES = Object.freeze({
  preregistration: path.join(PACKAGE_DIR, '30_H_Q_STATE_UPDATE_SOURCE_AUDIT_01_PREREGISTRATION.md'),
  runtimeKernel: path.join(REPO_ROOT, 'SCIENCE_LAB/RUNTIME/NEXAH_COMMON_RUNTIME_ADAPTER_V0_1/nexah-runtime-adapter.js'),
  runtimeProfiles: path.join(REPO_ROOT, 'SCIENCE_LAB/RUNTIME/NEXAH_COMMON_RUNTIME_ADAPTER_V0_1/nexah-profiles.js'),
  runtimeTest: path.join(REPO_ROOT, 'SCIENCE_LAB/RUNTIME/NEXAH_COMMON_RUNTIME_ADAPTER_V0_1/test-runtime.js'),
  runtimeHtml: path.join(REPO_ROOT, 'SCIENCE_LAB/EXPORTS/NEXAH_COMMON_RUNTIME_ADAPTER.html'),
  fiveHHtml: path.join(REPO_ROOT, 'SCIENCE_LAB/EXPORTS/NEXAH_FIVE_H_ONE_Q_CUT.html'),
  closureHtml: path.join(REPO_ROOT, 'SCIENCE_LAB/EXPORTS/MIWA_PINEAP_AN_DROMEDA.html'),
  fiveHSynthesis: path.join(REPO_ROOT, 'SCIENCE_LAB/RESEARCH_AREAS/FIELD_GLYPH_NUMBER_ARCHITECTURE_STAGE_0_2026-09-14/19_FIVE_H_Q_TRIPTYCHON_RAINBOW_LOOM_SYNTHESIS.md'),
  doubleCutModel: path.join(BUNDLE_DIR, 'ROEDELHEIM_OBSERVATORY_DOUBLE_CUT_MODEL_0_2.js'),
  piqMaskResult: path.join(PACKAGE_DIR, 'h_q_piq_mask_compatibility_01_results.json')
});

const EXPECTED_HASHES = Object.freeze({
  preregistration: 'db8545d685472f8647763beeb3d8157a02321ad6da207d7896d6398b425e4023',
  runtimeKernel: '56d2c9128418615f9fb92f33ebfee4ad2ac287653b4c5222d575206225565ef1',
  runtimeProfiles: '9e2a55497ae2c7fe5510398818e75658d6d27b83b6e7c89606465e26f85cd71d',
  runtimeTest: '44a879fc3f7343639371f9f5d51200d128ab828ef148449b52466ea231166566',
  runtimeHtml: '8d7c533db5f59139d09c9aa740a22d93df2f840226b317141ca469e317e812eb',
  fiveHHtml: '8c733218dfd1ae6e8632653439877c059429286fa45e09889d0ccfdce0e123ca',
  closureHtml: '936708636b7193543bdc31e3069c7836b14057730f39633319e909e5e2f3fb84',
  fiveHSynthesis: '14a4cd59e6cfcdddcc50d1bb125c15cf6f4cecd4ecfe74c151ef6fd2f9c5ac62',
  doubleCutModel: '35c49ac53760c0df79411822568f924e86b6bf697f2041690a04d705ab623849',
  piqMaskResult: '226f3aace443b0ffff74dc58b45d7aa9e01ef2bb854fd2fc6168acf6949590bc'
});

const CRITERIA = Object.freeze([
  'callable',
  'consumes_return_record',
  'emits_next_five_h_source_state',
  'defines_step_advancement',
  'has_no_refeed_control_test'
]);

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function source(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function methodNames(value) {
  return Object.keys(value).filter((key) => typeof value[key] === 'function').sort();
}

function score(id, label, evidence, values) {
  const criteria = Object.fromEntries(CRITERIA.map((criterion, index) => [criterion, Boolean(values[index])]));
  return {
    id,
    label,
    evidence,
    criteria,
    passed_count: Object.values(criteria).filter(Boolean).length,
    qualifies_as_state_update: Object.values(criteria).every(Boolean)
  };
}

async function main() {
  const observedHashes = Object.fromEntries(Object.entries(FILES).map(([key, filePath]) => [key, sha256(filePath)]));
  const hashesMatch = Object.keys(EXPECTED_HASHES).every((key) => observedHashes[key] === EXPECTED_HASHES[key]);
  if (!hashesMatch) throw new Error('frozen source hash drift');

  const runtime = require(FILES.runtimeKernel);
  const profiles = require(FILES.runtimeProfiles);
  const doubleCut = require(FILES.doubleCutModel);
  const fiveH = profiles.executable.find((profile) => profile.id === 'five-h-q');
  if (!fiveH) throw new Error('five-h-q profile missing');

  const conformanceStdout = execFileSync(process.execPath, [FILES.runtimeTest], { encoding: 'utf8' });
  const conformance = JSON.parse(conformanceStdout);
  const conformancePass = conformance.tests === 18 && conformance.passed === 18;

  const fiveHMethods = methodNames(fiveH);
  const sessionMethods = Object.getOwnPropertyNames(runtime.RuntimeSession.prototype)
    .filter((name) => name !== 'constructor' && typeof runtime.RuntimeSession.prototype[name] === 'function')
    .sort();
  const doubleCutMethods = methodNames(doubleCut);
  const forbiddenUpdateNames = ['updateState', 'nextState', 'applyReturn', 'refeedState', 'feedbackStep'];
  const hasForbiddenMethod = (names) => forbiddenUpdateNames.some((name) => names.includes(name));

  const registry = new runtime.ProfileRegistry();
  profiles.executable.forEach((profile) => registry.register(profile));
  profiles.pending.forEach((profile) => registry.register(profile));
  const session = new runtime.RuntimeSession(registry, 'five-h-q', {
    t0_days: 170.9,
    loop_days: 2
  }, { sessionId: 'urn:nexah:audit:h-q-state-update', pairIndex: 0 });
  const inputBefore = runtime.canonicalJson(session.input);
  session.freezeCut('A', { offset_days: 0 });
  session.freezeCut('B', { offset_days: 2 });
  const connection = session.connect();
  const inputAfter = runtime.canonicalJson(session.input);
  const connectionLeavesInputImmutable = inputBefore === inputAfter && Object.isFrozen(session.input);

  const closureSource = source(FILES.closureHtml);
  const fiveHSource = source(FILES.fiveHHtml);
  const synthesisSource = source(FILES.fiveHSynthesis);
  const explicitUpdatePattern = /\b(updateState|nextState|applyReturn|refeedState|feedbackStep)\b/;
  const closureBoundaryPresent = closureSource.includes('return does not mean reset');
  const fiveHVisualLabelsPresent = fiveHSource.includes('RETURN · RE-FEED')
    && fiveHSource.includes('Record wird zurück eingespeist');
  const fiveHExecutableUpdateNameAbsent = !explicitUpdatePattern.test(fiveHSource);
  const synthesisRoutingBoundaryPresent = synthesisSource.includes('declared routing of a record into a later comparison');

  const candidates = [
    score(
      'five_h_visual_return_path',
      'Five-H RETURN · RE-FEED path',
      'The HTML draws a return path and changes display text; it does not call a returned-record-to-next-state function.',
      [false, false, false, false, false]
    ),
    score(
      'five_h_profile_binder_comparator_residual',
      'five-h-q binder / comparator / residual',
      'Callable operators align Cut B by clock ID and compare it with Cut A; they do not replace or advance the session input.',
      [true, false, false, false, false]
    ),
    score(
      'common_runtime_connection_and_receipt',
      'Common Runtime connection / receipt',
      'connect() creates a frozen comparison record and receipt() seals provenance; neither emits a next Five-H input.',
      [true, false, false, false, false]
    ),
    score(
      'closure_transit_comparator',
      'Closure Transit return / comparator',
      'drawClosureTransit() displays transport and residual classes and explicitly states that return does not mean reset.',
      [true, false, false, false, false]
    ),
    score(
      'double_cut_projection_and_mask',
      'Double-Cut projection / mask classification',
      'projectState() and classifySample() emit projected and classified records, not a next five-phase source state.',
      [true, false, false, false, false]
    ),
    score(
      'synthesis_declared_routing',
      'Synthesis return declaration',
      'The synthesis types return/re-feed as routing into a later comparison, without an executable update equation.',
      [false, false, false, false, false]
    )
  ];

  const candidateCoverageComplete = candidates.length === 6
    && candidates.every((candidate) => CRITERIA.every((criterion) => criterion in candidate.criteria));
  const qualified = candidates.filter((candidate) => candidate.qualifies_as_state_update);

  const checks = {
    source_hashes_match: hashesMatch,
    common_runtime_conformance_18_of_18_pass: conformancePass,
    five_h_profile_method_surface_inventoried: fiveHMethods.join(',') === 'bind,compare,residual,sample,validateInput' && !hasForbiddenMethod(fiveHMethods),
    runtime_session_method_surface_inventoried: sessionMethods.join(',') === '_event,connect,freezeCut,receipt' && !hasForbiddenMethod(sessionMethods),
    cut_connection_leaves_immutable_session_input_unchanged: connectionLeavesInputImmutable,
    closure_transit_boundary_return_does_not_mean_reset_present: closureBoundaryPresent,
    five_h_visual_return_labels_present_but_executable_update_name_absent: fiveHVisualLabelsPresent && fiveHExecutableUpdateNameAbsent,
    double_cut_method_surface_inventoried_without_state_update: doubleCutMethods.length > 0 && !hasForbiddenMethod(doubleCutMethods),
    all_frozen_candidates_scored_against_all_five_criteria: candidateCoverageComplete && synthesisRoutingBoundaryPresent
  };
  const checksPassed = Object.values(checks).filter(Boolean).length;
  const auditPass = checksPassed === Object.keys(checks).length;
  const classification = auditPass
    ? (qualified.length > 0
      ? 'PASS_SOURCE_AUDIT__STATE_UPDATE_OPERATOR_FOUND'
      : 'PASS_SOURCE_AUDIT__STATE_UPDATE_OPERATOR_ABSENT')
    : 'FAIL_SOURCE_AUDIT';

  const result = {
    classification,
    checks,
    checks_passed: checksPassed,
    checks_total: Object.keys(checks).length,
    preregistration_sha256: observedHashes.preregistration,
    frozen_source_hashes: observedHashes,
    runtime_conformance: conformance,
    inventories: {
      five_h_profile_methods: fiveHMethods,
      runtime_session_methods: sessionMethods,
      double_cut_exported_methods: doubleCutMethods,
      connection_residual_classification: connection.residual.classification,
      session_input_unchanged_after_connection: connectionLeavesInputImmutable
    },
    mandatory_criteria: CRITERIA,
    candidates,
    qualifying_candidate_ids: qualified.map((candidate) => candidate.id),
    next_gate: qualified.length > 0
      ? 'PREREGISTER_CONTROLLED_REFEED_COMPARISON'
      : 'BLOCK_REFEED_EFFICACY_TEST_UNTIL_SEPARATELY_DEFINED_STATE_UPDATE_OPERATOR',
    claim_boundary: 'Source audit of bounded Five-H/Common-Runtime/Closure/Double-Cut artifacts only. Absence means no independently pre-existing H_Q next-state operator was found in the frozen sources; it is not proof that no future operator can be specified.'
  };

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  process.stdout.write(`${classification}\n`);
  process.stdout.write(`checks ${checksPassed}/${Object.keys(checks).length}\n`);
  process.stdout.write(`candidates ${candidates.length}; qualified ${qualified.length}\n`);
  process.stdout.write(`${OUTPUT_PATH}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
