const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const files = {
  mathfield: read('A0_MATHEMATICAL_JOINTS.html'),
  lens: read('A0_BLUE_PINK_DODECA_CELL_RETURN.html'),
  bench: read('A0_ORIENTATION_CONTROLLER_BENCH.html'),
  css: read('a0-application-return-polish.css')
};

const failures = [];
let checks = 0;
function expect(condition, label) {
  checks += 1;
  if (!condition) failures.push(label);
}

for (const [name, html] of Object.entries({mathfield: files.mathfield, lens: files.lens, bench: files.bench})) {
  expect(html.includes('a0-application-return-polish.css?rev=20261023-r2'), `${name}: shared polish stylesheet`);
  expect(html.includes('class="arp-system-map"'), `${name}: system map present`);
  expect(html.includes('01 · SOURCE'), `${name}: source role`);
  expect(html.includes('02 · VIEW'), `${name}: view role`);
  expect(html.includes('03 · CONTROL'), `${name}: control role`);
  expect(html.includes('04 · APERTURE'), `${name}: aperture role`);
  expect(html.includes('05 · RETURN'), `${name}: return role`);
  expect(html.includes('Touch → Shutter → Transfer'), `${name}: common aperture sequence`);
  expect(html.includes('A0_RESEARCH_DESK.html#coupled-channel-boundary-return-20261023'), `${name}: exact Science Desk return`);
  expect(html.includes('data-route-contract="A0-SVR-01"'), `${name}: frozen shared route contract`);
  expect(html.includes('id="a0-svr-01-route"'), `${name}: exact responsive acceptance anchor`);
  expect(html.includes('Route contract frozen · A0-SVR-01'), `${name}: visible freeze marker`);
  expect(html.includes('class="arp-governance-return"'), `${name}: governance return separated from scientific roles`);
  expect(html.includes('Science Desk</a> → <a href="../../../SCIENCE_LAB/NAVIGATION/APP/index.html#a0-orientation-evidence">Science Navigator</a> → <a href="../../../../../00%20EXECUTIVE/NEXAH-Mission-Control/INTERNAL_NAVIGATOR/index.html#a0-private-desk">Mission Control</a>'), `${name}: exact Desk → Navigator → Mission Control route`);
}

expect(files.mathfield.includes('data-focus="source"'), 'Mathfield highlights Source');
expect(files.mathfield.includes('A0_ORIENTATION_CONTROLLER_BENCH.html#pulseGrammarClock'), 'Mathfield links PULSE owner');
expect(files.lens.includes('data-focus="view"'), 'Blue/Pink highlights View');
expect(files.lens.includes('receive-only'), 'Blue/Pink declares receive-only PULSE edge');
expect(files.lens.includes('keine Adressmutation'), 'Blue/Pink preserves address');
expect(files.bench.includes('data-focus="control"'), 'Bench highlights Control');
expect(files.bench.includes('kein Rückkanal'), 'Bench excludes feedback channel');
expect(files.bench.includes('PULSE-Record und lokaler 20-Sekunden-Fallback'), 'Bench separates clock sources');

expect(files.css.includes('grid-template-columns: repeat(5'), 'desktop five-stage route');
expect(files.css.includes('@media (max-width: 920px)'), 'tablet fallback');
expect(files.css.includes('@media (max-width: 620px)'), 'mobile fallback');
expect(files.css.includes('.arp-system-map[data-focus="source"]'), 'focus states declared');
expect(files.css.includes('.arp-route { grid-template-columns: 1fr; }'), 'mobile route collapses to one column');
expect(files.css.includes('.arp-governance-return { grid-template-columns: 1fr; }'), 'mobile governance return collapses to one column');
expect(files.css.includes('@media (prefers-reduced-motion: reduce)'), 'reduced-motion contract');
expect(files.css.includes('@media print'), 'print-safe main visual');
expect(files.css.includes('outline: 3px solid var(--arp-accent'), 'keyboard focus remains visible');

if (failures.length) {
  console.error(JSON.stringify({status: 'FAIL', checks, failures}, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: 'PASS',
  checks,
  scope: 'shared Source → View → Control → Aperture → Return visual grammar across Mathfield, Blue/Pink Lens and Orientation Bench'
}, null, 2));
