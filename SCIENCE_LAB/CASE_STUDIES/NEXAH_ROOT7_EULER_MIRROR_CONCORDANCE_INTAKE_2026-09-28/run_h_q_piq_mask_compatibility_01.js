#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PACKAGE_DIR = __dirname;
const BUNDLE_DIR = '/Users/tho2020/Documents/NEXAH ECOSYSTEM/00 EXECUTIVE/NEXAH-Mission-Control/ROEDELHEIM_OBSERVATORY_BUNDLE';
const OUTPUT_PATH = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(PACKAGE_DIR, 'h_q_piq_mask_compatibility_01_results.json');

const FILES = Object.freeze({
  preregistration: path.join(PACKAGE_DIR, '28_H_Q_PIQ_MASK_COMPATIBILITY_01_PREREGISTRATION.md'),
  hqResult: path.join(PACKAGE_DIR, 'h_q_record_01_results.json'),
  doubleCutContract: path.join(BUNDLE_DIR, 'ROEDELHEIM_OBSERVATORY_DOUBLE_CUT_LAB_0_2.md'),
  doubleCutModel: path.join(BUNDLE_DIR, 'ROEDELHEIM_OBSERVATORY_DOUBLE_CUT_MODEL_0_2.js'),
  doubleCutTest: path.join(BUNDLE_DIR, 'ROEDELHEIM_OBSERVATORY_DOUBLE_CUT_LAB_0_2.test.js'),
  doubleCutHtml: path.join(BUNDLE_DIR, 'ROEDELHEIM_OBSERVATORY_DOUBLE_CUT_LAB_0_2.html'),
  threadLoomContract: path.join(BUNDLE_DIR, 'ROEDELHEIM_OBSERVATORY_THREAD_LOOM_PROJECTION_LAB_0_4.md'),
  threadLoomModel: path.join(BUNDLE_DIR, 'ROEDELHEIM_OBSERVATORY_THREAD_LOOM_PROJECTION_MODEL_0_4.js'),
  threadLoomTest: path.join(BUNDLE_DIR, 'ROEDELHEIM_OBSERVATORY_THREAD_LOOM_PROJECTION_LAB_0_4.test.js')
});

const EXPECTED_HASHES = Object.freeze({
  preregistration: 'b5411cfb472c169f54008e5b82e401b9f25f2d1a4dcec04a0aab9e16a9fb7257',
  hqResult: '79d767e7d4df682a663c09a87af6f46f185c9894c16763eca4c2a53bb1433480',
  doubleCutContract: '5ed622e3bce1a51512e4a931ab398ccfea52af6d04850398c0f02a81918c74ce',
  doubleCutModel: '35c49ac53760c0df79411822568f924e86b6bf697f2041690a04d705ab623849',
  doubleCutTest: 'd04c9cf8c4e421a968d10aa64a9d052ebbbfe283fe43a0d34d37dc8ab9f67449',
  doubleCutHtml: 'e766fed5e0f7086a7f71ebb099e0206e0dd608620e396528d22b7d6d1723ac71',
  threadLoomContract: '50c451623b8490d2e87490a698356daa9389bae65ddafbf498a2d3815746b40b',
  threadLoomModel: 'f6f48b8a1d5c043ad4d59e4dc4c31937953f65d72cd139c3753ebf295462b56e',
  threadLoomTest: 'f382c1aac36470b578582a7afd81224cfbdc68e03c97eac44ba776597b5021ff'
});

const CLOCK_IDS = Object.freeze([
  'H1_SOLAR_DAY',
  'H2_SYNODIC_MONTH',
  'H3_ANNUAL_ORBIT',
  'H4_PRINCIPAL_NODES',
  'H5_AXIAL_PRECESSION'
]);

const MASK_BASE = Object.freeze({
  widthPercent: 18,
  positionPercent: 50,
  moving: false,
  driftPercent: 12,
  boundaryTolerancePx: 0.75
});

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function sameNumber(a, b, tolerance = 1e-12) {
  return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= tolerance;
}

function buildGateRecords(phaseRegister) {
  const byGate = new Map();
  phaseRegister.forEach((cell) => {
    if (!byGate.has(cell.gate_hour)) byGate.set(cell.gate_hour, new Map());
    const gate = byGate.get(cell.gate_hour);
    if (gate.has(cell.clock_id)) throw new Error(`duplicate key ${cell.gate_hour}:${cell.clock_id}`);
    gate.set(cell.clock_id, cell.phase_turns);
  });
  return [...byGate.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([gateHour, phases]) => ({
      gateHour,
      clocks: CLOCK_IDS.map((clockId) => ({
        clockId,
        phaseTurns: phases.get(clockId)
      }))
    }));
}

function projectGate(model, gateRecord, offsetTurns = 0) {
  const sourceCells = gateRecord.clocks.map(({ clockId, phaseTurns }) => ({
    key: `${gateRecord.gateHour}:${clockId}`,
    clock_id: clockId,
    phase_turns: phaseTurns
  }));
  const state = Object.freeze({
    day: gateRecord.gateHour / 24,
    phases: Object.freeze(sourceCells.map((cell) => 2 * Math.PI * (cell.phase_turns + offsetTurns)))
  });
  const point = model.projectState(state);
  return {
    id: `gate-${gateRecord.gateHour}`,
    gate_hour: gateRecord.gateHour,
    day: state.day,
    x: point.x,
    y: point.y,
    source_clock_ids: sourceCells.map((cell) => cell.clock_id),
    source_cell_keys: sourceCells.map((cell) => cell.key),
    source_phase_turns: sourceCells.map((cell) => cell.phase_turns)
  };
}

function keyedProjection(model, phaseRegister) {
  return buildGateRecords(phaseRegister).map((gate) => projectGate(model, gate));
}

function coordinateMap(records) {
  return Object.fromEntries(records.map((record) => [record.gate_hour, [record.x, record.y]]));
}

function keyedCoordinatesEqual(left, right) {
  const a = coordinateMap(left);
  const b = coordinateMap(right);
  const keys = Object.keys(a).sort((x, y) => Number(x) - Number(y));
  return keys.length === Object.keys(b).length && keys.every((key) =>
    b[key] && sameNumber(a[key][0], b[key][0]) && sameNumber(a[key][1], b[key][1]));
}

function main() {
  const observedHashes = Object.fromEntries(Object.entries(FILES).map(([key, filePath]) => [key, sha256(filePath)]));
  const hashesMatch = Object.keys(EXPECTED_HASHES).every((key) => observedHashes[key] === EXPECTED_HASHES[key]);
  if (!hashesMatch) throw new Error('frozen source hash drift');

  const model = require(FILES.doubleCutModel);
  const hq = JSON.parse(fs.readFileSync(FILES.hqResult, 'utf8'));
  const phaseRegister = hq.record.phase_register;
  const gateRecords = buildGateRecords(phaseRegister);

  const inputShapeValid = gateRecords.length === 8 && gateRecords.every((gate) =>
    gate.clocks.length === 5 &&
    gate.clocks.every((clock, index) => clock.clockId === CLOCK_IDS[index] && Number.isFinite(clock.phaseTurns)));

  const projected = gateRecords.map((gate) => projectGate(model, gate));
  const projectedAgain = gateRecords.map((gate) => projectGate(model, gate));
  const projectionsFiniteDeterministic = projected.every((record, index) =>
    Number.isFinite(record.x) && Number.isFinite(record.y) &&
    sameNumber(record.x, projectedAgain[index].x) && sameNumber(record.y, projectedAgain[index].y));
  const identityAttached = projected.every((record) =>
    record.source_clock_ids.length === 5 && record.source_cell_keys.length === 5 &&
    record.source_clock_ids.every((id, index) => id === CLOCK_IDS[index]) &&
    record.source_cell_keys.every((key, index) => key === `${record.gate_hour}:${CLOCK_IDS[index]}`));

  const fullOptions = Object.freeze({ ...MASK_BASE, fullTraceDeclared: true });
  const noTraceOptions = Object.freeze({ ...MASK_BASE, fullTraceDeclared: false });
  const allowedClasses = new Set(Object.values(model.CLASS));
  const sourceSnapshot = JSON.stringify(phaseRegister);
  const classifiedFull = projected.map((record) => model.classifySample(record, fullOptions));
  const classifiedNoTrace = projected.map((record) => model.classifySample(record, noTraceOptions));
  const sourceUnmutated = JSON.stringify(phaseRegister) === sourceSnapshot;

  const coverage = classifiedFull.length === projected.length && classifiedFull.every((entry) => allowedClasses.has(entry.primary));
  const noOverlap = model.diagnostics(classifiedFull).classificationOverlaps === 0;
  const legalTransitions = classifiedFull.every((entry, index) => {
    const other = classifiedNoTrace[index];
    const sameGeometry = entry.zone === other.zone &&
      sameNumber(entry.sample.x, other.sample.x) && sameNumber(entry.sample.y, other.sample.y) &&
      sameNumber(entry.mask.left, other.mask.left) && sameNumber(entry.mask.right, other.mask.right);
    if (!sameGeometry) return false;
    if (entry.zone === 'inside') {
      return entry.primary === model.CLASS.RECOVERABLE && other.primary === model.CLASS.UNKNOWN;
    }
    return entry.primary === other.primary;
  });

  const shuffled = phaseRegister.slice().reverse();
  const shuffledOrderIndependent = keyedCoordinatesEqual(projected, keyedProjection(model, shuffled));
  const offsetProjected = gateRecords.map((gate) => projectGate(model, gate, 1 / 8));
  const offsetDistances = projected.map((record, index) => Math.hypot(
    record.x - offsetProjected[index].x,
    record.y - offsetProjected[index].y
  ));
  const maxOffsetDistance = Math.max(...offsetDistances);
  const positiveControlResponds = maxOffsetDistance > 1e-6;

  const checks = {
    source_hashes_match: hashesMatch,
    input_has_8_gates_and_5_unique_declared_clocks: inputShapeValid,
    projection_is_finite_and_deterministic: projectionsFiniteDeterministic,
    gate_and_clock_identity_remain_attached: identityAttached,
    mask_classification_covers_every_gate_once: coverage,
    mask_classification_has_no_overlap: noOverlap,
    full_trace_switch_has_only_legal_class_effects_and_no_geometry_effect: legalTransitions,
    shuffled_input_is_key_order_independent: shuffledOrderIndependent,
    mask_does_not_mutate_source_record: sourceUnmutated,
    positive_1_over_8_turn_control_changes_projection: positiveControlResponds
  };
  const checksPassed = Object.values(checks).filter(Boolean).length;
  const insideCount = classifiedFull.filter((entry) => entry.zone === 'inside').length;
  const maskEffectStatus = insideCount > 0
    ? 'MASK_EFFECT_EVALUABLE'
    : 'MASK_EFFECT_NOT_EVALUABLE_NO_MASK_INTERSECTION';
  const baseStatus = checksPassed === Object.keys(checks).length
    ? 'PASS_SOURCE_BOUND_PIQ_MASK_COMPATIBILITY'
    : 'FAIL';

  const classCount = (classified, primary) => classified.filter((entry) => entry.primary === primary).length;
  const projectionRecords = classifiedFull.map((entry, index) => ({
    gate_hour: entry.sample.gate_hour,
    x: entry.sample.x,
    y: entry.sample.y,
    mask_left: entry.mask.left,
    mask_right: entry.mask.right,
    zone: entry.zone,
    class_full_trace: entry.primary,
    class_no_trace: classifiedNoTrace[index].primary,
    source_clock_ids: entry.sample.source_clock_ids,
    source_cell_keys: entry.sample.source_cell_keys
  }));

  const result = {
    classification: `${baseStatus}__${maskEffectStatus}`,
    checks,
    checks_passed: checksPassed,
    checks_total: Object.keys(checks).length,
    preregistration_sha256: observedHashes.preregistration,
    frozen_source_hashes: observedHashes,
    adapter: {
      clock_order: CLOCK_IDS,
      conversion: 'angle_radians = 2*pi*phase_turns',
      day_field: 'gate_hour / 24',
      projection_operator: 'unchanged Double Cut Lab 0.2 projectState',
      weights: [0.32, 0.27, 0.20, 0.13, 0.08]
    },
    mask: {
      options: MASK_BASE,
      inside_count: insideCount,
      outside_count: classifiedFull.filter((entry) => entry.zone === 'outside').length,
      boundary_count: classifiedFull.filter((entry) => entry.zone === 'boundary').length,
      effect_status: maskEffectStatus,
      full_trace_class_counts: {
        GENERATED_UNMASKED: classCount(classifiedFull, model.CLASS.UNMASKED),
        GENERATED_MASKED_RECOVERABLE: classCount(classifiedFull, model.CLASS.RECOVERABLE),
        UNKNOWN: classCount(classifiedFull, model.CLASS.UNKNOWN),
        BOUNDARY: classCount(classifiedFull, model.CLASS.BOUNDARY)
      },
      no_trace_class_counts: {
        GENERATED_UNMASKED: classCount(classifiedNoTrace, model.CLASS.UNMASKED),
        GENERATED_MASKED_RECOVERABLE: classCount(classifiedNoTrace, model.CLASS.RECOVERABLE),
        UNKNOWN: classCount(classifiedNoTrace, model.CLASS.UNKNOWN),
        BOUNDARY: classCount(classifiedNoTrace, model.CLASS.BOUNDARY)
      }
    },
    positive_control: {
      transform: '+1/8 turn on every channel',
      distances_px_by_gate: Object.fromEntries(projected.map((record, index) => [record.gate_hour, offsetDistances[index]])),
      maximum_distance_px: maxOffsetDistance
    },
    information_loss: {
      source_dimension: 5,
      projected_dimension: 2,
      inverse_decoder_declared: false,
      status: 'NON_INVERTIBLE_WITHOUT_DECLARED_DECODER',
      provenance_retained: true,
      thread_loom_role: 'INDEPENDENT_BOUNDARY_CONTROL_ONLY'
    },
    projection_records: projectionRecords,
    claim_boundary: 'Source-bound Five-H-to-Pi_Q projection and mask compatibility only; no re-feed benefit, decoder, physical observation, astronomy prediction, SCN/NCS292/404, E8/H4 or M-Class claim.'
  };

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  process.stdout.write(`${result.classification}\n`);
  process.stdout.write(`checks ${checksPassed}/${Object.keys(checks).length}\n`);
  process.stdout.write(`zones inside=${insideCount} outside=${result.mask.outside_count} boundary=${result.mask.boundary_count}\n`);
  process.stdout.write(`positive-control max displacement=${maxOffsetDistance.toFixed(12)} px\n`);
  process.stdout.write(`${OUTPUT_PATH}\n`);
}

main();
