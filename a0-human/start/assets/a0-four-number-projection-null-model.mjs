import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const specPath = path.join(here, 'a0-four-number-projection-null-model-spec.json');
const specBytes = fs.readFileSync(specPath);
const spec = JSON.parse(specBytes.toString('utf8'));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function gcd(a, b) {
  while (b !== 0) [a, b] = [b, a % b];
  return Math.abs(a);
}

function factorization(n) {
  let rest = n;
  const factors = [];
  for (let p = 2; p * p <= rest; p += p === 2 ? 1 : 2) {
    if (rest % p !== 0) continue;
    let exponent = 0;
    while (rest % p === 0) {
      rest /= p;
      exponent += 1;
    }
    factors.push([p, exponent]);
  }
  if (rest > 1) factors.push([rest, 1]);
  return factors;
}

function phiFromFactors(n, factors) {
  let value = n;
  for (const [p] of factors) value = (value / p) * (p - 1);
  return value;
}

function reverseDigits(n) {
  return Number(String(n).split('').reverse().join(''));
}

function digitLength(n) {
  return String(n).length;
}

function alignedDigitSums(a, b) {
  const left = String(a);
  const right = String(b);
  assert(left.length === right.length, 'digitwise sum requires equal digit lengths');
  return [...left].map((digit, index) => Number(digit) + Number(right[index]));
}

function arithmetic(n) {
  const factors = factorization(n);
  const phi = phiFromFactors(n, factors);
  return {
    n,
    factors,
    phi,
    phiRatio: phi / n,
    omega: factors.length,
    Omega: factors.reduce((sum, [, exponent]) => sum + exponent, 0),
    residues: Object.fromEntries(spec.arithmetic_channels.crt_moduli.map((m) => [m, n % m])),
    q20: Math.floor(n / 20),
    r20: n % 20,
    mod360: n % 360,
    reverse: reverseDigits(n),
    palindrome: reverseDigits(n) === n
  };
}

function cyclicDistance(a, b, modulus) {
  const raw = Math.abs(a - b);
  return Math.min(raw, modulus - raw);
}

const cache = new Map();
function record(n) {
  if (!cache.has(n)) cache.set(n, arithmetic(n));
  return cache.get(n);
}

function blockDistances(a, b) {
  const factorOmega = Math.min(1, Math.abs(a.omega - b.omega) / 4);
  const factorBigOmega = Math.min(1, Math.abs(a.Omega - b.Omega) / 8);
  const crt = spec.arithmetic_channels.crt_moduli.map((m) => {
    const denominator = Math.floor(m / 2);
    return (cyclicDistance(a.residues[m], b.residues[m], m) / denominator) ** 2;
  });
  return {
    totient: (a.phiRatio - b.phiRatio) ** 2,
    factor_profile: (factorOmega ** 2 + factorBigOmega ** 2) / 2,
    crt: crt.reduce((sum, value) => sum + value, 0) / crt.length,
    qrt: (Math.abs(a.r20 - b.r20) / 19) ** 2
  };
}

function score(numbers, excludedBlock = null) {
  const rows = numbers.map(record);
  let sum = 0;
  let pairCount = 0;
  for (let i = 0; i < rows.length; i += 1) {
    for (let j = i + 1; j < rows.length; j += 1) {
      const blocks = blockDistances(rows[i], rows[j]);
      const values = Object.entries(blocks)
        .filter(([name]) => name !== excludedBlock)
        .map(([, value]) => value);
      sum += values.reduce((subtotal, value) => subtotal + value, 0) / values.length;
      pairCount += 1;
    }
  }
  return sum / pairCount;
}

function projection(n) {
  const a = record(n);
  const theta = 2 * Math.PI * a.mod360 / 360;
  return {
    n,
    theta,
    radius: a.phiRatio,
    x: a.phiRatio * Math.cos(theta),
    y: a.phiRatio * Math.sin(theta),
    z: 2 * a.r20 / 19 - 1,
    rgb: [a.residues[7] / 6, a.residues[11] / 10, a.residues[13] / 12],
    outline: a.residues[19] / 18
  };
}

function extendedGcd(a, b) {
  if (b === 0) return [a, 1, 0];
  const [g, x1, y1] = extendedGcd(b, a % b);
  return [g, y1, x1 - Math.floor(a / b) * y1];
}

function modInverse(a, modulus) {
  const [g, x] = extendedGcd(a, modulus);
  assert(g === 1, `no inverse for ${a} mod ${modulus}`);
  return ((x % modulus) + modulus) % modulus;
}

function crtReconstruct(residues, moduli) {
  const product = moduli.reduce((value, modulus) => value * modulus, 1);
  let total = 0;
  for (let i = 0; i < moduli.length; i += 1) {
    const partial = product / moduli[i];
    total += residues[i] * partial * modInverse(partial % moduli[i], moduli[i]);
  }
  return ((total % product) + product) % product;
}

function makePrng(seed) {
  let state = seed >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0x100000000;
  };
}

function choose(array, random) {
  return array[Math.floor(random() * array.length)];
}

function representationPools() {
  const reversalPairs = [];
  const pal4 = [];
  const pal5 = [];
  for (let n = 1000; n <= 9999; n += 1) {
    if (n % 2 === 0) continue;
    const reverse = reverseDigits(n);
    if (reverse === n) pal4.push(n);
    else if (digitLength(reverse) === 4 && reverse % 2 === 1 && n < reverse) reversalPairs.push([n, reverse]);
  }
  for (let n = 10000; n <= 19999; n += 1) {
    if (n % 2 === 1 && reverseDigits(n) === n) pal5.push(n);
  }
  return { reversalPairs, pal4, pal5 };
}

function factorScalePools(target) {
  return target.map((n) => {
    const wanted = record(n);
    const low = Math.ceil(n * 0.8);
    const high = Math.floor(n * 1.2);
    const values = [];
    for (let candidate = low; candidate <= high; candidate += 1) {
      if (candidate % 2 === 0 || digitLength(candidate) !== digitLength(n) || target.includes(candidate)) continue;
      const row = record(candidate);
      if (row.omega === wanted.omega && row.Omega === wanted.Omega) values.push(candidate);
    }
    return values;
  });
}

function summarize(values, targetValue) {
  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(1, values.length - 1);
  const at = (q) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
  const lowerOrEqual = values.filter((value) => value <= targetValue).length;
  return {
    target: targetValue,
    mean,
    standardDeviation: Math.sqrt(variance),
    q01: at(0.01),
    q05: at(0.05),
    q50: at(0.50),
    empiricalLowerTailP: (1 + lowerOrEqual) / (1 + values.length)
  };
}

function sampleNulls(target) {
  const draws = spec.sampling.draws_per_null;
  const random = makePrng(spec.sampling.seed_unsigned_32);
  const rep = representationPools();
  const scale = factorScalePools(target);
  assert(rep.reversalPairs.length > 0 && rep.pal4.length > 0 && rep.pal5.length > 0, 'empty representation-matched pool');
  assert(scale.every((pool) => pool.length > 0), 'empty factor-scale-matched pool');

  const blocks = [null, 'totient', 'factor_profile', 'crt', 'qrt'];
  const samples = {
    N1_REPRESENTATION_MATCHED: Object.fromEntries(blocks.map((block) => [block ?? 'full', []])),
    N2_FACTOR_SCALE_MATCHED: Object.fromEntries(blocks.map((block) => [block ?? 'full', []]))
  };
  const signatures = { N1_REPRESENTATION_MATCHED: new Set(), N2_FACTOR_SCALE_MATCHED: new Set() };

  while (samples.N1_REPRESENTATION_MATCHED.full.length < draws) {
    const pair = choose(rep.reversalPairs, random);
    const quartet = [...pair, choose(rep.pal4, random), choose(rep.pal5, random)];
    if (new Set(quartet).size !== 4 || quartet.every((value) => target.includes(value))) continue;
    const signature = [...quartet].sort((a, b) => a - b).join(',');
    signatures.N1_REPRESENTATION_MATCHED.add(signature);
    for (const block of blocks) samples.N1_REPRESENTATION_MATCHED[block ?? 'full'].push(score(quartet, block));
  }

  while (samples.N2_FACTOR_SCALE_MATCHED.full.length < draws) {
    const quartet = scale.map((pool) => choose(pool, random));
    if (new Set(quartet).size !== 4) continue;
    const signature = quartet.join(',');
    signatures.N2_FACTOR_SCALE_MATCHED.add(signature);
    for (const block of blocks) samples.N2_FACTOR_SCALE_MATCHED[block ?? 'full'].push(score(quartet, block));
  }

  return { samples, signatures, poolSizes: {
    N1_REPRESENTATION_MATCHED: {
      reversalPairs: rep.reversalPairs.length,
      fourDigitPalindromes: rep.pal4.length,
      fiveDigitPalindromes: rep.pal5.length
    },
    N2_FACTOR_SCALE_MATCHED: scale.map((pool) => pool.length)
  }};
}

function classify(results, uniqueCounts) {
  if (Object.values(uniqueCounts).some((count) => count < spec.sampling.minimum_unique_quartets)) return 'UNINFORMATIVE_NULL_POOL';
  const n1 = results.N1_REPRESENTATION_MATCHED.full.empiricalLowerTailP <= spec.decision.primary_alpha_each_null;
  const n2 = results.N2_FACTOR_SCALE_MATCHED.full.empiricalLowerTailP <= spec.decision.primary_alpha_each_null;
  if (n1 && n2) {
    const robust = ['without_totient', 'without_factor_profile', 'without_crt', 'without_qrt'].every((name) =>
      results.N1_REPRESENTATION_MATCHED[name].empiricalLowerTailP <= spec.decision.leave_one_block_out_alpha_each_null &&
      results.N2_FACTOR_SCALE_MATCHED[name].empiricalLowerTailP <= spec.decision.leave_one_block_out_alpha_each_null);
    return robust ? 'ROBUST_BOTH_NULLS_PASS' : 'PRIMARY_BOTH_NULLS_PASS_NOT_ROBUST';
  }
  if (n1) return 'REPRESENTATION_MATCHED_ONLY';
  if (n2) return 'FACTOR_SCALE_MATCHED_ONLY';
  return 'NO_UNUSUAL_COHERENCE';
}

function verify() {
  const target = spec.target;
  const expected = {
    1087: { factors: [[1087, 1]], phi: 1086, reverse: 7801 },
    7801: { factors: [[29, 1], [269, 1]], phi: 7504, reverse: 1087 },
    2929: { factors: [[29, 1], [101, 1]], phi: 2800, reverse: 2929 },
    12321: { factors: [[3, 2], [37, 2]], phi: 7992, reverse: 12321 }
  };
  for (const n of target) {
    const row = record(n);
    assert(JSON.stringify(row.factors) === JSON.stringify(expected[n].factors), `factorization mismatch for ${n}`);
    assert(row.phi === expected[n].phi, `totient mismatch for ${n}`);
    assert(row.reverse === expected[n].reverse, `reversal mismatch for ${n}`);
  }
  assert(1087 + 7801 === 8888, 'reversal-pair sum mismatch');
  assert(JSON.stringify(alignedDigitSums(1087, 7801)) === JSON.stringify([8, 8, 8, 8]), 'digitwise 8-column control mismatch');
  assert(gcd(7 * 11 * 13, 19) === 1, 'CRT moduli are not pairwise coprime');
  const moduli = spec.arithmetic_channels.crt_moduli;
  const crtProduct = moduli.reduce((value, modulus) => value * modulus, 1);
  assert(Math.max(...target) < crtProduct, 'CRT product does not cover target values');
  for (const n of target) {
    const residues = moduli.map((m) => n % m);
    assert(crtReconstruct(residues, moduli) === n, `CRT reconstruction mismatch for ${n}`);
    const p = projection(n);
    assert(Math.abs(Math.hypot(p.x, p.y) - p.radius) < 1e-12, `projection radius mismatch for ${n}`);
  }

  const excluded = [null, 'totient', 'factor_profile', 'crt', 'qrt'];
  const targetScores = Object.fromEntries(excluded.map((block) => [block ?? 'full', score(target, block)]));
  const { samples, signatures, poolSizes } = sampleNulls(target);
  const results = {};
  for (const [nullName, byScore] of Object.entries(samples)) {
    results[nullName] = {};
    for (const [name, values] of Object.entries(byScore)) {
      const outputName = name === 'full' ? 'full' : `without_${name}`;
      results[nullName][outputName] = summarize(values, targetScores[name]);
    }
  }
  const uniqueCounts = Object.fromEntries(Object.entries(signatures).map(([name, values]) => [name, values.size]));
  const classification = classify(results, uniqueCounts);
  return {
    recordId: spec.record_id,
    status: classification,
    authorizationSource: 'external Science Lab reopen and Human Owner run record required; executable does not grant authority',
    runtime: process.version,
    specSha256: crypto.createHash('sha256').update(specBytes).digest('hex'),
    knownRepresentationControls: {
      reversalPair: [1087, 7801],
      reversalPairSum: 8888,
      digitwiseColumnSums: alignedDigitSums(1087, 7801),
      palindromes: [2929, 12321],
      includedInCoherenceScore: false
    },
    target: target.map(record),
    projection: target.map(projection),
    targetScores,
    poolSizes,
    uniqueQuartets: uniqueCounts,
    nullResults: results,
    claimBoundary: spec.claim_boundary
  };
}

if (process.argv.length !== 3 || process.argv[2] !== '--verify') {
  process.stderr.write('Usage: node a0-four-number-projection-null-model.mjs --verify\n');
  process.exit(64);
}

try {
  process.stdout.write(`${JSON.stringify(verify(), null, 2)}\n`);
} catch (error) {
  process.stderr.write(`${error.stack ?? error.message}\n`);
  process.exit(1);
}
