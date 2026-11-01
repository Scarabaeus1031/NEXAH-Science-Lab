'use strict';

const TAU = 2 * Math.PI;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function isPrime(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let d = 3; d * d <= n; d += 2) if (n % d === 0) return false;
  return true;
}

function factorization(n) {
  if (!Number.isInteger(n) || n < 2) return [];
  const factors = [];
  let value = n;
  for (let d = 2; d * d <= value; d += d === 2 ? 1 : 2) {
    while (value % d === 0) {
      factors.push(d);
      value /= d;
    }
  }
  if (value > 1) factors.push(value);
  return factors;
}

function primes(count) {
  const out = [];
  for (let n = 2; out.length < count; n++) if (isPrime(n)) out.push(n);
  return out;
}

function primePiTable(limit) {
  const table = Array(limit + 1).fill(0);
  for (let n = 1; n <= limit; n++) table[n] = table[n - 1] + (isPrime(n) ? 1 : 0);
  return table;
}

function ramanujanPrimesThrough(limit) {
  const scanLimit = Math.max(1000, limit * 8);
  const pi = primePiTable(scanLimit);
  const out = [];
  for (let rank = 1; rank <= pi[limit]; rank++) {
    let lastFailure = 1;
    for (let x = 2; x <= scanLimit; x++) {
      if (pi[x] - pi[Math.floor(x / 2)] < rank) lastFailure = x;
    }
    const candidate = Math.max(2, lastFailure + 1);
    if (candidate > limit) break;
    out.push(candidate);
  }
  return out;
}

function circularBisectors(a, b) {
  const x = ((a % 360) + 360) % 360;
  const y = ((b % 360) + 360) % 360;
  const first = ((x + y) / 2) % 180;
  return [first, first + 180];
}

function claimAudit() {
  const ramanujan = ramanujanPrimesThrough(200);
  const crownNodes = [439, 457, 487, 503, 509];
  return {
    schema: 'nexah.a0.prime-pattern-claim-audit/1',
    claims: [
      { id: 'C504', statement: '3^2 * 2^3 * 7 = 504', status: 9 * 8 * 7 === 504 ? 'EXACT' : 'FALSE' },
      { id: 'MIRROR_3301_1031', statement: '3301 is the decimal reversal of 1031', observed: String(3301).split('').reverse().join(''), status: 'FALSE' },
      { id: 'FACTOR_509', statement: '509 = 7 * 73', observed: 7 * 73, factors: factorization(509), status: 'FALSE' },
      { id: 'RAMANUJAN_163', statement: '163 is a Ramanujan prime', ramanujan_primes_through_200: ramanujan, status: ramanujan.includes(163) ? 'EXACT' : 'FALSE' },
      { id: 'TWIN_151_157', statement: '151 and 157 are twin primes', gap: 157 - 151, status: 'FALSE', correction: 'SEXY_PRIME_PAIR' },
      { id: 'TWIN_167_173', statement: '167 and 173 are twin primes', gap: 173 - 167, status: 'FALSE', correction: 'SEXY_PRIME_PAIR' },
      { id: 'CROWN_PRIMALITY', statement: '439, 457, 487, 503 and 509 are prime', values: crownNodes.map(value => ({ value, prime: isPrime(value) })), status: crownNodes.every(isPrime) ? 'EXACT' : 'FALSE' },
      { id: 'MIRROR_457_137', statement: '457 mirrors 137', status: 'UNDEFINED_CONTRACT', missing: ['mirror operator', 'carrier', 'acceptance test'] },
      { id: 'FFT_MOBIUS', statement: 'FFT across a spiral detects Mobius interference', status: 'UNDEFINED_CONTRACT', missing: ['ordered scalar signal', 'sampling rule', 'Mobius observable', 'null model'] },
      { id: 'EVERY_11TH_PRIME', statement: 'Every 11th prime is an activated node', status: 'TESTABLE_HYPOTHESIS', boundary: 'index subsampling is exact; activation requires an independent observable' },
      { id: 'A2_B4', statement: 'a^2 + b^4 primes activate crossing nodes', status: 'UNDEFINED_CONTRACT', missing: ['a,b bounds', 'crossing geometry', 'activation threshold', 'control'] },
      { id: 'ANGLES_233_337', statement: '233 and 337 are mirror angles', separation_degrees: 104, possible_bisectors_degrees: circularBisectors(233, 337), status: 'UNDEFINED_CONTRACT', missing: ['declared mirror axis'] }
    ],
    boundary: 'Arithmetic classifications only. Symbolic, physical, harmonic, planetary and topological readings are not inferred.'
  };
}

function binaryComb(length, stride) {
  if (!Number.isInteger(length) || length < 2 || !Number.isInteger(stride) || stride < 2) throw new Error('invalid comb');
  return Array.from({ length }, (_, i) => ((i + 1) % stride === 0 ? 1 : 0));
}

function spectralPeak(signal) {
  const n = signal.length;
  const mean = signal.reduce((a, b) => a + b, 0) / n;
  const centered = signal.map(value => value - mean);
  const energy = Math.sqrt(centered.reduce((sum, value) => sum + value * value, 0)) || 1;
  let peak = { bin: 0, amplitude: 0 };
  for (let k = 1; k <= Math.floor(n / 2); k++) {
    let re = 0;
    let im = 0;
    for (let t = 0; t < n; t++) {
      const angle = TAU * k * t / n;
      re += centered[t] * Math.cos(angle);
      im -= centered[t] * Math.sin(angle);
    }
    const amplitude = Math.hypot(re, im) / energy;
    if (amplitude > peak.amplitude) peak = { bin: k, amplitude };
  }
  return peak;
}

function angularResultant(indices) {
  if (!indices.length) return 0;
  let x = 0;
  let y = 0;
  for (const index of indices) {
    const angle = index * GOLDEN_ANGLE;
    x += Math.cos(angle);
    y += Math.sin(angle);
  }
  return Math.hypot(x, y) / indices.length;
}

function deterministicSample(length, count, seed = 1031) {
  let state = seed >>> 0;
  const pool = Array.from({ length }, (_, i) => i);
  for (let i = pool.length - 1; i > 0; i--) {
    state = (1664525 * state + 1013904223) >>> 0;
    const j = state % (i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).sort((a, b) => a - b);
}

function a2b4PrimeFixture(bound = 25) {
  if (!Number.isInteger(bound) || bound < 1 || bound > 200) throw new Error('invalid bound');
  const hits = [];
  for (let a = 1; a <= bound; a++) for (let b = 1; b <= bound; b++) {
    const value = a * a + b ** 4;
    if (isPrime(value)) hits.push({ a, b, value });
  }
  return { bound, hits, unique_primes: [...new Set(hits.map(hit => hit.value))].sort((a, b) => a - b) };
}

function ghostGridControls({ length = 264, strides = [7, 10, 11, 12, 13] } = {}) {
  const primeValues = primes(length);
  const rows = strides.map(stride => {
    const signal = binaryComb(length, stride);
    const indices = signal.flatMap((value, index) => value ? [index] : []);
    return {
      stride,
      selected_count: indices.length,
      selected_prime_range: indices.length ? [primeValues[indices[0]], primeValues[indices.at(-1)]] : null,
      spectral_peak: spectralPeak(signal),
      golden_angle_resultant: angularResultant(indices)
    };
  });
  const stride11 = rows.find(row => row.stride === 11);
  const randomIndices = deterministicSample(length, stride11.selected_count);
  const randomSignal = Array.from({ length }, (_, index) => randomIndices.includes(index) ? 1 : 0);
  const periodicControls = rows.filter(row => row.stride !== 11);
  return {
    schema: 'nexah.a0.ghost-grid-control/1',
    fixture: 'PRIME_INDEX_GOLDEN_ANGLE_DISPLAY_ONLY',
    length,
    rows,
    deterministic_control: {
      selected_count: randomIndices.length,
      spectral_peak: spectralPeak(randomSignal),
      golden_angle_resultant: angularResultant(randomIndices)
    },
    result: {
      stride_11_is_periodic_by_construction: true,
      other_strides_are_periodic_by_construction: periodicControls.every(row => row.spectral_peak.amplitude > 0),
      unique_activation_supported: false
    },
    a2b4: a2b4PrimeFixture(25),
    boundary: 'The prime-index comb and golden-angle placement are declared controls, not recovered historical spiral geometry. FFT periodicity of every-k sampling is construction-bound and does not establish Mobius topology or node activation.'
  };
}

function validatePath(path) {
  if (!Array.isArray(path) || path.length < 2 || path.some(point => !Array.isArray(point) || point.length !== 2 || point.some(value => !Number.isFinite(value)))) throw new Error('invalid path');
}

function normalizePath(path) {
  validatePath(path);
  const centroid = path.reduce((acc, [x, y]) => [acc[0] + x, acc[1] + y], [0, 0]).map(value => value / path.length);
  const centered = path.map(([x, y]) => [x - centroid[0], y - centroid[1]]);
  const rms = Math.sqrt(centered.reduce((sum, [x, y]) => sum + x * x + y * y, 0) / path.length) || 1;
  return { centroid, rms, points: centered.map(([x, y]) => [x / rms, y / rms]) };
}

function pathDistance(a, b) {
  if (a.length !== b.length) throw new Error('path sample counts differ');
  return Math.sqrt(a.reduce((sum, point, index) => sum + (point[0] - b[index][0]) ** 2 + (point[1] - b[index][1]) ** 2, 0) / a.length);
}

function endpointReturn(path) {
  validatePath(path);
  return Math.hypot(path.at(-1)[0] - path[0][0], path.at(-1)[1] - path[0][1]);
}

function orangeFloorCompare(pathA, pathB) {
  validatePath(pathA);
  validatePath(pathB);
  if (pathA.length !== pathB.length) throw new Error('path sample counts differ');
  const A = normalizePath(pathA);
  const B = normalizePath(pathB);
  return {
    schema: 'nexah.a0.orange-floor-return-comparator/1',
    samples: pathA.length,
    raw_scale_ratio: A.rms / B.rms,
    normalized_path_rms_error: pathDistance(A.points, B.points),
    endpoint_return_error: { A: endpointReturn(pathA), B: endpointReturn(pathB) },
    scale_only_equivalence: pathDistance(A.points, B.points) < 1e-12,
    boundary: 'Centroid/RMS normalization tests scale effects only. It does not identify phi with pi, infer a shared generator, or establish a physical breath/return.'
  };
}

function orangeFloorFixture() {
  const source = [[0, 0], [1, 0], [2, 1], [1, 2], [0, 0]];
  const scaled = source.map(([x, y]) => [1000 * x + 23, 1000 * y - 41]);
  const changed = [[0, 0], [1, 0], [2, 0], [1, 3], [0, 0]];
  return {
    scale_control: orangeFloorCompare(source, scaled),
    shape_control: orangeFloorCompare(source, changed),
    historical_phi_pi_visual: {
      status: 'UNDEFINED_CONTRACT',
      missing: ['source equations or sampled paths', 'shared parameter interval', 'sampling rule', 'video scale transform']
    }
  };
}

function reverseDecimal(value) {
  if (!Number.isInteger(value) || value < 0) throw new Error('invalid decimal value');
  return Number(String(value).split('').reverse().join(''));
}

function isDecimalPalindrome(value) {
  if (!Number.isInteger(value) || value < 0) return false;
  const word = String(value);
  return word === [...word].reverse().join('');
}

function primeIndex(value) {
  if (!isPrime(value)) return null;
  let index = 0;
  for (let candidate = 2; candidate <= value; candidate++) if (isPrime(candidate)) index++;
  return index;
}

function primeIndexPalindromeAxis(limit = 1000) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 10000) throw new Error('invalid prime-index limit');
  const primeValues = primes(limit);
  const rows = [];
  for (let index = 1; index <= limit; index++) {
    if (!isDecimalPalindrome(index)) continue;
    const value = primeValues[index - 1];
    const returnValue = reverseDecimal(value);
    const returnIndex = primeIndex(returnValue);
    const valuePalindrome = isDecimalPalindrome(value);
    rows.push({
      index,
      value,
      index_palindrome: true,
      value_palindrome: valuePalindrome,
      decimal_return: returnValue,
      return_prime: returnIndex !== null,
      return_index: returnIndex,
      return_index_palindrome: returnIndex !== null && isDecimalPalindrome(returnIndex),
      class: valuePalindrome
        ? 'INDEX_AND_VALUE_PALINDROME'
        : returnIndex !== null
          ? 'INDEX_PALINDROME_EMIRP'
          : 'INDEX_PALINDROME_RETURN_COMPOSITE'
    });
  }

  const gateValues = [1031, 1033];
  const gateCycles = gateValues.map(value => {
    const index = primeIndex(value);
    const returnValue = reverseDecimal(value);
    const returnIndex = primeIndex(returnValue);
    return {
      source: { index, value, index_palindrome: isDecimalPalindrome(index) },
      decimal_return: { index: returnIndex, value: returnValue, index_palindrome: isDecimalPalindrome(returnIndex) },
      two_cycle_exact: reverseDecimal(returnValue) === value,
      return_index_palindrome: isDecimalPalindrome(returnIndex)
    };
  });

  const anchor1087 = {
    index: primeIndex(1087),
    value: 1087,
    index_palindrome: isDecimalPalindrome(primeIndex(1087)),
    decimal_return: 7801,
    return_prime: isPrime(7801),
    additive_lift: { equation: '181 = 10^2 + 3^4', base: 10 ** 2, payload: 3 ** 4, exact: 181 === 10 ** 2 + 3 ** 4 }
  };
  const handle3301 = {
    index: primeIndex(3301),
    value: 3301,
    index_palindrome: isDecimalPalindrome(primeIndex(3301)),
    decimal_return: 1033,
    return_index: primeIndex(1033),
    additive_lift: { equation: '464 = 20^2 + 2^6', base: 20 ** 2, payload: 2 ** 6, exact: 464 === 20 ** 2 + 2 ** 6 }
  };

  return {
    schema: 'nexah.a0.prime-index-palindrome-axis/1',
    identity_reuse: 'MOD:NUMBER_VIEW_SUITE',
    limit,
    rows,
    counts: {
      palindromic_indices: rows.length,
      value_palindromes: rows.filter(row => row.value_palindrome).length,
      emirp_returns: rows.filter(row => row.return_prime && !row.value_palindrome).length,
      composite_returns: rows.filter(row => !row.return_prime).length,
      palindromic_return_indices: rows.filter(row => row.return_index_palindrome).length
    },
    gate_axis: {
      triple: [1031, 1032, 1033],
      pattern: ['PRIME', 'COMPOSITE', 'PRIME'],
      midpoint_exact: (1031 + 1033) / 2 === 1032,
      hinge: {
        value: 1032,
        factorization: factorization(1032),
        carry_43: 1032 === 24 * 43,
        decimal_cut: '10|32',
        suffix_32: { value: 32, half_of_64: 32 === 64 / 2, power: '2^5' }
      },
      prime_return_cycles: gateCycles
    },
    focus: { anchor_1087: anchor1087, handle_3301: handle3301 },
    result: {
      gate_returns_land_on_palindromic_prime_indices: gateCycles.every(cycle => cycle.return_index_palindrome),
      anchor_1087_is_palindromic_index_stop: anchor1087.index_palindrome && !anchor1087.return_prime,
      additive_index_lifts_exact: anchor1087.additive_lift.exact && handle3301.additive_lift.exact,
      general_power_elevator_supported: false
    },
    boundary: 'Palindromic prime indices, decimal reversals and additive decompositions are exact finite classifications. The selected 181 and 464 decompositions are post-hoc address readings, not a general power law, geometric axis, activation rule or physical elevator.'
  };
}

function scarabGateHandleFixture() {
  const gate = [1031, 1032, 1033];
  const gateMirror = gate.map(reverseDecimal);
  const outerPair = [1087, 7801];
  const sourceSteps = gate.slice(1).map((value, index) => value - gate[index]);
  const mirrorSteps = gateMirror.slice(1).map((value, index) => value - gateMirror[index]);
  const gateSum = gate.reduce((sum, value) => sum + value, 0);
  const mirrorSum = gateMirror.reduce((sum, value) => sum + value, 0);
  const hexahedronLabels = [1031, 1032, 3301, 3201, 3201, 7801];

  return {
    schema: 'nexah.a0.scarab-gate-handle/1',
    identity_reuse: 'MOD:NUMBER_VIEW_SUITE',
    existing_relation_context: 'REL:IEEE300_GRAPH_GRID_NUMBER_ADDRESS',
    source_binding: {
      status: 'DOCUMENTARY_SOURCE_ONLY',
      receipt: 'NUMBER_OPERATOR_ARCHITECTURE_CONCORDANCE_AUDIT/visual_intake_2026-10-19/visual-source-receipt.json',
      receipt_sha256: 'd7b620f54847d21954cc97838edaa6a3fece9bb7170654f27b739f5146897f35',
      scarab_gate_visual_sha256: '917ed21859c6e41260a4aa84c2255c59ebbbf5eb0c6385fe727953f8850282ad',
      eris_cosmogram_visual_sha256: '3870586becd4496e79f175d60690bc7674d95f4b7e7d5794c127b73b44b3754a'
    },
    declared_gate: {
      visible_title_nodes: [1031, 1032, 1033, 1087, 3301],
      core_triangle_labels: gate,
      inner_anchor_label: 1087,
      handle_node: 3301,
      handle_attachment: 'UNRESOLVED_WITHOUT_NUMBER_TO_COORDINATE_MAP'
    },
    arithmetic_stair: {
      source_lane: gate,
      mirror_lane: gateMirror,
      reversal_pairs: gate.map((value, index) => [value, gateMirror[index]]),
      source_steps: sourceSteps,
      mirror_steps: mirrorSteps,
      place_value_expansion: mirrorSteps.every((step, index) => step === 1000 * sourceSteps[index]),
      gate_sum: gateSum,
      mirror_sum: mirrorSum,
      mirrored_sum_exact: reverseDecimal(gateSum) === mirrorSum,
      six_node_sum: gateSum + mirrorSum
    },
    outer_return: {
      pair: outerPair,
      exact_decimal_reversal: reverseDecimal(outerPair[0]) === outerPair[1],
      pair_sum: outerPair[0] + outerPair[1],
      full_eight_node_sum: gateSum + mirrorSum + outerPair[0] + outerPair[1]
    },
    classification_audit: {
      prime_values: [1031, 1033, 1087, 1301, 3301].map(value => ({ value, prime: isPrime(value) })),
      connector_1032: { prime: isPrime(1032), factors: factorization(1032) },
      resonator_2301: { prime: isPrime(2301), factors: factorization(2301) },
      outer_gate_7801: { prime: isPrime(7801), factors: factorization(7801), source_caption: 'Outer Gate Prime', caption_status: 'FALSE_ARITHMETIC_CLASSIFICATION' }
    },
    representation_audit: [
      {
        visual: 'SCARAB_GATE_GEOMETRY_BOUNDARY',
        status: 'PASS_VISIBLE_GATE_AND_HANDLE_NODE_WITH_HOLD',
        supports: ['yellow gate surface', 'inner anchor marker', 'cyan dashed handle ending at 3301'],
        missing: ['number-to-coordinate map', 'resolved triangle vertex labels', 'handle attachment vertex', 'generator']
      },
      {
        visual: 'ERIS_COSMOGRAM_3D_PROJECTION',
        status: 'PASS_DOCUMENTARY_LABEL_STAIR_WITH_HOLD',
        supports: ['1031/1032/1033 local cluster', '1301/2301/3301 mirror labels', '1087/7801 outer labels'],
        missing: ['source coordinates', 'projection matrix', 'metric acceptance rule'],
        warning: 'Role labels conflict with another supplied visual and remain documentary.'
      },
      {
        visual: 'MIRROR_NODES_HEXAHEDRON',
        status: 'HOLD_LABEL_COLLISION',
        duplicated_labels: [3201],
        missing_labels: [1033],
        observed_labels: hexahedronLabels
      },
      {
        visual: 'PREVIOUS_DOUBLE_TRIANGLE_READING',
        status: 'SUPERSEDED_BY_SOURCE_BOUND_GATE',
        boundary: '7801 is retained as the decimal reversal of 1087 and a documentary outer-gate label, not as a verified second apex.'
      }
    ],
    result: {
      arithmetic_stair: 'EXACT',
      gate_and_handle_visibility: 'DOCUMENTED',
      handle_attachment: 'UNDEFINED_CONTRACT',
      metric_geometry: 'UNDEFINED_CONTRACT',
      next_application: 'Recover or declare the number-to-coordinate generator, then test the visible gate, handle attachment and 3D stair without changing the arithmetic fixture.'
    },
    boundary: 'Exact decimal reversals and sums do not establish astronomical coordinates, a physical gate, a Cicada mechanism or an external puzzle connection. Source captions remain documentary and conflicting roles remain visible.'
  };
}

function mirrorGateDoubleTriangleFixture() {
  return {
    ...scarabGateHandleFixture(),
    compatibility_alias: 'mirrorGateDoubleTriangleFixture',
    compatibility_status: 'SUPERSEDED_NAME_ONLY'
  };
}

module.exports = {
  isPrime,
  factorization,
  ramanujanPrimesThrough,
  claimAudit,
  ghostGridControls,
  normalizePath,
  orangeFloorCompare,
  orangeFloorFixture,
  reverseDecimal,
  isDecimalPalindrome,
  primeIndex,
  primeIndexPalindromeAxis,
  scarabGateHandleFixture,
  mirrorGateDoubleTriangleFixture
};
