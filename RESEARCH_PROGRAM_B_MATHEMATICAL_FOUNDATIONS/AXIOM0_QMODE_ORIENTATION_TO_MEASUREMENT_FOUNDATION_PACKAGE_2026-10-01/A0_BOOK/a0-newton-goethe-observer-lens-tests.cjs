const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const model = require(path.join(root, 'assets/a0-newton-goethe-observer-lens-v1.js'));
const record = JSON.parse(fs.readFileSync(path.join(root, 'assets/a0-newton-goethe-observer-lens-v1.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'A0_NEWTON_GOETHE_OBSERVER_LENS.html'), 'utf8');

const state = model.relation(7, 0.18, 42, 'p5');
const left = model.relation(7, 0.18, -42, 'p5');
const doubled = model.relation(14, 0.18, 42, 'h6x2');
const sample = model.sample(0.2, -0.15, 7, 0.18, 42, 'p5');
const relationWindow = record.windows.find(window => window.id === 'relation');
const goetheWindow = record.windows.find(window => window.id === 'goethe');

assert.equal(state.bandCount, 7);
assert.equal(state.angle, 7);
assert.equal(state.edgeAngle, 7);
assert.equal(state.observerAngle, 42);
assert.equal(state.observerSide, 'right');
assert.equal(left.observerAngle, -42);
assert.equal(left.observerSide, 'left');
assert.ok(left.observerOffset < 0);
assert.ok(state.observerOffset > 0);
assert.equal(state.referenceWavelengthNm, 530);
assert.deepEqual(state.typedCoordinate, {wavelengthNm: 530, edgeAngleDegrees: 7, observerAngleDegrees: 42});
assert.deepEqual(model.EDGE_PRESETS, [5, 7, 14]);
assert.equal(state.overlay.sectors, 5);
assert.equal(doubled.edgeAngle, state.edgeAngle * 2);
assert.equal(doubled.overlay.families, 2);
assert.equal(doubled.overlay.sectors, 6);
assert.equal(doubled.overlay.offsetDegrees, 30);
assert.equal(state.observerFrame.id, 'Q_DEGREE_4_PLUS_1');
assert.equal(state.observerFrame.totalPoints, 5);
assert.equal(state.observerFrame.peripheralPoints, 4);
assert.equal(state.observerFrame.axisStepDegrees, 90);
assert.equal(state.observerFrame.coneHalfAngleDegrees, 22.5);
assert.deepEqual(state.observerFrame.labels, ['π VIEW', 'φ APERTURE', '√2 DRIFT', '√7 DRAFT']);
assert.ok(Number.isFinite(state.moireFrequency));
assert.ok(Number.isFinite(sample.residual));
assert.equal(record.view_id, 'A0-VIEW-NEWTON-GOETHE-OBSERVER-LENS');
assert.equal(record.new_navigator_identity, false);
assert.equal(record.new_graph_relation, false);
assert.equal(record.shared_visual_field_state.controller, 'goethe_boundary_polarity');
assert.deepEqual(record.shared_visual_field_state.states, ['cool_light_to_dark', 'warm_dark_to_light']);
assert.equal(record.shared_visual_field_state.newton_and_measurement_foundations_remain_neutral, true);
assert.equal(record.shared_visual_field_state.shared_physics_operator, false);
assert.equal(record.parameters.reference_wavelength_nm, 530);
assert.deepEqual(record.parameters.observer_angle_beta_degrees, [-90, 90]);
assert.equal(goetheWindow.observer_frame, 'Q_DEGREE_4_PLUS_1');
assert.equal(relationWindow.lens, 'leibniz_relational_order');
assert.deepEqual(relationWindow.notation, ['A≠B', 'I≠O']);
assert.match(relationWindow.attribution_boundary, /not_historical_formula/);
assert.match(html, /LEIBNIZ · relation/);
assert.match(html, /A ≠ B · I ≠ O/);
assert.match(html, /kein Leibniz-Zitat/);
assert.match(html, /Pyramidenkante α/);
assert.match(html, /Observer β/);
assert.match(html, /530 nm, 7°, \+42°/);
assert.match(html, /P5 = 5×72°/);
assert.match(html, /H6×2 = 2×6 \/ 30°/);
assert.match(html, /Q° observer frame/);
assert.match(html, /4×90°/);
assert.match(html, /pink-strip window/);
assert.match(html, /observerSideButton/);
assert.match(html, /min="-90" max="90"/);
assert.match(html, /π\/φ\/√2\/√7/);
assert.match(html, /not nm\+degree arithmetic/);
assert.match(html, /a0:goethe-boundary-change/);
assert.match(html, /shared_visual_field_state_not_physics_operator/);
assert.match(html, /NEWTON \/ LEIBNIZ \/ GOETHE OBSERVER LENS/);

console.log(JSON.stringify({
  status: 'PASS',
  assertions: 56,
  viewId: record.view_id,
  middleLens: relationWindow.lens,
  notation: relationWindow.notation,
  boundary: 'typed wavelength/angle coordinate; Goethe-controlled cool/warm visual field shared with Leibniz and Iota stage; no shared physics operator; signed left/right Q-degree 4+1 observer cone; finite overlays; not calibrated optics or a new graph relation'
}, null, 2));
