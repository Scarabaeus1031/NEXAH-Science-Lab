const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const model = require("./a0-machina-splinter-knob.js");
const html = fs.readFileSync(path.join(__dirname, "A0_MACHINA_COCKPIT.html"), "utf8");
const source = fs.readFileSync(path.join(__dirname, "downloads/NEXAH_Splinter_Geometrie_Offline_2026-10-27.html"), "utf8");
let checks = 0;
function ok(value, message) { assert.ok(value, message); checks += 1; }
for (const token of ["splinterChordBay", "Sehnen‑Knob", "c=2q", "δ INVARIANT", "ORIENTATION ONLY", "A0‑BL‑058 / Pulse", "Source-lokaler Kreisabschnitt ≠ A0‑BL‑035"]) ok(html.includes(token), `missing ${token}`);
for (const token of ["data-skb-q", "data-skb-angle", "data-skb-frame", "a0-machina-splinter-knob.js", "a0-machina-splinter-knob.css"]) ok(html.includes(token), `missing control ${token}`);
for (const token of ["id=\"sm-k\"", "id=\"sm-angle\"", "δ = 1 − √(1 − q²)", "Die Winkelwahl dreht dieselbe Figur"]) ok(source.includes(token), `source contract ${token}`);
ok(model.Q_STAGES.length === 4, "four frozen q stages");
ok(model.ANGLES.length === 3, "three frozen angle views");
for (const stage of model.Q_STAGES) {
  ok(Math.abs(stage.chord - 2 * stage.q) < 1e-15, `chord exact for q=${stage.q}`);
  const d = model.delta(stage.q);
  ok(Math.abs(d - (1 - Math.sqrt(1 - stage.q * stage.q))) < 1e-15, `stable delta identity q=${stage.q}`);
}
ok(Math.abs(model.delta(0.2) - 0.0202041028867288) < 1e-15, "q=.2 reference delta");
console.log(`a0-machina-splinter-knob: ${checks}/${checks} PASS`);
