'use strict';

const LENS_ORDER = Object.freeze([
  'source',
  'carrier',
  'orientation',
  'comparator',
  'transformation',
  'return',
  'claim_boundary'
]);

const QUERY_DEPENDENCIES = Object.freeze({
  Q01_SOURCE_IDENTITY: Object.freeze(['source']),
  Q02_SOURCE_HASH_AND_CONTRACT: Object.freeze(['source']),
  Q03_CARRIER_AND_AXIS_NODES: Object.freeze(['carrier']),
  Q04_ORIENTATION_VECTOR: Object.freeze(['orientation']),
  Q05_DIRECTION_AND_WINDING: Object.freeze(['orientation']),
  Q06_COMPARATOR_NON_IDENTITY: Object.freeze(['comparator']),
  Q07_TRANSFORMATION_MUTATION_STATE: Object.freeze(['transformation']),
  Q08_EXACT_RETURN_ANCHOR: Object.freeze(['return']),
  Q09_CLAIM_CEILING: Object.freeze(['claim_boundary'])
});

function createStack(view, format) {
  return {
    schema: 'nexah.a0.orientation-return-lens-stack/0.1.0-experimental',
    format,
    lenses: {
      source: {
        identity: view.source.identity,
        contract: view.source.contract,
        path: view.source.path,
        sha256: view.source.sha256
      },
      carrier: {
        source_identity: view.source.identity,
        target_identity: view.target.identity,
        pair: view.frame.pair,
        pin_role: view.frame.pin.role,
        horizontal_node: view.frame.horizontal_axis.node,
        vertical_node: view.frame.vertical_axis.node
      },
      orientation: {
        theta_degrees: view.frame.theta_degrees,
        radius: view.frame.radius,
        quadrant: view.frame.quadrant,
        horizontal_relation: view.frame.horizontal_relation,
        vertical_relation: view.frame.vertical_relation,
        horizontal_crossings: view.frame.horizontal_crossings,
        vertical_crossings: view.frame.vertical_crossings,
        winding: view.frame.winding,
        direction: view.frame.direction,
        clock: view.frame.clock
      },
      comparator: {
        exit: view.comparators.exit,
        return: view.comparators.return,
        roles_distinct: view.comparators.exit.role !== view.comparators.return.role
      },
      transformation: {
        target_contract: view.target.contract,
        target_view: view.target.view,
        source_mutation: view.return.source_mutation,
        new_canonical_ids: view.new_canonical_ids,
        relation_changes: view.relation_changes
      },
      return: {
        target: view.return.target,
        anchor: view.return.anchor,
        source_mutation: view.return.source_mutation
      },
      claim_boundary: {
        text: view.claim_boundary
      }
    },
    loss_lens: {
      state: 'UNDECLARED_IN_PROFILE',
      retained: null,
      lost: null,
      added: null,
      unresolved: null,
      note: 'The current profile exposes rejection and non-mutation boundaries but no explicit retained/lost/added/unresolved vocabulary.'
    }
  };
}

function answer(stack, queryId) {
  const required = QUERY_DEPENDENCIES[queryId];
  if (!required) throw new RangeError('LENS_QUERY_UNKNOWN');
  const missing = required.filter(name => !stack.lenses[name]);
  if (missing.length) return {status: 'UNANSWERABLE_MISSING_LENS', missing};
  const lens = stack.lenses[required[0]];
  const answers = {
    Q01_SOURCE_IDENTITY: lens.identity,
    Q02_SOURCE_HASH_AND_CONTRACT: {sha256: lens.sha256, contract: lens.contract},
    Q03_CARRIER_AND_AXIS_NODES: {source: lens.source_identity, target: lens.target_identity, pair: lens.pair, pin: lens.pin_role, horizontal: lens.horizontal_node, vertical: lens.vertical_node},
    Q04_ORIENTATION_VECTOR: {theta_degrees: lens.theta_degrees, radius: lens.radius, quadrant: lens.quadrant},
    Q05_DIRECTION_AND_WINDING: {direction: lens.direction, winding: lens.winding},
    Q06_COMPARATOR_NON_IDENTITY: {exit: lens.exit, return: lens.return, roles_distinct: lens.roles_distinct},
    Q07_TRANSFORMATION_MUTATION_STATE: lens,
    Q08_EXACT_RETURN_ANCHOR: lens,
    Q09_CLAIM_CEILING: lens.text
  };
  return {status: 'ANSWERED', value: answers[queryId]};
}

function ablate(stack, lensName) {
  if (!LENS_ORDER.includes(lensName)) throw new RangeError('LENS_ABLATION_UNKNOWN');
  const copy = structuredClone(stack);
  delete copy.lenses[lensName];
  copy.ablation = lensName;
  return copy;
}

function auditAblation(stack) {
  const baseline = Object.keys(QUERY_DEPENDENCIES).map(id => [id, answer(stack, id)]);
  if (baseline.some(([, result]) => result.status !== 'ANSWERED')) throw new Error('LENS_STACK_BASELINE_INCOMPLETE');
  return LENS_ORDER.map(lensName => {
    const candidate = ablate(stack, lensName);
    const unavailable = Object.keys(QUERY_DEPENDENCIES).filter(id => answer(candidate, id).status !== 'ANSWERED');
    const expected = Object.entries(QUERY_DEPENDENCIES).filter(([, dependencies]) => dependencies.includes(lensName)).map(([id]) => id);
    return {lens: lensName, unavailable, expected, isolated: JSON.stringify(unavailable) === JSON.stringify(expected)};
  });
}

function consistency(stack) {
  const {source, carrier, orientation, comparator, transformation, return: returnLens} = stack.lenses;
  const checks = [
    {id: 'SOURCE_EQUALS_CARRIER_SOURCE', pass: source.identity === carrier.source_identity},
    {id: 'CARRIER_EQUALS_TRANSFORMATION_TARGET', pass: carrier.target_identity === 'MOD:TESSAREC' && transformation.target_contract === 'a0.v12-xy-graph-translator/1.0.0'},
    {id: 'PAIR_AXES_DISTINCT', pass: carrier.horizontal_node !== carrier.vertical_node},
    {id: 'DIRECTION_MATCHES_WINDING', pass: (orientation.winding === -1 && orientation.direction === 'CW') || (orientation.winding === 1 && orientation.direction === 'CCW')},
    {id: 'COMPARATOR_ROLES_DISTINCT', pass: comparator.roles_distinct},
    {id: 'RETURN_AND_TRANSFORMATION_NON_MUTATING', pass: returnLens.source_mutation === false && transformation.source_mutation === false},
    {id: 'NO_IDENTITY_OR_RELATION_PROMOTION', pass: transformation.new_canonical_ids.length === 0 && transformation.relation_changes.length === 0}
  ];
  return {status: checks.every(item => item.pass) ? 'PASS_LENS_CONSISTENCY' : 'FAIL_LENS_CONSISTENCY', checks};
}

module.exports = {LENS_ORDER, QUERY_DEPENDENCIES, createStack, answer, ablate, auditAblation, consistency};
