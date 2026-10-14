const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const model = require(path.join(root, 'assets/a0-newton-goethe-observer-lens-v1.js'));
const record = JSON.parse(fs.readFileSync(path.join(root, 'assets/a0-newton-goethe-observer-lens-v1.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'A0_NEWTON_GOETHE_OBSERVER_LENS.html'), 'utf8');

const state = model.relation(42, 0.18);
const sample = model.sample(0.2, -0.15, 42, 0.18);
const relationWindow = record.windows.find(window => window.id === 'relation');

assert.equal(state.bandCount, 7);
assert.equal(state.angle, 42);
assert.ok(Number.isFinite(state.moireFrequency));
assert.ok(Number.isFinite(sample.residual));
assert.equal(record.view_id, 'A0-VIEW-NEWTON-GOETHE-OBSERVER-LENS');
assert.equal(record.new_navigator_identity, false);
assert.equal(record.new_graph_relation, false);
assert.equal(relationWindow.lens, 'leibniz_relational_order');
assert.deepEqual(relationWindow.notation, ['A≠B', 'I≠O']);
assert.match(relationWindow.attribution_boundary, /not_historical_formula/);
assert.match(html, /LEIBNIZ · relation/);
assert.match(html, /A ≠ B · I ≠ O/);
assert.match(html, /kein Leibniz-Zitat/);
assert.match(html, /NEWTON \/ LEIBNIZ \/ GOETHE OBSERVER LENS/);

console.log(JSON.stringify({
  status: 'PASS',
  assertions: 14,
  viewId: record.view_id,
  middleLens: relationWindow.lens,
  notation: relationWindow.notation,
  boundary: 'interpretive relational lens; not a historical Leibniz formula and no new graph relation'
}, null, 2));
