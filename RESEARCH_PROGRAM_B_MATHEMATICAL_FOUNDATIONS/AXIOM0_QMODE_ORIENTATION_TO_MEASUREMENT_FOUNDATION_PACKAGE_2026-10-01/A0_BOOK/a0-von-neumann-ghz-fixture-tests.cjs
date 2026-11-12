'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {buildReceipt, verifyReceipt} = require('./a0-von-neumann-ghz-fixture.cjs');

const root = __dirname;
const receipt = buildReceipt();
assert.equal(receipt.summary.checksPassed, 16);
assert.equal(receipt.summary.checksTotal, 16);
assert.deepEqual(receipt.operatorOutcome.sameQubitSumSpectrum, [-1.414213562373, 1.414213562373]);
assert.deepEqual(receipt.operatorOutcome.contextFreeOutcomeSums, [-2, 0, 2]);
assert.deepEqual(receipt.operatorOutcome.diagonalSpectrum, [-1, 1]);
assert.equal(receipt.rotationAdapter.diagonalControl.matchesD, true);
assert.deepEqual(receipt.rotationAdapter.sampleSpectra['-45'], [-1, 1]);
assert.equal(receipt.rotationAdapter.typedRoles.apparatus, 'Q_B lens');
assert.equal(receipt.rotationAdapter.typedRoles.observable, 'M_B(beta)');
assert.deepEqual(receipt.commutingControl.sumSpectrum, [-2, 0, 0, 2]);
assert.equal(receipt.ghzParity.assignmentsChecked, 64);
assert.equal(receipt.ghzParity.satisfyingAssignments, 0);
assert.equal(receipt.ghzParity.maximumContextsSatisfied, 3);
assert.equal(receipt.ghzParity.assignmentsAtMaximum, 32);
assert.equal(Object.values(receipt.summary.graphDelta).every(value => value === 0), true);
verifyReceipt();

const surfaces = [
  'A0_RESEARCH_DESK.html',
  'A0_SCIENCE.html',
  'A0_MATHEMATICAL_JOINTS.html'
].map(file => fs.readFileSync(path.join(root, file), 'utf8'));
for (const html of surfaces) {
  assert.match(html, /A0-MATH-VN-GHZ-01/);
  assert.match(html, /a0-von-neumann-ghz-fixture-return-2026-11-11\.json/);
  assert.match(html, /16\/16/);
  assert.match(html, /NO NEW PHYSICS|NO_NEW_PHYSICS|keine neue Physik/i);
}

const workspace = fs.readFileSync(path.join(root, '..', '32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md'), 'utf8');
assert.match(workspace, /A0-MATH-VN-GHZ-01/);
assert.match(workspace, /NOT_A_LAB_RUN/);
assert.match(workspace, /satisfying assignments[^\n]*0/i);

console.log('PASS A0-MATH-VN-GHZ-01 · 16 mathematical assertions · 3 current surfaces · 1 Math/Findings record');
