const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const base = __dirname;
const binderPath = path.join(base, 'assets/a0-universal-machine-parts-shelf-v1.json');
const binder = JSON.parse(fs.readFileSync(binderPath, 'utf8'));
const bench = fs.readFileSync(path.join(base, 'A0_ORIENTATION_CONTROLLER_BENCH.html'), 'utf8');
const desk = fs.readFileSync(path.join(base, 'A0_RESEARCH_DESK.html'), 'utf8');
const script = fs.readFileSync(path.join(base, 'a0-universal-machine-parts-shelf.js'), 'utf8');
let passed = 0;
const check = (condition, message) => { assert.ok(condition, message); passed += 1; };
const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

check(binder.family_id === 'FAM-009', 'existing family reused');
check(binder.family_status === 'HISTORICAL_STAGING', 'historical status retained');
check(binder.identity_effect === 'REUSE_FAM_009_NO_NEW_IDENTITY', 'identity effect bounded');
check(binder.graph_effect === 'NO_NEW_CANONICAL_NODE_OR_RELATION', 'graph effect bounded');
check(binder.scientific_run === false && binder.canonical_promotion === false, 'no science or canonical promotion');
check(binder.models.length === 9, 'nine representatives selected');
check(new Set(binder.models.map(model => model.series)).size === 9, 'one representative per working series');
check(binder.collection_context.unique_glb_payloads === 45, 'collection denominator retained');
check(binder.collection_context.selected_bytes === binder.models.reduce((sum, model) => sum + model.bytes, 0), 'selected bytes add up');

for (const model of binder.models) {
  const source = path.join(binder.source_root, model.file);
  const copy = path.join(base, binder.presentation_root, model.file);
  check(fs.existsSync(source), `source exists: ${model.file}`);
  check(fs.existsSync(copy), `copy exists: ${model.file}`);
  check(fs.statSync(copy).size === model.bytes, `byte count matches: ${model.file}`);
  check(sha256(source) === model.sha256, `source SHA-256 matches: ${model.file}`);
  check(sha256(copy) === model.sha256, `copy SHA-256 matches: ${model.file}`);
  check(model.native_animation === false, `native animation is not claimed: ${model.file}`);
}

check(bench.includes('id="universalMachinePartsShelf"'), 'bench shelf mounted');
check(bench.includes('assets/vendor/a0-model-viewer-classic.js'), 'local model viewer used');
check(bench.includes('a0-universal-machine-parts-shelf.js?rev=20261023-r1'), 'shelf controller loaded');
check(bench.includes('A0_RESEARCH_DESK.html#universal-machine-parts-return-20261023'), 'bench returns to Science Desk');
check(desk.includes('id="universal-machine-parts-return-20261023"'), 'Science Desk return present');
check(desk.includes('9 von 45'), 'Science Desk states selection denominator');
check(script.includes("viewer.toggleAttribute('auto-rotate',on)"), 'view rotation is explicit');
check(script.includes('NOT NATIVE ANIMATION'), 'viewer/native animation boundary visible');
check(script.includes('SOURCE-BOUND COPY'), 'source-bound status visible');

console.log(`PASS ${passed}/${passed} · Universal Machine Parts Shelf`);
