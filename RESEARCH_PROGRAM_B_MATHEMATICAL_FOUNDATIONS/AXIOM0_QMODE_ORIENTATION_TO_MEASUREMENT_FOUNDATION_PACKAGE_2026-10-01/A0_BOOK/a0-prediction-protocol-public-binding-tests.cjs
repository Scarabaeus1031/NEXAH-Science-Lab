const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const here = __dirname;
const science = fs.readFileSync(path.join(here, 'A0_SCIENCE.html'), 'utf8');
const desk = fs.readFileSync(path.join(here, 'A0_RESEARCH_DESK.html'), 'utf8');

const markers = [
  'Prediction Protocol · Method Review Candidate',
  '/papers/nexah-prediction-protocol-01/',
  'prediction-protocol-01-method-review-return-20261119',
  'M-CURATE01_ATLAS_III_INTERSTELLAR_ENTRY_EXIT_LENS',
  'Δgraph=0',
  'Study 0',
  'Finding 0',
  'Publication 0'
];

for (const marker of markers) assert.ok(science.includes(marker), `missing public marker: ${marker}`);

assert.match(desk, /id="prediction-protocol-01-method-review-return-20261119"/);
assert.match(desk, /METHOD_REVIEW_CANDIDATE/);
assert.match(desk, /DRAFT_NOT_LOCKED/);
assert.match(desk, /NOT_YET_ACTIVATED/);
assert.match(desk, /NEW ID 0 \/ RELATION 0 \/ ALIAS 0 \/ STUDY 0 \/ FINDING 0/);
assert.doesNotMatch(science, /href="A0_RESEARCH_DESK\.html#prediction-protocol-01-method-review-return-20261119"/);

console.log('PASS a0-prediction-protocol-public-binding-tests');
