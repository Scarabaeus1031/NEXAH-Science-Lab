'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const bookRoot = __dirname;
const ecosystemRoot = path.resolve(bookRoot, '../../../../..');
const deskPath = path.join(bookRoot, 'A0_RESEARCH_DESK.html');
const ownerViewPath = path.join(
  ecosystemRoot,
  '00 EXECUTIVE/NEXAH-Mission-Control/00_OVERVIEW/OWNER_VIEW.md'
);
const desk = fs.readFileSync(deskPath, 'utf8');
const ownerView = fs.readFileSync(ownerViewPath, 'utf8');

let checks = 0;
function ok(value, label) {
  assert.ok(value, label);
  checks += 1;
}

const missionStart = desk.indexOf('<section class="spread" id="nexah-a0-context"');
const indexStart = desk.indexOf('<section class="spread" id="a0-work-index"');
const coreStart = desk.indexOf('<section class="spread" id="core-documents"');
ok(missionStart >= 0, 'A0 mission section exists');
ok(indexStart > missionStart, 'work index follows the mission');
ok(coreStart > indexStart, 'work index precedes the core documents');

const workIndex = desk.slice(indexStart, coreStart);
ok(workIndex.includes('Fieldbook ↔ Fuge ↔ Mathfield.'), 'Fieldwork framing is visible');
ok(workIndex.includes('Ein Zeichen. Zwei Übersichten.'), 'two-overview contract is visible');
ok((workIndex.match(/class="fieldwork-action"/g) || []).length === 2, 'exactly two overview actions');
for (const route of ['A0_TOURS.html#fieldbook-mathfield-index', 'A0_TOURS.html#tour-map']) {
  ok(workIndex.includes(`href="${route}"`), `overview route present: ${route}`);
}
for (const category of ['Fieldbook · 9', 'Fugen / Reader · 8', 'Mathfield · 8', 'Pascal · 2', 'angrenzend · 30']) {
  ok(workIndex.includes(category), `category present: ${category}`);
}
for (const builderRoute of ['href="#builder"', 'A0_BUILDER_TOY_STORE.html', 'A0_BUILDER_LOG.html']) {
  ok(workIndex.includes(builderRoute), `separate Builder route present: ${builderRoute}`);
}
ok(workIndex.includes('<svg viewBox="0 0 360 230" role="img"'), 'Fieldbook–seam–grid mark is present');
ok(workIndex.includes('Keine Umklassifizierung der 57 Work-Bindings'), 'existing classifications remain explicit');
ok(desk.includes('Darstellungen öffnen. Übergänge untersuchen. Unterschiede erhalten. Rückwege nachvollziehbar machen.'), 'mission statement is visible');
ok(desk.includes('ERLEBEN → LESEN → VERGLEICHEN<br>→ BAUEN → PRÜFEN → RETURN'), 'working movement is visible');
ok(ownerView.includes('A0_RESEARCH_DESK.html#a0-work-index'), 'Mission Control links to the work index');

for (const match of workIndex.matchAll(/href="([^"]+)"/g)) {
  const href = match[1];
  if (/^(?:https?:|mailto:)/.test(href)) continue;
  const url = new URL(href, `file://${deskPath}`);
  const target = decodeURIComponent(url.pathname);
  ok(fs.existsSync(target), `link target exists: ${href}`);
  if (url.hash && target !== path.resolve(bookRoot, '../../../SCIENCE_LAB/NAVIGATION/APP/index.html')) {
    const targetText = fs.readFileSync(target, 'utf8');
    ok(targetText.includes(`id="${url.hash.slice(1)}"`), `link anchor exists: ${href}`);
  }
}

const ids = [...desk.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
ok(ids.length === new Set(ids).size, 'Science Desk IDs remain unique');

console.log(JSON.stringify({
  status: 'PASS',
  checks,
  scope: 'A0 mission, Fieldbook–Mathfield desk mark, two overview routes, categories, separate Builder route and authority boundary'
}));
