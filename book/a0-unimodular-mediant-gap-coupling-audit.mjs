#!/usr/bin/env node

import assert from 'node:assert/strict';

const MAX_N = 2048;

function isPrime(value) {
  if (!Number.isSafeInteger(value) || value < 2) return false;
  if (value % 2 === 0) return value === 2;
  for (let divisor = 3; divisor * divisor <= value; divisor += 2) {
    if (value % divisor === 0) return false;
  }
  return true;
}

function record(n) {
  const a = [n, n + 1];
  const b = [n + 1, n + 2];
  const c = [a[0] + b[0], a[1] + b[1]];
  const gap = ([left, right]) => right - left;
  const determinant = ([x1, y1], [x2, y2]) => x1 * y2 - y1 * x2;
  return {
    n,
    a,
    b,
    c,
    gaps: { a: gap(a), b: gap(b), c: gap(c), couplingRatio: '2:1' },
    determinants: { ab: determinant(a, b), ac: determinant(a, c), bc: determinant(b, c) },
    mediant: `${a[0]}/${a[1]} ⊕ ${b[0]}/${b[1]} = ${c[0]}/${c[1]}`,
    exactReturn: [c[0] - b[0], c[1] - b[1]],
    outputTwinPrime: isPrime(c[0]) && isPrime(c[1]),
  };
}

const records = Array.from({ length: MAX_N }, (_, index) => record(index + 1));
const failures = records.filter((item) => !(
  item.gaps.a === 1
  && item.gaps.b === 1
  && item.gaps.c === 2
  && item.determinants.ab === -1
  && item.determinants.ac === -1
  && item.determinants.bc === 1
  && item.exactReturn[0] === item.a[0]
  && item.exactReturn[1] === item.a[1]
));
const twinHits = records.filter((item) => item.outputTwinPrime);

assert.equal(failures.length, 0);
assert.deepEqual(record(2), {
  n: 2,
  a: [2, 3],
  b: [3, 4],
  c: [5, 7],
  gaps: { a: 1, b: 1, c: 2, couplingRatio: '2:1' },
  determinants: { ab: -1, ac: -1, bc: 1 },
  mediant: '2/3 ⊕ 3/4 = 5/7',
  exactReturn: [2, 3],
  outputTwinPrime: true,
});

const report = {
  schema: 'a0.unimodular-mediant-gap-coupling-audit.v1',
  date: '2026-10-30',
  status: 'PASS_BOUNDED_UNIMODULAR_MEDIANT_GAP_COUPLING',
  authority: 'existing ART:A0:MATHEMATICAL_JOINTS engineering verifier; no Study, Finding, identity, relation or vocabulary promotion',
  range: { n: [1, MAX_N], casesChecked: records.length },
  definition: {
    inputA: 'A_n=(n,n+1)',
    inputB: 'B_n=(n+1,n+2)',
    coupledOutput: 'C_n=A_n+B_n=(2n+1,2n+3)',
    gapOperator: 'Delta(x,y)=y-x',
    gapCoupling: 'Delta(C_n)=Delta(A_n)+Delta(B_n)=1+1=2',
    mediant: 'n/(n+1) oplus (n+1)/(n+2) = (2n+1)/(2n+3)',
  },
  universalChecks: {
    passed: records.length,
    failed: failures.length,
    determinants: ['det(A_n,B_n)=-1', 'det(A_n,C_n)=-1', 'det(B_n,C_n)=+1'],
    exactReturn: 'C_n-B_n=A_n',
  },
  requestedWitness: record(2),
  primeFilter: {
    condition: '2n+1 and 2n+3 are both prime',
    twinHits: twinHits.length,
    firstTwentyN: twinHits.slice(0, 20).map((item) => item.n),
    lastHit: twinHits.at(-1),
    reading: 'Gap 2 is universal in the declared family; twin-primality is a separate filter and is not universal.',
  },
  labels: {
    formal: 'Unimodular Mediant Gap-Doubling Joint',
    working: 'Quach Coupling · 2:1',
    vocabularyState: 'WORKING_LABEL_ONLY_NOT_CANONICAL',
  },
  claimCeiling: 'Exact finite arithmetic family and bounded prime filter only; no twin-prime theorem, prime generator, RPM or physical coupling, canonical vocabulary, Study, Finding, new identity, graph relation or publication state',
};

console.log(JSON.stringify(report, null, 2));
