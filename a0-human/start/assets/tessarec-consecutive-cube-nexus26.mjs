#!/usr/bin/env node

// Deterministic arithmetic audit of the historical 23-24-25 / 26-handle panel.
// Writes no files. This is not an authorized Science Lab run.

import assert from "node:assert/strict";

const CENTER = 24;
const HANDLE = 26;
const MODULUS = 77;
const LOCAL_HANDLES = Array.from({ length: 13 }, (_, index) => 20 + index);
const IDEMPOTENTS_77 = [0, 1, 22, 56];

function mod(value, modulus) {
  return ((value % modulus) + modulus) % modulus;
}

function centeredTriple(n) {
  return (n - 1) ** 3 + n ** 3 + (n + 1) ** 3;
}

function centeredTripleClosedForm(n) {
  return 3 * n * (n ** 2 + 2);
}

function fourConsecutiveFromCenter(n) {
  return centeredTriple(n) + (n + 2) ** 3;
}

function fourConsecutiveClosedForm(n) {
  return 2 * (2 * n + 1) * (n ** 2 + n + 4);
}

function exactSquareRoot(value) {
  const root = Math.floor(Math.sqrt(value));
  return root * root === value ? root : null;
}

function exactTriangularIndex(value) {
  const discriminant = 8 * value + 1;
  const root = exactSquareRoot(discriminant);
  if (root === null || (root - 1) % 2 !== 0) return null;
  return (root - 1) / 2;
}

function isIdempotent77(value) {
  return mod(value * value, MODULUS) === mod(value, MODULUS);
}

// Symbolic identities are exhaustively checked on a declared finite integer window.
for (let n = -200; n <= 200; n += 1) {
  assert.equal(centeredTriple(n), centeredTripleClosedForm(n));
  assert.equal(fourConsecutiveFromCenter(n), fourConsecutiveClosedForm(n));
}

const core = centeredTriple(CENTER);
const extension = core + HANDLE ** 3;

assert.equal(core, 41_616);
assert.equal(core, 204 ** 2);
assert.equal(core, (12 * 17) ** 2);
assert.equal(core, 2 ** 4 * 3 ** 2 * 17 ** 2);
assert.equal(exactSquareRoot(core), 204);
assert.equal(exactTriangularIndex(core), 288);
assert.equal(288 * 289 / 2, core);

assert.equal(17, HANDLE - 9);
assert.equal(HANDLE, 2 * 13);
assert.equal(HANDLE ** 3, 17_576);
assert.equal(extension, 59_192);
assert.equal(extension, fourConsecutiveFromCenter(CENTER));
assert.equal(extension, 2 ** 3 * 7 ** 2 * 151);
assert.equal(exactSquareRoot(extension), null);
assert.equal(exactTriangularIndex(extension), null);

const core77 = mod(core, MODULUS);
const handleCube77 = mod(HANDLE ** 3, MODULUS);
const extension77 = mod(extension, MODULUS);
assert.equal(core77, 36);
assert.equal(handleCube77, 20);
assert.equal(extension77, 56);
assert.deepEqual([mod(extension77, 7), mod(extension77, 11)], [0, 1]);
assert.ok(isIdempotent77(extension77));
assert.deepEqual(
  Array.from({ length: MODULUS }, (_, value) => value).filter(isIdempotent77),
  IDEMPOTENTS_77,
);

function handleRecord(handle) {
  const residue = mod(core + handle ** 3, MODULUS);
  return {
    handle,
    residue,
    crt_7_11: [mod(residue, 7), mod(residue, 11)],
    idempotent: isIdempotent77(residue),
  };
}

const localRecords = LOCAL_HANDLES.map(handleRecord);
const localIdempotentHits = localRecords.filter((record) => record.idempotent);
assert.deepEqual(
  localIdempotentHits.map(({ handle, residue }) => [handle, residue]),
  [[24, 0], [26, 56]],
);

const residueClassHits = Array.from({ length: MODULUS }, (_, handle) => handleRecord(handle))
  .filter((record) => record.idempotent);
assert.deepEqual(
  residueClassHits.map(({ handle, residue }) => [handle, residue]),
  [[13, 0], [24, 0], [26, 56], [35, 22], [48, 56], [59, 56], [68, 0], [70, 1]],
);

const squareTriangularCensus = [];
for (let n = 1; n <= 200; n += 1) {
  const value = centeredTriple(n);
  const squareRoot = exactSquareRoot(value);
  const triangularIndex = exactTriangularIndex(value);
  if (squareRoot !== null && triangularIndex !== null) {
    squareTriangularCensus.push({ n, value, square_root: squareRoot, triangular_index: triangularIndex });
  }
}
assert.deepEqual(squareTriangularCensus, [
  { n: 2, value: 36, square_root: 6, triangular_index: 8 },
  { n: 24, value: 41_616, square_root: 204, triangular_index: 288 },
]);

const receipt = {
  schema: "nexah.a0.tessarec-consecutive-cube-nexus26.receipt.v1",
  record_id: "A0_TESSAREC_CONSECUTIVE_CUBE_NEXUS26_ENGINEERING_CHECK_001",
  status: "PASS_EXACT_CORE_AND_MOD77_TRANSLATION_WITH_NONUNIQUE_HANDLE",
  identity_effect: "REUSES_MOD_TESSAREC_RELATES_TO_PBM_MOD77_NO_NEW_IDENTITY_NO_NEW_RELATION",
  checks: {
    C1_CENTERED_CUBE_IDENTITY: {
      status: "PASS_EXACT_IDENTITY",
      checked_integer_window: [-200, 200],
      center: CENTER,
      triple: [23, 24, 25],
      value: core,
    },
    C2_SQUARE_TRIANGULAR_FACTOR: {
      status: "PASS_EXACT_SQUARE_AND_TRIANGULAR",
      square_root: 204,
      triangular_index: 288,
      prime_factorization: "2^4 * 3^2 * 17^2",
      split: "(12 * 17)^2",
    },
    C3_HANDLE_EXTENSION: {
      status: "PASS_EXACT_FOURTH_CUBE_EXTENSION",
      handle: HANDLE,
      handle_cube: HANDLE ** 3,
      extended_value: extension,
      extended_factorization: "2^3 * 7^2 * 151",
      extended_is_square: false,
      extended_is_triangular: false,
    },
    C4_MOD77_TRANSLATION: {
      status: "PASS_EXACT_TRANSLATION_TO_IDEMPOTENT_56",
      core_residue: core77,
      handle_cube_residue: handleCube77,
      extended_residue: extension77,
      extended_crt_7_11: [0, 1],
      idempotents_mod77: IDEMPOTENTS_77,
    },
    C5_LOCAL_HANDLE_CONTROL: {
      status: "PASS_NONUNIQUE_LOCAL_IDEMPOTENT_HIT",
      handle_window: [20, 32],
      hits: localIdempotentHits,
      handle_26_unique_among_all_idempotent_hits: false,
      handle_26_unique_nonzero_projector_in_local_window: true,
    },
    C6_FULL_RESIDUE_CONTROL: {
      status: "PASS_NONUNIQUE_GLOBAL_RESIDUE_CLASS",
      handle_residue_window: [0, 76],
      hit_count: residueClassHits.length,
      hits: residueClassHits,
    },
    C7_CENTER_CENSUS: {
      status: "PASS_FINITE_CENSUS_NOT_GLOBAL_UNIQUENESS",
      center_window: [1, 200],
      square_and_triangular_hits: squareTriangularCensus,
    },
  },
  boundaries: {
    physical_field_energy_claim: false,
    tesla_mechanism_claim: false,
    nexus_handle_privilege_claim: false,
    global_uniqueness_claim: false,
    scientific_finding: false,
  },
};

process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
