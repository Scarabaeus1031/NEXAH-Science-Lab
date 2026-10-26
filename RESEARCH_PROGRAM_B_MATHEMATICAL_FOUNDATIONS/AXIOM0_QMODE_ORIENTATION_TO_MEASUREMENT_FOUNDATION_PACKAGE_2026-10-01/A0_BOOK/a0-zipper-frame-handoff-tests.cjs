'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const model = require('./assets/a0-zipper-frame-handoff-v1.js');

let checks = 0;
function check(condition, message) { assert.ok(condition, message); checks += 1; }

check(model.STATE_COUNT === 2640, '2 × 3 × 5 × 88 must equal 2640');
check(model.RAYS.length === 5, 'exactly five Iota rays');
check(model.RED_SHADOW.countedRay === false, 'red shadow is not a sixth ray');
check(model.RED_SHADOW.angle === 45, 'red shadow remains +45°');
check(model.snapshot({}).greenWheel.role === 'DISPLAY_SLOT_LOCK', 'green wheel uses declared display lock');
check(model.snapshot({ position: 87 }).greenWheel.position === 87, 'green wheel follows the regulator slot');
check(model.snapshot({}).greenWheel.ratioClaim === null, 'no undeclared transmission ratio');
check(model.VIEW_MODES.join('|') === 'TOGETHER|TOWER|BRIDGE', 'three display modes are declared');
check(model.ASSEMBLY.tower.rails === 2, 'tower has two display rails');
check(model.ASSEMBLY.tower.plates === 11, 'tower has eleven display plates');
check(model.ASSEMBLY.bridge.segments === 2 && model.ASSEMBLY.bridge.shape === 'CHEVRON', 'bridge has two visible chevron segments');
check(model.ASSEMBLY.algorithmLines.count === 2 && model.ASSEMBLY.algorithmLines.crossing === true, 'two crossed algorithm guides');
check(model.ASSEMBLY.iotaFrame.corners === 4, 'Iota frame has four display anchors');
check(model.ASSEMBLY.lanternOverlay.apertureGlyph === 'EPSILON_LEAF', 'epsilon leaf is a display glyph');
check(model.ASSEMBLY.lanternOverlay.pearlSpokes === 8, 'pearl has eight display supports');
check(model.ASSEMBLY.lanternOverlay.emeraldSupports === 4, 'emerald frame has four supports');
check(model.ASSEMBLY.lanternOverlay.exitMarker === 74, 'hourglass exit marker is 74');
check(model.ASSEMBLY.lanternOverlay.phantomTine === 'VIOLET_DOWNWARD_GUIDE', 'violet phantom tine is a display guide');
check(model.ASSEMBLY.lanternOverlay.teslaCoilRole === 'VIEW_MNEMONIC_ONLY', 'Tesla coil is not a physics claim');
check(model.ASSEMBLY.lanternOverlay.yugoBinding === 'UNBOUND_OWNER_MNEMONIC', 'phantom tine is not bound to D1-D2 YUGO identity');
check(model.snapshot({ viewMode: 'TOWER' }).stateIndex === model.snapshot({ viewMode: 'BRIDGE' }).stateIndex, 'display mode does not change carrier state');
check(model.snapshot({}).changesCarrierState === false, 'assembly view is read-only');
check(model.PHASES.join('>') === 'BLUE_FOLD_DOWN>PIVOT_SPARK>BLUE_FOLD_UP>PINK_STRIP_GATE>ZIPPER_CAPTURE>PINK_DIAMOND_LENS>ORANGE_HOLD>YELLOW_FRAME>ORANGE_RETURN', 'phase order');

const seen = new Set();
for (let index = 0; index < model.STATE_COUNT; index += 1) {
  const state = model.stateAt(index);
  check(state.stateIndex === index, `round trip ${index}`);
  check(state.stateNumber === index + 1, `human index ${index}`);
  check(model.indexOf(state) === index, `index ${index}`);
  check(state.addresses.parent === '1.111.111.111', `parent ${index}`);
  check(state.addresses.hinge === 'PINK_K90_DIAMOND', `hinge ${index}`);
  check(state.addresses.localReturn === '1:8878/A0', `local return ${index}`);
  check(model.verify(state).pass, `verification ${index}`);
  seen.add(state.stateIndex);
}
check(seen.size === 2640, 'all states unique');
const audit = model.auditAll();
check(audit.pass && audit.checked === 2640 && audit.unique === 2640, 'full finite audit');

assert.throws(() => model.snapshot({ rayIndex: 5 }), /rayIndex/); checks += 1;
assert.throws(() => model.snapshot({ position: 88 }), /position/); checks += 1;
assert.throws(() => model.stateAt(2640), /state index/); checks += 1;
assert.throws(() => model.snapshot({ viewMode: 'ELEVATOR' }), /viewMode/); checks += 1;

const html = fs.readFileSync(path.join(__dirname, 'A0_BLUE_PINK_DODECA_CELL_RETURN.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, 'a0-zipper-frame-handoff.css'), 'utf8');
for (const token of ['zipper-frame-handoff', 'zfhOrientation', 'zfhFormat', 'zfhRay', 'zfhPosition', 'RED_SHADOW', 'a0-zipper-frame-handoff-v1.js', 'data-zfh-view="TOWER"', 'data-zfh-view="BRIDGE"', '2 PINK RAILS · 11 PLATES', 'zfh-frame-corner c4', 'TESLA COIL · VIEW MNEMONIC ONLY', 'GREEN EMERALD · 4 CORNER SUPPORTS', 'EXIT 74 · PHANTOM TINE · YUGO? UNBOUND']) {
  check(html.includes(token), `HTML token ${token}`);
}
check(css.includes('.zfh-red-shadow'), 'separate red shadow style');
check(css.includes('.zfh-plates i'), 'eleven-plate stack style');
check(css.includes('.zfh-bridge-line'), 'visible bridge style');
check(css.includes('.zfh-pearl-spokes'), 'radial pearl support style');
check(css.includes('.zfh-emerald'), 'green emerald style');
check(css.includes('.zfh-phantom-tine'), 'violet phantom tine style');
const plateMarkup = html.match(/<div class="zfh-teeth zfh-plates"[^>]*>(.*?)<\/div>/s);
check(Boolean(plateMarkup) && (plateMarkup[1].match(/<i><\/i>/g) || []).length === 11, 'exactly eleven plate elements');
const spokeMarkup = html.match(/<div class="zfh-pearl-spokes"[^>]*>(.*?)<\/div>/s);
check(Boolean(spokeMarkup) && (spokeMarkup[1].match(/<i><\/i>/g) || []).length === 8, 'exactly eight pearl support elements');
console.log(`PASS · ${checks} checks · ${model.STATE_COUNT} unique Zipper–Frame states`);
