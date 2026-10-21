'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const bookRoot = __dirname;
const toursPath = path.join(bookRoot, 'A0_TOURS.html');
const tours = fs.readFileSync(toursPath, 'utf8');
const coveragePath = path.resolve(
  bookRoot,
  '../../../SCIENCE_LAB/NAVIGATION/EVIDENCE/A0_ORIENTATION_EVIDENCE_LINEAGE_2026-10-10/A0_MODULE_SURFACE_COVERAGE_V1_2026-10-14.json'
);
const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));

let checks = 0;
function ok(value, label) {
  assert.ok(value, label);
  checks += 1;
}

const start = tours.indexOf('<section id="fieldbook-mathfield-index"');
const end = tours.indexOf('<section id="explanation-path"', start);
ok(start >= 0 && end > start, 'bounded Fieldbook–Mathfield index exists');
const section = tours.slice(start, end);

const hrefs = [...section.matchAll(/<a data-a0-surface href="([^"]+)"/g)].map((match) => match[1]);
const indexedSurfaces = hrefs.map((href) => href.split('#')[0]);
const expectedSurfaces = coverage.work_bindings.flatMap((binding) => binding.surfaces).sort();
ok(hrefs.length === 57, 'index contains 57 registered surface links');
ok(new Set(indexedSurfaces).size === 57, 'every registered surface is listed once');
assert.deepEqual([...indexedSurfaces].sort(), expectedSurfaces, 'index and governed coverage contain the same surfaces');
checks += 1;

for (const href of hrefs) {
  const url = new URL(href, `file://${toursPath}`);
  const target = decodeURIComponent(url.pathname);
  ok(fs.existsSync(target), `target exists: ${href}`);
  if (url.hash) {
    const targetText = fs.readFileSync(target, 'utf8');
    ok(targetText.includes(`id="${url.hash.slice(1)}"`), `anchor exists: ${href}`);
  }
}

for (const [label, count] of [
  ['Fieldbook · Kern', '9 Seiten'],
  ['Fugen · Reader', '8 Seiten'],
  ['Mathfield', '8 Seiten'],
  ['Pascal-Anschluss', '2 Seiten']
]) {
  ok(section.includes(label) && section.includes(count), `summary retained: ${label}`);
}
ok(section.includes('keine Umklassifizierung'), 'inventory does not imply reclassification');
ok(section.includes('angrenzende Collections'), 'adjacent works remain visibly separate');
ok(fs.readFileSync(path.join(bookRoot, 'index.html'), 'utf8').includes('A0_TOURS.html#fieldbook-mathfield-index'), 'Fieldbook links to index');
ok(fs.readFileSync(path.join(bookRoot, 'A0_MATHEMATICAL_JOINTS.html'), 'utf8').includes('A0_TOURS.html#fieldbook-mathfield-index'), 'Mathfield links to index');

console.log(JSON.stringify({
  status: 'PASS',
  checks,
  indexed_surfaces: hrefs.length,
  scope: 'complete governed A0 page inventory, local targets, anchors and Fieldbook/Mathfield returns'
}));
