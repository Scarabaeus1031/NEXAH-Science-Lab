'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const dock = require('./a0-typed-boundary-hinge-dock.js');

assert.equal(280 / 5, 56);
assert.equal(56, 7 * 8);
assert.equal(dock.OCTAVE_GAPS.reduce((sum, value) => sum + value, 0), 24);
assert.equal(dock.DANCE.length, 8);

for (let phase = 0; phase < 280; phase += 1) {
  const state = dock.decodePhase(phase);
  assert.equal(dock.encodePhase(state.macro, state.fiber), phase);
  assert.equal(dock.flip(dock.flip(phase)), phase);
  assert.equal(state.macro, state.station + 7 * state.hinge + 28 * state.side);
}

let phase = 0;
const fullOrbit = new Set();
for (let i = 0; i < 280; i += 1) { fullOrbit.add(phase); phase = dock.rotate(phase, 107); }
assert.equal(fullOrbit.size, 280);
assert.equal(phase, 0);

let macro = 0;
const macroOrbit = new Set();
for (let i = 0; i < 56; i += 1) { macroOrbit.add(macro); macro = dock.mod(macro + 51, 56); }
assert.equal(macroOrbit.size, 56);
assert.deepEqual(dock.decodePhase(107), { phase: 107, macro: 51, fiber: 1, station: 2, hinge: 3, side: 1, orientation: 7, label: '7S' });

const pinkHtml = fs.readFileSync(path.join(__dirname, 'A0_PINK_DIAMOND_GRID_ATLAS.html'), 'utf8');
const draftHtml = fs.readFileSync(path.join(__dirname, 'DRAFTS', 'A0_TYPED_MIRROR_ROTATION_COMPASS_DRAFT_2026-11-07.html'), 'utf8');
for (const witness of ['id="crt16SpatialReturn"', 'A0_ASSEMBLY_ATLAS.html#motion-test', 'A0_IOTA_BRIDGE_DEMONSTRATOR.html#iotaTumbleTLens', 'assets/game-of-worlds-play/ioi-world-cube/index.html#a0AngleHingeDock', 'A0_METHOD.html#floor-zero-method', 'A0_OPIUM.html#opiumF0Seam', 'A0_FAMILY_CONNECTION_ATLAS.html#tessarecWitnessRoute', 'NEXAH_BLOCK01_CUBE_LAB.html', 'A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html#grid-lift-visual']) assert.ok(pinkHtml.includes(witness), `Pink spatial return missing ${witness}`);
for (const witness of ['id="spatial-return-route"', '#crt16SpatialReturn', '#a0AngleHingeDock', '#tessarecWitnessRoute', 'NEXAH_BLOCK01_CUBE_LAB.html']) assert.ok(draftHtml.includes(witness), `Draft return missing ${witness}`);
console.log('PASS · typed boundary hinge dock · 280 phases · 56-state quotient · 5T fiber · spatial return wired');
