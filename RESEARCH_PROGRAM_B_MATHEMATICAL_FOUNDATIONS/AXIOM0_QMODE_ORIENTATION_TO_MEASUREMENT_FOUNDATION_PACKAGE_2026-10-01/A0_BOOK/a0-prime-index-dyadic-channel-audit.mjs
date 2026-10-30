#!/usr/bin/env node

import assert from 'node:assert/strict';

const MAX_INDEX = 2048;
const PRIME_LIMIT = 100000;

function primesThrough(limit) {
  const composite = new Uint8Array(limit + 1);
  const primes = [];
  for (let value = 2; value <= limit; value += 1) {
    if (composite[value]) continue;
    primes.push(value);
    if (value * value <= limit) {
      for (let multiple = value * value; multiple <= limit; multiple += value) composite[multiple] = 1;
    }
  }
  return primes;
}

function isPowerOfTwo(value) {
  return value > 0 && Number.isInteger(Math.log2(value));
}

const primes = primesThrough(PRIME_LIMIT);
assert.ok(primes.length >= MAX_INDEX * 2, 'sieve must cover p_(i+j)');

const hits = [];
const byExponent = new Map();
let residueEqualsLeft = 0;
let residueEqualsRight = 0;
let primeResidues = 0;

for (let i = 1; i <= MAX_INDEX; i += 1) {
  for (let j = i; j <= MAX_INDEX; j += 1) {
    const leftPrime = primes[i - 1];
    const rightPrime = primes[j - 1];
    const valueSum = leftPrime + rightPrime;
    if (!isPowerOfTwo(valueSum)) continue;
    const indexSum = i + j;
    const indexPrime = primes[indexSum - 1];
    const residue = indexPrime - valueSum;
    const exponent = Math.log2(valueSum);
    const hit = { i, j, leftPrime, rightPrime, indexSum, valueSum, exponent, indexPrime, residue };
    hits.push(hit);
    byExponent.set(exponent, (byExponent.get(exponent) || 0) + 1);
    if (residue === leftPrime) residueEqualsLeft += 1;
    if (residue === rightPrime) residueEqualsRight += 1;
    if (residue > 1 && primes.includes(residue)) primeResidues += 1;
  }
}

const primary = hits.find(({ i, j }) => i === 2 && j === 3);
const sameResidualControl = hits.find(({ i, j }) => i === 2 && j === 6);
assert.deepEqual(primary, {
  i: 2, j: 3, leftPrime: 3, rightPrime: 5, indexSum: 5,
  valueSum: 8, exponent: 3, indexPrime: 11, residue: 3,
});
assert.deepEqual(sameResidualControl, {
  i: 2, j: 6, leftPrime: 3, rightPrime: 13, indexSum: 8,
  valueSum: 16, exponent: 4, indexPrime: 19, residue: 3,
});
assert.ok(hits.length > 2, 'the primary equality must not be reported as unique');
assert.ok(residueEqualsLeft > 1, 'the residual form must have a counterexample to uniqueness');
assert.equal(residueEqualsRight, 0, 'no bounded hit returns the right addend');

const report = {
  schema: 'a0.prime-index-dyadic-channel-audit.v1',
  date: '2026-10-30',
  status: 'PASS_BOUNDED_TYPED_ARITHMETIC_AUDIT_NO_GENERAL_LAW',
  authority: 'existing A0 Science Desk engineering audit; no Study, Finding, identity or relation',
  range: { oneBasedPrimeIndices: [1, MAX_INDEX], unorderedPairs: MAX_INDEX * (MAX_INDEX + 1) / 2 },
  definitions: {
    primeIndex: 'p_1=2, p_2=3, p_3=5, ...',
    valueChannel: 'p_i+p_j',
    indexCoil: 'p_(i+j)',
    residualReturn: 'p_(i+j)-(p_i+p_j)',
    dyadicGate: 'p_i+p_j=2^n',
  },
  primary,
  controls: {
    sameResidualControl,
    dyadicHits: hits.length,
    dyadicHitsByExponent: Object.fromEntries([...byExponent.entries()].sort((a, b) => a[0] - b[0])),
    residueEqualsLeft,
    residueEqualsRight,
    primeResidues,
    firstTenHits: hits.slice(0, 10),
  },
  interpretation: {
    exact: ['2+3=5 as an index equation', 'p_2+p_3=3+5=8=2^3', 'p_(2+3)=p_5=11', '11-8=3=p_2'],
    boundedResult: 'The primary case is a member of a wider Goldbach-to-power-of-two family; neither the dyadic hit nor the left-residual form is unique.',
    application: 'typed comparator for index/value/address/return channels and a negative control against coincidence-driven identity claims',
    claimCeiling: 'not a prime generator, recurrence, mechanism, 6k law, musical law or evidence of a physical channel',
  },
};

console.log(JSON.stringify(report, null, 2));
