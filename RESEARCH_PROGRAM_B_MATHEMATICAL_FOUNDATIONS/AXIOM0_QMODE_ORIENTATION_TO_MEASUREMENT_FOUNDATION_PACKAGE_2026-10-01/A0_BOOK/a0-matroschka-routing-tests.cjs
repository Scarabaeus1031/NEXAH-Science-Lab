'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = (name) => fs.readFileSync(path.join(__dirname, name), 'utf8');
const relation = require('./a0-machina-relation-chamber.js');
let checks = 0;
const ok = (value, message) => { assert.ok(value, message); checks += 1; };

const entry = read('index.html');
const instrument = read('A0_MATROSCHKA_CLUSTER_BRIDGE.html');
const mathfield = read('A0_MATHEMATICAL_JOINTS.html');
const desk = read('A0_RESEARCH_DESK.html');
const machina = read('A0_MACHINA_COCKPIT.html');
const builder = read('A0_BUILDER_LOG.html');
const worldCube = read('assets/game-of-worlds-play/ioi-world-cube/index.html');
const worldCubeFreeze = read('A0_101_WORLD_CUBE_CURRENTNESS_FREEZE_2026-11-05.md');

ok((entry.match(/id="matroschka-101-entry"/g) || []).length === 1, 'A0/101 has one Matroschka entrance');
ok(entry.includes('ONE → NEST → RETURN') && entry.includes('THE MATROSCHKA'), 'A0/101 states the reader grammar');
ok(entry.includes('assets/game-of-worlds-play/ioi-world-cube/index.html#matroschka101Dock'), 'A0 entrance routes into the 101/World Cube Matroschka window');

ok((worldCube.match(/id="matroschka101Dock"/g) || []).length === 1, '101/World Cube contains one embedded Matroschka dock');
ok(worldCube.includes('src="../../../A0_MATROSCHKA_CLUSTER_BRIDGE.html?embed=a0-101#mcb-3d-source-lens"'), '101/World Cube embeds the canonical source lens');
ok(worldCube.includes('05 · MATROSCHKA') && worldCube.includes('06 · A0 RETURN'), '101 route places Matroschka before the governed A0 Return');
ok(worldCube.includes('101 · ADDRESS') && worldCube.includes('WITNESS · RETURN'), 'embedded dock exposes the typed Matroschka return route');
ok(worldCubeFreeze.includes('Source-bound Matroschka window addendum') && worldCubeFreeze.includes('→ MATROSCHKA / NEST + PROJECT + WITNESS'), '101 currentness record documents the embedded window');

ok((mathfield.match(/id="matroschka-cluster-bridge"/g) || []).length === 1, 'Mathfield retains one scientific home');
ok(mathfield.includes('58/58 PASS') && mathfield.includes('ASSET-E78DF8527C6B'), 'Mathfield carries current verification and source lens');
ok(mathfield.includes('A0_MACHINA_COCKPIT.html?view=matroschka#relationChamber'), 'Mathfield routes to the Machina projection');

ok((desk.match(/id="matroschka-cluster-bridge-20261112"/g) || []).length === 1, 'Science Desk retains one status return');
ok(desk.includes('58/58 PASS') && desk.includes('Δgraph=0'), 'Science Desk preserves status and zero graph delta');

ok(machina.includes('data-mrc-view="matroschka"'), 'Machina exposes a Matroschka projection control');
ok(machina.includes('THE MACHINE · THE MATROSCHKA'), 'Machina names the machine/matroschka reading');
ok(relation.VIEW_ROUTES.matroschka === 'A0_MATROSCHKA_CLUSTER_BRIDGE.html?embed=machina#mcb-3d-source-lens', 'Machina lazy route targets the source lens');
ok(relation.VIEW_STATUS.matroschka.includes('Q-CORE / TRIPLE WHEEL / LADDER / RETURN'), 'Machina status keeps the typed 3D route');

ok(builder.includes('A0/101 Distribution Return') && builder.includes('58 PASS'), 'Builder records the distributed current build');
ok(builder.includes('ASSET-883C1509BCEF') && builder.includes('ASSET-E78DF8527C6B'), 'Builder reuses both existing asset identities');

for (const route of [
  'assets/game-of-worlds-play/ioi-world-cube/index.html#matroschka101Dock',
  'index.html#matroschka-101-entry',
  'A0_MATHEMATICAL_JOINTS.html#matroschka-cluster-bridge',
  'A0_RESEARCH_DESK.html#matroschka-cluster-bridge-20261112',
  'A0_MACHINA_COCKPIT.html?view=matroschka#relationChamber',
  'A0_BUILDER_LOG.html#matroschka-cluster-bridge-builder-20261112'
]) ok(instrument.includes(`href="${route}"`), `instrument returns to ${route}`);

ok(!/newIdentity\s*[:=]\s*true|newRelation\s*[:=]\s*true/.test(entry + mathfield + desk + machina + builder), 'distribution does not promote graph authority');

console.log(`PASS a0-matroschka-routing ${checks}/${checks}`);
