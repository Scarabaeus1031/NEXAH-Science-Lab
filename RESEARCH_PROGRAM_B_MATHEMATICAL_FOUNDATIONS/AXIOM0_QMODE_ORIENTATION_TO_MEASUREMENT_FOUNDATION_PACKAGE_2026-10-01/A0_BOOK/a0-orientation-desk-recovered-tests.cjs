const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const desk = fs.readFileSync(path.join(root, 'A0_ORIENTATION_DESK_RECOVERED.html'), 'utf8');
const snapshot = fs.readFileSync(path.join(root, 'A0_NEXAHEDRON_LIVING_WORKSPACE_SNAPSHOT.html'), 'utf8');
const human = fs.readFileSync(path.join(root, 'A0_NEXAH_APERTURE_JOURNEY.html'), 'utf8');

assert.match(desk, /The Orientation<em>Desk\.<\/em>/);
assert.match(desk, /f9cbe35 · 2026-08-07/);
assert.match(desk, /5a9a25b · 2026-09-03/);
assert.match(desk, /Bring what you have/);
assert.match(desk, /Open THE EYE · Compare A \/ A′/);
assert.match(desk, /I · RETAINED/);
assert.match(desk, /L · LOST/);
assert.match(desk, /A · ADDED/);
assert.match(desk, /U · UNAVAILABLE/);
assert.match(desk, /does not execute the sealed THE EYE runtime/);
assert.match(desk, /ΔGRAPH=0 · NO NEW STUDY · NO PUBLICATION AUTHORITY/);
assert.equal((desk.match(/class="fragment"/g) || []).length, 4);
assert.equal((desk.match(/data-workflow-step=/g) || []).length, 6);
assert.match(desk, /BRING WHAT YOU HAVE/);
assert.match(desk, /DECLARE WHAT COUNTS HERE/i);
assert.match(desk, /Inside is a decision/);
assert.match(desk, /Continue—or let the question Rest/);
assert.match(desk, /src="a0-orientation-desk-engine\.js"/);
assert.match(desk, /src="a0-orientation-desk-ui\.js"/);
assert.match(human, /href="A0_ORIENTATION_DESK_RECOVERED\.html"/);
assert.match(human, /<b>8 Zugänge<\/b>/);
assert.match(human, /<b>4 in Entwicklung<\/b>/);
assert.match(human, /<b>4 bereits draußen<\/b>/);
assert.match(human, /id="orientation-desk-recovered"/);
assert.match(human, /<iframe src="A0_ORIENTATION_DESK_RECOVERED\.html"/);
assert.ok(human.indexOf('id="orientation-desk-recovered"') > human.indexOf('id="a0-human-apps"'));
assert.ok(human.indexOf('id="a0-human-public"') > human.indexOf('id="orientation-desk-recovered"'));
assert.ok(human.lastIndexOf('href="A0_LOOK_AGAIN_PLAY.html"') > human.indexOf('id="a0-human-public"'));
assert.ok(human.lastIndexOf('href="A0_LOOK_AGAIN_PLAY.html"') > human.indexOf('href="A0_OPIUM.html#entrance"'));
assert.match(desk, /href="A0_NEXAHEDRON_LIVING_WORKSPACE_SNAPSHOT\.html"/);
assert.match(desk, /Open the original NEXAHEDRON page locally/);
assert.match(desk, /github\.com\/Scarabaeus1031\/NEXAHEDRON\/tree\/f9cbe359b08fdb4d63c3ff11eb2ae0ade9ecd1ab/);
assert.match(desk, /github\.com\/Scarabaeus1031\/NEXAHEDRON\/commit\/5a9a25b14a42d9da9711808f05cb82c520597732/);
assert.match(snapshot, /LOCAL HISTORICAL SNAPSHOT/);
assert.match(snapshot, /f9cbe359b08fdb4d63c3ff11eb2ae0ade9ecd1ab/);
assert.match(snapshot, /Can a bounded process help a Human find their bearings\?/);
assert.match(snapshot, /A question held on an open working surface/);
assert.match(snapshot, /Bring what you have/);
assert.match(snapshot, /Information is abundant\. Orientation is not\./);
assert.match(snapshot, /Next\.js routes, ORION, Gateway and live experiment execution are intentionally not reproduced/);

console.log(JSON.stringify({
  status: 'PASS',
  checks: 36,
  scope: 'historical interface recovery, A0 Human View route and explicit no-authority boundary'
}));
