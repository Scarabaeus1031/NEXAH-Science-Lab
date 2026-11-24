#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {buildReceipt, verifyReceipt} = require('./a0-root8-gamma-root7-audit.cjs');

const read = name => fs.readFileSync(path.join(__dirname, name), 'utf8');
const joints = read('A0_MATHEMATICAL_JOINTS.html');
const rootRoom = read('A0_ROOTROOM_CODON_ORIENTATION_RETURN.html');
const viewJs = read('a0-root8-gamma-root7-view.js');
const viewCss = read('a0-root8-gamma-root7-view.css');
const receipt = buildReceipt();

verifyReceipt();

const checks = [
  ['receipt remains exact', receipt.summary.checksPassed === 15 && receipt.summary.checksTotal === 15],
  ['graph delta remains zero', Object.values(receipt.summary.graphDelta).every(value => value === 0)],
  ['joint host is present', /id="root8-gamma-root7-comparator"/.test(joints)],
  ['joint exact chain is present', /2³=8/.test(joints) && /γ=√8/.test(joints) && /γβ=√7/.test(joints) && /γ²−\(γβ\)²=1/.test(joints)],
  ['joint links the machine receipt', /results\/a0-root8-gamma-root7-audit-2026-11-19\.json/.test(joints)],
  ['root room gamma light view is present', /id="gamma-light"/.test(rootRoom) && /Gamma Light · The 8│7 Gate/.test(rootRoom)],
  ['both hosts use the shared lens', [joints, rootRoom].every(source => /data-root8-gamma-lens/.test(source))],
  ['both hosts load shared assets', [joints, rootRoom].every(source => /a0-root8-gamma-root7-view\.css/.test(source) && /a0-root8-gamma-root7-view\.js/.test(source))],
  ['interactive preset remains bounded', /ROOT8_BETA/.test(viewJs) && /Math\.sqrt\(7 \/ 8\)/.test(viewJs) && /1 \/ Math\.sqrt\(1 - beta \* beta\)/.test(viewJs)],
  ['invariant readout remains explicit', /gamma \* gamma - gammaBeta \* gammaBeta/.test(viewJs)],
  ['root8 finite boundary remains visible', /√8<\/code> ist endlich/.test(joints) && /finite · not ∞/.test(rootRoom) && /γ→∞/.test(joints)],
  ['claim ceiling remains visible', /keine neue Physik/.test(joints) && /nicht zu einem relativistischen Raum/.test(rootRoom)],
  ['responsive visual contract exists', /@media\(max-width:860px\)/.test(viewCss) && /@media\(max-width:520px\)/.test(viewCss)]
];

for (const [label, pass] of checks) assert.equal(pass, true, label);

console.log(`PASS A0 Root8/Gamma/Root7 integration · ${checks.length}/${checks.length}`);
