'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const api = require('./a0-architecture-observation-sail.js');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'A0_ARCHITECTURE_OF_DIFFERENCE.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'a0-architecture-observation-sail.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'a0-architecture-observation-sail.js'), 'utf8');

assert.deepEqual(api.chamberStages.map(stage => stage.id), ['cut', 'pink', 'echo', 'shadow', 'return']);

const initial = api.chamberContract();
assert.equal(initial.quarter, 1);
assert.equal(initial.visibleFraction, 0.25);
assert.equal(initial.shadowFraction, 0.75);
assert.equal(initial.pinkResidual, 0.62);
assert.equal(initial.echoResidualMs, 480);
assert.equal(initial.complete, false);
assert.equal(initial.audioModel, false);
assert.equal(initial.physicalFieldClaim, false);

const returned = api.chamberContract({quarter: 4, pink: 0, lag: 0});
assert.equal(returned.positionReturn, true);
assert.equal(returned.colorReturn, true);
assert.equal(returned.echoReturn, true);
assert.equal(returned.shadowReturn, true);
assert.equal(returned.complete, true);

const clamped = api.chamberContract({quarter: 8, pink: -5, lag: 2000});
assert.equal(clamped.quarter, 4);
assert.equal(clamped.pinkResidual, 0);
assert.equal(clamped.echoResidualMs, 1200);

for (const token of [
  'id="observation-echo-shadow"', 'OD–FSP–02', '01 · CUT', '02 · PINK SHIFT',
  '03 · ECHO', '04 · SHADOW', '05 · RETURN', 'data-pink-shift', 'data-echo-lag',
  'CYAN → GREY → LIGHT → MAGENTA', 'kein Ton erzeugt', 'data-quarter="4"'
]) assert.ok(html.includes(token), `missing HTML token: ${token}`);

for (const token of ['.echo-shadow', '.echo-ring', '[data-chamber-stage=echo]', '[data-quarter="4"]'])
  assert.ok(css.includes(token), `missing CSS token: ${token}`);

for (const token of ['function chamberContract', 'function mountChamber', "document.querySelectorAll('[data-echo-shadow]')"])
  assert.ok(js.includes(token), `missing JS token: ${token}`);

console.log('A0 Echo / Shadow Chamber: finite-state + residual-return + integration checks PASS');
