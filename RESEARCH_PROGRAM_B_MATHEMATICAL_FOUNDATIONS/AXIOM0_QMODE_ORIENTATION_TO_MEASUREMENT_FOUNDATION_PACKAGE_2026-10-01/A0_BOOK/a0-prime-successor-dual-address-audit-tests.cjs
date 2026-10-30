const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = __dirname;
const run = spawnSync(process.execPath, [path.join(root, 'a0-prime-successor-dual-address-audit.mjs')], { encoding: 'utf8' });
assert.equal(run.status, 0, run.stderr);
const computed = JSON.parse(run.stdout);
const receipt = JSON.parse(fs.readFileSync(path.join(root, 'results/a0-prime-successor-dual-address-audit-2026-10-30.json'), 'utf8'));
const desk = fs.readFileSync(path.join(root, 'A0_RESEARCH_DESK.html'), 'utf8');
const mathfield = fs.readFileSync(path.join(root, 'A0_MATHEMATICAL_JOINTS.html'), 'utf8');

assert.equal(computed.theoremLevelIdentity.boundedHits, receipt.range.successorHits);
assert.equal(computed.theoremLevelIdentity.requestedWitnesses.p1PlusP7, '2+17=19=p_8');
assert.equal(computed.theoremLevelIdentity.requestedWitnesses.p1PlusP10, '2+29=31=p_11');
assert.equal(computed.dualAddress.indexAddress, 710);
assert.equal(computed.dualAddress.valueAddress, 1729);
[
  'prime-successor-dual-address-return',
  'p₁+p₇=p₈',
  'p₁+p₁₀=p₁₁',
  '17|29=1729',
  '7|10=710',
  '311',
  'PASS_BOUNDED_TWIN_SUCCESSOR_AND_DUAL_ADDRESS_AUDIT',
].forEach((token) => {
  assert.ok(desk.includes(token), `Desk: ${token}`);
  assert.ok(mathfield.includes(token), `Mathfield: ${token}`);
});

console.log(JSON.stringify({ status: 'PASS', checks: 19, successorHits: computed.theoremLevelIdentity.boundedHits, valueAddress: 1729, indexAddress: 710 }));
