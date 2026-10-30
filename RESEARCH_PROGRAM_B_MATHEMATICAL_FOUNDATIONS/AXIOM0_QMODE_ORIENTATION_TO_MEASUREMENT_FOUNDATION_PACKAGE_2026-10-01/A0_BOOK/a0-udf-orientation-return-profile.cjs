'use strict';

const crypto = require('node:crypto');

const SCHEMA = 'nexah.udf.orientation-return/0.1.0-experimental';
const PAIR_NODES = Object.freeze({
  ab: Object.freeze(['BAND_0.429', 'BAND_0.456']),
  bc: Object.freeze(['BAND_0.456', 'BAND_0.487']),
  ca: Object.freeze(['BAND_0.487', 'BAND_0.429'])
});

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((result, key) => {
      result[key] = stableValue(value[key]);
      return result;
    }, {});
  }
  return value;
}

function canonicalJson(value) {
  return `${JSON.stringify(stableValue(value), null, 2)}\n`;
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function ensure(condition, code) {
  if (!condition) throw new TypeError(code);
}

function validate(record) {
  ensure(record && typeof record === 'object' && !Array.isArray(record), 'UDF_RECORD_REQUIRED');
  ensure(record.schema === SCHEMA, 'UDF_SCHEMA_UNSUPPORTED');
  ensure(record.profile_state === 'EXPERIMENTAL_NOT_FROZEN', 'UDF_PROFILE_STATE_INVALID');
  ensure(record.source?.identity === 'NEXAH:INSTRUMENT:BREATHING_PRIME_CRYSTAL:V1', 'UDF_SOURCE_IDENTITY_INVALID');
  ensure(record.source?.contract === 'nexah.a0.breathing-crystal-orientation-ledger/1.0.0', 'UDF_SOURCE_CONTRACT_INVALID');
  ensure(/^[a-f0-9]{64}$/.test(record.source?.sha256 || ''), 'UDF_SOURCE_HASH_INVALID');
  ensure(record.target?.identity === 'MOD:TESSAREC', 'UDF_TARGET_IDENTITY_INVALID');
  ensure(record.target?.contract === 'a0.v12-xy-graph-translator/1.0.0', 'UDF_TARGET_CONTRACT_INVALID');
  ensure(Object.hasOwn(PAIR_NODES, record.frame?.pair), 'UDF_PAIR_INVALID');
  const expectedNodes = PAIR_NODES[record.frame.pair];
  ensure(record.frame?.pin?.role === 'FIXED_RELATION_ORIGIN', 'UDF_PIN_INVALID');
  ensure(record.frame?.horizontal_axis?.node === expectedNodes[0], 'UDF_HORIZONTAL_NODE_INVALID');
  ensure(record.frame?.vertical_axis?.node === expectedNodes[1], 'UDF_VERTICAL_NODE_INVALID');
  ensure(Number.isFinite(record.frame?.theta_degrees), 'UDF_THETA_INVALID');
  ensure(Number.isFinite(record.frame?.radius) && record.frame.radius >= 0 && record.frame.radius <= Math.SQRT2 + 1e-9, 'UDF_RADIUS_INVALID');
  ensure(record.frame?.winding === -1 || record.frame?.winding === 1, 'UDF_WINDING_INVALID');
  ensure((record.frame.winding === -1 && record.frame.direction === 'CW') || (record.frame.winding === 1 && record.frame.direction === 'CCW'), 'UDF_DIRECTION_INVALID');
  ensure(record.comparators?.exit?.role === 'V12_FIXED_EXIT_COMPARATOR' && record.comparators.exit.angle_degrees === 45, 'UDF_EXIT_COMPARATOR_INVALID');
  ensure(record.comparators?.return?.role === 'V12_FIXED_RETURN_COMPARATOR' && record.comparators.return.angle_degrees === 360, 'UDF_RETURN_COMPARATOR_INVALID');
  ensure(record.comparators.exit.role !== record.comparators.return.role, 'UDF_COMPARATOR_ROLES_COLLAPSED');
  ensure(record.return?.target === 'CRYSTAL_ORIENTATION_LEDGER' && record.return?.source_mutation === false, 'UDF_RETURN_INVALID');
  ensure(Array.isArray(record.new_canonical_ids) && record.new_canonical_ids.length === 0, 'UDF_NEW_ID_FORBIDDEN');
  ensure(Array.isArray(record.relation_changes) && record.relation_changes.length === 0, 'UDF_RELATION_CHANGE_FORBIDDEN');
  return record;
}

function createPackage({orientation, sourcePath, sourceHash}) {
  ensure(orientation?.schema === 'nexah.a0.breathing-crystal-orientation-ledger/1.0.0', 'UDF_ORIENTATION_LEDGER_REQUIRED');
  const record = {
    schema: SCHEMA,
    profile_state: 'EXPERIMENTAL_NOT_FROZEN',
    source: {
      identity: 'NEXAH:INSTRUMENT:BREATHING_PRIME_CRYSTAL:V1',
      contract: orientation.schema,
      path: sourcePath,
      sha256: sourceHash
    },
    target: {
      identity: 'MOD:TESSAREC',
      contract: 'a0.v12-xy-graph-translator/1.0.0',
      view: 'V12_XY_GRAPH_TRANSLATOR'
    },
    frame: {
      pair: orientation.pair,
      pin: orientation.pin,
      horizontal_axis: orientation.horizontal_axis,
      vertical_axis: orientation.vertical_axis,
      theta_degrees: orientation.theta_degrees,
      radius: orientation.radius,
      quadrant: orientation.quadrant,
      horizontal_relation: orientation.horizontal_relation,
      vertical_relation: orientation.vertical_relation,
      horizontal_crossings: orientation.horizontal_crossings,
      vertical_crossings: orientation.vertical_crossings,
      winding: orientation.winding,
      direction: orientation.direction,
      clock: orientation.clock
    },
    comparators: {
      exit: {label: 'RE · EXIT', role: 'V12_FIXED_EXIT_COMPARATOR', angle_degrees: 45},
      return: {label: 'DO′ · RETURN', role: 'V12_FIXED_RETURN_COMPARATOR', angle_degrees: 360}
    },
    return: {
      target: 'CRYSTAL_ORIENTATION_LEDGER',
      anchor: 'A0_ORIENTATION_CONTROLLER_BENCH.html#breathingCrystalMeasurementDeck',
      source_mutation: false
    },
    identity_reuse: [
      'NEXAH:INSTRUMENT:BREATHING_PRIME_CRYSTAL:V1',
      'NEXAH_A0_ORIENTATION_CONTROLLER_BENCH',
      'ART:A0:MATHEMATICAL_JOINTS',
      'MOD:TESSAREC'
    ],
    new_canonical_ids: [],
    relation_changes: [],
    claim_boundary: 'Experimental source-bound serialization profile for one typed orientation Return. It is not a universal UDF schema, product capability, shared mechanism, GLB mutation, Study, Finding promotion or publication.'
  };
  return validate(record);
}

function serialize(record) {
  return canonicalJson(validate(record));
}

function parse(text) {
  let record;
  try { record = JSON.parse(text); } catch { throw new TypeError('UDF_JSON_INVALID'); }
  return validate(record);
}

function digest(record) {
  return sha256(serialize(record));
}

function toAdapterInput(record) {
  const validated = validate(record);
  return {
    pair: validated.frame.pair,
    thetaDegrees: validated.frame.theta_degrees,
    radius: validated.frame.radius,
    horizontalRelation: validated.frame.horizontal_relation,
    verticalRelation: validated.frame.vertical_relation,
    horizontalNode: validated.frame.horizontal_axis.node,
    verticalNode: validated.frame.vertical_axis.node,
    winding: validated.frame.winding,
    direction: validated.frame.direction
  };
}

module.exports = {SCHEMA, PAIR_NODES, canonicalJson, sha256, validate, createPackage, serialize, parse, digest, toAdapterInput};
