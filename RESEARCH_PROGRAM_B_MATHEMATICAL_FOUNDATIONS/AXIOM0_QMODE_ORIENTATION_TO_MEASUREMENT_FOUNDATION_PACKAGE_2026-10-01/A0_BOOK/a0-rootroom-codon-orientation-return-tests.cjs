const assert = require("node:assert/strict");
const fs = require("node:fs");
const engine = require("./a0-rootroom-codon-orientation-return.js");

assert.equal(engine.GOLDEN_ANGLE, 137.5);
assert.deepEqual(engine.ROOT_RADII.map((n) => Number(n.toFixed(12))), [1.414213562373, 2.2360679775, 2.645751311065]);
for (const [key, triplet] of Object.entries(engine.CODONS)) {
  assert.equal(triplet.length, 3, `${key} remains an ordered triplet`);
  assert.equal(triplet.reduce((a, b) => a + b, 0), 33, `${key} source sum`);
}

const control = engine.run({ codonKey: "F2", mode: "ORIENTABLE_CONTROL", loops: 1 });
assert.equal(control.gate_count, 5);
assert.equal(control.stations.length, 5);
assert.ok(control.stations.every((s) => s.orientation_sign === 1));
assert.deepEqual(control.stations.map((s) => s.angle_deg), [0, 137.5, 275, 52.5, 190]);

const half = engine.run({ codonKey: "F3", mode: "HALF_TWIST_CANDIDATE", loops: 1 });
assert.ok(half.stations.every((s) => s.orientation_sign === -1));
assert.equal(half.classification, "DECLARED_HALF_TWIST_CANDIDATE");

const double = engine.run({ codonKey: "F4", mode: "HALF_TWIST_CANDIDATE", loops: 2 });
assert.ok(double.stations.every((s) => s.orientation_sign === 1));
assert.equal(double.classification, "ORIENTABLE_CONTROL_RETURN");
assert.throws(() => engine.run({ codonKey: "F5" }), /unknown CODON/);

const html = fs.readFileSync("./A0_ROOTROOM_CODON_ORIENTATION_RETURN.html", "utf8");
const ui = fs.readFileSync("./a0-rootroom-codon-orientation-return-ui.js", "utf8");
const css = fs.readFileSync("./a0-rootroom-codon-orientation-return.css", "utf8");
assert.match(html, /id="codonTraveler"/);
assert.match(html, /id="animateButton"/);
assert.match(html, /id="animationProgress"/);
assert.match(html, /θ1\+θ2<\/span>Load/);
assert.match(html, /id="loadBridge"/);
assert.match(html, /id="directionGuide"/);
assert.match(html, /id="smackPulse"/);
assert.match(html, /5–3–7 Ghost-Grid view/);
assert.match(ui, /getPointAtLength/);
assert.match(ui, /requestAnimationFrame\(animationStep\)/);
assert.match(ui, /visits = loops \* receipt\.gate_count/);
assert.match(ui, /θ1 \+ θ2 · LOAD/);
assert.match(ui, /isCoupledLoad = selected === 1 && i === 0/);
assert.match(ui, /stage\.dataset\.phase = phase\.key/);
assert.match(ui, /θ4 · SMACK/);
assert.match(ui, /θ5 · PUSH-OFF/);
assert.match(css, /data-phase="load"/);
assert.match(css, /data-phase="direction"/);
assert.match(css, /data-phase="smack"/);
assert.match(css, /data-phase="push-off"/);
assert.match(css, /prefers-reduced-motion:reduce/);

console.log("PASS a0-rootroom-codon-orientation-return · 4 source triplets · 5 semantic phases · coupled load/direction/SMACK/push-off · 1/2-loop return");
