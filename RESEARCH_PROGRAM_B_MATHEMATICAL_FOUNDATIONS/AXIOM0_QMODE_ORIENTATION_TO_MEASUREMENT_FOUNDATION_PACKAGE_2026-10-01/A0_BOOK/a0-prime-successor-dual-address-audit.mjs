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

const primes = primesThrough(100000);
assert.ok(primes.length > MAX_INDEX);
const successorHits = [];

for (let n = 1; n <= MAX_INDEX; n += 1) {
  const pn = primes[n - 1];
  const successor = primes[n];
  if (primes[0] + pn === successor) successorHits.push({ n, pn, successorIndex: n + 1, successor });
}

const concat = (left, right) => Number(`${left}${right}`);
const addressWitness = {
  leftIndex: 7,
  rightIndex: 10,
  leftPrime: primes[6],
  rightPrime: primes[9],
  indexAddress: concat(7, 10),
  valueAddress: concat(primes[6], primes[9]),
};

assert.deepEqual(successorHits.find(({ n }) => n === 7), { n: 7, pn: 17, successorIndex: 8, successor: 19 });
assert.deepEqual(successorHits.find(({ n }) => n === 10), { n: 10, pn: 29, successorIndex: 11, successor: 31 });
assert.deepEqual(addressWitness, { leftIndex: 7, rightIndex: 10, leftPrime: 17, rightPrime: 29, indexAddress: 710, valueAddress: 1729 });
assert.equal(1729, 1 ** 3 + 12 ** 3);
assert.equal(1729, 9 ** 3 + 10 ** 3);
assert.equal(1729, 7 * 13 * 19);
assert.equal(710, 2 * 5 * 71);

const allSuccessorEquivalencesHold = successorHits.every(({ pn, successor }) => successor - pn === 2);
assert.equal(allSuccessorEquivalencesHold, true);

const report = {
  schema: 'a0.prime-successor-dual-address-audit.v1',
  date: '2026-10-30',
  status: 'PASS_BOUNDED_TWIN_SUCCESSOR_AND_DUAL_ADDRESS_AUDIT',
  authority: 'existing A0 Science Desk / Mathfield engineering audit; no Study, Finding, identity or relation',
  range: { oneBasedPrimeIndices: [1, MAX_INDEX] },
  theoremLevelIdentity: {
    statement: 'p_1+p_n=p_(n+1) iff p_(n+1)-p_n=2',
    reason: 'p_1=2; the equality is exactly the twin-prime successor condition',
    boundedHits: successorHits.length,
    firstTenHits: successorHits.slice(0, 10),
    requestedWitnesses: {
      p1PlusP7: '2+17=19=p_8',
      p1PlusP10: '2+29=31=p_11',
    },
  },
  dualAddress: {
    ...addressWitness,
    typedReading: 'C10(7,10)=710 is the index address; C10(p_7,p_10)=C10(17,29)=1729 is the value address',
    valueFacts: ['1729=1^3+12^3=9^3+10^3', '1729=7*13*19'],
    indexAddressFacts: ['710=2*5*71'],
  },
  controls: {
    nonIdentity: '710 and 1729 are linked by declared source indices, not by equality, lift, multiplication or an inferred physical channel',
    existingArchaeology: '1729 already has Hardy-Ramanujan, QRT/CRT, sum/difference and 17|29 source-bound readings; this audit adds only the explicit 7|10 index-address return',
  },
  application: 'Mathfield joint with four typed ports: prime values, prime indices, decimal concatenation, and successor/return condition',
  claimCeiling: 'No twin-prime theorem, generator, universal decimal law, physical channel, Study, Finding, new identity, relation or publication state',
};

console.log(JSON.stringify(report, null, 2));
