'use strict';

const crypto = require('node:crypto');

const PROFILE = 'nexah.a0.prov-rocrate.orientation-return-baseline/0.1.0';
const RO_CRATE_CONTEXT = 'https://w3id.org/ro/crate/1.2/context';
const PROV = 'http://www.w3.org/ns/prov#';
const A0 = 'https://nexah.example/ns/a0-orientation-return#';
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

function serialize(value) {
  return `${JSON.stringify(stableValue(value), null, 2)}\n`;
}

function digest(value) {
  return crypto.createHash('sha256').update(serialize(value)).digest('hex');
}

function ensure(condition, code) {
  if (!condition) throw new TypeError(code);
}

function ref(id) {
  return {'@id': id};
}

function node(crate, id) {
  return crate['@graph'].find(item => item['@id'] === id);
}

function createBaseline(udfRecord) {
  const frame = udfRecord.frame;
  return validate({
    '@context': [
      RO_CRATE_CONTEXT,
      {
        prov: PROV,
        a0: A0,
        sha256: 'https://schema.org/sha256',
        used: {'@id': `${PROV}used`, '@type': '@id'},
        wasGeneratedBy: {'@id': `${PROV}wasGeneratedBy`, '@type': '@id'},
        wasDerivedFrom: {'@id': `${PROV}wasDerivedFrom`, '@type': '@id'}
      }
    ],
    '@graph': [
      {
        '@id': 'ro-crate-metadata.json',
        '@type': 'CreativeWork',
        about: ref('./'),
        conformsTo: ref(RO_CRATE_CONTEXT)
      },
      {
        '@id': './',
        '@type': 'Dataset',
        name: 'Breathing Crystal to V12 orientation Return baseline crate',
        conformsTo: ref(PROFILE),
        hasPart: [ref('#source'), ref('#frame'), ref('#handoff'), ref('#target'), ref('#exit'), ref('#return-axis'), ref('#return')]
      },
      {
        '@id': '#source',
        '@type': ['CreativeWork', 'prov:Entity'],
        identifier: udfRecord.source.identity,
        additionalType: udfRecord.source.contract,
        contentUrl: udfRecord.source.path,
        sha256: udfRecord.source.sha256
      },
      {
        '@id': '#frame',
        '@type': ['Dataset', 'prov:Entity'],
        additionalType: 'nexah.a0.breathing-crystal-orientation-ledger/1.0.0',
        wasDerivedFrom: ref('#source'),
        'a0:pair': frame.pair,
        'a0:pinRole': frame.pin.role,
        'a0:pinX': frame.pin.x,
        'a0:pinY': frame.pin.y,
        'a0:horizontalAxisRole': frame.horizontal_axis.role,
        'a0:horizontalAxisNode': frame.horizontal_axis.node,
        'a0:verticalAxisRole': frame.vertical_axis.role,
        'a0:verticalAxisNode': frame.vertical_axis.node,
        'a0:thetaDegrees': frame.theta_degrees,
        'a0:radius': frame.radius,
        'a0:quadrant': frame.quadrant,
        'a0:horizontalRelation': frame.horizontal_relation,
        'a0:verticalRelation': frame.vertical_relation,
        'a0:horizontalCrossings': frame.horizontal_crossings,
        'a0:verticalCrossings': frame.vertical_crossings,
        'a0:winding': frame.winding,
        'a0:direction': frame.direction,
        'a0:clock': frame.clock
      },
      {
        '@id': '#handoff',
        '@type': ['CreateAction', 'prov:Activity'],
        name: 'Crystal orientation frame to V12 typed view handoff',
        used: [ref('#source'), ref('#frame')],
        result: ref('#target'),
        'a0:sourceMutation': udfRecord.return.source_mutation
      },
      {
        '@id': '#target',
        '@type': ['SoftwareApplication', 'prov:Entity'],
        identifier: udfRecord.target.identity,
        additionalType: udfRecord.target.contract,
        name: udfRecord.target.view,
        wasGeneratedBy: ref('#handoff')
      },
      {
        '@id': '#exit',
        '@type': 'PropertyValue',
        name: udfRecord.comparators.exit.label,
        propertyID: udfRecord.comparators.exit.role,
        value: udfRecord.comparators.exit.angle_degrees,
        unitText: 'degree'
      },
      {
        '@id': '#return-axis',
        '@type': 'PropertyValue',
        name: udfRecord.comparators.return.label,
        propertyID: udfRecord.comparators.return.role,
        value: udfRecord.comparators.return.angle_degrees,
        unitText: 'degree'
      },
      {
        '@id': '#return',
        '@type': ['Action', 'prov:Activity'],
        name: 'Return to unchanged Crystal Orientation Ledger',
        object: ref('#target'),
        result: ref('#frame'),
        target: udfRecord.return.target,
        url: udfRecord.return.anchor,
        'a0:sourceMutation': udfRecord.return.source_mutation,
        'a0:newCanonicalIds': udfRecord.new_canonical_ids,
        'a0:relationChanges': udfRecord.relation_changes,
        'a0:claimBoundary': udfRecord.claim_boundary
      }
    ]
  });
}

function validate(crate) {
  ensure(crate && typeof crate === 'object' && Array.isArray(crate['@graph']), 'BASELINE_CRATE_REQUIRED');
  ensure(Array.isArray(crate['@context']) && crate['@context'].includes(RO_CRATE_CONTEXT), 'BASELINE_RO_CRATE_CONTEXT_REQUIRED');
  const root = node(crate, './');
  const source = node(crate, '#source');
  const frame = node(crate, '#frame');
  const handoff = node(crate, '#handoff');
  const target = node(crate, '#target');
  const exit = node(crate, '#exit');
  const returnAxis = node(crate, '#return-axis');
  const returnNode = node(crate, '#return');
  ensure(root?.conformsTo?.['@id'] === PROFILE, 'BASELINE_PROFILE_INVALID');
  ensure(source?.identifier === 'NEXAH:INSTRUMENT:BREATHING_PRIME_CRYSTAL:V1', 'BASELINE_SOURCE_IDENTITY_INVALID');
  ensure(source?.additionalType === 'nexah.a0.breathing-crystal-orientation-ledger/1.0.0', 'BASELINE_SOURCE_CONTRACT_INVALID');
  ensure(/^[a-f0-9]{64}$/.test(source?.sha256 || ''), 'BASELINE_SOURCE_HASH_INVALID');
  ensure(Object.hasOwn(PAIR_NODES, frame?.['a0:pair']), 'BASELINE_PAIR_INVALID');
  const expectedNodes = PAIR_NODES[frame['a0:pair']];
  ensure(frame?.['a0:pinRole'] === 'FIXED_RELATION_ORIGIN', 'BASELINE_PIN_ROLE_INVALID');
  ensure(frame?.['a0:horizontalAxisRole'] === 'PAIR_X' && frame?.['a0:horizontalAxisNode'] === expectedNodes[0], 'BASELINE_HORIZONTAL_NODE_INVALID');
  ensure(frame?.['a0:verticalAxisRole'] === 'PAIR_Y' && frame?.['a0:verticalAxisNode'] === expectedNodes[1], 'BASELINE_VERTICAL_NODE_INVALID');
  ensure(Number.isFinite(frame?.['a0:thetaDegrees']), 'BASELINE_THETA_INVALID');
  ensure(Number.isFinite(frame?.['a0:radius']) && frame['a0:radius'] >= 0 && frame['a0:radius'] <= Math.SQRT2 + 1e-9, 'BASELINE_RADIUS_INVALID');
  ensure(frame?.['a0:winding'] === -1 || frame?.['a0:winding'] === 1, 'BASELINE_WINDING_INVALID');
  ensure((frame['a0:winding'] === -1 && frame['a0:direction'] === 'CW') || (frame['a0:winding'] === 1 && frame['a0:direction'] === 'CCW'), 'BASELINE_DIRECTION_INVALID');
  ensure(handoff?.used?.some(item => item['@id'] === '#frame'), 'BASELINE_HANDOFF_FRAME_INVALID');
  ensure(target?.identifier === 'MOD:TESSAREC', 'BASELINE_TARGET_IDENTITY_INVALID');
  ensure(target?.additionalType === 'a0.v12-xy-graph-translator/1.0.0', 'BASELINE_TARGET_CONTRACT_INVALID');
  ensure(exit?.propertyID === 'V12_FIXED_EXIT_COMPARATOR' && exit.value === 45, 'BASELINE_EXIT_COMPARATOR_INVALID');
  ensure(returnAxis?.propertyID === 'V12_FIXED_RETURN_COMPARATOR' && returnAxis.value === 360, 'BASELINE_RETURN_COMPARATOR_INVALID');
  ensure(returnNode?.target === 'CRYSTAL_ORIENTATION_LEDGER' && returnNode?.['a0:sourceMutation'] === false, 'BASELINE_RETURN_INVALID');
  ensure(Array.isArray(returnNode?.['a0:newCanonicalIds']) && returnNode['a0:newCanonicalIds'].length === 0, 'BASELINE_NEW_ID_FORBIDDEN');
  ensure(Array.isArray(returnNode?.['a0:relationChanges']) && returnNode['a0:relationChanges'].length === 0, 'BASELINE_RELATION_CHANGE_FORBIDDEN');
  return crate;
}

function parse(text) {
  let crate;
  try { crate = JSON.parse(text); } catch { throw new TypeError('BASELINE_JSON_INVALID'); }
  return validate(crate);
}

function semanticView(crate) {
  validate(crate);
  const source = node(crate, '#source');
  const frame = node(crate, '#frame');
  const target = node(crate, '#target');
  const exit = node(crate, '#exit');
  const returnAxis = node(crate, '#return-axis');
  const returnNode = node(crate, '#return');
  return {
    source: {identity: source.identifier, contract: source.additionalType, path: source.contentUrl, sha256: source.sha256},
    target: {identity: target.identifier, contract: target.additionalType, view: target.name},
    frame: {
      pair: frame['a0:pair'],
      pin: {role: frame['a0:pinRole'], x: frame['a0:pinX'], y: frame['a0:pinY']},
      horizontal_axis: {role: frame['a0:horizontalAxisRole'], node: frame['a0:horizontalAxisNode']},
      vertical_axis: {role: frame['a0:verticalAxisRole'], node: frame['a0:verticalAxisNode']},
      theta_degrees: frame['a0:thetaDegrees'], radius: frame['a0:radius'], quadrant: frame['a0:quadrant'],
      horizontal_relation: frame['a0:horizontalRelation'], vertical_relation: frame['a0:verticalRelation'],
      horizontal_crossings: frame['a0:horizontalCrossings'], vertical_crossings: frame['a0:verticalCrossings'],
      winding: frame['a0:winding'], direction: frame['a0:direction'], clock: frame['a0:clock']
    },
    comparators: {
      exit: {label: exit.name, role: exit.propertyID, angle_degrees: exit.value},
      return: {label: returnAxis.name, role: returnAxis.propertyID, angle_degrees: returnAxis.value}
    },
    return: {target: returnNode.target, anchor: returnNode.url, source_mutation: returnNode['a0:sourceMutation']},
    new_canonical_ids: returnNode['a0:newCanonicalIds'],
    relation_changes: returnNode['a0:relationChanges'],
    claim_boundary: returnNode['a0:claimBoundary']
  };
}

module.exports = {PROFILE, RO_CRATE_CONTEXT, PROV, A0, createBaseline, validate, parse, serialize, digest, semanticView};
