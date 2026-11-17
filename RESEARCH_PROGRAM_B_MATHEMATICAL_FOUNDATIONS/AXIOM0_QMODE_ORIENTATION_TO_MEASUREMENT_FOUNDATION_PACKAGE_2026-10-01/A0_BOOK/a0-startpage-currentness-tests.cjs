const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const activeHtml = html.replace(/<template\b[\s\S]*?<\/template>/g, "");
const publicPreview = activeHtml.match(/<section class="portal-home"[\s\S]*?<\/section>/)?.[0] || "";
const navigation = fs.readFileSync(path.join(__dirname, "a0-context-navigation.js"), "utf8");

for (const publicHome of [
  "https://nexah.de/",
  "https://nexahedron.com/",
  "https://www.scarabaeus1033.net/"
]) {
  assert.ok(navigation.includes(publicHome), `shared header is missing public home: ${publicHome}`);
}

for (const marker of [
  "id=\"a0-home\"",
  "id=\"field-notes-entrance\"",
  "id=\"finden\"",
  "id=\"portal\"",
  "id=\"wegweiser\"",
  "id=\"research-now\"",
]) {
  assert.ok(activeHtml.includes(marker), `missing lean start-page marker: ${marker}`);
}

assert.match(html, /<template id="a0-duplicate-entry-archive"[^>]+superseded-by-reading-gate-guide-and-research-now/);
assert.doesNotMatch(activeHtml, /class="entry-switch"|class="nexah-threshold"/);
assert.match(activeHtml, /class="portal-home"[^>]+id="portal"/);
assert.equal((activeHtml.match(/<article class="portal-house /g) || []).length, 3);
assert.doesNotMatch(publicPreview, /portal-currentness|portal-depth|portal-hatches|portal-house--builder/);
assert.equal((activeHtml.match(/<section class="a0-path a0-path--/g) || []).length, 3);
for (const marker of [
  "A0 Wegweiser · ein Pfad · drei Stationen",
  "a0-path--human",
  "a0-path--science",
  "a0-path--builder",
  "3 weitere Einstiege",
  "6 weitere Vertiefungen",
  "5 weitere Instrumente"
]) {
  assert.ok(activeHtml.includes(marker), `missing reduced A0 path marker: ${marker}`);
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
  "A0_AXIAL_CARRIER_ADAPTER_SUITE.html"
]) {
  assert.ok(activeHtml.includes(`href="${target}"`), `missing A0 path target: ${target}`);
}
assert.doesNotMatch(
  html,
  /Aktueller Human-Stagingstand|Public Science Staging|bedienen und weiterbauen|Currentness 31\. Oktober 2026|a0-guide-grid|a0-guide-card/
);

console.log(JSON.stringify({
  status: "PASS",
  checks: 34,
  scope: "lean A0 start page, compact public-site preview, canonical reading path and reduced three-station route"
}, null, 2));
