#!/usr/bin/env node

// Deterministic engineering audit of the typed 1 -> 2 -> 0 -> 3 proposal.
// Writes no files. This is not an authorized Science Lab run.

import assert from "node:assert/strict";

const SOURCES = [-13, -3, -1, 0.5, 2, 7, 23];
const ASYMMETRY_FACTORS = [0.5, 0.75, 1.25, 2];
const PERTURBATIONS = [-0.25, -0.01, 0.01, 0.25];
const CLOCK_PERIODS = [18, 24, 30];

function splitRecord(source) {
  assert.notEqual(source, 0, "the frozen carrier sample must be nonzero");
  return {
    source,
    branches: [
      { role: "plus", value: source },
      { role: "minus", value: -source },
    ],
  };
}

function project(record) {
  return record.branches.reduce((sum, branch) => sum + branch.value, 0);
}

function memoryLift(record) {
  return [
    { role: "source", value: record.source },
    ...record.branches.map((branch) => ({ ...branch })),
  ];
}

function unlabeledBranches(record) {
  return record.branches.map((branch) => branch.value).sort((a, b) => a - b);
}

function gcd(left, right) {
  return right === 0 ? Math.abs(left) : gcd(right, left % right);
}

function lcm(left, right) {
  return Math.abs(left * right) / gcd(left, right);
}

const records = SOURCES.map(splitRecord);

for (const record of records) {
  assert.equal(record.branches.length, 2);
  assert.equal(record.branches[0].value, record.source);
  assert.equal(record.branches[1].value, -record.source);
  assert.equal(project(record), 0);

  const lifted = memoryLift(record);
  assert.equal(lifted.length, 3);
  assert.deepEqual(lifted.map((entry) => entry.role), ["source", "plus", "minus"]);
  assert.equal(lifted[0].value, record.source);
}

// The null projection is many-to-one: distinct sources share the same readout.
const nullReadouts = new Set(records.map(project));
assert.deepEqual([...nullReadouts], [0]);
assert.ok(new Set(records.map((record) => record.source)).size > 1);

// Removing labels and the source destroys orientation: x and -x have the same pair.
for (const source of [1, 3, 7, 23]) {
  assert.deepEqual(
    unlabeledBranches(splitRecord(source)),
    unlabeledBranches(splitRecord(-source)),
  );
}

// An asymmetric split does not pass the exact null gate.
const asymmetricControls = [];
for (const source of [1, 2, 7]) {
  for (const factor of ASYMMETRY_FACTORS) {
    const residual = source + (-factor * source);
    assert.notEqual(residual, 0);
    asymmetricControls.push({ source, factor, residual });
  }
}

// Additive perturbations pass through as residuals rather than disappearing.
const perturbationControls = PERTURBATIONS.map((epsilon) => {
  const source = 7;
  const residual = source + (-source + epsilon);
  assert.ok(Math.abs(residual - epsilon) < 1e-12);
  return { epsilon, residual };
});

// A step-three clock is a declared downstream use of the three-record arity.
// It is not inferred from the scalar zero.
const arityClock = Array.from({ length: 8 }, (_, index) => 3 * (index + 1));
assert.deepEqual(arityClock, [3, 6, 9, 12, 15, 18, 21, 24]);

const commonClosure = CLOCK_PERIODS.reduce(lcm);
assert.equal(commonClosure, 360);
const clockCheckpoints = [36, 72, 360].map((tick) => ({
  tick,
  residues: Object.fromEntries(CLOCK_PERIODS.map((period) => [period, tick % period])),
}));
assert.deepEqual(clockCheckpoints, [
  { tick: 36, residues: { 18: 0, 24: 12, 30: 6 } },
  { tick: 72, residues: { 18: 0, 24: 0, 30: 12 } },
  { tick: 360, residues: { 18: 0, 24: 0, 30: 0 } },
]);

const receipt = {
  schema: "nexah.a0.tessarec-zero-split-memory-lift.receipt.v1",
  record_id: "A0_TESSAREC_ZERO_SPLIT_MEMORY_LIFT_ENGINEERING_CHECK_001",
  status: "PASS_EXACT_SPLIT_AND_MEMORY_DEPENDENCE_WITH_NO_ZERO_ONLY_LIFT",
  identity_effect: "REUSES_MOD_TESSAREC_NO_NEW_IDENTITY_NO_NEW_RELATION",
  checks: {
    C1_ONE_TO_TWO_SPLIT: {
      status: "PASS_EXACT_SPLIT_CARDINALITY",
      source_count: SOURCES.length,
      branch_count_per_source: 2,
    },
    C2_TWO_TO_ZERO_PROJECTION: {
      status: "PASS_EXACT_CANCELLATION",
      distinct_null_readouts: nullReadouts.size,
    },
    C3_ZERO_ONLY_INVERSION: {
      status: "PASS_NONINJECTIVE_NULL_PROJECTION",
      distinct_sources_with_same_zero: SOURCES.length,
      unique_reconstruction_from_zero: false,
    },
    C4_MEMORY_LIFT_TO_THREE: {
      status: "PASS_DECLARED_MEMORY_LIFT_CARDINALITY_THREE",
      roles: ["source", "plus", "minus"],
      unique_reconstruction_with_full_record: true,
    },
    C5_UNLABELLED_ORIENTATION: {
      status: "PASS_ORIENTATION_REQUIRES_LABELLED_SOURCE",
      tested_pairs: 4,
      orientation_recoverable_from_unlabelled_pair: false,
    },
    C6_ASYMMETRIC_CONTROLS: {
      status: "PASS_ASYMMETRY_REJECTS_NULL",
      cases: asymmetricControls.length,
      factors: ASYMMETRY_FACTORS,
    },
    C7_PERTURBATION_CONTROLS: {
      status: "PASS_RESIDUAL_PRESERVED",
      cases: perturbationControls.length,
    },
    C8_THREE_ARITY_CLOCK: {
      status: "PASS_DECLARED_COUPLING_ONLY",
      ticks: arityClock,
      derived_from_scalar_zero: false,
    },
    C9_THREE_CLOCK_BOUNDARY: {
      status: "PASS_EXACT_CHECKPOINT_CLASSIFICATION",
      periods: CLOCK_PERIODS,
      checkpoints: clockCheckpoints,
      first_common_closure: commonClosure,
    },
  },
  boundaries: {
    physics_claim: false,
    schumann_binding: false,
    tesla_historical_claim: false,
    mod77_identity: false,
    scientific_finding: false,
  },
};

process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
