"use strict";

const assert = require("node:assert/strict");
const model = require("./assets/a0-fibonacci-ring-operator-comparator-r1.js");

const result = model.evaluate();
const chain = result.operator_chain;
const schedules = Object.fromEntries(result.comparator.schedules.map((item) => [item.schedule, item]));

assert.deepEqual(chain.origin_address, [0, 0]);
assert.deepEqual(chain.target_address, [1, 1]);
assert.equal(chain.decoded_scalar, 1.1);
assert.equal(chain.square_envelope, 1.21);
assert.deepEqual(chain.phase_pair_degrees, [-1.84, 1.84]);
assert.equal(chain.raw_phase_span_degrees, 3.68);
assert.equal(chain.effective_phase_span_degrees, 4.048);
assert.equal(chain.address_scalar_identity, false);
assert.equal(result.comparator.sample_count, 48);
assert.equal(result.comparator.seed, 110121);
assert.equal(result.comparator.schedules.length, 3);
assert.ok(schedules.UNIFORM.coefficient_rmse < 1e-12);
assert.ok(schedules.FIBONACCI.coefficient_rmse > schedules.UNIFORM.coefficient_rmse);
assert.ok(schedules.FIBONACCI.coefficient_rmse < schedules.SEEDED_RANDOM.coefficient_rmse);
assert.ok(schedules.UNIFORM.maximum_circular_gap_turns < schedules.FIBONACCI.maximum_circular_gap_turns);
assert.ok(schedules.FIBONACCI.maximum_circular_gap_turns < schedules.SEEDED_RANDOM.maximum_circular_gap_turns);
assert.deepEqual(result.comparator.rmse_order_best_to_worst, ["UNIFORM", "FIBONACCI", "SEEDED_RANDOM"]);
assert.equal(result.comparator.fibonacci_beats_uniform, false);
assert.equal(result.comparator.fibonacci_beats_seeded_random, true);
assert.equal(result.comparator.fibonacci_privileged, false);
assert.equal(result.status, "PASS_CONTROLS_DISTINGUISHED_FIBONACCI_NOT_PRIVILEGED");
assert.equal(result.gate, "G6_SAMPLING_PREFLIGHT_ONLY");
assert.equal(result.governance.authorized_science_run, false);
assert.equal(result.governance.study_activated, false);
assert.equal(result.governance.closes_g6, false);
assert.equal(result.governance.new_navigator_identity, false);

console.log("PASS A0 Fibonacci Ring Operator Comparator · 26 assertions · synthetic engineering preflight");
