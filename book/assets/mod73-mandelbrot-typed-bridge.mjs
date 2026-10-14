#!/usr/bin/env node

// Deterministic audit of the Mod-73 / Z_365 board and the c=-0.1087
// Mandelbrot parameter label. Writes no files. Not a Science Lab run.

import assert from "node:assert/strict";

const MODULUS = 365;
const MULTIPLIER = 64;
const MOD73 = 73;
const MANDELBROT_C = -1087 / 10_000;

function mod(value, modulus) {
  return ((value % modulus) + modulus) % modulus;
}

function gcd(left, right) {
  return right === 0 ? Math.abs(left) : gcd(right, left % right);
}

function multiplicativeOrder(value, modulus) {
  assert.equal(gcd(value, modulus), 1);
  let state = 1;
  for (let step = 1; step <= modulus; step += 1) {
    state = mod(state * value, modulus);
    if (state === 1) return step;
  }
  throw new Error("order not found within finite carrier bound");
}

function orbit(seed) {
  const values = [];
  let state = seed;
  do {
    values.push(state);
    state = mod(MULTIPLIER * state, MODULUS);
  } while (state !== seed);
  return values;
}

assert.equal(MODULUS, 5 * MOD73);
assert.equal(gcd(MULTIPLIER, MODULUS), 1);
assert.equal(multiplicativeOrder(MULTIPLIER, 5), 2);
assert.equal(multiplicativeOrder(MULTIPLIER, MOD73), 3);
assert.equal(multiplicativeOrder(MULTIPLIER, MODULUS), 6);
assert.equal(mod(MULTIPLIER ** 6, MODULUS), 1);
assert.equal(mod(154 * MULTIPLIER, MODULUS), 1);

const visited = new Set();
const orbits = [];
for (let seed = 0; seed < MODULUS; seed += 1) {
  if (visited.has(seed)) continue;
  const values = orbit(seed);
  for (const value of values) {
    assert.ok(!visited.has(value));
    visited.add(value);
  }
  orbits.push(values);
}
assert.equal(visited.size, MODULUS);

const classMap = new Map();
for (const values of orbits) {
  const divisorClass = gcd(values[0], MODULUS);
  const record = classMap.get(divisorClass) ?? {
    gcd_class: divisorClass,
    elements: 0,
    orbit_count: 0,
    orbit_lengths: new Set(),
    closure_failures: 0,
  };
  record.elements += values.length;
  record.orbit_count += 1;
  record.orbit_lengths.add(values.length);
  if (mod(values.reduce((sum, value) => sum + value, 0), MODULUS) !== 0) {
    record.closure_failures += 1;
  }
  classMap.set(divisorClass, record);
}

const orbitClasses = [...classMap.values()]
  .sort((a, b) => a.gcd_class - b.gcd_class)
  .map((record) => ({ ...record, orbit_lengths: [...record.orbit_lengths].sort((a, b) => a - b) }));
assert.deepEqual(orbitClasses, [
  { gcd_class: 1, elements: 288, orbit_count: 48, orbit_lengths: [6], closure_failures: 0 },
  { gcd_class: 5, elements: 72, orbit_count: 24, orbit_lengths: [3], closure_failures: 0 },
  { gcd_class: 73, elements: 4, orbit_count: 2, orbit_lengths: [2], closure_failures: 0 },
  { gcd_class: 365, elements: 1, orbit_count: 1, orbit_lengths: [1], closure_failures: 0 },
]);
assert.equal(orbits.length, 75);

const axis5 = [0, 73, 146, 219, 292];
const axisAction = axis5.map((value) => [value, mod(MULTIPLIER * value, MODULUS)]);
assert.deepEqual(axisAction, [[0, 0], [73, 292], [146, 219], [219, 146], [292, 73]]);
for (const value of axis5) {
  assert.equal(mod(MULTIPLIER * mod(MULTIPLIER * value, MODULUS), MODULUS), value);
}
assert.equal(mod(MULTIPLIER * 5, MODULUS), 320); // not a global reflection
assert.equal(mod(4774, MODULUS), 29);
assert.equal(mod(MULTIPLIER * 29, MODULUS), 31);

function iterateRealQuadratic(c, steps) {
  let z = 0;
  let maxAbs = 0;
  let escapedAt = null;
  for (let index = 1; index <= steps; index += 1) {
    z = z * z + c;
    maxAbs = Math.max(maxAbs, Math.abs(z));
    if (escapedAt === null && Math.abs(z) > 2) escapedAt = index;
  }
  return { z, max_abs: maxAbs, escaped_at: escapedAt };
}

// For real c in (-3/4, 1/4), the attracting fixed point lies in the main cardioid.
assert.ok(MANDELBROT_C > -0.75 && MANDELBROT_C < 0.25);
const fixedPoint = (1 - Math.sqrt(1 - 4 * MANDELBROT_C)) / 2;
const fixedMultiplier = 2 * fixedPoint;
assert.ok(Math.abs(fixedMultiplier) < 1);
const candidateOrbit = iterateRealQuadratic(MANDELBROT_C, 1000);
assert.equal(candidateOrbit.escaped_at, null);
assert.ok(Math.abs(candidateOrbit.z - fixedPoint) < 1e-14);

// Controls distinguish interior, boundary and exterior parameter roles.
const boundaryC = -0.75;
const boundaryFixedPoint = (1 - Math.sqrt(1 - 4 * boundaryC)) / 2;
assert.equal(Math.abs(2 * boundaryFixedPoint), 1);
const exteriorOrbit = iterateRealQuadratic(0.26, 1000);
assert.notEqual(exteriorOrbit.escaped_at, null);

const receipt = {
  schema: "nexah.a0.mod73-mandelbrot-typed-bridge.receipt.v1",
  record_id: "A0_MOD73_MANDELBROT_TYPED_BRIDGE_ENGINEERING_CHECK_001",
  status: "PASS_MOD73_ORBIT_CENSUS_AND_MANDELBROT_INTERIOR_BOUNDARY",
  identity_effect: "REUSES_EXISTING_T64_AND_MANDELBROT_INTAKE_LINES_NO_NEW_IDENTITY_NO_NEW_RELATION",
  checks: {
    C1_CRT_5_73_ORDER: {
      status: "PASS_EXACT_CRT_ORDER",
      modulus: MODULUS,
      factors: [5, MOD73],
      orders: { mod5: 2, mod73: 3, mod365: 6 },
      inverse_64_mod365: 154,
    },
    C2_FULL_ORBIT_CENSUS: {
      status: "PASS_EXACT_365_STATE_PARTITION",
      orbit_count: orbits.length,
      classes: orbitClasses,
    },
    C3_FIVE_AXIS: {
      status: "PASS_INVOLUTION_ON_A5_ONLY",
      axis: axis5,
      action: axisAction,
      global_reflection: false,
      counterexample: { input: 5, output: 320 },
    },
    C4_CONNECTOR_4774: {
      status: "PASS_EXACT_REDUCTION_AND_TRANSITION",
      reduction: { input: 4774, mod365: 29 },
      transition: { input: 29, output: 31 },
      selection_reason_established: false,
    },
    C5_MANDELBROT_PARAMETER: {
      status: "PASS_STANDARD_MAIN_CARDIOID_INTERIOR",
      c: MANDELBROT_C,
      fixed_point: fixedPoint,
      multiplier: fixedMultiplier,
      multiplier_abs: Math.abs(fixedMultiplier),
      iteration_1000: candidateOrbit,
      standard_boundary_claim: false,
    },
    C6_MANDELBROT_CONTROLS: {
      status: "PASS_INTERIOR_BOUNDARY_EXTERIOR_SEPARATION",
      boundary_control: { c: boundaryC, fixed_multiplier_abs: 1 },
      exterior_control: { c: 0.26, escaped_at: exteriorOrbit.escaped_at },
    },
    C7_SHARED_292_LABEL: {
      status: "PASS_NUMERIC_REUSE_ONLY",
      mod73_role: "292 = 4 * 73 is a member of A5 in Z_365",
      visual_role: "NCS Switch / 292 states is an owner-supplied board label",
      intertwiner_declared: false,
      object_identity: false,
    },
  },
  boundaries: {
    mod73_mandelbrot_identity: false,
    euler_lattice_is_standard_mandelbrot_structure: false,
    julia_weather_is_declared_operator: false,
    prime_corridor_mechanism: false,
    physical_resonance_claim: false,
    scientific_finding: false,
  },
};

process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
