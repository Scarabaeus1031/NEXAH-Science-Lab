// Documentation regression only: no experiment, runtime adapter or browser run.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks++; };
const html = fs.readFileSync(path.join(__dirname, 'A0_BUILDER_LOG.html'), 'utf8');
const section = html.match(/<section id="existing-series-orion-kernel">([\s\S]*?)<\/section>/)?.[1];
check(section, 'existing-series bridge section is present');
check(html.includes('href="#existing-series-orion-kernel"'), 'entry is reachable from log navigation');
for (const term of [
  'ausführbarer A0-Adapter nicht implementiert', 'RUN01–04', 'EMP-02',
  'MOD:ORIENTATION_DEMONSTRATORS', 'SRC:A0OE:RUN01_04', 'SRC:A0OE:EMP02',
  'SRC:A0OE:GENEALOGY', 'SG:LENS:A0_ORIENTATION_EVIDENCE',
  'SG:LENS:ORION_CAPABILITY_EVIDENCE', 'OLS-RELEASE-1.0.0',
  'INVARIANT', 'EQUIVARIANT', 'ROBUST', 'UNDEFINED',
  'REPRESENTATION_DEPENDENT', 'FAILED', 'Science-Lab-Forschung',
  '13 physische HTML-Dateien sind nicht 13 vollständige Kernpositionen',
  'historische Browserbericht', 'kein heutiger wissenschaftlicher Replay',
  '0–720°', 'Lotus-μ', 'sign(sin θ)', 'sign(cos θ)', 'Messwerttoleranz',
  'Human-Crosswalk überträgt Navigationskontext', 'keine wissenschaftlichen Daten',
  'INVALID', 'sechs bereits vorhandene Hash-Abweichungen',
  'Neue IDs: 0; neue Graphrelationen: 0', '7/8-Demonstrator-Kopplung'
]) check(section.includes(term), 'preserved scope / boundary: ' + term);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
check(ids.length === new Set(ids).size, 'unique document IDs');
let links = 0;
for (const match of section.matchAll(/href="([^"]+)"/g)) {
  const [file, fragment] = decodeURIComponent(match[1]).split('#');
  const target = path.resolve(__dirname, file);
  check(fs.existsSync(target), 'local target exists: ' + file);
  if (fragment) check(
    file.endsWith('/APP/index.html') && ['evidence', 'a0-orientation-evidence'].includes(fragment),
    'only declared Navigator SPA routes used'
  );
  links++;
}
const sourceFile = path.resolve(__dirname, '../../../SCIENCE_LAB/CASE_STUDIES/T_RAN_S_FORMATION/FullPackage/EMP_02_FREEZE_2026-08-27/run07_active_disambiguation.csv');
const rows = fs.readFileSync(sourceFile, 'utf8').trim().split(/\r?\n/).slice(1);
check(rows.length === 4, 'frozen Run07 source still contains four rows');
check(rows.map(r => r.split(',')[0]).join(',') === '60,120,240,300', 'documented source angles agree');
const binder = JSON.parse(fs.readFileSync(path.resolve(__dirname,
  '../../../SCIENCE_LAB/NAVIGATION/EVIDENCE/A0_ORIENTATION_EVIDENCE_LINEAGE_2026-10-10/A0_ORIENTATION_EVIDENCE_LINEAGE_BINDER_V1_2026-10-10.json'), 'utf8'));
for (const id of ['SRC:A0OE:RUN01_04', 'SRC:A0OE:EMP02', 'SRC:A0OE:GENEALOGY']) {
  check(JSON.stringify(binder).includes('"'+id+'"'), 'reused existing binding: ' + id);
}
console.log('PASS: ' + checks + ' documentation checks; ' + links + ' source links. No runtime or science replay.');
