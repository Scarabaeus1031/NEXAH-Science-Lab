const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const desk = fs.readFileSync(path.join(root, 'A0_RESEARCH_DESK.html'), 'utf8');
const receipt = JSON.parse(fs.readFileSync(path.join(root, 'results/a0-ols-glyph-tile-hub-return-2026-11-08.json'), 'utf8'));

for (const marker of [
  'id="ols-glyph-tile-hub-20261108"',
  'Orientation Language · OLS 1.0',
  'OBSERVE → REPRESENT → COMPARE → ORIENT → EXPLAIN',
  'DRAFTS/IOI_PRIME_OPEN_BOOK_COMPOSITION.html#letterSyllableLens',
  'A0_NUMBERMAGICK_GRID_RESEARCH.html#number-glyph-weight-return',
  'LABREPORT_NEXAH_ZERO_GLYPH_IOTA_BOUNDARY_001.md',
  '06_GLYPH_AND_MORPHOLOGY_LEDGER.csv',
  '03_GLYPH_FAMILY_LEDGER.csv',
  'NAVIGATION/APP/index.html#orion-capability-evidence',
  'NAVIGATION/APP/index.html#a0-orientation-evidence',
  'OLS EXTENSION 0',
  'NEW NAVIGATOR ID 0'
]) assert.ok(desk.includes(marker), marker);

assert.equal(receipt.status, 'PASS_SOURCE_BOUND_OLS_GLYPH_TILE_HUB');
assert.equal(receipt.effects.new_navigator_ids, 0);
assert.equal(receipt.effects.relation_changes, 0);
assert.equal(receipt.effects.ols_extension, false);
assert.equal(receipt.effects.publication, false);
assert.ok(receipt.identity_reuse.includes('NEXAH:ORION:CAPABILITY_EVIDENCE:V1'));
assert.ok(receipt.identity_reuse.includes('MOD:NUMBER_VIEW_SUITE'));

console.log(JSON.stringify({ status: 'PASS', checks: 20, hub: receipt.science_desk_anchor }));
