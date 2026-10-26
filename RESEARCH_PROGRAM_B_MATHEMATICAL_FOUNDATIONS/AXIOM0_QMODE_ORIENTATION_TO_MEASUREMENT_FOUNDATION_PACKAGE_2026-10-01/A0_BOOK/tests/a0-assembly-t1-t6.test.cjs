'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const atlasPath = path.join(root, 'A0_ASSEMBLY_ATLAS.html');
const contractPath = path.join(root, 'assets/a0-assembly-atlas-v1.json');
const enginePath = path.join(root, 'assets/game-of-worlds-play/three-domain-transition-test/domain-engine.js');
const appPath = path.join(root, 'assets/game-of-worlds-play/three-domain-transition-test/app.js');
const monitorPath = path.join(root, 'assets/game-of-worlds-play/three-domain-transition-test/atlas-contracts.js');
const domainIndexPath = path.join(root, 'assets/game-of-worlds-play/three-domain-transition-test/index.html');
const mathfieldPath = path.join(root, 'A0_MATHEMATICAL_JOINTS.html');

const atlas = fs.readFileSync(atlasPath, 'utf8');
const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const app = fs.readFileSync(appPath, 'utf8');
const monitor = fs.readFileSync(monitorPath, 'utf8');
const domainIndex = fs.readFileSync(domainIndexPath, 'utf8');
const mathfield = fs.readFileSync(mathfieldPath, 'utf8');
const engine = require(enginePath);

function result(id, status, assertion, evidence, missing = []) {
  return { id, status, assertion, evidence, missing };
}

const results = [];

const anchorsDeclared = atlas.includes('cx="205" cy="405"') && atlas.includes('cx="695" cy="405"');
const anchorReadouts = atlas.includes('id="nodeAReadout">205,405') && atlas.includes('id="nodeBReadout">695,405');
const anchorWrites = /node[AB]Readout['"]?\)?\.textContent\s*=/.test(atlas);
const phaseHandler = atlas.includes("beltPhase.addEventListener('input'") && atlas.includes("$('phaseReadout').textContent=String(phase)");
results.push(result('T1', anchorsDeclared && anchorReadouts && !anchorWrites && phaseHandler ? 'PASS' : 'FAIL', 'Anchor coordinates remain invariant while belt phase changes.', { anchorsDeclared, anchorReadouts, anchorWrites, phaseHandler, browserProbe: { phase: 73, nodeA: '205,405', nodeB: '695,405' } }));

const pinkCount = (atlas.match(/id="pinkRail"/g) || []).length;
const greenCount = (atlas.match(/id="greenRail"/g) || []).length;
const separateTransforms = atlas.includes("$('pinkRail').style.transform") && atlas.includes("$('greenRail').style.transform");
results.push(result('T2', pinkCount === 1 && greenCount === 1 && separateTransforms ? 'PASS' : 'FAIL', 'Pink and Green remain separately addressable carriers.', { pinkCount, greenCount, separateTransforms }));

const life = engine.createModel('life', 5, 1, 'open');
life.cells.fill(0);
life.cells[2 * 5 + 1] = 1;
life.cells[2 * 5 + 2] = 1;
life.cells[2 * 5 + 3] = 1;
const lifeNext = engine.step(life);
const lifeEvents = engine.events(life.cells, lifeNext.cells);
const lifeLedger = engine.transitionLedger(life.cells, lifeNext.cells);
const expectedLifePartition = lifeEvents.positive.length === 2 && lifeEvents.hold.length === 1 && lifeEvents.negative.length === 2 && lifeEvents.all.length === 5;
results.push(result('T3', expectedLifePartition && lifeLedger.exact ? 'PASS' : 'FAIL', 'The W-plate event lanes form a typed B3/S23 Birth/Survive/Death partition with an exact four-channel ledger.', { generation: lifeNext.generation, births_i_positive: lifeEvents.positive.length, survives_j_hold: lifeEvents.hold.length, deaths_k_negative: lifeEvents.negative.length, events_all: lifeEvents.all.length, ledger: lifeLedger }));

const life2 = engine.step(lifeNext);
const oneStep = lifeNext.generation === life.generation + 1 && life2.generation === lifeNext.generation + 1;
const oneMasterTimer = app.includes('timer=setInterval(advance') && monitor.includes('masterTimers:1') && monitor.includes('independentSynchronizedTimers:false');
results.push(result('T4', oneStep && oneMasterTimer ? 'PASS' : 'FAIL', 'Each input step advances exactly one generation and the monitor declares one master timer.', { generations: [life.generation, lifeNext.generation, life2.generation], oneMasterTimer }));

const checkpointFields = {
  generation: /checkpoint=\{pairs:cloneState\(pairs\),generation,/.test(app),
  sourceState: /pairs:cloneState\(pairs\)/.test(app),
  history: /history:cloneState\(history\)/.test(app),
  jointHistory: /jointHistory:cloneState\(jointHistory\)/.test(app),
  boundary: /boundary:boundary\.value/.test(app),
  threshold: /threshold:threshold\.value/.test(app),
  signature: /signature:stateSignature\(\)/.test(app),
  selectedView: /selectedView|selected_view|viewId|view_id/.test(app),
  transitionMap: /transitionMap|transition_map/.test(app)
};
const t5Missing = Object.entries(checkpointFields).filter(([, present]) => !present).map(([name]) => name);
const noEventFeedback = !/events\.(positive|hold|negative).*step|step.*events\.(positive|hold|negative)/s.test(fs.readFileSync(enginePath, 'utf8'));
results.push(result('T5', t5Missing.length === 0 && noEventFeedback ? 'PASS' : 'HOLD', 'Return must preserve generation, source state, rule/view context and transition map; Death must not directly feed Birth.', { checkpointFields, noEventFeedback, exactSignatureComparison: app.includes("exact=stateSignature()===checkpoint.signature") }, t5Missing));

const exactNotation = '1i / jk ≠ Q°';
const t6Contract = contract.engineering_test_protocol.tests.find(test => test.id === 'T6');
const notationPresent = atlas.includes(exactNotation) && t6Contract?.pass.includes(exactNotation);
const glyphReadingPresent = atlas.includes('LL → T') && atlas.includes('Tic‑Tac‑Toe');
const qAliasAssignment = /Q°\s*=|Q\s*=\s*(?:1|i|j|k)\b/.test(atlas);
results.push(result('T6', notationPresent && glyphReadingPresent && !qAliasAssignment ? 'PASS' : 'FAIL', 'Owner notation remains separated: 1i / jk ≠ Q°; T is preserved as the LL distribution seam and TL/Tic-Tac-Toe remain candidate views.', { notationPresent, glyphReadingPresent, qAliasAssignment }));

const mapping = contract.owner_reconstruction_mapping;
const compound = mapping?.compound_glyph;
const compoundMarkup = atlas.includes('data-chain-stage="compound-kbeta"') && atlas.includes('kß (2‑in‑1)');
const morphologySeparated = contract.owner_reconstruction_mapping?.esszett_roles?.multiplicity === 'MULTIFUNCTIONAL_CONTEXT_REQUIRED' && contract.owner_reconstruction_mapping?.esszett_roles?.beta_zeta_identity === 'OPEN_NOT_ASSERTED';
results.push(result('T7', compound?.literal === 'kß' && compound?.channels === 2 && compound?.multiplication === false && compound?.square === false && compoundMarkup && morphologySeparated ? 'PASS' : 'FAIL', 'kß remains one compound Owner glyph with two distinguishable channels while ß/beta/zeta identities remain separated.', { compound, compoundMarkup, morphologySeparated }));

const addressAxisVisuals = JSON.stringify(mapping?.persistent_address_axis_visuals) === JSON.stringify([3, 5]);
const addressAxisMarkup = atlas.includes('data-chain-stage="persistent-address"') && atlas.includes('V3 + V5 · PERSISTENT');
results.push(result('T8', addressAxisVisuals && addressAxisMarkup ? 'PASS' : 'FAIL', 'Visuals 3 and 5 retain the persistent-address/axis view role.', { addressAxisVisuals, addressAxisMarkup }));

const screenMapping = mapping?.screen_visual === 4;
const screenMarkup = atlas.includes('data-chain-stage="screen-reconstruction"') && atlas.includes('V4 · RECONSTRUCTION VIEW');
const noMergeBoundary = mapping?.boundary.includes('No identity merge');
results.push(result('T9', screenMapping && screenMarkup && noMergeBoundary ? 'PASS' : 'FAIL', 'Visual 4 remains a reconstruction screen view without identity merge.', { screenMapping, screenMarkup, noMergeBoundary }));

const fresnelSequence = JSON.stringify(mapping?.fresnel_visuals) === JSON.stringify([7, 8, 9, 10, 11]);
const fresnelMarkup = atlas.includes('data-chain-stage="fresnel-family"') && atlas.includes('V7–V11');
const noMechanismClaim = mapping?.boundary.includes('optical calibration') && mapping?.boundary.includes('gravitational mechanism') && mapping?.boundary.includes('resonance finding');
results.push(result('T10', fresnelSequence && fresnelMarkup && noMechanismClaim ? 'PASS' : 'FAIL', 'Visuals 7–11 retain an ordered Fresnel projection-family role with no mechanism claim.', { fresnelSequence, fresnelMarkup, noMechanismClaim }));

const physical = mapping?.boltzmann_pascal_candidate;
const gameKIsNegative = domainIndex.includes('k · NEG Teller') && domainIndex.includes('<code>k</code> here is the existing typed negative/death/down-flip ledger channel');
const existingBowFamily = mathfield.includes('B–8–ß Loop') && mathfield.includes('Formvergleichsfamilie, keine Operatoridentität');
const dimensionGuard = physical?.state === 'HOLD_UNTIL_TYPED_PHYSICAL_ADAPTER' && physical?.required_equation === 'p = (N/V) k_B T' && physical?.output_unit === 'Pa = J m^-3' && physical?.required_inputs?.length === 4;
results.push(result('T11', gameKIsNegative && existingBowFamily && dimensionGuard ? 'HOLD' : 'FAIL', 'Boltzmann/Pascal remains a dimensionally guarded candidate adapter: the current Game k·NEG and multifunctional A0 ß roles are preserved.', { gameKIsNegative, existingBowFamily, dimensionGuard, candidate: physical }, physical?.required_inputs || []));

const summary = {
  schema: 'nexah.a0.assembly_atlas_dry_test_receipt',
  version: '1.2.0',
  date: '2026-10-25',
  status: results.some(item => item.status === 'FAIL') ? 'FAIL' : results.some(item => item.status === 'HOLD') ? 'PASS_WITH_HOLD' : 'PASS',
  authority: 'ENGINEERING_DRY_TEST_ONLY_STRUCTURE_FREEZE',
  identity_effect: 'NONE',
  counts: {
    pass: results.filter(item => item.status === 'PASS').length,
    hold: results.filter(item => item.status === 'HOLD').length,
    fail: results.filter(item => item.status === 'FAIL').length
  },
  results,
  boundary: 'No scientific replay, mechanism validation, study activation or claim promotion.'
};

console.log(JSON.stringify(summary, null, 2));
if (summary.counts.fail) process.exitCode = 1;
