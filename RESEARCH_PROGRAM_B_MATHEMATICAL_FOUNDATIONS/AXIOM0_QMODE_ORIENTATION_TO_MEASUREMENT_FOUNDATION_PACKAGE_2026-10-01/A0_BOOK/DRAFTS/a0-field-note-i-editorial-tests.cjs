const fs = require('node:fs');
const path = require('node:path');

const base = __dirname;
const file = path.join(base, 'A0_FIELD_NOTE_I_ARCHITECTURE_OF_OBSERVATION_2026-11-21.html');
const html = fs.readFileSync(file, 'utf8');
const checks = [];

function check(name, pass) {
  checks.push({ name, pass: Boolean(pass) });
  if (!pass) process.exitCode = 1;
}

check('declares existing Field Note I editorial candidate', html.includes('data-editorial-candidate="field-note-i"'));
check('contains six-operation reading grammar', ['Field', 'Viewpoint', 'Cut', 'Horizon', 'Map', 'Residual'].every(term => html.includes(`<h3>${term}</h3>`)));
check('contains typed context and view-return records', html.includes('{carrier, context, observable, apparatus, provenance, outcome}') && html.includes('{source, aperture, view, residual, return_key, return_status}'));
check('contains exact base-11 address and return equations', html.includes('n − 1 = x + 11y + 121z') && html.includes('n = 1 + x + 11y + 121z'));
check('contains claim boundary and no-publication status', html.includes('Claim boundary.') && html.includes('NOT AUTHORIZED'));
check('contains no absolute local file URL', !html.includes('file:///'));
check('contains no private Owner Notes link', !html.includes('assets/a0-field-notes/index.html'));

const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map(match => match[1]).filter(href => !href.startsWith('#'));
for (const href of hrefs) {
  const [relative] = href.split('#');
  check(`linked source exists: ${relative}`, fs.existsSync(path.resolve(base, relative)));
}

for (const item of checks) console.log(`${item.pass ? 'PASS' : 'FAIL'} ${item.name}`);
console.log(`${checks.filter(item => item.pass).length}/${checks.length} checks passed`);
