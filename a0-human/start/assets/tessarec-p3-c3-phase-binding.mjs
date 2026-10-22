#!/usr/bin/env node

// Deterministic engineering/formal comparison of the existing Q4 □ P3 carrier
// and a seam-closed Q4 □ C3 control. Writes no files; not a Science Lab run.

import assert from "node:assert/strict";

const GRAY = Object.freeze(Array.from({ length: 16 }, (_, i) => i ^ (i >> 1)));
const INVERSE_GRAY = Object.freeze(Object.fromEntries(GRAY.map((value, index) => [value, index])));

function permutations(values) {
  if (values.length < 2) return [[...values]];
  const output = [];
  for (let index = 0; index < values.length; index += 1) {
    const rest = [...values.slice(0, index), ...values.slice(index + 1)];
    for (const suffix of permutations(rest)) output.push([values[index], ...suffix]);
  }
  return output;
}

function permuteBits(value, permutation) {
  return permutation.reduce((output, sourceBit, targetBit) =>
    output | (((value >> sourceBit) & 1) << targetBit), 0);
}

function cycleLengths(size, operation) {
  const seen = new Set();
  const lengths = [];
  for (let start = 0; start < size; start += 1) {
    if (seen.has(start)) continue;
    let value = start;
    let length = 0;
    do {
      seen.add(value);
      value = operation(value);
      length += 1;
    } while (value !== start);
    lengths.push(length);
  }
  return lengths.sort((a, b) => a - b);
}

function signature(lengths) {
  return lengths.join(",");
}

function factorial(value) {
  let output = 1n;
  for (let factor = 2n; factor <= BigInt(value); factor += 1n) output *= factor;
  return output;
}

function power(operation, exponent) {
  return (value) => {
    let output = value;
    for (let step = 0; step < exponent; step += 1) output = operation(output);
    return output;
  };
}

function graphEdges(layerCarrier) {
  const edges = [];
  for (let layer = 0; layer < 3; layer += 1) {
    for (let q4 = 0; q4 < 16; q4 += 1) {
      for (let bit = 0; bit < 4; bit += 1) {
        if (((q4 >> bit) & 1) === 0) {
          edges.push([layer * 16 + q4, layer * 16 + (q4 | (1 << bit))]);
        }
      }
      if (layerCarrier === "C3") {
        edges.push([layer * 16 + q4, ((layer + 1) % 3) * 16 + q4]);
      } else if (layer < 2) {
        edges.push([layer * 16 + q4, (layer + 1) * 16 + q4]);
      }
    }
  }
  return edges;
}

function edgeKey(a, b) {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function preservationReceipt(edges, operation) {
  const edgeSet = new Set(edges.map(([a, b]) => edgeKey(a, b)));
  const preserved = edges.filter(([a, b]) =>
    edgeSet.has(edgeKey(operation(a), operation(b)))).length;
  return {
    edges: edges.length,
    preserved,
    broken: edges.length - preserved,
    is_automorphism: preserved === edges.length,
  };
}

function displayIndex(vertex) {
  const layer = Math.floor(vertex / 16);
  return layer * 16 + INVERSE_GRAY[vertex % 16];
}

function displayVertex(index) {
  const layer = Math.floor(index / 16);
  return layer * 16 + GRAY[index % 16];
}

function displayShift(amount) {
  return (vertex) => displayVertex((displayIndex(vertex) + amount) % 48);
}

export function verifyP3C3PhaseBinding() {
  const p3Edges = graphEdges("P3");
  const c3Edges = graphEdges("C3");
  assert.equal(p3Edges.length, 128);
  assert.equal(c3Edges.length, 144);

  const coordinatePermutations = permutations([0, 1, 2, 3]);
  const q4Affine = [];
  for (const permutation of coordinatePermutations) {
    for (let mask = 0; mask < 16; mask += 1) {
      const operation = (value) => permuteBits(value, permutation) ^ mask;
      q4Affine.push({ permutation, mask, operation, cycles: cycleLengths(16, operation) });
    }
  }
  assert.equal(q4Affine.length, 384);
  const q4FixedFreeQuarterTurns = q4Affine.filter(({ cycles }) =>
    signature(cycles) === "4,4,4,4");
  assert.equal(q4FixedFreeQuarterTurns.length, 84);

  const p3LayerMaps = [
    { name: "identity", map: (layer) => layer },
    { name: "reflection", map: (layer) => 2 - layer },
  ];
  const c3LayerMaps = permutations([0, 1, 2]).map((permutation) => ({
    name: permutation.join(""),
    permutation,
    map: (layer) => permutation[layer],
    cycles: cycleLengths(3, (layer) => permutation[layer]),
  }));
  const c3Rotations = c3LayerMaps.filter(({ cycles }) => signature(cycles) === "3");
  assert.equal(c3Rotations.length, 2);

  // Factor-preserving P3 x Q4 controls.
  let p3ProductAutomorphisms = 0;
  let p3FixedFreeQuarterTurns = 0;
  let p3TwelveCycles = 0;
  for (const q4 of q4Affine) {
    for (const layer of p3LayerMaps) {
      const operation = (vertex) => {
        const layerAddress = Math.floor(vertex / 16);
        return layer.map(layerAddress) * 16 + q4.operation(vertex % 16);
      };
      assert.equal(preservationReceipt(p3Edges, operation).is_automorphism, true);
      const cycles = cycleLengths(48, operation);
      p3ProductAutomorphisms += 1;
      if (signature(cycles) === Array(12).fill(4).join(",")) p3FixedFreeQuarterTurns += 1;
      if (signature(cycles) === Array(4).fill(12).join(",")) p3TwelveCycles += 1;
    }
  }
  assert.equal(p3ProductAutomorphisms, 768);
  assert.equal(p3FixedFreeQuarterTurns, 168);
  assert.equal(p3TwelveCycles, 0);

  // Seam-closed C3 comparison: combine a fixed-free Q4 quarter turn with a
  // genuine three-cycle on layers. The result must have order 12.
  const combinedCandidates = [];
  for (const q4 of q4FixedFreeQuarterTurns) {
    for (const layer of c3Rotations) {
      const operation = (vertex) => {
        const layerAddress = Math.floor(vertex / 16);
        return layer.map(layerAddress) * 16 + q4.operation(vertex % 16);
      };
      assert.equal(preservationReceipt(c3Edges, operation).is_automorphism, true);
      const cycles = cycleLengths(48, operation);
      if (signature(cycles) === Array(4).fill(12).join(",")) {
        combinedCandidates.push({ q4, layer, operation, cycles });
      }
    }
  }
  assert.equal(combinedCandidates.length, 168);

  const witness = combinedCandidates[0];
  const witnessThird = power(witness.operation, 3);
  const witnessFourth = power(witness.operation, 4);
  assert.deepEqual(cycleLengths(48, witness.operation), Array(4).fill(12));
  assert.deepEqual(cycleLengths(48, witnessThird), Array(12).fill(4));
  assert.deepEqual(cycleLengths(48, witnessFourth), Array(16).fill(3));
  for (let vertex = 0; vertex < 48; vertex += 1) {
    const layer = Math.floor(vertex / 16);
    assert.equal(Math.floor(witnessThird(vertex) / 16), layer);
    assert.equal(witnessFourth(vertex) % 16, vertex % 16);
  }

  // Existing Paper-F display order is a separate object. The pure +16 layer
  // shift becomes an automorphism only after the P3 seam is closed; +12 and
  // +4 do not become graph automorphisms under the current Gray enumeration.
  const currentDisplay = {
    P3: {
      plus4: preservationReceipt(p3Edges, displayShift(4)),
      plus12: preservationReceipt(p3Edges, displayShift(12)),
      plus16: preservationReceipt(p3Edges, displayShift(16)),
    },
    C3: {
      plus4: preservationReceipt(c3Edges, displayShift(4)),
      plus12: preservationReceipt(c3Edges, displayShift(12)),
      plus16: preservationReceipt(c3Edges, displayShift(16)),
    },
  };
  assert.deepEqual(currentDisplay.P3.plus16, { edges: 128, preserved: 112, broken: 16, is_automorphism: false });
  assert.deepEqual(currentDisplay.C3.plus16, { edges: 144, preserved: 144, broken: 0, is_automorphism: true });
  assert.equal(currentDisplay.C3.plus12.is_automorphism, false);
  assert.equal(currentDisplay.C3.plus4.is_automorphism, false);

  // Conjugacy counts quantify non-uniqueness. They count pairs of a selected
  // product-form operator and a bijection from the relevant cyclic index.
  const perP3QuarterBinding = factorial(12) * 4n ** 12n;
  const allP3QuarterBindings = BigInt(p3FixedFreeQuarterTurns) * perP3QuarterBinding;
  const perC3CombinedBinding = factorial(4) * 12n ** 4n;
  const allC3CombinedBindings = BigInt(combinedCandidates.length) * perC3CombinedBinding;
  assert.equal(perP3QuarterBinding, 8036313307545600n);
  assert.equal(allP3QuarterBindings, 1350100635667660800n);
  assert.equal(perC3CombinedBinding, 497664n);
  assert.equal(allC3CombinedBindings, 83607552n);

  return {
    status: "PASS_WITH_CARRIER_COMPARATOR_AND_UNDERDETERMINATION",
    classification: "ENGINEERING_FORMAL_CHECK_NOT_SCIENCE_RUN",
    identity_effect: "REUSES_MOD_TESSAREC_NO_NEW_STUDY_NO_NEW_RELATION",
    tests: {
      B1_CARRIER_COUNTS: {
        status: "PASS",
        Q4_P3: { vertices: 48, q4_inner_edges: 96, layer_bridges: 32, total_edges: 128 },
        Q4_C3_CONTROL: { vertices: 48, q4_inner_edges: 96, layer_bridges: 48, total_edges: 144 },
        seam_closure_delta_edges: 16,
      },
      B2_LAYER_SYMMETRY: {
        status: "PASS_COMPARATOR",
        P3_layer_automorphisms: ["identity", "reflection"],
        P3_has_order3_layer_rotation: false,
        C3_layer_automorphisms: 6,
        C3_order3_rotations: 2,
      },
      B3_Q4_AFFINE_QUARTER_TURNS: {
        status: "PASS",
        affine_automorphisms_checked: q4Affine.length,
        fixed_free_order4_candidates: q4FixedFreeQuarterTurns.length,
      },
      B4_PRODUCT_OPERATOR_SEARCH: {
        status: "PASS_WITH_CONTRAST",
        P3_factor_preserving_automorphisms_checked: p3ProductAutomorphisms,
        P3_fixed_free_order4_candidates: p3FixedFreeQuarterTurns,
        P3_order12_cycle_12x4_candidates: p3TwelveCycles,
        C3_combined_order12_cycle_12x4_candidates: combinedCandidates.length,
        witness: {
          q4_coordinate_permutation: witness.q4.permutation,
          q4_xor_mask: witness.q4.mask,
          layer_permutation: witness.layer.permutation,
          generator_cycle_type: witness.cycles,
          third_power_cycle_type: cycleLengths(48, witnessThird),
          fourth_power_cycle_type: cycleLengths(48, witnessFourth),
        },
      },
      B5_CURRENT_DISPLAY_ORDER: {
        status: "MIXED_NEGATIVE_BINDING_RESULT",
        ...currentDisplay,
        reading: "+16 is an exact layer rotation only on C3; current +12 and +4 remain non-automorphisms",
      },
      B6_CANONICALITY_CONTROL: {
        status: "UNDERDETERMINED",
        P3_quarter_turn_operator_candidates: p3FixedFreeQuarterTurns,
        conjugating_bijections_per_P3_candidate: perP3QuarterBinding.toString(),
        total_P3_operator_bijection_pairs: allP3QuarterBindings.toString(),
        C3_combined_operator_candidates: combinedCandidates.length,
        conjugating_bijections_per_C3_candidate: perC3CombinedBinding.toString(),
        total_C3_operator_bijection_pairs: allC3CombinedBindings.toString(),
        canonical_binding_established: false,
      },
    },
    conclusion: {
      existing_Q4_P3_carrier_retained: true,
      direct_current_plus12_binding: "REFUTED",
      abstract_P3_quarter_turn_binding: "EXISTS_BUT_HIGHLY_NON_UNIQUE",
      C3_seam_closure_144_edge_identity: "SUPPORTED_AS_GRAPH_COUNT",
      C3_combined_three_by_four_phase_operator: "EXISTS_BUT_NON_CANONICAL",
      carrier_change_authorized: false,
      visual_change_authorized: false,
      new_finding: false,
    },
    writes_files: false,
    authorized_science_run: false,
  };
}

if (process.argv.length !== 3 || process.argv[2] !== "--verify") {
  console.error("Usage: node tessarec-p3-c3-phase-binding.mjs --verify");
  process.exitCode = 2;
} else {
  console.log(JSON.stringify(verifyP3C3PhaseBinding(), null, 2));
}
