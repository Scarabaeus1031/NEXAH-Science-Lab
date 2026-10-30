#!/usr/bin/env node

import assert from 'node:assert/strict';

const MAX_INDEX = 2048;

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

function isPrime(value) {
  if (!Number.isSafeInteger(value) || value < 2) return false;
  if (value % 2 === 0) return value === 2;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return false;
  }
  return true;
}

// Compare base^exponent with a small exact target without constructing a huge power.
function comparePowerToTarget(base, exponent, target) {
  let value = 1;
  for (let step = 0; step < exponent; step += 1) {
    if (value > Math.floor(target / base)) return 1;
    value *= base;
  }
  return Math.sign(value - target);
}

const primes = primesThrough(100000);
assert.ok(primes.length >= MAX_INDEX);

const seamHits = [];
let pairsChecked = 0;
for (let i = 1; i <= MAX_INDEX; i += 1) {
  const a = primes[i - 1];
  for (let j = 1; j <= MAX_INDEX; j += 1) {
    const b = primes[j - 1];
    const product = a * b;
    const upper = product + 2;
    pairsChecked += 1;
    if (comparePowerToTarget(a, b, upper) !== 0) continue;
    const seam = product + 1;
    seamHits.push({ i, j, a, b, product, seam, power: upper, seamIsPrime: isPrime(seam) });
  }
}

assert.equal(pairsChecked, MAX_INDEX ** 2);
assert.deepEqual(seamHits, [{ i: 1, j: 2, a: 2, b: 3, product: 6, seam: 7, power: 8, seamIsPrime: true }]);

const witness = {
  orderedSeed: [2, 3],
  multiplicationPort: 2 * 3,
  exponentiationPort: 2 ** 3,
  seam: (2 * 3 + 2 ** 3) / 2,
  leftResidual: 7 - 2 * 3,
  rightResidual: 2 ** 3 - 7,
  bracketWidth: 2 ** 3 - 2 * 3,
  rootLift: Math.sqrt(7),
};

assert.deepEqual({ ...witness, rootLift: undefined }, {
  orderedSeed: [2, 3],
  multiplicationPort: 6,
  exponentiationPort: 8,
  seam: 7,
  leftResidual: 1,
  rightResidual: 1,
  bracketWidth: 2,
  rootLift: undefined,
});

const report = {
  schema: 'a0.product-power-prime-seam-audit.v1',
  date: '2026-10-30',
  status: 'PASS_BOUNDED_UNIQUE_ORDERED_PRIME_SEAM',
  authority: 'existing A0 Science Desk / Mathfield engineering audit; no Study, Finding, identity or relation',
  range: {
    oneBasedPrimeIndices: [1, MAX_INDEX],
    orderedPairsChecked: pairsChecked,
    operatorOrder: 'a*b compared with a^b; ordered because exponentiation is not commutative',
  },
  definition: {
    multiplicationPort: 'M(a,b)=a*b',
    exponentiationPort: 'P(a,b)=a^b',
    unitSeamCondition: 'P-M=2 and S=(M+P)/2=M+1=P-1 is prime',
    rootLift: 'R=sqrt(S), kept as a derived value rather than an identity with S or the unit residual',
  },
  witness,
  boundedResult: {
    hits: seamHits.length,
    seamHits,
    reading: '(a,b)=(2,3) is the only ordered prime pair through p_2048 satisfying a^b-ab=2',
  },
  controls: {
    swapped: { orderedSeed: [3, 2], product: 6, power: 9, width: 3, integerMidpoint: false },
    repeatedTwo: { orderedSeed: [2, 2], product: 4, power: 4, width: 0, unitSeam: false },
    nextExponent: { orderedSeed: [2, 5], product: 10, power: 32, width: 22, unitSeam: false },
  },
  interpretation: {
    exact: '2*3=6, 7=(6+8)/2, 2^3=8, with residuals +1 and +1; bracket width 2=p_1',
    mnemonic: 'the taumelnde 1 names the two unit residuals around 7',
    rootBoundary: 'sqrt(7) is the declared root lift of the seam value 7; it is not 7, not 1, and not evidence of a physical rotation',
  },
  claimCeiling: 'Finite arithmetic uniqueness in the declared ordered prime window; no universal prime law, generator, root identity, rotation mechanism, physical channel, Study, Finding, new graph relation or publication state',
};

console.log(JSON.stringify(report, null, 2));
