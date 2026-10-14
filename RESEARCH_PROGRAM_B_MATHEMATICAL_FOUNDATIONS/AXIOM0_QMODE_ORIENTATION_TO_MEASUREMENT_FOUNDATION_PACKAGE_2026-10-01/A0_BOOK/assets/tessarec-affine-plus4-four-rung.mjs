#!/usr/bin/env node

// Deterministic post-hoc engineering audit of the +4 affine translation of
// the Tessarec operator ladder. Writes no files. This is not a Science run.

import assert from "node:assert/strict";

const BASE_SEED = 6;
const SHIFT = 4;
const RUNGS = 4;
const GON_SET = Object.freeze([7, 8, 17, 19, 23, 29]);
const CONTROL_SHIFTS = Object.freeze(
  Array.from({ length: 21 }, (_, index) => -20 + 2 * index),
);

function isPrime(value) {
  if (!Number.isInteger(value) || value < 2) return false;
  if (value % 2 === 0) return value === 2;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function smallestFactor(value) {
  if (value % 2 === 0) return 2;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return divisor;
  }
  return value;
}

function primesThroughIndex(index) {
  const primes = [];
  for (let candidate = 2; primes.length < index; candidate += 1) {
    if (isPrime(candidate)) primes.push(candidate);
  }
  return primes;
}

function baseRow(rung) {
  const left = BASE_SEED * 2 ** rung;
  const right = left + 1;
  return [left, right, left + right];
}

function tau(value, shift = SHIFT) {
  return value + shift;
}

function affineJoint(left, right, shift = SHIFT) {
  return left + right - shift;
}

function shiftedRow(rung, shift = SHIFT) {
  const [left, right, output] = baseRow(rung);
  return [tau(left, shift), tau(right, shift), tau(output, shift)];
}

function shiftedOutput(rung, shift = SHIFT) {
  return 12 * 2 ** rung + 1 + shift;
}

function primeRun(shift, maximumRungs = 64) {
  const values = [];
  for (let rung = 0; rung < maximumRungs; rung += 1) {
    const value = shiftedOutput(rung, shift);
    if (!isPrime(value)) {
      const factor = value > 1 ? smallestFactor(value) : null;
      return {
        shift,
        length: values.length,
        primes: values,
        first_failure: {
          rung,
          value,
          factor,
          cofactor: factor ? value / factor : null,
        },
      };
    }
    values.push(value);
  }
  throw new Error(`Prime run exceeded frozen maximum at shift ${shift}`);
}

function unorderedDistinctPairSums(values) {
  const pairs = [];
  for (let leftIndex = 0; leftIndex < values.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < values.length; rightIndex += 1) {
      pairs.push({
        pair: [values[leftIndex], values[rightIndex]],
        sum: values[leftIndex] + values[rightIndex],
      });
    }
  }
  return pairs;
}

export function verifyAffinePlus4FourRung() {
  // A1 — translation does not preserve ordinary addition. It intertwines it
  // with the affine joint J_h(u,v)=u+v-h.
  for (let left = -8; left <= 8; left += 1) {
    for (let right = -8; right <= 8; right += 1) {
      assert.equal(
        tau(left + right),
        affineJoint(tau(left), tau(right)),
      );
    }
  }

  // A2 — the proposed +4 ladder is exact componentwise translation.
  const baseRows = Array.from({ length: RUNGS }, (_, rung) => baseRow(rung));
  const shiftedRows = Array.from({ length: RUNGS }, (_, rung) => shiftedRow(rung));
  assert.deepEqual(baseRows, [
    [6, 7, 13],
    [12, 13, 25],
    [24, 25, 49],
    [48, 49, 97],
  ]);
  assert.deepEqual(shiftedRows, [
    [10, 11, 17],
    [16, 17, 29],
    [28, 29, 53],
    [52, 53, 101],
  ]);
  for (let rung = 0; rung < RUNGS; rung += 1) {
    assert.deepEqual(shiftedRows[rung], baseRows[rung].map((value) => value + SHIFT));
    assert.equal(
      affineJoint(shiftedRows[rung][0], shiftedRows[rung][1]),
      shiftedRows[rung][2],
    );
  }

  // A3 — four rung states form a path P4 with three adjacent transitions.
  const outputs = shiftedRows.map((row) => row[2]);
  const outputGaps = outputs.slice(1).map((value, index) => value - outputs[index]);
  assert.deepEqual(outputs, [17, 29, 53, 101]);
  assert.deepEqual(outputGaps, [12, 24, 48]);

  // A4 — within the frozen supplied Gon set, only the fourth left rail node
  // is independently reconstructed by a distinct unordered Gon pair.
  const leftRail = shiftedRows.map((row) => row[0]);
  const gonPairs = unorderedDistinctPairSums(GON_SET);
  const crossBindings = gonPairs
    .filter((record) => leftRail.includes(record.sum))
    .map((record) => ({ left_rail_value: record.sum, gon_pair: record.pair }));
  assert.deepEqual(crossBindings, [
    { left_rail_value: 52, gon_pair: [23, 29] },
  ]);
  assert.equal(52, 13 * 2 ** 2);

  // A5 — the translated outputs have a finite seven-prime run, then fail.
  const primaryRun = primeRun(SHIFT);
  assert.deepEqual(primaryRun, {
    shift: 4,
    length: 7,
    primes: [17, 29, 53, 101, 197, 389, 773],
    first_failure: { rung: 7, value: 1541, factor: 23, cofactor: 67 },
  });

  // A6 — post-hoc local controls over even translations h in [-20,20].
  const localControls = CONTROL_SHIFTS.map((shift) => primeRun(shift));
  assert.deepEqual(localControls.map(({ shift, length }) => [shift, length]), [
    [-20, 0], [-18, 0], [-16, 0], [-14, 0], [-12, 0],
    [-10, 1], [-8, 4], [-6, 3], [-4, 0], [-2, 3],
    [0, 1], [2, 0], [4, 7], [6, 2], [8, 0], [10, 1],
    [12, 0], [14, 0], [16, 2], [18, 3], [20, 0],
  ]);
  const maximumLocalRun = Math.max(...localControls.map((record) => record.length));
  assert.deepEqual(
    localControls.filter((record) => record.length === maximumLocalRun).map((record) => record.shift),
    [4],
  );

  // A7/A8 — prime indices and the separate 79/97 decimal mirror cue.
  const primes = primesThroughIndex(26);
  assert.equal(primes[21], 79);
  assert.equal(primes[24], 97);
  assert.equal(primes[25], 101);
  assert.equal(Number(String(79).split("").reverse().join("")), 97);

  return {
    status: "PASS_WITH_DESCRIPTIVE_THREE_PLUS_ONE_AND_FINITE_PRIME_RUN",
    classification: "ENGINEERING_FORMAL_CHECK_NOT_SCIENCE_RUN",
    identity_effect: "REUSES_MOD_TESSAREC_NO_NEW_STUDY_NO_NEW_RELATION",
    frozen_parameters: {
      base_seed: BASE_SEED,
      affine_shift: SHIFT,
      rung_count: RUNGS,
      gon_set: GON_SET,
      local_control_shifts: CONTROL_SHIFTS,
      prime_indexing: "one_based_p_1_equals_2",
    },
    tests: {
      A1_AFFINE_TRANSLATION_INTERTWINER: {
        status: "PASS_GENERIC_AFFINE_IDENTITY",
        identity: "tau_h(x+y)=J_h(tau_h(x),tau_h(y)); J_h(u,v)=u+v-h",
        novelty: "GENERIC_NOT_NOVEL",
      },
      A2_PLUS4_FOUR_RUNG_TRACE: {
        status: "PASS_EXACT",
        base_rows: baseRows,
        shifted_rows: shiftedRows,
        correction: "the exact fourth row is 52,53,101; not 52,51,101",
      },
      A3_FOUR_STATES_THREE_TRANSITIONS: {
        status: "PASS_EXACT_PATH_COUNT",
        graph_type: "P4",
        states: outputs,
        transition_count: outputs.length - 1,
        transition_gaps: outputGaps,
        physical_three_plus_one_authorized: false,
      },
      A4_FOURTH_RUNG_GON_CROSS_BINDING: {
        status: "DESCRIPTIVE_UNIQUE_CROSS_BINDING_IN_FROZEN_SET",
        left_rail: leftRail,
        cross_bindings: crossBindings,
        factorization: "52=13*2^2",
        inference_authorized: false,
      },
      A5_SHIFTED_OUTPUT_PRIME_RUN: {
        status: "PASS_FINITE_RUN_THEN_FAIL",
        formula: "c_n=12*2^n+5",
        ...primaryRun,
        p_26: primes[25],
        prime_generator: false,
      },
      A6_LOCAL_SHIFT_CONTROLS: {
        status: "DESCRIPTIVE_UNIQUE_LOCAL_MAXIMUM_POST_HOC",
        controls: localControls.map(({ shift, length, first_failure }) => ({
          shift,
          prime_run_length: length,
          first_failure: first_failure.value,
        })),
        maximum_run_length: maximumLocalRun,
        maximizing_shifts: [4],
        inference_authorized: false,
      },
      A7_FOUR_GEAR_VERSUS_THREE_PLUS_ONE: {
        status: "SUPPORTED_AS_TWO_TYPED_READINGS",
        four_gear: "four rung states",
        three_plus_one_graph: "three transitions plus terminal fourth state",
        three_plus_one_cross_binding: "three ladder-only left nodes plus one Gon-cross-bound left node under frozen set",
        canonical_or_physical_interpretation: "NOT_ESTABLISHED",
      },
      A8_MIRROR_79_97_BINDING: {
        status: "OPEN_NO_DECLARED_OPERATOR_MAP",
        decimal_mirror: "79<->97",
        prime_indices: { p_22: 79, p_25: 97 },
        relation_to_affine_ladder: "NOT_ESTABLISHED",
      },
    },
    conclusion: {
      four_rung_affine_ladder: "SUPPORTED_EXACT",
      four_states_three_transitions: "SUPPORTED_EXACT_GRAPH_COUNT",
      fourth_rung_special_in_frozen_gon_set: "SUPPORTED_DESCRIPTIVELY_POST_HOC",
      plus4_unique_local_prime_run_maximum: "SUPPORTED_DESCRIPTIVELY_POST_HOC",
      prime_generator: "REFUTED_BY_1541_EQUALS_23_TIMES_67",
      physical_four_gear_or_three_plus_one_mechanism: "NOT_ESTABLISHED",
      mirror_79_97_operator_binding: "NOT_ESTABLISHED",
      new_finding: false,
    },
    writes_files: false,
    authorized_science_run: false,
  };
}

if (process.argv.length !== 3 || process.argv[2] !== "--verify") {
  console.error("Usage: node tessarec-affine-plus4-four-rung.mjs --verify");
  process.exitCode = 2;
} else {
  console.log(JSON.stringify(verifyAffinePlus4FourRung(), null, 2));
}
