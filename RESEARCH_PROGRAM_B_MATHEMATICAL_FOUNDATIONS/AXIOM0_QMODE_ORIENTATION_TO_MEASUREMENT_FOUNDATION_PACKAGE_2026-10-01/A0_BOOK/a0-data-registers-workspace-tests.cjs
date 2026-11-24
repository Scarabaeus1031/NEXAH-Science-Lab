const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "A0_DATA_AND_REGISTERS.html"), "utf8");
const builderDesk = fs.readFileSync(path.resolve(__dirname, "../../../../../10 NEXAH CORE/NEXAH/BUILDER/B0_BUILDER_DECK/a0-tools.html"), "utf8");

assert.doesNotMatch(html, /<nav class="a0-desk-trinity/);
assert.match(html, /a0-context-navigation\.js/);
assert.match(html, /<title>NEXAH · A0 NSNavigator<\/title>/);
assert.match(html, /id="nsnDoorTitle">NEXAH Science Navigator/);
assert.match(html, /SCIENCE_LAB\/NAVIGATION\/APP\/index\.html#home/);
assert.match(html, /SCIENCE_LAB\/NAVIGATION\/APP\/index\.html#a0-orientation-evidence/);
assert.match(html, /id="bindings"/);
for (const label of ["THE MACHINA", "Produktionskette", "Entdecken &amp; verbinden", "Bestand &amp; Cuts"]) assert.match(html, new RegExp(label));
assert.match(html, /Navigation ist keine Admission, Aktivierung, wissenschaftliche Validierung oder Publikation/);
assert.match(html, /<main id="top">/);
assert.match(html, /id="mastermap"/);
assert.match(html, /Der Zusammenhang vor dem Detail/);
assert.equal((html.match(/<article class="master-zone"/g) || []).length, 6);
for (const stage of ["SOURCE", "CARRIER", "OPERATOR", "VIEW", "RETURN", "EVIDENCE"]) {
  assert.match(html, new RegExp(`<span>${stage}</span>`));
}
for (const route of [
  "A0_FIELDS_AND_JOINTS_ATLAS.html#joint-workspace",
  "A0_NUMBERMAGICK_GRID_RESEARCH.html#prime-master-builds",
  "A0_BLUE_PINK_DODECA_CELL_RETURN.html#module-entry",
  "SCIENCE_LAB/NAVIGATION/APP/index.html#lab-register",
  "SCIENCE_LAB/NAVIGATION/APP/index.html#a0-orientation-evidence",
]) assert.ok(html.includes(route), `mastermap route missing: ${route}`);
for (const state of ["EXACT", "BOUNDED", "OPEN", "PROVENANCE"]) assert.match(html, new RegExp(`<span>${state}</span>`));
assert.match(html, /Δ GRAPH = 0 · Δ STUDIES = 0 · Δ CLAIMS = 0/);
assert.match(html, /history\.scrollRestoration="manual"/);
assert.match(html, /\["wheel","touchstart","pointerdown","keydown"\]/);
assert.match(html, /document\.querySelectorAll\("\.register-window iframe"\)/);
assert.match(html, /frame\.addEventListener\("load",\(\)=>requestAnimationFrame\(restoreDataTop\),\{once:true\}\)/);
assert.match(html, /addEventListener\("load",\(\)=>requestAnimationFrame\(\(\)=>requestAnimationFrame\(restoreDataTop\)\),\{once:true\}\)/);
assert.match(html, /addEventListener\("pageshow",\(\)=>requestAnimationFrame\(restoreDataTop\)\)/);
assert.match(html, /addEventListener\("hashchange",\(\)=>\{if\(location\.hash==="#top"\)requestAnimationFrame\(restoreDataTop\)\}\)/);
assert.match(html, /Fünf Registerfamilien · fünf Zuständigkeiten/);
assert.doesNotMatch(html, /<h3>Mission Control · Current<\/h3>/);
assert.doesNotMatch(html, /Vorschau Mission Control/);
assert.match(html, /<h3>Ecosystem Source Field<\/h3>/);
assert.match(html, /src="https:\/\/nexah\.de\/library\/"/);
assert.equal((html.match(/<article class="family"/g) || []).length, 5);
assert.equal((html.match(/class="register-question"/g) || []).length, 5);
assert.match(html, /Beantwortet die Frage/);
assert.match(html, /<h3>Builder Register Stack<\/h3>/);
assert.match(html, /Tool Inventory · gepflegter Werkzeugbestand/);
assert.match(html, /Toolbox · What we can build/);
assert.match(html, /Builder Desk<\/a>/);
assert.match(html, /id="master-build-consolidation"/);
assert.match(html, /Master-Builds im Zusammenhang lesen/);
for (const route of [
  "A0_NUMBERMAGICK_GRID_RESEARCH.html#prime-master-builds",
  "A0_BLUE_PINK_DODECA_CELL_RETURN.html#module-entry",
  "A0_IHARA_HASHIMOTO_CYCLE_BRIDGE.html",
  "A0_AXIS08_FOLD_RETURN_SEQUENCER.html",
]) assert.ok(html.includes(route), `master-build route missing: ${route}`);
assert.match(html, /0 neue Identitäten · 0 Relationen · 0 Aliase · 0 Studies · 0 Findings/);
assert.match(html, /PARTIAL SOURCE CUSTODY/);

assert.match(builderDesk, /id="register-stack"/);
assert.match(builderDesk, /MAINTAINED SOURCE REGISTER/);
assert.match(builderDesk, /Inventory = gepflegter Bestand/);
assert.match(builderDesk, /Toolbox = Eignung/);
assert.match(builderDesk, /A0_DATA_AND_REGISTERS\.html#assets-publications/);

console.log("A0 data/registers workspace navigation tests passed.");
