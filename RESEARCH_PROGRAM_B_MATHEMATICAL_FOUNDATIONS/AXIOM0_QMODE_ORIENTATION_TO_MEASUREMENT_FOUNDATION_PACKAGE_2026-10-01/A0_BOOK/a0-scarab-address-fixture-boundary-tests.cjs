'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const chamber = require('./a0-scarab-stretch-chamber.js');

let checks = 0;
const ok = (value, message) => {
  checks += 1;
  assert.ok(value, message);
};

const EXPECTED = Object.freeze({
  left: 63,
  right: 64,
  pair: 127,
  facets: 54,
  total: 181,
});

function verifyAddressFixture(record) {
  const fixture = record && record.address_fixtures;
  if (!fixture || typeof fixture !== 'object') return 'REJECT_MISSING_FIXTURE';
  for (const [key, value] of Object.entries(EXPECTED)) {
    if (fixture[key] !== value) return `REJECT_${key.toUpperCase()}_MISMATCH`;
  }
  if (fixture.left + fixture.right !== fixture.pair) return 'REJECT_PAIR_ARITHMETIC';
  if (fixture.pair + fixture.facets !== fixture.total) return 'REJECT_TOTAL_ARITHMETIC';
  return 'PASS_VERIFIED_ADDRESS_FIXTURE';
}

const captured = chamber.receipt(chamber.snapshot(0));
ok(verifyAddressFixture(captured) === 'PASS_VERIFIED_ADDRESS_FIXTURE', 'captured fixture passes');

const replayed = JSON.parse(JSON.stringify(captured));
ok(verifyAddressFixture(replayed) === 'PASS_VERIFIED_ADDRESS_FIXTURE', 'serialized replay passes exactly');
ok(JSON.stringify(replayed.address_fixtures) === JSON.stringify(EXPECTED), 'replay preserves the exact address tuple');

for (const [key, value] of Object.entries(EXPECTED)) {
  const tampered = JSON.parse(JSON.stringify(captured));
  tampered.address_fixtures[key] = value + 1;
  ok(verifyAddressFixture(tampered).startsWith('REJECT_'), `${key} tamper is rejected`);
}

const missing = JSON.parse(JSON.stringify(captured));
delete missing.address_fixtures;
ok(verifyAddressFixture(missing) === 'REJECT_MISSING_FIXTURE', 'missing fixture is rejected');

for (const candidate of ['C+3^3', '12:1', 'SCARAB_CHAMBER']) {
  ok(captured.reading_candidates.includes(candidate), `${candidate} remains a reading candidate`);
}
ok(!captured.reading_candidates.includes('C2'), 'unqualified C2 is not silently promoted into the chamber receipt');

const fieldNotes = fs.readFileSync(path.join(__dirname, 'assets/a0-field-notes/index.html'), 'utf8');
ok(fieldNotes.includes('C2 = (1,2,1)'), 'Breathing Crystal C2=(1,2,1) source reading exists');
ok(fieldNotes.includes('larger <code>C1/C2/C3</code> Breathing Crystal family remains out of band'), 'Breathing Crystal C2 remains out of band');
ok(fieldNotes.includes('X40 = C5 x P4 x C2'), 'distinct two-sheet C2 factor exists');
ok(fieldNotes.includes('erases one <code>C2</code> orientation bit'), 'two-sheet C2 has its own typed role');

console.log(JSON.stringify({
  status: 'PASS',
  checks,
  fixture_status: 'VERIFIED_ADDRESS_FIXTURE',
  arithmetic: ['63+64=127', '127+54=181'],
  replay: 'EXACT',
  tamper: 'REJECT',
  c2_boundary: {
    breathing_crystal: 'C2=(1,2,1) / OUT_OF_BAND_CANDIDATE',
    two_sheet_factor: 'C2 / DISTINCT_TYPED_OBJECT',
    automatic_binding: 'NONE',
  },
  claim_effect: 'NONE',
}));
