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
assert.match(html, /PROLOGUE 00 · THREE WINDOWS · ONE OBSERVER/);
assert.match(html, /Keine neue Lichttheorie, sondern eine neu gefügte Vergleichsanordnung/);
assert.match(html, /Drei Lesarten\. Ein gemeinsamer Beobachtungsrahmen\./);
assert.match(html, /Bis hierher lesen wir Licht\./);
assert.match(html, /Ab hier messen wir seinen Weg\./);
assert.match(html, /Aus einer Messzahl wird eine Adresse\./);
assert.match(html, /Ohne dass die Adresse zur Physik wird\./);
assert.ok(html.indexOf('id="readingKey"') < html.indexOf('id="lightTimeMeasurementBridge"'));
assert.ok(html.indexOf('id="lightTimeMeasurementBridge"') < html.indexOf('id="flowOfLightLab"'));
assert.equal((html.match(/Newton: geordnete Zerlegung/g) || []).length, 1);
assert.match(html, /data-journey-deeper href="#readingKey"/);
assert.match(html, /HOW TO READ FOUNDATION 02 · VALUE \/ TYPE \/ ADDRESS/);
assert.match(html, /Gleiche Ziffern\. Andere Rolle\./);
assert.match(html, /Wert und Einheit gehören zusammen\./);
assert.match(html, /Nur der deklarierte Integer passiert das Gate\./);
assert.match(html, /Eine endliche Adresse — kein Raum und kein Lichtweg\./);
assert.match(html, /WAS BEREITS FESTSTEHT/);
assert.match(html, /WAS JETZT FOLGT/);
assert.ok(html.indexOf('id="addressReadingKey"') < html.indexOf('data-fol-app'));
assert.match(html, /id="ghNumberWindow"/);
assert.match(html, /GH Numbermagick — Zahlen vor Bedeutung\./);
assert.match(html, /NUMBER → ADDRESS → STORY/);
assert.match(html, /12 644 353/);
assert.match(html, /keine Neunerpotenz/);
assert.match(html, /Poetische Anschlussfähigkeit bleibt erhalten/);
assert.match(html, /noch eine neue Navigator-Identität oder Relation/);
assert.ok(html.indexOf('data-fol-app') < html.indexOf('id="ghNumberWindow"'));
assert.ok(html.indexOf('id="ghNumberWindow"') < html.indexOf('<div class="boundary"><strong>Claim boundary:'));
assert.match(html, /ANIMATED 3×3 OWNER VISUAL/);
assert.match(html, /OPEN STANDALONE BOOK/);
assert.match(html, /THE DUSTY STARRY SKY/);
assert.match(html, /REPLAY THE JOURNEY/);
assert.match(html, /RETURN TO THE FOUNDATIONS/);
assert.match(html, /EXPLORE RELATED A0 INSTRUMENTS/);
assert.doesNotMatch(html, /Nicht alles auf einer Bühne/);

console.log(JSON.stringify({
  status: 'PASS',
  assertions: 91,
  viewId: record.view_id,
  middleLens: relationWindow.lens,
  notation: relationWindow.notation,
  boundary: 'typed wavelength/angle coordinate; Goethe-controlled cool/warm visual field shared with Leibniz and Iota stage; no shared physics operator; signed left/right Q-degree 4+1 observer cone; finite overlays; not calibrated optics or a new graph relation'
}, null, 2));
