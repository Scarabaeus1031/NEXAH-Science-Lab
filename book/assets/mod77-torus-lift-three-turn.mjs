#!/usr/bin/env node

// Deterministic post-hoc engineering audit of the Mod-77 torus carrier,
// the 23/67 order-three multiplier and the lifted return at 1541.
// Writes no files. This is not an authorized Science Lab run.

import assert from "node:assert/strict";

const MODULUS = 77;
const MOD_A = 7;
const MOD_B = 11;
const MULTIPLIER = 23;
const INVERSE_MULTIPLIER = 67;
const LIFTED_VALUE = 1541;

function mod(value, modulus = MODULUS) {
  return ((value % modulus) + modulus) % modulus;
}

function gcd(left, right) {
  return right === 0 ? Math.abs(left) : gcd(right, left % right);
}

function crtCoordinate(value) {
  return [mod(value, MOD_A), mod(value, MOD_B)];
}

function crtInverse([a, b]) {
  return mod(22 * a + 56 * b);
}

function torusNeighbors([a, b]) {
  return [
    [mod(a + 1, MOD_A), b],
    [mod(a - 1, MOD_A), b],
    [a, mod(b + 1, MOD_B)],
    [a, mod(b - 1, MOD_B)],
  ];
}

function canonicalEdge(left, right) {
  const leftKey = left.join(",");
  const rightKey = right.join(",");
  return leftKey < rightKey ? `${leftKey}|${rightKey}` : `${rightKey}|${leftKey}`;
}

function orbit(start, map) {
  const values = [];
  let current = start;
  do {
    values.push(current);
    current = map(current);
    if (values.length > MODULUS + 1) throw new Error("orbit did not close");
  } while (current !== start);
  return values;
}

function cycleDecomposition(map) {
  const seen = new Set();
  const cycles = [];
  for (let start = 0; start < MODULUS; start += 1) {
    if (seen.has(start)) continue;
    const cycle = orbit(start, map);
    for (const value of cycle) seen.add(value);
    cycles.push(cycle);
  }
  return cycles;
}

function affineInteger(rung) {
  return 12 * 2 ** rung + 5;
}

function affineResidue(rung) {
  return mod(affineInteger(rung));
}

export function verifyMod77TorusLiftThreeTurn() {
  // B1 — exact CRT carrier and inverse over all 77 residues.
  const coordinates = Array.from({ length: MODULUS }, (_, value) => crtCoordinate(value));
  assert.equal(new Set(coordinates.map((coordinate) => coordinate.join(","))).size, MODULUS);
  for (let value = 0; value < MODULUS; value += 1) {
    assert.equal(crtInverse(crtCoordinate(value)), value);
  }

  // B2 — C7 square C11 with standard wrap-around adjacency.
  const vertices = [];
  const edgeSet = new Set();
  for (let a = 0; a < MOD_A; a += 1) {
    for (let b = 0; b < MOD_B; b += 1) {
      const vertex = [a, b];
      vertices.push(vertex);
      const neighbors = torusNeighbors(vertex);
      assert.equal(new Set(neighbors.map((neighbor) => neighbor.join(","))).size, 4);
      for (const neighbor of neighbors) edgeSet.add(canonicalEdge(vertex, neighbor));
    }
  }
  assert.equal(vertices.length, 77);
  assert.equal(edgeSet.size, 154);

  // B3 — additive +1 becomes the diagonal (+1,+1) Hamiltonian cycle.
  const additiveOrbit = orbit(0, (value) => mod(value + 1));
  assert.equal(additiveOrbit.length, 77);
  assert.deepEqual(additiveOrbit.map(crtCoordinate).slice(0, 4), [[0, 0], [1, 1], [2, 2], [3, 3]]);

  // B4 — multiplication by 23 is an order-three permutation. Multiplication
  // by 67 is its inverse; mod 11 is fixed while mod 7 rotates by x -> 2x.
  assert.equal(gcd(MULTIPLIER, MODULUS), 1);
  assert.equal(mod(MULTIPLIER * INVERSE_MULTIPLIER), 1);
  assert.equal(mod(MULTIPLIER ** 2), INVERSE_MULTIPLIER);
  assert.equal(mod(MULTIPLIER ** 3), 1);
  assert.deepEqual(orbit(1, (value) => mod(MULTIPLIER * value)), [1, 23, 67]);
  assert.deepEqual([1, 23, 67].map(crtCoordinate), [[1, 1], [2, 1], [4, 1]]);

  const multiplierCycles = cycleDecomposition((value) => mod(MULTIPLIER * value));
  const cycleCounts = Object.fromEntries(
    [...new Set(multiplierCycles.map((cycle) => cycle.length))]
      .sort((left, right) => left - right)
      .map((length) => [length, multiplierCycles.filter((cycle) => cycle.length === length).length]),
  );
  assert.deepEqual(cycleCounts, { 1: 11, 3: 22 });
  assert(multiplierCycles.filter((cycle) => cycle.length === 1).every(([value]) => value % 7 === 0));

  // B5 — exact factor, sum and polynomial readouts.
  assert.equal(MULTIPLIER * INVERSE_MULTIPLIER, LIFTED_VALUE);
  assert.equal(MULTIPLIER + INVERSE_MULTIPLIER, 90);
  assert.equal(mod(MULTIPLIER + INVERSE_MULTIPLIER), 13);
  assert.equal(6 + 7, 13);
  for (const root of [MULTIPLIER, INVERSE_MULTIPLIER]) {
    assert.equal(mod(root ** 2 - 13 * root + 1), 0);
  }

  // B6 — quotient return with a nonzero integer lift.
  const quotientState = mod(LIFTED_VALUE);
  const windingCount = (LIFTED_VALUE - quotientState) / MODULUS;
  assert.equal(quotientState, 1);
  assert.deepEqual(crtCoordinate(LIFTED_VALUE), [1, 1]);
  assert.equal(windingCount, 20);

  // B7 — +4 affine prime trajectory, projected to Mod 77.
  const affineResidues = Array.from({ length: 31 }, (_, rung) => affineResidue(rung));
  assert.deepEqual(affineResidues.slice(0, 8), [17, 29, 53, 24, 43, 4, 3, 1]);
  assert.equal(affineInteger(7), LIFTED_VALUE);
  assert.equal(affineResidues[7], 1);
  assert.equal(affineResidues[30], affineResidues[0]);
  assert(!affineResidues.slice(1, 30).includes(affineResidues[0]));
  for (let rung = 0; rung < 30; rung += 1) {
    assert.equal(affineResidues[rung + 1], mod(2 * affineResidues[rung] - 5));
  }

  // B8 — if and only if visual time t indexes the affine rung, t=36 aliases
  // t=6 under the period-30 quotient orbit. No crossing follows without a
  // separately declared observable or embedding.
  assert.equal(affineResidue(36), affineResidue(6));
  assert.equal(affineResidue(36), 3);

  // B9 — decimal split 15|41 is representation-dependent. Its additive
  // readout 56 happens to be the standard CRT idempotent for the mod-11 slot.
  const crtProjectorA = 22;
  const crtProjectorB = 56;
  assert.equal(15 + 41, crtProjectorB);
  assert.equal(mod(crtProjectorA ** 2), crtProjectorA);
  assert.equal(mod(crtProjectorB ** 2), crtProjectorB);
  assert.equal(mod(crtProjectorA * crtProjectorB), 0);
  assert.equal(mod(crtProjectorA + crtProjectorB), 1);

  return {
    status: "PASS_EXACT_MOD77_TORUS_LIFT_WITH_OPEN_CROSSING_BINDING",
    classification: "ENGINEERING_FORMAL_CHECK_NOT_SCIENCE_RUN",
    identity_effect: "REUSES_PBM_MOD77_AND_MOD_TESSAREC_NO_NEW_IDENTITY_OR_RELATION",
    frozen_parameters: {
      modulus: MODULUS,
      crt_moduli: [MOD_A, MOD_B],
      multiplier: MULTIPLIER,
      inverse_multiplier: INVERSE_MULTIPLIER,
      lifted_value: LIFTED_VALUE,
      torus_adjacency: "C7_CARTESIAN_PRODUCT_C11_WITH_PLUS_MINUS_UNIT_EDGES",
      affine_trajectory: "c_n=12*2^n+5",
    },
    tests: {
      B1_CRT77_CARRIER: {
        status: "PASS_EXACT_BIJECTION",
        carrier_size: coordinates.length,
        inverse: "n=22a+56b mod 77",
      },
      B2_DISCRETE_TORUS_GRAPH: {
        status: "PASS_EXACT_UNDER_DECLARED_ADJACENCY",
        graph: "C7 square C11",
        vertices: vertices.length,
        undirected_edges: edgeSet.size,
        degree: 4,
      },
      B3_ADDITIVE_DIAGONAL_ORBIT: {
        status: "PASS_EXACT_HAMILTONIAN_CYCLE",
        step: "n -> n+1 mod 77; (a,b)->(a+1,b+1)",
        orbit_length: additiveOrbit.length,
      },
      B4_MULTIPLICATIVE_THREE_TURN: {
        status: "PASS_EXACT_ORDER_THREE_PERMUTATION",
        orbit_from_one: [1, 23, 67],
        crt_orbit_from_one: [[1, 1], [2, 1], [4, 1]],
        cycle_counts: cycleCounts,
        interpretation: "mod11 fiber fixed; mod7 coordinate rotates by multiplication by 2",
      },
      B5_FACTOR_SUM_RETURN: {
        status: "PASS_EXACT",
        product: "23*67=1541",
        product_mod_77: 1,
        sum: 90,
        sum_mod_77: 13,
        additive_readout: "6+7=13",
        polynomial_mod_77: "x^2-13x+1 has roots 23 and 67",
      },
      B6_NONZERO_LIFT_RETURN: {
        status: "PASS_EXACT_QUOTIENT_RETURN",
        equation: "1541=20*77+1",
        quotient_state: quotientState,
        crt_state: [1, 1],
        winding_count: windingCount,
        crossing_event_authorized: false,
      },
      B7_AFFINE_TRAJECTORY_PROJECTION: {
        status: "PASS_EXACT_PERIOD_30",
        recurrence_mod_77: "r_(n+1)=2r_n-5",
        initial_residues: affineResidues.slice(0, 8),
        period: 30,
        rung_7_integer: affineInteger(7),
        rung_7_residue: affineResidues[7],
      },
      B8_TIME_36_BINDING: {
        status: "OPEN_CONDITIONAL_ALIAS_ONLY",
        condition: "visual time t must equal affine rung n",
        if_condition_holds: "t=36 aliases t=6 at residue 3 because period=30",
        crossing_or_regime_change: "NOT_ESTABLISHED",
      },
      B9_DECIMAL_SPLIT_CRT_PROJECTOR: {
        status: "DESCRIPTIVE_REPRESENTATION_DEPENDENT",
        decimal_split: "15|41",
        additive_readout: "15+41=56",
        crt_projectors: [22, 56],
        projector_identities: ["22^2=22", "56^2=56", "22*56=0", "22+56=1 mod 77"],
        inference_authorized: false,
      },
      B10_CROSSING_VERSUS_STATE_CHANGE: {
        status: "OPEN_REQUIRES_TYPED_EMBEDDING_AND_EVENT_RULE",
        established: "same quotient state can have a different integer lift and winding count",
        not_established: "geometric crossing, regime change, hub, corridor, bridge or dead zone",
      },
    },
    conclusion: {
      crt77_product_carrier: "SUPPORTED_EXACT_STANDARD_MATHEMATICS",
      discrete_torus: "SUPPORTED_EXACT_AFTER_ADJACENCY_DECLARATION",
      multiplier_23_three_turn: "SUPPORTED_EXACT",
      multiplier_67_inverse: "SUPPORTED_EXACT",
      lifted_return_1541_to_1_with_winding_20: "SUPPORTED_EXACT",
      affine_mod77_period_30: "SUPPORTED_EXACT",
      time_36_crossing: "NOT_ESTABLISHED",
      visual_torus_or_spiral_identity: "NOT_ESTABLISHED",
      new_finding: false,
    },
    writes_files: false,
    authorized_science_run: false,
  };
}

if (process.argv.length !== 3 || process.argv[2] !== "--verify") {
  console.error("Usage: node mod77-torus-lift-three-turn.mjs --verify");
  process.exitCode = 2;
} else {
  console.log(JSON.stringify(verifyMod77TorusLiftThreeTurn(), null, 2));
}
