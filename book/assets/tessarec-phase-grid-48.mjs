#!/usr/bin/env node

// Deterministic formal/engineering verifier for the candidate 7/17/19/29
// phase-grid relation. It writes no files and is not a Science Lab run.

import assert from "node:assert/strict";

const MODULUS = 48;
const QUARTER_SHIFT = 12;
const SEED_GRID = Object.freeze([[7, 17], [19, 29]]);
const ORBIT_STARTS = Object.freeze([1, 5, 7, 11]);
const SELECTED_ORBIT_STARTS = Object.freeze([5, 7]);
const CONTROL_ORBIT_STARTS = Object.freeze([1, 11]);
const GRAY_SEQUENCE = Object.freeze(
  Array.from({ length: 16 }, (_, step) => step ^ (step >> 1)),
);

function gcd(a, b) {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function isPrime(value) {
  if (!Number.isInteger(value) || value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function choose(n, k) {
  if (k < 0 || k > n) return 0;
  let result = 1;
  for (let index = 1; index <= Math.min(k, n - k); index += 1) {
    result = result * (n - index + 1) / index;
  }
  return result;
}

function fisherRightTail(a, b, c, d) {
  const row1 = a + b;
  const row2 = c + d;
  const successes = a + c;
  const total = row1 + row2;
  const maximum = Math.min(row1, successes);
  let probability = 0;
  for (let observed = a; observed <= maximum; observed += 1) {
    probability += choose(successes, observed) * choose(total - successes, row1 - observed) /
      choose(total, row1);
  }
  return probability;
}

function q(value) {
  return (value + QUARTER_SHIFT) % MODULUS;
}

function orbit(start) {
  return Array.from({ length: 4 }, (_, index) =>
    (start + index * QUARTER_SHIFT) % MODULUS);
}

function hammingDistance(a, b) {
  let value = a ^ b;
  let count = 0;
  while (value) {
    count += value & 1;
    value >>= 1;
  }
  return count;
}

function complexMultiply([a, b], [c, d]) {
  return [a * c - b * d, a * d + b * c];
}

function dft(values) {
  return values.map((_, frequency) => {
    let real = 0;
    let imaginary = 0;
    for (let index = 0; index < values.length; index += 1) {
      const angle = -2 * Math.PI * frequency * index / values.length;
      real += values[index] * Math.cos(angle);
      imaginary += values[index] * Math.sin(angle);
    }
    return [real, imaginary];
  });
}

function maxComplexDelta(left, right) {
  assert.equal(left.length, right.length);
  return Math.max(...left.map(([a, b], index) =>
    Math.hypot(a - right[index][0], b - right[index][1])));
}

function paperFAddress(step) {
  assert(Number.isInteger(step) && step >= 0 && step < MODULUS);
  const local = step % 16;
  return {
    step,
    layer: Math.floor(step / 16),
    local,
    q4: GRAY_SEQUENCE[local],
  };
}

function counts(values) {
  return Object.fromEntries(
    [...new Set(values)].sort((a, b) => a - b)
      .map((value) => [String(value), values.filter((item) => item === value).length]),
  );
}

export function verifyPhaseGrid48() {
  // T1 — exact arithmetic lattice.
  const flatGrid = SEED_GRID.flat();
  const rowSums = SEED_GRID.map((row) => row[0] + row[1]);
  const columnSums = [SEED_GRID[0][0] + SEED_GRID[1][0], SEED_GRID[0][1] + SEED_GRID[1][1]];
  const diagonalSums = [SEED_GRID[0][0] + SEED_GRID[1][1], SEED_GRID[0][1] + SEED_GRID[1][0]];
  const total = flatGrid.reduce((sum, value) => sum + value, 0);
  const mean = total / flatGrid.length;
  const offsets = flatGrid.map((value) => value - mean);
  assert.deepEqual(rowSums, [24, 48]);
  assert.deepEqual(columnSums, [26, 46]);
  assert.deepEqual(diagonalSums, [36, 36]);
  assert.equal(total, 72);
  assert.equal(mean, 18);
  assert.deepEqual(offsets, [-11, -1, 1, 11]);
  for (let a = 0; a < 2; a += 1) {
    for (let b = 0; b < 2; b += 1) {
      assert.equal(SEED_GRID[b][a], 7 + 10 * a + 12 * b);
    }
  }

  // T2 — complete quarter-turn orbit decomposition on Z/48Z.
  const orbits = ORBIT_STARTS.map(orbit);
  for (let value = 0; value < MODULUS; value += 1) {
    assert.equal(q(q(q(q(value)))), value);
    assert.notEqual(q(value), value);
    assert.notEqual(q(q(value)), value);
    assert.notEqual(q(q(q(value))), value);
  }
  const units = Array.from({ length: MODULUS }, (_, value) => value)
    .filter((value) => gcd(value, MODULUS) === 1);
  assert.deepEqual([...orbits.flat()].sort((a, b) => a - b), units);
  assert.deepEqual(orbit(7), [7, 19, 31, 43]);
  assert.deepEqual(orbit(17), [17, 29, 41, 5]);

  // T3 — post-hoc selection control. The p-value is descriptive only because
  // the prime-rich pair of orbits was noticed before this check was frozen.
  const selected = SELECTED_ORBIT_STARTS.flatMap(orbit);
  const controls = CONTROL_ORBIT_STARTS.flatMap(orbit);
  const selectedPrimeCount = selected.filter(isPrime).length;
  const controlPrimeCount = controls.filter(isPrime).length;
  const descriptiveFisherRightP = fisherRightTail(
    selectedPrimeCount,
    selected.length - selectedPrimeCount,
    controlPrimeCount,
    controls.length - controlPrimeCount,
  );
  assert.equal(selectedPrimeCount, 8);
  assert.equal(controlPrimeCount, 5);
  assert(Math.abs(descriptiveFisherRightP - 0.1) < 1e-12);

  // T4 — DFT circular-shift theorem. The sign is fixed by the DFT convention
  // used here; the magnitude of the fundamental phase shift is 90 degrees.
  const signal = Array.from({ length: MODULUS }, (_, index) =>
    Math.sin(2 * Math.PI * 5 * index / MODULUS) +
    0.37 * Math.cos(2 * Math.PI * 11 * index / MODULUS) +
    (index % 7) / 19);
  const shiftedSignal = signal.map((_, index) =>
    signal[(index - QUARTER_SHIFT + MODULUS) % MODULUS]);
  const spectrum = dft(signal);
  const shiftedSpectrum = dft(shiftedSignal);
  const predictedSpectrum = spectrum.map((coefficient, frequency) => {
    const angle = -2 * Math.PI * frequency * QUARTER_SHIFT / MODULUS;
    return complexMultiply(coefficient, [Math.cos(angle), Math.sin(angle)]);
  });
  const fourierMaxDelta = maxComplexDelta(shiftedSpectrum, predictedSpectrum);
  assert(fourierMaxDelta < 1e-10);

  // T5 — current Paper-F display-address binding. The +12 index shift is a
  // permutation of order four, but it is not a single fixed product operator
  // on the displayed P3 layer and Q4 Gray address.
  const bindingRows = Array.from({ length: MODULUS }, (_, step) => {
    const from = paperFAddress(step);
    const to = paperFAddress(q(step));
    return {
      layerDeltaMod3: (to.layer - from.layer + 3) % 3,
      localDeltaMod16: (to.local - from.local + 16) % 16,
      q4XorMask: from.q4 ^ to.q4,
      q4HammingDistance: hammingDistance(from.q4, to.q4),
    };
  });
  const layerDeltaCounts = counts(bindingRows.map((row) => row.layerDeltaMod3));
  const localDeltaCounts = counts(bindingRows.map((row) => row.localDeltaMod16));
  const xorMaskCounts = counts(bindingRows.map((row) => row.q4XorMask));
  const hammingCounts = counts(bindingRows.map((row) => row.q4HammingDistance));
  assert.deepEqual(layerDeltaCounts, { "0": 12, "1": 36 });
  assert.deepEqual(localDeltaCounts, { "12": 48 });
  assert.deepEqual(xorMaskCounts, { "6": 24, "10": 24 });
  assert.deepEqual(hammingCounts, { "2": 48 });
  const fixedLayerOperator = Object.keys(layerDeltaCounts).length === 1;
  const fixedQ4Operator = Object.keys(xorMaskCounts).length === 1;
  assert.equal(fixedLayerOperator, false);
  assert.equal(fixedQ4Operator, false);

  // T6 — the displayed numeric order itself is not an equal quadrature cycle.
  const cyclicGaps = flatGrid.map((value, index) =>
    (flatGrid[(index + 1) % flatGrid.length] - value + MODULUS) % MODULUS);
  const cyclicGapDegrees = cyclicGaps.map((gap) => gap * 360 / MODULUS);
  assert.deepEqual(cyclicGaps, [10, 2, 10, 26]);
  assert.deepEqual(cyclicGapDegrees, [75, 15, 75, 195]);

  return {
    status: "PASS_WITH_NEGATIVE_BINDING_RESULT",
    classification: "ENGINEERING_FORMAL_CHECK_NOT_SCIENCE_RUN",
    identity_effect: "REUSES_MOD_TESSAREC_NO_NEW_STUDY_NO_NEW_RELATION",
    tests: {
      T1_ARITHMETIC_LATTICE: {
        status: "PASS",
        grid: SEED_GRID,
        affine_form: "7 + 10a + 12b; a,b in {0,1}",
        row_sums: rowSums,
        column_sums: columnSums,
        diagonal_sums: diagonalSums,
        total,
        mean,
        offsets,
      },
      T2_Z48_QUARTER_TURN: {
        status: "PASS",
        operator: "Q(n) = n + 12 mod 48",
        order: 4,
        phase_degrees_per_application: 90,
        unit_orbits: orbits,
      },
      T3_POST_HOC_PRIME_SELECTION_CONTROL: {
        status: "DESCRIPTIVE_ONLY",
        selected_orbits: selected,
        selected_prime_count: selectedPrimeCount,
        control_orbits: controls,
        control_prime_count: controlPrimeCount,
        fisher_right_tail_p: descriptiveFisherRightP,
        inference_authorized: false,
      },
      T4_FOURIER_SHIFT: {
        status: "PASS",
        convention: "DFT exp(-2 pi i k n / 48); signal shifted right by 12",
        factor: "exp(-i k pi / 2)",
        fundamental_phase_degrees: -90,
        max_complex_delta: fourierMaxDelta,
        tolerance: 1e-10,
      },
      T5_CURRENT_PAPER_F_BINDING: {
        status: "NEGATIVE_BINDING_RESULT",
        display_index_shift_order: 4,
        layer_delta_counts: layerDeltaCounts,
        local_delta_counts: localDeltaCounts,
        q4_xor_mask_counts: xorMaskCounts,
        q4_hamming_distance_counts: hammingCounts,
        fixed_layer_operator: fixedLayerOperator,
        fixed_q4_operator: fixedQ4Operator,
        factorized_p3_x_q4_operator_established: false,
      },
      T6_LITERAL_SEQUENCE_QUADRATURE: {
        status: "NEGATIVE_RESULT",
        sequence: flatGrid,
        cyclic_gaps_mod48: cyclicGaps,
        cyclic_gap_degrees: cyclicGapDegrees,
        equal_quarter_turn_sequence: false,
      },
    },
    conclusion: {
      formal_z48_quarter_turn: "SUPPORTED",
      direct_binding_to_current_paper_f_carrier: "NOT_ESTABLISHED",
      literal_7_17_19_29_quadrature_sequence: "REFUTED",
      prime_enrichment: "POST_HOC_UNINFORMATIVE_FOR_INFERENCE",
    },
    writes_files: false,
    authorized_science_run: false,
  };
}

if (process.argv.length !== 3 || process.argv[2] !== "--verify") {
  console.error("Usage: node tessarec-phase-grid-48.mjs --verify");
  process.exitCode = 2;
} else {
  console.log(JSON.stringify(verifyPhaseGrid48(), null, 2));
}
