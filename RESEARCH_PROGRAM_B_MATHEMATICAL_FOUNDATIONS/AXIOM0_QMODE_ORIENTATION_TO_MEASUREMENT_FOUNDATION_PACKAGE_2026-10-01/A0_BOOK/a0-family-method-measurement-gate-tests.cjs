const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const bookDir = __dirname;
const paperPath = path.join(bookDir, 'A0_NEXAH_FAMILY_METHOD_WHITE_PAPER.html');
const fixturePath = path.join(bookDir, 'DRAFTS', 'A0_MEASUREMENT_GATE_DRAFT_2026-11-19.html');
const paper = fs.readFileSync(paperPath, 'utf8');
const fixture = fs.readFileSync(fixturePath, 'utf8');

function embeddedData(html, id) {
  const match = html.match(new RegExp(`<script type="application/json" id="${id}">([\\s\\S]*?)<\\/script>`));
  assert.ok(match, `missing embedded data: ${id}`);
  return JSON.parse(match[1]);
}

function comparableCase(item) {
  return {
    id: item.id,
    operator: item.operator,
    analogy: item.analogy,
    source: {
      authority: item.source.authority,
      title: item.source.title,
      solution: item.source.solution,
      solution_date: item.source.solution_date,
      epoch: item.source.epoch,
      retrieved: item.source.retrieved,
    },
    carrier: item.carrier,
    quantities: item.quantities.map(({ id, type, symbol, value, display, unit, qualifier }) => ({
      id, type, symbol, value, display, unit, qualifier,
    })),
    return: item.return,
  };
}

const paperData = embeddedData(paper, 'familyMeasurementGateData');
const fixtureData = embeddedData(fixture, 'measurementGateData');

assert.equal(paperData.schema, 'nexah.a0.measurement-gate.data.v1');
assert.equal(paperData.retrieved, fixtureData.retrieved);
assert.equal(paperData.cases.length, 4, 'the embedded method surface stays intentionally bounded');
assert.deepEqual(
  paperData.cases.map(comparableCase),
  fixtureData.cases.map(comparableCase),
  'the White Paper embedding must not drift from the internal source fixture',
);

const sequenceIndex = paper.indexOf('id="sequence"');
const gateIndex = paper.indexOf('id="measurement-gate"');
const cycleIndex = paper.indexOf('id="cycle"');
assert.ok(sequenceIndex >= 0 && sequenceIndex < gateIndex && gateIndex < cycleIndex, '04A sits between T1–T8 and the cycle');
assert.match(paper, /href="#measurement-gate">Gate<\/a>/);
assert.match(paper, /Die Methode wird ausführbar\./);
assert.match(paper, /SOURCE<\/span><span>TYPE<\/span><span>CUT<\/span><span>TRACE<\/span><span>COMPARE<\/span><span>RETURN/);
assert.match(paper, /T1–T2 · DECLARE/);
assert.match(paper, /T7–T8 · RETURN/);
assert.match(paper, /Claim boundary:/);
assert.match(paper, /QRT bleibt ausdrücklich Analogie/);
assert.match(paper, /dirty local candidate · Δgraph 0/);
assert.doesNotMatch(paper, /Eris 25\.9\s*h/i);

for (const item of paperData.cases) {
  assert.ok(item.source.authority && item.source.title && item.source.retrieved, `${item.id}: source declaration incomplete`);
  assert.ok(item.carrier.object && item.carrier.frame, `${item.id}: carrier declaration incomplete`);
  assert.ok(item.operator && item.return.status && item.return.class, `${item.id}: return declaration incomplete`);
  for (const quantity of item.quantities) {
    assert.ok(quantity.id && quantity.type && quantity.symbol, `${item.id}: untyped quantity`);
    assert.notEqual(quantity.value, undefined, `${item.id}/${quantity.id}: missing value`);
    assert.ok(quantity.unit && quantity.qualifier, `${item.id}/${quantity.id}: unit or qualifier missing`);
  }
  if (item.time_sensitive) {
    assert.ok(item.source.solution && item.source.solution_date && item.source.epoch, `${item.id}: time-sensitive source is not pinned`);
  }
}

const qrt = paperData.cases.find(item => item.id === 'saturn-titan-qrt');
assert.equal(qrt.analogy, true);
assert.equal(qrt.return.status, 'N_A_ANALOGY_ONLY');
const qrtSource = path.resolve(bookDir, qrt.source.url);
assert.ok(fs.existsSync(qrtSource), `QRT source link must resolve locally: ${qrtSource}`);

const jupiter = paperData.cases.find(item => item.id === 'jupiter-resonance-sorter');
const aJ = 5.203;
for (const quantity of jupiter.quantities) {
  const [numerator, denominator] = quantity.id.split(':').map(Number);
  const reproduced = aJ * Math.pow(denominator / numerator, 2 / 3);
  assert.ok(Math.abs(reproduced - quantity.value) < 0.002, `${quantity.id}: resonance radius is not reproducible`);
}

const executableScripts = [...paper.matchAll(/<script(?![^>]*type="application\/json")(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)]
  .map(match => match[1])
  .filter(source => source.trim());
assert.ok(executableScripts.length >= 1, 'inline controller script missing');
for (const source of executableScripts) new Function(source);

console.log('PASS a0-family-method-measurement-gate-tests');
