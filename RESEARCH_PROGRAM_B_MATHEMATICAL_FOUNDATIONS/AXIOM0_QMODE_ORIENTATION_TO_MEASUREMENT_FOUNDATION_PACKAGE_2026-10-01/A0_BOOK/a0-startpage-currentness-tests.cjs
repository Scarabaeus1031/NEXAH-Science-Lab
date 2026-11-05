const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

for (const publicHome of [
  "https://nexah.de/",
  "https://nexahedron.com/",
  "https://www.scarabaeus1033.net/"
]) {
  assert.ok(html.includes(`href="${publicHome}"`), `missing live public home: ${publicHome}`);
}

for (const marker of [
  "Owner-angenommener lokaler Freeze",
  "23 / 23",
  "62 / 10",
  "SCC-003-R1",
  "MAKE · INTERNAL",
  "UNDERSTAND · LIVE"
]) {
  assert.ok(html.includes(marker), `missing start-page currentness marker: ${marker}`);
}

assert.match(html, /<details class="portal-depth">[\s\S]*Bestand &amp; Vertiefung/);
assert.equal((html.match(/<section class="a0-path a0-path--/g) || []).length, 3);
for (const marker of [
  "A0 Wegweiser · ein Pfad · drei Stationen",
  "a0-path--human",
  "a0-path--science",
  "a0-path--builder",
  "2 weitere Einstiege",
  "5 weitere Vertiefungen",
  "4 weitere Instrumente"
]) {
  assert.ok(html.includes(marker), `missing reduced A0 path marker: ${marker}`);
}
for (const target of [
  "#introduction",
  "A0_LIVING_BLUEPRINT.html#utg-map",
  "LAB_ORIENTATION_MACHINE.html",
  "A0_SCC_003_PASCAL_PENTAGON_PAPER.html",
  "A0_MATHEMATICAL_JOINTS.html",
  "A0_PASCAL_PENTAGON_OPERATOR_JOINTS.html",
  "A0_RETURN_WITHOUT_IDENTITY_PAPER.html",
  "A0_NEXAH_FAMILY_METHOD_WHITE_PAPER.html",
  "A0_SCIENTIFIC_POSITION_REPORT.html",
  "A0_LIVING_BLUEPRINT.html#integration-crosswalk",
  "A0_TESSAREC_BLUE_BODY_LAB.html#pentagon-body-player",
  "A0_BLUE_PINK_DODECA_CELL_RETURN.html#cells",
  "A0_GAME_4_LIFE_PLUS_1.html#blue-body-transfer",
  "A0_AXIAL_CARRIER_ADAPTER_SUITE.html"
]) {
  assert.ok(html.includes(`href="${target}"`), `missing A0 path target: ${target}`);
}
assert.doesNotMatch(
  html,
  /Aktueller Human-Stagingstand|Public Science Staging|bedienen und weiterbauen|Currentness 31\. Oktober 2026|a0-guide-grid|a0-guide-card/
);

console.log(JSON.stringify({
  status: "PASS",
  checks: 33,
  scope: "A0 start-page currentness, live houses, folded depth and reduced three-station path"
}, null, 2));
