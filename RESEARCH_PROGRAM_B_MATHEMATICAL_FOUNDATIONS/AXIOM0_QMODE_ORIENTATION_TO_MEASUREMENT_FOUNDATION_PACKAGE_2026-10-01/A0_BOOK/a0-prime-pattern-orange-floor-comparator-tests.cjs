'use strict';

const assert = require('node:assert/strict');
const C = require('./a0-prime-pattern-orange-floor-comparator.js');

let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks++; };

const audit = C.claimAudit();
const byId = Object.fromEntries(audit.claims.map(claim => [claim.id, claim]));
ok(byId.C504.status === 'EXACT', '504 identity is exact');
ok(byId.MIRROR_3301_1031.status === 'FALSE' && byId.MIRROR_3301_1031.observed === '1033', '3301 reverses to 1033, not 1031');
ok(byId.FACTOR_509.status === 'FALSE' && byId.FACTOR_509.observed === 511 && byId.FACTOR_509.factors.join(',') === '509', '509 factor claim is rejected');
ok(byId.RAMANUJAN_163.status === 'FALSE' && !byId.RAMANUJAN_163.ramanujan_primes_through_200.includes(163), '163 is not a Ramanujan prime');
ok(byId.TWIN_151_157.gap === 6 && byId.TWIN_151_157.correction === 'SEXY_PRIME_PAIR', '151/157 classification corrected');
ok(byId.TWIN_167_173.gap === 6 && byId.TWIN_167_173.correction === 'SEXY_PRIME_PAIR', '167/173 classification corrected');
ok(byId.CROWN_PRIMALITY.status === 'EXACT' && byId.CROWN_PRIMALITY.values.every(row => row.prime), 'crown-node primality retained separately');
ok(byId.MIRROR_457_137.status === 'UNDEFINED_CONTRACT', 'undefined mirror operator is not inferred');
ok(byId.FFT_MOBIUS.status === 'UNDEFINED_CONTRACT', 'FFT is not treated as a topology detector');
ok(byId.ANGLES_233_337.possible_bisectors_degrees.join(',') === '105,285', 'possible angle bisectors are exact but axis remains undeclared');

const ghost = C.ghostGridControls();
ok(ghost.rows.map(row => row.stride).join(',') === '7,10,11,12,13', 'stride 11 has matched periodic controls');
ok(ghost.result.stride_11_is_periodic_by_construction, 'stride 11 periodicity is construction-bound');
ok(ghost.result.other_strides_are_periodic_by_construction, 'other every-k controls are also periodic');
ok(!ghost.result.unique_activation_supported, 'no unique activation is inferred');
ok(ghost.deterministic_control.selected_count === ghost.rows.find(row => row.stride === 11).selected_count, 'random control is count matched');
ok(ghost.a2b4.hits.length > 0 && ghost.a2b4.unique_primes.length > 0, 'bounded a2+b4 arithmetic fixture is generated');
ok(ghost.boundary.includes('does not establish Mobius topology'), 'Ghost Grid claim ceiling is explicit');

const floor = C.orangeFloorFixture();
ok(floor.scale_control.scale_only_equivalence, 'translation and scale disappear under declared normalization');
ok(floor.scale_control.normalized_path_rms_error < 1e-12, 'scale control closes numerically');
ok(!floor.shape_control.scale_only_equivalence && floor.shape_control.normalized_path_rms_error > 0.1, 'shape change survives normalization');
ok(floor.scale_control.endpoint_return_error.A === 0 && floor.scale_control.endpoint_return_error.B === 0, 'closed fixture returns exactly on both scales');
ok(floor.historical_phi_pi_visual.status === 'UNDEFINED_CONTRACT', 'historical phi/pi visual waits for source equations or samples');
assert.throws(() => C.orangeFloorCompare([[0, 0]], [[0, 0]])); checks++;
assert.throws(() => C.orangeFloorCompare([[0, 0], [1, 1]], [[0, 0], [1, 1], [2, 2]])); checks++;

const gate = C.scarabGateHandleFixture();
ok(gate.identity_reuse === 'MOD:NUMBER_VIEW_SUITE', 'existing Number View identity is reused');
ok(gate.existing_relation_context === 'REL:IEEE300_GRAPH_GRID_NUMBER_ADDRESS', 'existing source-bound 1031/1032/1033 relation is retained as context only');
ok(gate.source_binding.status === 'DOCUMENTARY_SOURCE_ONLY', 'existing source receipt boundary is retained');
ok(gate.declared_gate.core_triangle_labels.join(',') === '1031,1032,1033', 'core gate labels are retained');
ok(gate.declared_gate.inner_anchor_label === 1087 && gate.declared_gate.handle_node === 3301, '1087 anchor and 3301 handle roles are retained');
ok(gate.declared_gate.handle_attachment === 'UNRESOLVED_WITHOUT_NUMBER_TO_COORDINATE_MAP', 'handle attachment is not inferred from pixels');
ok(gate.arithmetic_stair.reversal_pairs.every(([source, mirror]) => C.reverseDecimal(source) === mirror), 'three decimal reversal pairs are exact');
ok(gate.arithmetic_stair.source_steps.join(',') === '1,1', 'source gate advances by unit steps');
ok(gate.arithmetic_stair.mirror_steps.join(',') === '1000,1000', 'mirror lane advances by thousand steps');
ok(gate.arithmetic_stair.place_value_expansion, 'decimal reversal expands the two unit steps by place value');
ok(gate.arithmetic_stair.gate_sum === 3096 && gate.arithmetic_stair.mirror_sum === 6903, 'gate and mirror sums are exact');
ok(gate.arithmetic_stair.mirrored_sum_exact, '3096 reverses exactly to 6903');
ok(gate.arithmetic_stair.six_node_sum === 9999, 'the two three-node lanes sum to 9999');
ok(gate.outer_return.exact_decimal_reversal && gate.outer_return.pair_sum === 8888, '1087 and 7801 form an exact reversal pair summing to 8888');
ok(gate.outer_return.full_eight_node_sum === 18887, 'the eight declared stair values sum exactly');
ok(gate.classification_audit.outer_gate_7801.factors.join(',') === '29,269' && !gate.classification_audit.outer_gate_7801.prime, '7801 source caption is not promoted to prime status');
ok(gate.classification_audit.resonator_2301.factors.join(',') === '3,13,59', '2301 composite classification is exact');
ok(gate.classification_audit.prime_values.every(row => row.prime), 'declared prime subset passes arithmetic classification');
ok(gate.representation_audit.find(row => row.visual === 'MIRROR_NODES_HEXAHEDRON').status === 'HOLD_LABEL_COLLISION', 'hexahedron plate remains held for duplicate 3201 and missing 1033');
ok(gate.representation_audit.find(row => row.visual === 'PREVIOUS_DOUBLE_TRIANGLE_READING').status === 'SUPERSEDED_BY_SOURCE_BOUND_GATE', 'previous double-triangle reading is explicitly superseded');
ok(gate.result.metric_geometry === 'UNDEFINED_CONTRACT', 'metric geometry waits for source coordinates');

const pip = C.primeIndexPalindromeAxis(1000);
ok(pip.identity_reuse === 'MOD:NUMBER_VIEW_SUITE', 'prime-index axis reuses the existing Number View identity');
ok(pip.rows.every(row => C.isDecimalPalindrome(row.index)), 'enumeration contains only palindromic prime indices');
ok(pip.rows.every((row, index, rows) => index === 0 || rows[index - 1].index < row.index), 'prime-index-palindrome rows are sorted by ascending index');
ok(pip.rows.length > 100 && pip.counts.emirp_returns > 0 && pip.counts.composite_returns > 0, 'bounded population contains matched positive and negative return classes');
ok(C.primeIndex(1087) === 181 && C.primeIndex(3301) === 464, '1087 and 3301 have the declared palindromic prime indices');
ok(pip.focus.anchor_1087.additive_lift.exact && pip.focus.anchor_1087.additive_lift.base === 100 && pip.focus.anchor_1087.additive_lift.payload === 81, '181 equals the bounded additive lift 10^2 + 3^4');
ok(pip.focus.handle_3301.additive_lift.exact && pip.focus.handle_3301.additive_lift.base === 400 && pip.focus.handle_3301.additive_lift.payload === 64, '464 equals the bounded additive lift 20^2 + 2^6');
ok(pip.gate_axis.midpoint_exact && pip.gate_axis.hinge.carry_43 && pip.gate_axis.hinge.suffix_32.half_of_64, '1032 retains midpoint, 24x43 carry and 64/2 suffix readings');
ok(pip.gate_axis.prime_return_cycles.map(cycle => cycle.source.index).join(',') === '173,174', 'source gate prime indices are 173 and 174');
ok(pip.gate_axis.prime_return_cycles.map(cycle => cycle.decimal_return.index).join(',') === '212,464', 'decimal returns land on indices 212 and 464');
ok(pip.gate_axis.prime_return_cycles.every(cycle => cycle.two_cycle_exact && cycle.return_index_palindrome), 'both gate endpoints form exact reversal cycles landing on palindromic indices');
ok(pip.result.anchor_1087_is_palindromic_index_stop, '1087 is the negative control: palindromic index with composite decimal return');
ok(!pip.result.general_power_elevator_supported && pip.boundary.includes('post-hoc'), 'additive lifts do not create a general elevator law');

console.log(JSON.stringify({
  status: 'PASS_WITH_HOLDS',
  checks,
  exact_claims: audit.claims.filter(claim => claim.status === 'EXACT').map(claim => claim.id),
  rejected_claims: audit.claims.filter(claim => claim.status === 'FALSE').map(claim => claim.id),
  undefined_claims: audit.claims.filter(claim => claim.status === 'UNDEFINED_CONTRACT').map(claim => claim.id),
  ghost_grid_unique_activation_supported: ghost.result.unique_activation_supported,
  orange_floor_scale_control: floor.scale_control.scale_only_equivalence,
  orange_floor_historical_status: floor.historical_phi_pi_visual.status,
  scarab_gate_arithmetic_stair: gate.result.arithmetic_stair,
  scarab_gate_visibility: gate.result.gate_and_handle_visibility,
  scarab_gate_handle_attachment: gate.result.handle_attachment,
  mirror_gate_metric_geometry: gate.result.metric_geometry,
  mirror_gate_representation_holds: gate.representation_audit.filter(row => row.status.startsWith('HOLD')).map(row => row.visual),
  prime_index_palindrome_axis: {
    limit: pip.limit,
    counts: pip.counts,
    gate_return_indices: pip.gate_axis.prime_return_cycles.map(cycle => cycle.decimal_return.index),
    anchor_1087_stop: pip.result.anchor_1087_is_palindromic_index_stop,
    additive_index_lifts_exact: pip.result.additive_index_lifts_exact,
    general_power_elevator_supported: pip.result.general_power_elevator_supported
  },
  boundary: 'BOUNDED_ENGINEERING_COMPARATOR / NO SCIENCE RUN / NO NEW IDENTITY OR RELATION'
}, null, 2));
