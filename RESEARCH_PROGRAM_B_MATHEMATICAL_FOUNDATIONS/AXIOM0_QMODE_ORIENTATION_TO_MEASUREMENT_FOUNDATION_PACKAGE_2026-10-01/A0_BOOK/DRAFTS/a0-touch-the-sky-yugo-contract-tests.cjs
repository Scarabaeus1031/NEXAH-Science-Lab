'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Contract = require('./a0-touch-the-sky-yugo-contract-v0-1.cjs');
const Yugo = require('../a0-yugo-iota-pivot.js');
const Base11 = require('../assets/game-of-worlds-play/ioi-world-cube/base11-drift-cube-dock.js');

const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'a0-touch-the-sky-yugo-fixture-v0-1.json'), 'utf8'));
const html = fs.readFileSync(path.join(__dirname, 'A0_STARDUST_DOUBLE_CUT_LIVING_FLOW_BRIEFING_2026-11-19.html'), 'utf8');
let checks = 0;
const eq = (actual, expected, message) => { assert.deepEqual(actual, expected, message); checks += 1; };
const ok = (value, message) => { assert.ok(value, message); checks += 1; };

eq(Contract.VERSION, '0.1.0', 'contract version');
eq(Yugo.IDENTITY, fixture.existing_bindings.host_identity, 'existing YUGO host identity reused');
eq(Yugo.inspect(Yugo.createState()).distinction, {iota: 'EVENT_PIVOT', yugo: 'LOCAL_FLOW_DIRECTION', zipper: 'PAIRED_BOUNDARY', seam: 'CENTER_LINE'}, 'existing YUGO distinctions retained');

for (const expected of fixture.middle_square_fixture.expected) {
  const cut = Contract.middleSquareCut(expected.input);
  eq(cut.square, expected.square, `${expected.input} square`);
  eq(cut.left, expected.left, `${expected.input} left hidden`);
  eq(cut.visible, expected.visible, `${expected.input} visible cut`);
  eq(cut.right, expected.right, `${expected.input} right hidden`);
  eq(cut.reconstructs, true, `${expected.input} reconstructs`);
}

const replay = Contract.replay(fixture.middle_square_fixture.seed, fixture.middle_square_fixture.rounds);
eq(replay.records.map(record => record.input), fixture.middle_square_fixture.expected.map(record => record.input), 'replay inputs');
eq(replay.records.map(record => record.visible), fixture.middle_square_fixture.expected.map(record => record.visible), 'replay visible sequence');
eq(replay.records.map(record => record.eventCount), [1, 2, 3, 4], 'PLUS_ONE occurs exactly once per round');
eq(replay.records.map(record => record.orientation), ['B', 'A', 'B', 'A'], 'orientation flips once per round');
eq(Contract.flipOrientation(Contract.flipOrientation('A')), 'A', 'flip orientation is an involution');

let state = Contract.createState({carrier: '4243'});
state = Contract.plusOne(state, 'test-seam');
assert.throws(() => Contract.plusOne(state, 'duplicate-seam'), /requires READY/); checks += 1;
state = Contract.drop(state);
state = Contract.shear(state);
state = Contract.flip(state);
const ledgerBeforeReturn = state.ledger;
const returned = Contract.returnView(state);
eq(returned.ledger, ledgerBeforeReturn, 'RETURN preserves ledger contents');
eq(returned.ledger.length, ledgerBeforeReturn.length, 'RETURN appends no ledger record');
eq(returned.activeView, 'HOME', 'RETURN restores HOME view');
const restarted = Contract.restart(returned);
eq(restarted.carrier, '0030', 'RESTART keeps returned carrier');
eq(restarted.ledger, returned.ledger, 'RESTART preserves ledger');
eq(restarted.phase, 'READY', 'RESTART begins next ready round');

const control4774 = Contract.middleSquareCut('4774');
eq(control4774, {input: '4774', square: '22791076', left: '22', visible: '7910', right: '76', reconstructs: true}, '4774 Middle-Square control');
eq(Base11.toBase(4774, 11), '3650', '4774 separate base-11 address');
eq(Base11.fromBase('365', 11), Base11.fromBase('360', 11) + 5, 'existing base-11 +5 residual');
eq(fixture.controls.word_4774_existing_base11_lens.relation_to_middle_square, 'SEPARATE_OPERATOR_AND_ADDRESS_SYSTEM', '4774 operator namespaces remain separate');

const receiptA = Contract.buildReceipt(Contract.replay('4243', 4));
const receiptB = Contract.buildReceipt(Contract.replay('4243', 4));
eq(receiptA, receiptB, 'deterministic replay receipt');
eq(receiptA.invariants.visiblePlusHiddenReconstructsSquare, true, 'receipt reconstruction invariant');
eq(receiptA.invariants.centerSeamAloneIsZipper, false, 'center seam is not silently promoted to zipper');
eq(receiptA.authority, {researchRun: false, scientificEvidence: false, newCanonicalIdentity: false, newRelation: false, newOperatorIdentity: false, publication: false}, 'authority boundary');

for (const text of [
  'id="touch-the-sky-yugo-contract"',
  'Touch the Sky / YUGO Game Contract v0.1',
  'PLUS_ONE → DROP → SHEAR → FLIP → RETURN → RESTART',
  'a0-touch-the-sky-yugo-fixture-v0-1.json',
  'a0-touch-the-sky-yugo-contract-v0-1.cjs',
  'a0-touch-the-sky-yugo-contract-tests.cjs',
  'Center-Seam ist Ereignislinie, aber nicht allein der Zipper',
  'RETURN ≠ RESET'
]) ok(html.includes(text), `HTML includes ${text}`);

eq(fixture.identity_disposition, {reuse_existing_a0_identity: true, new_navigator_identity: false, new_source_graph_relation: false, new_operator_identity: false, new_study: false, new_finding: false, publication: false}, 'fixture graph and authority effect');

console.log(JSON.stringify({status: 'PASS', checks, scope: 'Touch the Sky / YUGO local seam-shear-flip-return contract; deterministic replay; existing identities; no research activation'}));
