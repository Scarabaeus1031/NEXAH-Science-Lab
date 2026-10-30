const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = __dirname;
const run = spawnSync(process.execPath, [path.join(root, 'a0-prime-index-dyadic-channel-audit.mjs')], { encoding: 'utf8' });
assert.equal(run.status, 0, run.stderr);
const computed = JSON.parse(run.stdout);
const receipt = JSON.parse(fs.readFileSync(path.join(root, 'results/a0-prime-index-dyadic-channel-audit-2026-10-30.json'), 'utf8'));
const desk = fs.readFileSync(path.join(root, 'A0_RESEARCH_DESK.html'), 'utf8');

assert.equal(computed.range.unorderedPairs, 2098176);
assert.equal(computed.controls.dyadicHits, receipt.controls.dyadicHits);
assert.equal(computed.controls.residueEqualsLeft, receipt.controls.sameLeftResidualHits);
assert.equal(computed.controls.residueEqualsRight, receipt.controls.sameRightResidualHits);
assert.equal(computed.controls.primeResidues, receipt.controls.primeResidualHits);
assert.deepEqual(computed.primary, {
  i: 2, j: 3, leftPrime: 3, rightPrime: 5, indexSum: 5,
  valueSum: 8, exponent: 3, indexPrime: 11, residue: 3,
});
[
  'prime-index-dyadic-channel-audit-20261030',
  '2 + 3 = 5',
  'p₂ + p₃ = 3 + 5 = 8 = 2³',
  'p₅ = 11',
  '386',
  '6k±1',
  'A0_NUMBERMAGICK_GRID_RESEARCH.html#pascal-thread-demonstrator',
  'A0_MATHEMATICAL_JOINTS.html',
  'PASS_BOUNDED_TYPED_ARITHMETIC_AUDIT_NO_GENERAL_LAW',
].forEach((token) => assert.ok(desk.includes(token), token));

console.log(JSON.stringify({ status: 'PASS', checks: 18, dyadicHits: computed.controls.dyadicHits, pairs: computed.range.unorderedPairs }));
