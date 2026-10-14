const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'NEXAH_C_CONNECT.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'nexah-c-connect.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'nexah-c-connect.js'), 'utf8');
const laboratory = fs.readFileSync(path.join(root, 'A0_LABORATORY.html'), 'utf8');

assert.match(html, /id="builders"/);
assert.match(html, /Some connections<br>need <em>builders\.<\/em>/);
assert.match(html, /OPEN INVITATION · BUILD WHAT IS MISSING/);
assert.match(html, /01 · EXPERIENCE/);
assert.match(html, /02 · SYSTEMS/);
assert.match(html, /03 · TRANSLATION/);
assert.match(html, /mailto:info@nexah\.de\?subject=NEXAH%20Builder%20Introduction/);
assert.match(html, />info@nexah\.de<\/a>/);
assert.match(html, /A0_BUILDER_TOY_STORE\.html/);
assert.match(html, /keine formale Stellenausschreibung/);
assert.match(html, /WHAT YOU BUILD · WHAT YOU WANT TO UNDERSTAND/);
assert.match(css, /\.builder-beacon/);
assert.match(css, /@keyframes beaconTurn/);
assert.match(css, /prefers-reduced-motion:reduce/);
assert.match(html, /a0-context-navigation\.js\?rev=science-desk-entry-20261014/);
assert.match(html, /id="mapPlayback"/);
assert.match(html, /id="cardSource"/);
assert.match(js, /href:"A0_LABORATORY\.html"/);
assert.match(js, /sourceHref:"https:\/\/github\.com\/Scarabaeus1031\/NEXAH-Science-Lab"/);
assert.match(js, /if \(manual\) setPaused\(true\)/);
assert.match(js, /playback\.addEventListener\("click"/);
assert.match(css, /\.map-playback\[aria-pressed="true"\]/);
assert.match(css, /\.orbit-map\.is-paused \.orbit-ring/);
assert.match(laboratory, /Science Lab Repository/);
assert.match(laboratory, /https:\/\/github\.com\/Scarabaeus1031\/NEXAH-Science-Lab/);

console.log(JSON.stringify({
  status: 'PASS',
  assertions: 25,
  surface: 'NEXAH_C_CONNECT',
  contact: 'info@nexah.de',
  identity: 'existing C Connect surface extended; no new route or relation'
}, null, 2));
