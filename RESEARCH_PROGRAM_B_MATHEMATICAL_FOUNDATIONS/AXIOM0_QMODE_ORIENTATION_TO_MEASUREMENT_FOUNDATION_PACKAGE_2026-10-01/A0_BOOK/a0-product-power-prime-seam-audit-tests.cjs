const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = __dirname;
const run = spawnSync(process.execPath, [path.join(root, 'a0-product-power-prime-seam-audit.mjs')], { encoding: 'utf8' });
assert.equal(run.status, 0, run.stderr);
const computed = JSON.parse(run.stdout);
const receipt = JSON.parse(fs.readFileSync(path.join(root, 'results/a0-product-power-prime-seam-audit-2026-10-30.json'), 'utf8'));
const desk = fs.readFileSync(path.join(root, 'A0_RESEARCH_DESK.html'), 'utf8');
const mathfield = fs.readFileSync(path.join(root, 'A0_MATHEMATICAL_JOINTS.html'), 'utf8');

assert.equal(computed.range.orderedPairsChecked, 2048 ** 2);
assert.equal(computed.boundedResult.hits, 1);
assert.deepEqual(computed.boundedResult.seamHits, receipt.boundedResult.seamHits);
assert.equal(computed.witness.multiplicationPort, 6);
assert.equal(computed.witness.seam, 7);
assert.equal(computed.witness.exponentiationPort, 8);
assert.equal(computed.witness.leftResidual, 1);
assert.equal(computed.witness.rightResidual, 1);
assert.equal(computed.witness.bracketWidth, 2);
assert.equal(computed.controls.swapped.width, 3);
assert.equal(computed.controls.swapped.integerMidpoint, false);

[
  'product-power-prime-seam-return',
  '2·3=6',
  '2³=8',
  '√7',
  'taumelnde 1',
  '4.194.304',
  'PASS_BOUNDED_UNIQUE_ORDERED_PRIME_SEAM',
].forEach((token) => {
  assert.ok(desk.includes(token), `Desk: ${token}`);
  assert.ok(mathfield.includes(token), `Mathfield: ${token}`);
});

console.log(JSON.stringify({ status: 'PASS', checks: 20, orderedPairsChecked: computed.range.orderedPairsChecked, hits: computed.boundedResult.hits, seam: 7 }));
