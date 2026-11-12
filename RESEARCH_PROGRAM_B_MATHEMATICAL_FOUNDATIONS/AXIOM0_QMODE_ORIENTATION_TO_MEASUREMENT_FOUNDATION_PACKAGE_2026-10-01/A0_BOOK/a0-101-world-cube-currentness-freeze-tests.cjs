#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const here = __dirname;
const pkg = path.dirname(here);
const read = file => fs.readFileSync(file, 'utf8');
const cube = read(path.join(here, 'assets/game-of-worlds-play/ioi-world-cube/index.html'));
const freeze = read(path.join(here, 'A0_101_WORLD_CUBE_CURRENTNESS_FREEZE_2026-11-05.md'));
const science = read(path.join(here, 'A0_RESEARCH_DESK.html'));
const builder = read(path.join(here, 'A0_BUILDER_LOG.html'));
const findings = read(path.join(pkg, '32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md'));
const protocol = read(path.join(pkg, '22_A0_FORSCHUNGSPROTOKOLL_BUCH_UND_RAHMEN_2026-10-10.md'));
const backlog = read(path.join(pkg, '24_A0_RESEARCH_BACKLOG_AND_OPEN_JOINTS_2026-10-10.md'));
const state = JSON.parse(read(path.join(here, 'A0_CURRENT_STATE.json')));
const receipt = JSON.parse(read(path.join(here, 'results/a0-101-world-cube-currentness-freeze-2026-11-05.json')));
let checks = 0;
const ok = (condition, message) => { checks += 1; if (!condition) throw new Error(`FAIL ${checks}: ${message}`); };

ok(cube.includes('id="a0ContextLoop"'), 'Cube exposes the 101/A0 context route');
ok(['SOURCE / LEAF', 'APERTURE / VIEW', 'CARRIER / MAP', 'ORIENT / CONTINUE', 'NEST / PROJECT / WITNESS', 'RECEIPT / GOVERN'].every(token => cube.includes(token)), 'Context route contains all six typed stations including the Matroschka window');
ok(cube.includes('id="matroschka101Dock"') && cube.includes('A0_MATROSCHKA_CLUSTER_BRIDGE.html?embed=a0-101#mcb-3d-source-lens'), 'World Cube embeds the canonical Matroschka source lens');
ok((cube.match(/\{title:'/g) || []).length === 12, 'Extended demo contains exactly twelve tour steps');
ok(['HEPTAD 14 · ORIENTATION', 'ALGO · EIGHT FLOORS', 'CPMR · SPIRAL OVER CUBE', 'PASCAL · FILL / RELEASE / J-TURN', 'KEYSTONE 9 · A0 RETURN'].every(token => cube.includes(token)), 'Tour binds all successor modules and the governed return');
ok(cube.includes('String-/M-Theory') && cube.includes('keine physikalische Dualität, Resonanz oder gemeinsame Theorie'), 'Player carries the explicit physics nonclaim');
ok(['heptad14Orientation', 'algoEightFloorRegister', 'cpmrSpiralCube', 'pascalGenerationTurn'].every(id => cube.includes(`focusModule('${id}')`)), 'Tour targets all four dynamically mounted bounded successor modules');
ok(cube.includes('body.tour-active:not(.progression-embed) .cube-tour .tour-readout{position:fixed'), 'Active tour keeps its controller visible while successor modules receive focus');
ok(cube.includes("tourPrev.disabled=tourIndex===0") && cube.includes("tourNext.disabled=tourIndex===tourSteps.length-1"), 'Tour exposes explicit first and final step boundaries');
ok(cube.includes("tourNext.disabled?'TOUR ENDE ✓':'WEITER →'"), 'Final step reports completion instead of appearing to ignore another next click');
ok(cube.includes("catch(error){console.error('A0 tour step failed'"), 'A failed view action cannot strand the tour controller');
ok(freeze.includes('This is a successor currentness freeze') && freeze.includes('Count delta: `new IDs 0 / relations 0 / aliases 0`'), 'Freeze preserves prior returns and declares zero graph delta');
ok(science.includes('id="a0-101-world-cube-currentness-freeze-20261105"'), 'Science Desk receives the classified freeze');
ok(builder.includes('id="a0-101-world-cube-currentness-freeze-builder-20261105"'), 'Builder Log receives the implementation freeze');
ok(findings.includes('## A0 101 / World Cube currentness freeze — 2026-11-05'), 'Findings workspace receives a non-promotion record');
ok(protocol.includes('## A0 101 / World Cube currentness return — 2026-11-05'), 'Research protocol receives the return');
ok(backlog.includes('## A0 101 / World Cube post-freeze open gates — 2026-11-05'), 'Backlog holds the four inactive reopen gates');
ok(state.summary.currentness_freeze === 'A0_101_WORLD_CUBE_CURRENTNESS_FREEZE_2026-11-05', 'Current-state lens names the freeze');
ok(state.summary.new_finding_promotions === 0 && state.summary.active_research_cycles === 0 && state.summary.active_builds === 0, 'Current-state lens preserves zero activation and promotion');
ok(receipt.status === 'PASS_LOCAL_SOURCE_BOUND_CURRENTNESS_FREEZE', 'Machine receipt closes the local freeze');
ok(receipt.navigator_delta.new_ids === 0 && receipt.navigator_delta.relations === 0 && receipt.navigator_delta.aliases === 0, 'Machine receipt records zero Navigator delta');
ok(receipt.claim_effect.study === 0 && receipt.claim_effect.finding_promotion === 0 && receipt.claim_effect.physical_claim === 0 && receipt.claim_effect.publication === 0, 'Machine receipt preserves the scientific and publication ceiling');
ok(receipt.external_effect.commit === false && receipt.external_effect.push === false && receipt.external_effect.deployment === false && receipt.external_effect.outreach === false, 'Machine receipt records no external side effect');

console.log(JSON.stringify({
  status: 'PASS',
  checks,
  route: ['101_SOURCE', 'Q_CUT', 'WORLD_CUBE', 'J_GENERATION', 'MATROSCHKA_WITNESS', 'A0_RECEIPT'],
  tour_steps: 12,
  navigator_delta: '0/0/0'
}));
