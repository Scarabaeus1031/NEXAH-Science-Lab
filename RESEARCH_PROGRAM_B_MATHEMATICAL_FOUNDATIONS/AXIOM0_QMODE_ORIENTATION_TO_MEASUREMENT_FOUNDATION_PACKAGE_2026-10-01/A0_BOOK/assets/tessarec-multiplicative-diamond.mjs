#!/usr/bin/env node

// Deterministic post-hoc formal audit of the 24/48/72/144 multiplicative
// diamond. Writes no files. This is not an authorized Science Lab run.

import assert from "node:assert/strict";

const P1 = 2;
const P2 = 3;
const GON_QUARTET = Object.freeze([7, 17, 19, 29]);

function gcd(a, b) {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function isPrime(value) {
  if (!Number.isInteger(value) || value < 2) return false;
  for (let divisor = 2; divisor * divisor <= value; divisor += 1) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function combinations(values, size) {
  const output = [];
  function visit(start, selected) {
    if (selected.length === size) {
      output.push([...selected]);
      return;
    }
    for (let index = start; index <= values.length - (size - selected.length); index += 1) {
      selected.push(values[index]);
      visit(index + 1, selected);
      selected.pop();
    }
  }
  visit(0, []);
  return output;
}

function quartetProperties([a, b, c, d]) {
  const lowerRow = a + b;
  const upperRow = c + d;
  return {
    lowerRow,
    upperRow,
    total: a + b + c + d,
    centralBalance: a + d === b + c,
    doubledRows: upperRow === 2 * lowerRow,
    exact2448: lowerRow === 24 && upperRow === 48,
  };
}

function enumerateQuartets(universe) {
  const quartets = combinations(universe, 4);
  const records = quartets.map((quartet) => ({ quartet, ...quartetProperties(quartet) }));
  const shapeHits = records.filter((record) => record.centralBalance && record.doubledRows);
  const exactHits = records.filter((record) => record.exact2448);
  const jointHits = records.filter((record) =>
    record.centralBalance && record.doubledRows && record.exact2448);
  return {
    universe,
    quartets: quartets.length,
    central_balance_hits: records.filter((record) => record.centralBalance).length,
    doubled_row_hits: records.filter((record) => record.doubledRows).length,
    shape_hits: shapeHits.map((record) => record.quartet),
    exact_24_48_hits: exactHits.map((record) => record.quartet),
    joint_hits: jointHits.map((record) => record.quartet),
    joint_rate: jointHits.length / quartets.length,
  };
}

function diamond(p, q) {
  const base = p ** q * q;
  const carrier = p * base;
  const crossPower = p ** q * q ** p;
  const closure = p * crossPower;
  return {
    seed: [p, q],
    base,
    carrier,
    crossPower,
    closure,
    eastRatio: carrier / base,
    southRatio: crossPower / base,
    northEastToSouthEastRatio: closure / carrier,
    southWestToSouthEastRatio: closure / crossPower,
  };
}

export function verifyMultiplicativeDiamond() {
  // M1 — exact (2,3) exponent rectangle.
  const primary = diamond(P1, P2);
  assert.deepEqual(primary, {
    seed: [2, 3],
    base: 24,
    carrier: 48,
    crossPower: 72,
    closure: 144,
    eastRatio: 2,
    southRatio: 3,
    northEastToSouthEastRatio: 3,
    southWestToSouthEastRatio: 2,
  });
  assert.equal(gcd(primary.carrier, primary.crossPower), primary.base);
  assert.equal(lcm(primary.carrier, primary.crossPower), primary.closure);

  // M2 — exact numeric binding supplied by the sorted gon quartet.
  const gon = quartetProperties(GON_QUARTET);
  assert.equal(gon.lowerRow, primary.base);
  assert.equal(gon.upperRow, primary.carrier);
  assert.equal(gon.total, primary.crossPower);
  assert.equal(gon.centralBalance, true);
  assert.equal(gon.doubledRows, true);
  assert.equal(gon.exact2448, true);

  // M3/M4 — fully enumerated matched finite controls. These are descriptive
  // rates, not confirmatory p-values, because the quartet and bounds are known.
  const primeUniverse = Array.from({ length: 43 }, (_, index) => index + 5).filter(isPrime);
  const oddUniverse = Array.from({ length: 22 }, (_, index) => 5 + 2 * index);
  const primeControl = enumerateQuartets(primeUniverse);
  const oddControl = enumerateQuartets(oddUniverse);
  assert.equal(primeControl.quartets, 715);
  assert.equal(primeControl.shape_hits.length, 6);
  assert.equal(primeControl.exact_24_48_hits.length, 3);
  assert.deepEqual(primeControl.joint_hits, [GON_QUARTET]);
  assert.equal(oddControl.quartets, 7315);
  assert.equal(oddControl.shape_hits.length, 25);
  assert.equal(oddControl.exact_24_48_hits.length, 14);
  assert.deepEqual(oddControl.joint_hits, [
    GON_QUARTET,
    [9, 15, 21, 27],
    [11, 13, 23, 25],
  ]);

  // M5 — novelty control. The commuting exponent rectangle is a generic
  // construction for positive p,q; it is not special to the prime seed (2,3).
  const genericSeeds = [[2, 3], [2, 5], [3, 5], [3, 7]];
  const genericDiamonds = genericSeeds.map(([p, q]) => diamond(p, q));
  for (const record of genericDiamonds) {
    assert.equal(record.carrier * record.southRatio, record.closure);
    assert.equal(record.crossPower * record.eastRatio, record.closure);
  }

  return {
    status: "PASS_POST_HOC_FORMAL_AUDIT",
    classification: "ENGINEERING_FORMAL_CHECK_NOT_SCIENCE_RUN",
    identity_effect: "REUSES_MOD_TESSAREC_NO_NEW_STUDY_NO_NEW_RELATION",
    tests: {
      M1_EXPONENT_DIAMOND: {
        status: "PASS",
        formulas: {
          base: "p1^p2 * p2",
          carrier: "p1^(p2+1) * p2",
          cross_power: "p1^p2 * p2^p1",
          closure: "p1^(p2+1) * p2^p1",
        },
        values: primary,
        gcd_48_72: gcd(48, 72),
        lcm_48_72: lcm(48, 72),
      },
      M2_GON_SUM_BINDING: {
        status: "PASS_NUMERIC_IDENTITY",
        quartet: GON_QUARTET,
        sorted_layout: [[7, 17], [19, 29]],
        lower_row: gon.lowerRow,
        upper_row: gon.upperRow,
        total: gon.total,
        equal_diagonals: [7 + 29, 17 + 19],
        operator_identity_established: false,
      },
      M3_PRIME_QUARTET_CONTROL_UNDER_48: {
        status: "DESCRIPTIVE_EXACT_ENUMERATION",
        ...primeControl,
        interpretation: "unique joint hit among 715 sorted prime quartets in the frozen universe",
        inference_authorized: false,
      },
      M4_ODD_QUARTET_CONTROL_UNDER_48: {
        status: "DESCRIPTIVE_EXACT_ENUMERATION",
        ...oddControl,
        interpretation: "three joint hits among 7315 sorted odd quartets in the frozen universe",
        inference_authorized: false,
      },
      M5_GENERICITY_CONTROL: {
        status: "NEGATIVE_NOVELTY_RESULT",
        checked_seeds: genericDiamonds,
        exponent_diamond_is_generic: true,
        special_candidate_is_cross_binding_not_diamond_alone: true,
      },
    },
    conclusion: {
      arithmetic_diamond_24_48_72_144: "SUPPORTED",
      gon_sum_cross_binding: "SUPPORTED_AS_NUMERIC_IDENTITY",
      uniqueness_in_frozen_prime_control: "SUPPORTED_DESCRIPTIVELY",
      exponent_diamond_novelty: "REFUTED_GENERIC_CONSTRUCTION",
      tessarec_operator_binding: "NOT_TESTED_NOT_ESTABLISHED",
      new_finding: false,
    },
    writes_files: false,
    authorized_science_run: false,
  };
}

if (process.argv.length !== 3 || process.argv[2] !== "--verify") {
  console.error("Usage: node tessarec-multiplicative-diamond.mjs --verify");
  process.exitCode = 2;
} else {
  console.log(JSON.stringify(verifyMultiplicativeDiamond(), null, 2));
}
