const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const canonical = Array.from({ length: 28 }, (_, i) => ({
  id: `TESA-${String(i + 1).padStart(2, '0')}`,
  order: i,
  value: i + 1
}));

const views = {
  TESA_GRID: canonical.map((r, i) => ({ ...r, x: i % 7, y: Math.floor(i / 7) })),
  HZ_LADDER: canonical.map((r, i) => ({ ...r, x: i, y: r.value / 28 })),
  IVOMARIA_POLAR: canonical.map((r, i) => {
    const theta = 2 * Math.PI * i / 28;
    const radius = 1 + 0.12 * Math.cos(4 * theta);
    return { ...r, theta, radius, x: radius * Math.cos(theta), y: radius * Math.sin(theta) };
  })
};
views.FZ_RETURN_R270 = views.IVOMARIA_POLAR.map(p => ({ ...p, x: p.y, y: -p.x }));

const expectedHash = '3ef85cb870448d10eb4d2fd93b7fae6ae41ab172c1e15de1577e11d094ff0478';
const actualHash = crypto.createHash('sha256').update(JSON.stringify(canonical)).digest('hex');
assert.equal(actualHash, expectedHash, 'canonical record hash');

for (const [name, view] of Object.entries(views)) {
  assert.equal(view.length, 28, `${name}: sample count`);
  view.forEach((row, i) => {
    assert.equal(row.id, canonical[i].id, `${name}: identity at ${i}`);
    assert.equal(row.order, canonical[i].order, `${name}: order at ${i}`);
    assert.equal(row.value, canonical[i].value, `${name}: value at ${i}`);
    assert.notEqual(row.value, 29, `${name}: external address excluded`);
  });
}

views.FZ_RETURN_R270.forEach((row, i) => {
  const source = views.IVOMARIA_POLAR[i];
  assert.ok(Math.abs(row.x - source.y) < 1e-12, `R270 x at ${i}`);
  assert.ok(Math.abs(row.y + source.x) < 1e-12, `R270 y at ${i}`);
});

const receiptPath = path.join(__dirname, 'results', 'a0-tesa-hz-ivomaria-fz-four-view-2026-11-15.json');
const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
assert.equal(receipt.status, 'PASS_VIEW_PRESERVATION');
assert.equal(receipt.carrier.sha256, expectedHash);
assert.deepEqual(receipt.views, Object.keys(views));
assert.equal(receipt.separation.ocbM3SampleCount, 48);
assert.equal(receipt.separation.sameRecordClaim, false);
assert.equal(receipt.graphDelta.newIdentities, 0);
assert.equal(receipt.graphDelta.newRelations, 0);
assert.equal(receipt.graphDelta.sourceGraphEffect, 'NO_SOURCE_GRAPH_EFFECT');

if (!process.argv.includes('--model-only')) {
  const htmlPath = path.join(__dirname, 'assets', 'a0-field-notes', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  for (const marker of [
    'id="tesa-four-view-register"',
    'Ein Record. Vier Projektionen.',
    'PASS_VIEW_PRESERVATION',
    expectedHash,
    '29 · EXTERNAL',
    'M3 · 48 SAMPLES · SEPARATE',
    'TESA → HZ → IVOMARIA → R270 → FZ',
    'VIEW_ONLY / NO_PHYSICAL_FREQUENCY / NO_CARDANO_IDENTITY / NO_RAMANUJAN_IDENTITY / NO_NEW_RELATION'
  ]) assert.ok(html.includes(marker), `generated reader marker: ${marker}`);
}

console.log(`PASS_VIEW_PRESERVATION · 28 samples · 4 views · ${actualHash}`);
