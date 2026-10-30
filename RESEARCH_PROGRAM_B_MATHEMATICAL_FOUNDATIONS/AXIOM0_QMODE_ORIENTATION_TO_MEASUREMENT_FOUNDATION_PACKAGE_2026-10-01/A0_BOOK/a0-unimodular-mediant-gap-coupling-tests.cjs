const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = __dirname;
const run = spawnSync(process.execPath, [path.join(root, 'a0-unimodular-mediant-gap-coupling-audit.mjs')], { encoding: 'utf8' });
assert.equal(run.status, 0, run.stderr);
const computed = JSON.parse(run.stdout);
const receipt = JSON.parse(fs.readFileSync(path.join(root, 'results/a0-unimodular-mediant-gap-coupling-audit-2026-10-30.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'A0_MATHEMATICAL_JOINTS.html'), 'utf8');
const desk = fs.readFileSync(path.join(root, 'A0_RESEARCH_DESK.html'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'a0-unimodular-mediant-gap-coupling.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'a0-unimodular-mediant-gap-coupling.css'), 'utf8');

assert.equal(computed.range.casesChecked, 2048);
assert.equal(computed.universalChecks.failed, 0);
assert.equal(computed.requestedWitness.mediant, '2/3 ⊕ 3/4 = 5/7');
assert.deepEqual(computed.requestedWitness.exactReturn, [2, 3]);
assert.equal(computed.requestedWitness.gaps.c, 2);
assert.equal(computed.requestedWitness.determinants.ab, -1);
assert.equal(computed.primeFilter.twinHits, receipt.primeFilter.twinHits);

[
  'quachCouplingDemo',
  'Quach Coupling · 2:1',
  'Unimodular Mediant Gap-Doubling Joint',
  'data-qc-twin',
  'a0-unimodular-mediant-gap-coupling.js',
  'a0-unimodular-mediant-gap-coupling.css',
  'PASS_BOUNDED_UNIMODULAR_MEDIANT_GAP_COUPLING',
].forEach((token) => assert.ok(html.includes(token), `Mathfield: ${token}`));
[
  'unimodular-mediant-gap-coupling-return',
  'PASS_BOUNDED_UNIMODULAR_MEDIANT_GAP_COUPLING',
  'WORKING_LABEL_ONLY_NOT_CANONICAL',
].forEach((token) => assert.ok(desk.includes(token), `Desk: ${token}`));
['setInterval', 'nextTwin', 'const { a, b, c }', "put('prime'"].forEach((token) => assert.ok(ui.includes(token), `UI: ${token}`));
['.quach-demo', '[data-twin=true]', '@media(max-width:820px)'].forEach((token) => assert.ok(css.includes(token), `CSS: ${token}`));

console.log(JSON.stringify({ status: 'PASS', checks: 25, cases: computed.range.casesChecked, twinHits: computed.primeFilter.twinHits, witness: computed.requestedWitness.c }));
