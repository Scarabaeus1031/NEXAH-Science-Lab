'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = file => fs.readFileSync(path.join(__dirname, file), 'utf8');
const science = read('A0_SCIENCE.html');
const desk = read('A0_RESEARCH_DESK.html');
const binder = read('../../../SCIENCE_LAB/NAVIGATION/EVIDENCE/A0_ORIENTATION_EVIDENCE_LINEAGE_2026-10-10/A0_ORIENTATION_EVIDENCE_LINEAGE_BINDER_V1_2026-10-10.json');
let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks += 1; };

check(science.includes('Owner Staging · 24.11.2026'), 'hero currentness is 24.11.2026');
check(science.includes('Currentness Overlay · 24. November 2026'), 'status currentness is 24 November');
check(science.includes('id="same-carrier-different-cuts-20261124"'), 'current synthesis has a stable anchor');
check(science.includes('Same carrier, different cuts.'), 'synthesis title is present');
check(science.includes('<code>661</code> · sieben Ansichten · exakter Return'), 'finite carrier and seven-view return are explicit');
check(science.includes('<code>PC1111:N0661</code>'), 'source address is explicit');
check(science.includes('<code>13 × 11 = 143</code>'), 'view-audit dimensions are explicit');
check(science.includes('<code>R / L / A / U</code>'), 'retained lost added unresolved ledger is explicit');
check(science.includes('Vier Negativkontrollen'), 'four fail-visible controls are explicit');
check(science.includes('EXP-J × Tube comparator'), 'EXP-J and Tube comparator is routed');
check(science.includes('nicht das historische Ursprungsskript'), 'reconstruction boundary is explicit');
check(science.includes('Kein Sonderstatus für Mod 17'), 'Mod-17 negative result is visible');
check(science.includes('Mod 23 den höchsten beobachteten Gain'), 'bounded Mod-23 comparison is visible');
check(science.includes('A0_RETURN_WITHOUT_IDENTITY_PAPER.html'), 'Paper C route exists');
check(science.includes('A0_NEXAH_FAMILY_METHOD_WHITE_PAPER.html'), 'Paper E route exists');
check(science.includes('A0_TESSAREC_FRAME_ENVELOPE_OBSERVER_PAPER.html'), 'Paper F route exists');
check(science.includes('FIVE RELATION CANDIDATES / TWO AGENT CLASSES'), 'relation and agent boundaries are explicit');
check(science.includes('Δgraph=0 / STUDY 0 / CANONICAL FINDING 0'), 'authority boundary prevents promotion');
check(science.includes('Relational identifiability under representation change'), 'durable contribution is present');
check(desk.includes('id="primecube-nexah-core-agent-rebinding-20261124"'), 'Science Desk return anchor exists');
check(binder.includes('"a0_science_same_carrier_different_cuts_20261124"'), 'Navigator binder records the editorial synthesis');
check(binder.includes('"relations": 0') && binder.includes('"claim_promotions": 0'), 'binder preserves zero semantic graph and claim delta');

console.log(`PASS · ${checks} checks · A0 Science same-carrier return is source-bound and non-promotional.`);
