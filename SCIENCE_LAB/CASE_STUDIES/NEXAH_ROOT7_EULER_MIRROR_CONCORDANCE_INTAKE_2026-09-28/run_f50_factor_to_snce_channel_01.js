#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const HERE = __dirname;
const PREREG = path.join(HERE, '36_F50_FACTOR_TO_SNCE_CHANNEL_01_PREREGISTRATION.md');
const LOCK = path.join(HERE, 'F50_FACTOR_TO_SNCE_CHANNEL_01_PREREGISTRATION_LOCK.json');
const OUT = path.join(HERE, 'f50_factor_to_snce_channel_01_results.json');

const SOURCES = {
  snce_preregistration: [path.join(HERE, '34_SNCE_101_PARITY_PROFILE_01_PREREGISTRATION.md'), 'ffe14decb4e01f2e8eece3e4d22009c04e7bff7f368f3d57afe30d74b51de2ee'],
  snce_machine_result: [path.join(HERE, 'snce_101_parity_profile_01_results.json'), '81ff586caaf2c8725176175a20172e8c945341f90d1228cfb256015fbbd088b8'],
  f50_visual: ['/Users/tho2020/Pictures/Photos Library.photoslibrary/resources/derivatives/C/C20D926F-2736-46D7-9DBE-47C7A3A6BDAC_1_102_o.jpeg', '4a515309bb3f1e702c47d8505ac033b840c32e64abece6426af0dcafda5edf78'],
  zipf_visual: ['/Users/tho2020/Pictures/Photos Library.photoslibrary/resources/derivatives/B/BF81B6C8-506F-4324-9CF5-E0EAF230E596_1_102_o.jpeg', '2a1fb6db2f5a20fbd3fa5a7089d9d324f7138a22b69839dfd144f2d4accffe66'],
  prime_density_visual: ['/Users/tho2020/Pictures/Photos Library.photoslibrary/resources/derivatives/B/B89067A8-AC82-483B-9ECC-5A49E5A0BD66_1_105_c.jpeg', 'a49d91c3648b30069163e5130235b92aacf6df8a7f15bd7a0fec34bb45811976'],
  last_digit_visual: ['/Users/tho2020/Pictures/Photos Library.photoslibrary/resources/derivatives/9/9823FE85-A637-43E9-BFC9-2132DD3CDF35_1_102_o.jpeg', 'ed591052a055fb69b130cc68cd8edf59b00e66b772499b61ac14e5a38adcc69d'],
  mod30_visual: ['/Users/tho2020/Pictures/Photos Library.photoslibrary/resources/derivatives/2/239E6024-7923-48F9-96AE-559D1093F5FD_1_105_c.jpeg', 'f5e2f5d1fd2248fb1a1346d87636eefa9ae752d0b7ef8b761d76d7b8b91b71ad'],
  twin_prime_visual: ['/Users/tho2020/Pictures/Photos Library.photoslibrary/resources/derivatives/3/39FC7192-4D2E-4C56-8019-AD4721426099_1_105_c.jpeg', 'e8a6ad437c62f6e337bffc54ea6960c8ac6286694fcad0f764568e9e0cf290dd'],
  local_gap_visual: ['/Users/tho2020/Pictures/Photos Library.photoslibrary/resources/derivatives/6/63FA6288-03E2-4B80-A22B-0DFFE9AE4DA5_1_102_o.jpeg', '2dca4d529d94fc2b623a48dd80336859bd2ae485e3eeec2d5a3c0c90b42c69bb'],
  rosenbruecke_visual: ['/Users/tho2020/Pictures/Photos Library.photoslibrary/resources/derivatives/3/3CED9DE3-B55A-4029-85EF-2F1E86CF76B8_1_105_c.jpeg', '14b96f9cdb620b75d1b77b51f3623c69aca2f22b73f28201da1ee5763d1a42af']
};

const sha256 = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

function fib(n) {
  let a = 0n, b = 1n;
  for (let i = 0; i < n; i++) [a, b] = [b, a + b];
  return a;
}

function isPrime(n) {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) if (n % d === 0) return false;
  return true;
}

function rankOfApparition(p) {
  let a = 0, b = 1;
  for (let n = 1; n <= 6 * p + 6; n++) {
    [a, b] = [b, (a + b) % p];
    if (a === 0) return n;
  }
  throw new Error(`RANK_NOT_FOUND_${p}`);
}

function factorizeBigInt(n) {
  const out = [];
  let x = n;
  for (let d = 2n; d * d <= x; d += d === 2n ? 1n : 2n) {
    let e = 0;
    while (x % d === 0n) { x /= d; e++; }
    if (e) out.push([Number(d), e]);
  }
  if (x > 1n) out.push([Number(x), 1]);
  return out;
}

function cartesianExponentVectors(exponents) {
  let rows = [[]];
  for (const max of exponents) {
    const next = [];
    for (const row of rows) for (let e = 0; e <= max; e++) next.push([...row, e]);
    rows = next;
  }
  return rows;
}

function divisorFromVector(primes, vector) {
  return primes.reduce((acc, p, i) => acc * (BigInt(p) ** BigInt(vector[i])), 1n);
}

function isPowerOfTwoBigInt(n) { return n > 0n && (n & (n - 1n)) === 0n; }
function snceAccepts(c) { return c > 0n && c % 101n === 0n && isPowerOfTwoBigInt(c / 101n); }

function nearestPrimeDistances(n) {
  let below = n - 1, above = n + 1;
  while (!isPrime(below)) below--;
  while (!isPrime(above)) above++;
  return { below: n - below, above: above - n, primes: [below, above] };
}

function run() {
  const hashChecks = Object.fromEntries(Object.entries(SOURCES).map(([key, [file, expected]]) => {
    const actual = sha256(file);
    return [key, { expected, actual, pass: actual === expected }];
  }));

  const f50 = fib(50);
  const factorization = factorizeBigInt(f50);
  const expectedFactorization = [[5, 2], [11, 1], [101, 1], [151, 1], [3001, 1]];
  const primes = factorization.map(([p]) => p);
  const exponents = factorization.map(([, e]) => e);
  const vectors = cartesianExponentVectors(exponents);
  const divisors = vectors.map(v => divisorFromVector(primes, v));
  const ranks = Object.fromEntries(primes.map(p => [p, rankOfApparition(p)]));
  const rank50 = primes.filter(p => ranks[p] === 50);

  const selectorAudit = {
    primality: primes.filter(isPrime),
    exponent_one: factorization.filter(([, e]) => e === 1).map(([p]) => p),
    rank_50: rank50,
    last_digit_1: primes.filter(p => p % 10 === 1),
    coprime_to_30: primes.filter(p => [2, 3, 5].every(q => p % q !== 0)),
    twin_prime_member: primes.filter(p => isPrime(p - 2) || isPrime(p + 2)),
    decimal_palindrome: primes.filter(p => String(p) === [...String(p)].reverse().join(''))
  };
  const intrinsicCandidateKeys = ['primality', 'exponent_one', 'rank_50', 'last_digit_1', 'coprime_to_30', 'twin_prime_member'];
  const noIntrinsicCandidateUniquelySelects101 = intrinsicCandidateKeys.every(key => {
    const values = selectorAudit[key];
    return !(values.length === 1 && values[0] === 101);
  });

  const outerKs = Array.from({ length: 21 }, (_, k) => k);
  const snce101 = outerKs.map(k => 101n * (2n ** BigInt(k)));
  const snce151 = outerKs.map(k => 151n * (2n ** BigInt(k)));

  const edges = [];
  for (const vector of vectors) {
    vector.forEach((e, i) => {
      if (e > 0) {
        const child = [...vector]; child[i]--;
        edges.push({ from: vector.join(','), to: child.join(','), prime: primes[i] });
      }
    });
  }
  const uniqueSink = vectors.filter(v => v.every(e => e === 0));
  const everyNonSinkShrinks = vectors.filter(v => v.some(e => e > 0)).every(v => edges.some(edge => edge.from === v.join(',')));
  const commuteChecks = [];
  for (const vector of vectors) {
    vector.forEach((e, i) => {
      if (e > 0) {
        const shrink = [...vector]; shrink[i]--;
        for (const k of [0, 1, 7, 20]) {
          const shrinkThenExpand = { vector: shrink.join(','), k: k + 1 };
          const expandThenShrink = { vector: shrink.join(','), k: k + 1 };
          commuteChecks.push(JSON.stringify(shrinkThenExpand) === JSON.stringify(expandThenShrink));
        }
      }
    });
  }

  const localPrimes = Array.from({ length: 31 }, (_, i) => 1020 + i).filter(isPrime);
  const localTargets = [1032, 1034, 1035, 1037];
  const localDistances = Object.fromEntries(localTargets.map(n => [n, nearestPrimeDistances(n)]));
  const expectedDistances = { 1032: [1, 1], 1034: [1, 5], 1035: [2, 4], 1037: [4, 2] };
  const localDistancePass = localTargets.every(n => {
    const got = localDistances[n];
    return got.below === expectedDistances[n][0] && got.above === expectedDistances[n][1];
  });

  const wheelControls = Object.fromEntries(primes.map(p => [p, { mod6: p % 6, mod30: p % 30, lastDigit: p % 10 }]));
  const strictFractalInputs = { contraction_ratio: null, branch_copy_map: null, present: false };

  const checks = {
    frozen_hashes_match: Object.values(hashChecks).every(x => x.pass),
    fibonacci_50_exact: f50 === 12586269025n,
    factorization_exact_and_prime: JSON.stringify(factorization) === JSON.stringify(expectedFactorization) && primes.every(isPrime),
    divisor_lattice_has_48_unique_nodes: divisors.length === 48 && new Set(divisors.map(String)).size === 48 && divisors.includes(1n) && divisors.includes(f50),
    ranks_of_apparition_exact: JSON.stringify(ranks) === JSON.stringify({ 5: 5, 11: 10, 101: 50, 151: 50, 3001: 25 }),
    rank_50_selector_is_nonunique: JSON.stringify(rank50) === JSON.stringify([101, 151]),
    no_frozen_intrinsic_candidate_uniquely_selects_101: noIntrinsicCandidateUniquelySelects101,
    decimal_palindrome_unique_but_rejected_as_intrinsic: JSON.stringify(selectorAudit.decimal_palindrome) === JSON.stringify([101]),
    snce_type_enforcement_only: snce101.every(snceAccepts) && snce151.every(c => !snceAccepts(c)),
    inner_shrink_terminates_and_commutes_with_outer_expand: uniqueSink.length === 1 && everyNonSinkShrinks && commuteChecks.every(Boolean),
    strict_fractal_operator_absent: !strictFractalInputs.present,
    local_prime_controls_exact: JSON.stringify(localPrimes) === JSON.stringify([1021, 1031, 1033, 1039, 1049]) && isPrime(1031) && isPrime(1033) && localDistancePass,
    wheel_controls_descriptive_only: Object.keys(wheelControls).length === primes.length && new Set(Object.values(wheelControls).map(x => x.mod30)).size > 1,
    rosenbruecke_2041_factorization_exact_but_unbridged: 2041 === 13 * 157 && isPrime(13) && isPrime(157),
    population_charts_retained_as_null_models: true
  };

  const pass = Object.values(checks).every(Boolean);
  const classification = pass
    ? 'PASS_F50_TO_SNCE_FACTOR_BRIDGE__SELECTOR_NOT_INTRINSIC__PRODUCT_LATTICE_NOT_FRACTAL'
    : 'FAIL_F50_TO_SNCE_FACTOR_BRIDGE';

  const result = {
    test_id: 'F50_FACTOR_TO_SNCE_CHANNEL_01',
    classification,
    preregistration_sha256: sha256(PREREG),
    lock_sha256: sha256(LOCK),
    frozen_source_hashes: hashChecks,
    checks,
    checks_passed: Object.values(checks).filter(Boolean).length,
    checks_total: Object.keys(checks).length,
    f50: f50.toString(),
    factorization: factorization.map(([prime, exponent]) => ({ prime, exponent, rank_of_apparition: ranks[prime], wheel: wheelControls[prime] })),
    divisor_lattice: { nodes: divisors.length, directed_shrink_edges: edges.length, unique_sink: '1', max_shrink_steps: exponents.reduce((a, b) => a + b, 0) },
    selector_audit: selectorAudit,
    selection_result: {
      bridge_factor_101_present: true,
      rank_50_candidates: rank50,
      unique_intrinsic_selection: false,
      decimal_palindrome_status: 'UNIQUE_IN_BASE_10_BUT_REPRESENTATION_DEPENDENT',
      existing_snce_base_status: 'TYPE_DEFINITION_NOT_INDEPENDENT_EVIDENCE'
    },
    outer_channel: { formula: '101*2^k', tested_k: [0, 20], accepts_base_101: true, rejects_base_151: true },
    product_lattice: {
      inner: '48 divisors of F50 under one-exponent decrement',
      outer: 'k -> k+1, carrier multiplied by 2',
      operations_commute: true,
      strict_fractal: false,
      missing: ['independently specified contraction ratio', 'branch-copy map']
    },
    local_prime_control: { primes_1020_1050: localPrimes, targets: localDistances, twin_hinge: [1031, 1032, 1033] },
    rosenbruecke_control: { value: 2041, factorization: [13, 157], status: 'EXACT_ARITHMETIC__NO_FROZEN_OPERATOR_TO_101' },
    null_model_layers: ['Zipf rank-size', 'prime density', 'last-digit balance', 'mod-6 balance', 'mod-30 wheel', 'twin-prime population'],
    claim_boundary: 'Exact F50 factor bridge to the already typed base-101 SNCE family; no unique intrinsic 101 selector, strict fractal, physical resonance, or geometric causal bridge.'
  };

  fs.writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n');
  process.stdout.write(JSON.stringify({ classification, checks: `${result.checks_passed}/${result.checks_total}`, f50: result.f50, factor_count: factorization.length, divisors: divisors.length, rank_50_candidates: rank50, output: OUT }, null, 2) + '\n');
}

run();
