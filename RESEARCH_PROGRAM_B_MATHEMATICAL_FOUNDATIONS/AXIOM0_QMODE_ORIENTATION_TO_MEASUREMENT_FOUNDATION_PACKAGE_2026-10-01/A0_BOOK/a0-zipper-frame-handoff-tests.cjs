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

const html = fs.readFileSync(path.join(__dirname, 'A0_BLUE_PINK_DODECA_CELL_RETURN.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, 'a0-zipper-frame-handoff.css'), 'utf8');
for (const token of ['zipper-frame-handoff', 'zfhOrientation', 'zfhFormat', 'zfhRay', 'zfhPosition', 'RED_SHADOW', 'a0-zipper-frame-handoff-v1.js']) {
  check(html.includes(token), `HTML token ${token}`);
}
check(css.includes('.zfh-red-shadow'), 'separate red shadow style');
console.log(`PASS · ${checks} checks · ${model.STATE_COUNT} unique Zipper–Frame states`);
