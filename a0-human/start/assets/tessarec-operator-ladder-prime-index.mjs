#!/usr/bin/env node

// Deterministic post-hoc engineering audit of the 6/7 operator ladder,
// its p_25=97 readout and the separate 42-return / 42-degree roles.
// Writes no files. This is not an authorized Science Lab run.

import assert from "node:assert/strict";

const SEED = 6;
const MAX_SEED = 10_000;
const INDEX_SHIFTS = Object.freeze([-3, -2, -1, 0, 1, 2, 3]);
const TARGET_SHIFTS = Object.freeze([-6, -4, -2, 0, 2, 4, 6]);
const TOLERANCE = 1e-12;

function gcd(a, b) {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function sieve(limit) {
  const flags = new Uint8Array(limit + 1);
  flags.fill(1, 2);
  for (let value = 2; value * value <= limit; value += 1) {
    if (!flags[value]) continue;
    for (let multiple = value * value; multiple <= limit; multiple += value) {
      flags[multiple] = 0;
    }
  }
  const primes = [];
  for (let value = 2; value <= limit; value += 1) {
    if (flags[value]) primes.push(value);
  }
  return primes;
}

function primesThroughIndex(index) {
  let limit = 1024;
  let primes = sieve(limit);
  while (primes.length < index) {
    limit *= 2;
    primes = sieve(limit);
  }
  return { primes, limit };
}

function ladderRow(seed, rung) {
  const left = seed * 2 ** rung;
  const right = left + 1;
  return {
    rung,
    left,
    right,
    additive_readout: left + right,
    next_right: seed * 2 ** (rung + 1) + 1,
  };
}

function ladder(seed, rows = 4) {
  return Array.from({ length: rows }, (_, rung) => ladderRow(seed, rung));
}

function primeClosureHits(primes, maxSeed, indexShift = 0, targetShift = 0) {
  const hits = [];
  for (let seed = 1; seed <= maxSeed; seed += 1) {
    const oneBasedIndex = 4 * seed + 1 + indexShift;
    const target = 16 * seed + 1 + targetShift;
    if (oneBasedIndex > 0 && primes[oneBasedIndex - 1] === target) {
      hits.push({ seed, one_based_index: oneBasedIndex, target });
    }
  }
  return hits;
}

function observerProject([x, y], angleDegrees) {
  const radians = angleDegrees * Math.PI / 180;
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return [
    cosine * x - 0.5 * sine * y,
    0.5 * sine * x + cosine * y,
  ];
}

function reflectY([x, y]) {
  return [x, -y];
}

function maxAbsDelta(left, right) {
  return Math.max(...left.map((value, index) => Math.abs(value - right[index])));
}

export function verifyOperatorLadderPrimeIndex() {
  // L1/L2 — generic operator identity and the exact seed-six trace.
  const rows = ladder(SEED);
  for (const row of rows) {
    assert.equal(row.additive_readout, row.next_right);
  }
  assert.deepEqual(rows.map(({ left, right, additive_readout }) =>
    [left, right, additive_readout]), [
    [6, 7, 13],
    [12, 13, 25],
    [24, 25, 49],
    [48, 49, 97],
  ]);

  // L3 — one-based prime-index closure b_2=25 -> p_25=97=b_4.
  const maximumIndex = 4 * MAX_SEED + 1 + Math.max(...INDEX_SHIFTS);
  const { primes, limit } = primesThroughIndex(maximumIndex);
  const index25Value = primes[24];
  assert.equal(index25Value, 97);
  assert.equal(rows[1].additive_readout, 25);
  assert.equal(rows[3].additive_readout, 97);

  // L4 — complete finite seed enumeration for the observed affine closure.
  const primaryHits = primeClosureHits(primes, MAX_SEED);
  assert.deepEqual(primaryHits, [{ seed: 6, one_based_index: 25, target: 97 }]);

  // L5 — nearby formulas are descriptive matched controls. Their sparse hits
  // prevent a confirmatory specificity claim for the post-hoc primary rule.
  const indexShiftControls = INDEX_SHIFTS.map((shift) => ({
    shift,
    formula: `p_(4s+1${shift < 0 ? shift : `+${shift}`}) = 16s+1`,
    hits: primeClosureHits(primes, MAX_SEED, shift, 0),
  }));
  const targetShiftControls = TARGET_SHIFTS.map((shift) => ({
    shift,
    formula: `p_(4s+1) = 16s+1${shift < 0 ? shift : `+${shift}`}`,
    hits: primeClosureHits(primes, MAX_SEED, 0, shift),
  }));
  assert.deepEqual(indexShiftControls.map((record) => record.hits.length), [0, 0, 0, 1, 1, 1, 0]);
  assert.deepEqual(targetShiftControls.map((record) => record.hits.length), [2, 1, 0, 1, 0, 0, 0]);

  // L6 — the separately established C6 x C7 return fixture.
  const wheel = {
    factors: [6, 7],
    gcd: gcd(6, 7),
    additive_readout: 6 + 7,
    multiplicative_return: lcm(6, 7),
    state_at_step_13: [13 % 6, 13 % 7],
    state_at_step_42: [42 % 6, 42 % 7],
  };
  assert.deepEqual(wheel, {
    factors: [6, 7],
    gcd: 1,
    additive_readout: 13,
    multiplicative_return: 42,
    state_at_step_13: [1, 6],
    state_at_step_42: [0, 0],
  });
  for (let step = 1; step < 42; step += 1) {
    assert.notDeepEqual([step % 6, step % 7], [0, 0]);
  }

  // L7 — the declared observer map has generic +/-theta reflection
  // conjugacy. This holds for every angle and does not identify 42 steps with
  // 42 degrees.
  const observerSamples = Object.freeze([[1, 0], [0, 1], [2, -3], [-5, 8]]);
  const mirrorDeltas = observerSamples.map((point) => {
    const left = reflectY(observerProject(reflectY(point), 42));
    const right = observerProject(point, -42);
    return maxAbsDelta(left, right);
  });
  assert(Math.max(...mirrorDeltas) <= TOLERANCE);

  return {
    status: "PASS_WITH_POST_HOC_UNIQUENESS_AND_OPEN_GEOMETRIC_BINDING",
    classification: "ENGINEERING_FORMAL_CHECK_NOT_SCIENCE_RUN",
    identity_effect: "REUSES_MOD_TESSAREC_NO_NEW_STUDY_NO_NEW_RELATION",
    frozen_parameters: {
      seed: SEED,
      seed_universe: [1, MAX_SEED],
      prime_indexing: "one_based_p_1_equals_2",
      primary_condition: "p_(4s+1)=16s+1",
      index_shifts: INDEX_SHIFTS,
      target_shifts: TARGET_SHIFTS,
      observer_angles_degrees: [42, -42],
    },
    tests: {
      L1_OPERATOR_IDENTITY: {
        status: "PASS_GENERIC_IDENTITY",
        identity: "x+(x+1)=2x+1",
        equivalent_joint: "Add(id,Succ)=Succ(Double)",
        novelty: "GENERIC_NOT_NOVEL",
      },
      L2_SEED_SIX_TRACE: {
        status: "PASS_EXACT",
        rows,
      },
      L3_PRIME_INDEX_CLOSURE: {
        status: "PASS_EXACT_NUMERIC_IDENTITY",
        b2: 25,
        p_b2: index25Value,
        b4: 97,
        identity: "p_25=97",
      },
      L4_FROZEN_SEED_ENUMERATION: {
        status: "DESCRIPTIVE_UNIQUE_HIT_IN_FROZEN_RANGE",
        searched_seeds: MAX_SEED,
        sieve_limit: limit,
        hits: primaryHits,
        hit_rate: primaryHits.length / MAX_SEED,
        inference_authorized: false,
      },
      L5_NEARBY_FORMULA_CONTROLS: {
        status: "NO_CONFIRMATORY_SPECIFICITY",
        index_shift_controls: indexShiftControls,
        target_shift_controls: targetShiftControls,
        interpretation: "nearby post-hoc affine formulas also have sparse hits",
      },
      L6_C6_C7_RETURN: {
        status: "PASS_EXACT_FIRST_RETURN",
        ...wheel,
      },
      L7_OBSERVER_MIRROR_CONJUGACY: {
        status: "PASS_GENERIC_OPERATOR_IDENTITY",
        identity: "S*pi_theta*S=pi_-theta",
        angle_degrees: 42,
        maximum_sample_delta: Math.max(...mirrorDeltas),
        novelty: "GENERIC_FOR_ALL_ANGLES",
      },
      L8_RETURN_TO_ANGLE_BINDING: {
        status: "OPEN_NO_DECLARED_MAP",
        return_role: "42 steps on C6 x C7",
        observer_role: "+/-42 degrees in pi_theta",
        missing_object: "typed map from wheel state or step to observer angle and envelope observable",
      },
    },
    conclusion: {
      operator_ladder: "SUPPORTED_GENERIC",
      p25_equals_97: "SUPPORTED_EXACT",
      seed_six_uniqueness_1_to_10000: "SUPPORTED_DESCRIPTIVELY",
      confirmatory_specificity: "NOT_ESTABLISHED_POST_HOC_CONTROLS",
      c6_c7_first_return_42: "SUPPORTED_EXACT",
      plus_minus_42_observer_mirror: "SUPPORTED_AS_GENERIC_CONJUGACY",
      return_42_steps_equals_observer_42_degrees: "NOT_ESTABLISHED_TYPED_NON_IDENTITY",
      tessarec_state_or_edge_binding: "NOT_TESTED_NOT_ESTABLISHED",
      new_finding: false,
    },
    writes_files: false,
    authorized_science_run: false,
  };
}

if (process.argv.length !== 3 || process.argv[2] !== "--verify") {
  console.error("Usage: node tessarec-operator-ladder-prime-index.mjs --verify");
  process.exitCode = 2;
} else {
  console.log(JSON.stringify(verifyOperatorLadderPrimeIndex(), null, 2));
}
