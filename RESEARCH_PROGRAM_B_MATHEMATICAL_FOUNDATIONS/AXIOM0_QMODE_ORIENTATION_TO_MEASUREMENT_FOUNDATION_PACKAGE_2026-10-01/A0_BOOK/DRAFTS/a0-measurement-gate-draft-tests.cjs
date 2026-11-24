const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "A0_MEASUREMENT_GATE_DRAFT_2026-11-19.html"), "utf8");
const match = html.match(/<script type="application\/json" id="measurementGateData">\s*([\s\S]*?)\s*<\/script>/);
assert.ok(match, "pinned measurement data must be embedded as application/json");
const data = JSON.parse(match[1]);

assert.equal(data.schema, "nexah.a0.measurement-gate.data.v1");
assert.equal(data.retrieved, "2026-11-19");
assert.equal(data.cases.length, 4);

const allowedOperators = new Set(["CONIC_GATE", "RESONANCE_SORTER", "QRT_RECORD"]);
for (const item of data.cases) {
  assert.ok(item.id && item.label && item.source && item.carrier && item.return);
  assert.ok(allowedOperators.has(item.operator));
  assert.ok(item.source.authority && item.source.title && item.source.url && item.source.retrieved);
  assert.ok(item.carrier.object && item.carrier.frame);
  assert.ok(item.quantities.length > 0);
  for (const quantity of item.quantities) {
    assert.ok(quantity.id && quantity.type && quantity.symbol);
    assert.notEqual(quantity.value, undefined);
    assert.ok(quantity.unit, `${item.id}/${quantity.id} must declare a unit or dimensionless`);
    assert.ok(quantity.qualifier && quantity.note);
  }
  if (item.time_sensitive) {
    assert.ok(item.source.solution && item.source.solution_date && item.source.epoch && item.source.retrieved);
  }
  if (item.operator === "CONIC_GATE") {
    const eccentricity = item.quantities.find(quantity => quantity.id === "e").value;
    const expected = eccentricity < 1 ? "ELLIPTIC" : eccentricity === 1 ? "PARABOLIC" : "HYPERBOLIC";
    assert.equal(item.return.class, expected);
  }
  if (item.operator === "QRT_RECORD") {
    assert.equal(item.analogy, true);
    assert.equal(item.return.status, "N_A_ANALOGY_ONLY");
    assert.match(item.return.class, /ANALOGY/);
  }
}

const resonance = data.cases.find(item => item.id === "jupiter-resonance-sorter");
const aJ = 5.203;
for (const quantity of resonance.quantities) {
  const [p, q] = quantity.id.split(":").map(Number);
  const expected = aJ * Math.pow(q / p, 2 / 3);
  assert.ok(Math.abs(quantity.value - expected) < 0.001, `${quantity.id} resonance radius must reproduce`);
}

const atlas = data.cases.find(item => item.id === "3i-atlas-jpl-55");
assert.equal(atlas.source.solution, "55");
assert.equal(atlas.source.epoch, "2026-10-27.0 TDB");
assert.equal(atlas.quantities.find(quantity => quantity.id === "e").value, 6.123467394525528);

assert.match(html, /SOURCE → TYPE → CUT → TRACE → COMPARE → RETURN/);
assert.match(html, /prefers-reduced-motion/);
assert.match(html, /aria-live="polite"/);
assert.match(html, /N_A_ANALOGY_ONLY/);
assert.match(html, /Δgraph 0/);
assert.doesNotMatch(html, /Eris[^<\n]{0,80}25\.9 h/i);
assert.doesNotMatch(html, /fetch\s*\(/);
assert.doesNotMatch(html, /<script[^>]+src=/i);
assert.doesNotMatch(html, /<link[^>]+stylesheet/i);

console.log("PASS · Measurement Gate is a four-case, offline, typed and graph-neutral draft fixture.");
