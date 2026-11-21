const fs = require("node:fs");
const path = require("node:path");

const file = path.join(__dirname, "A0_RESEARCH_DESK.html");
const html = fs.readFileSync(file, "utf8");
let passed = 0;

function check(condition, message) {
  if (!condition) throw new Error(message);
  passed += 1;
}

const main = html.indexOf("<main>");
const hero = html.indexOf('<section class="hero" id="top">');
const snapshot = html.indexOf('<div class="snapshot">');
const archive = html.indexOf('<details class="engineering-return-archive"');
const firstReturn = html.indexOf('id="bench-tool-catalog-20261021"');
const archiveEnd = html.indexOf("</details>", archive);
const resultsTour = html.indexOf('id="results-tour"');

check(main !== -1, "main missing");
check(hero > main, "Science Desk hero must follow main");
check(snapshot > hero, "snapshot must follow the Science Desk hero");
check(archive > snapshot, "Engineering Returns archive must follow the snapshot");
check(firstReturn > archive, "engineering entries must live inside the archive");
check(archiveEnd > firstReturn, "Engineering Returns archive does not close after its entries");
check(resultsTour > archiveEnd, "normal Desk content must follow the closed Engineering Returns archive");
check((html.match(/id="top"/g) || []).length === 1, "Science Desk must contain exactly one top anchor");
check(!html.includes('body[data-desk-view]:not([data-desk-view="overview"]) .hero{display:none}'), "filtered Desk views must keep the visible top anchor and hero");
check(html.includes('history.scrollRestoration = "manual"'), "the #top Desk entry must override browser scroll restoration");
check(html.includes('addEventListener("pageshow", () => requestAnimationFrame(restoreDeskTop))'), "restored in-app browser pages must return to the declared #top anchor");
check(!/<details class="engineering-return-archive"[^>]*\sopen(?:\s|=|>)/.test(html), "Engineering Returns must be collapsed by default");
check(/<details class="engineering-return-archive"[^>]*\shidden(?:\s|=|>)/.test(html), "Engineering Returns must stay hidden until moved to Protocols");

[
  "bench-tool-catalog-20261021",
  "bench-overview-20261021",
  "bench-integration-20261021",
  "three-domain-blue-body-return-20261021",
  "orbit-grid-joints-return-20261021",
].forEach((id) => {
  const position = html.indexOf(`id="${id}"`);
  check(position > archive && position < archiveEnd, `${id} must remain inside the Engineering Returns archive`);
});

check(html.includes('details.reader-dossier, details.engineering-return-archive, details.desk-cabinet'), "collapsed-target reveal must include Engineering Returns and the Desk cabinet");
check(html.includes('window.addEventListener("hashchange", revealCollapsedTarget)'), "hash navigation must reveal collapsed targets");
check(html.includes('document.querySelector("#protocols .spread")'), "Engineering Returns must target the Protocols area");
check(html.includes("protocolArea.append(engineeringReturns)"), "Engineering Returns must be moved into Protocols");
check(html.includes("engineeringReturns.hidden = false"), "Engineering Returns must become visible only after protocol placement");
check(html.includes('href="#engineering-returns-20261021"'), "hero must expose the protocol archive");
check(!html.includes('id="field-notes-entry"'), "The curated Field Notes reader entry must live in A0 Science, not the Desk hero");
check(!html.includes('id="field-note-ii-entry"'), "The separate Field Note II draft entry must not live in the Desk hero");
check(html.includes('id="a0-owner-handbook-notes-binding-20261105"'), "The Desk must retain the Field Notes provenance and claim-boundary record");
check(html.includes("Die A0 Field Notes sind die fortschreibbaren NEXAH-Handbuchnotizen des Human Owners."), "The Desk must retain its historical Field Notes classification");
check(html.includes('id="fam002-a0-orientation-intake-handoff-20261028"'), "Current FAM-002 intake must remain preserved as its handoff section");
check(html.includes('FAM_002_HTML_LATEST_INSTRUMENTS_2026-10-28.html'), "FAM-002 handoff must open the current instrument wall");
check(html.includes('FAM_002_A0_INTAKE_GALLERY_2026-10-28.html'), "FAM-002 handoff must open the preserved gallery");
check(!html.includes('link.href="http://127.0.0.1:8878/FAM_002_HTML_LATEST_INSTRUMENTS_2026-10-28.html"'), "Current Desk must not bypass the research room for a single instrument wall");

const cabinet = html.indexOf('<details class="desk-cabinet" id="desk-cabinet">');
check(cabinet > snapshot && cabinet < archive, "expandable Desk cabinet must follow the status snapshot");
check((html.match(/class="desk-drawer"/g) || []).length === 5, "Desk cabinet must expose five existing work compartments");
check((html.match(/class="desk-visibility-label/g) || []).length === 5, "all Desk compartments need visibility labels");
check(html.includes("Meine Fächer auf einen Blick"), "Desk cabinet needs a readable overview label");
check(html.includes('href="#desk-cabinet"'), "hero or top navigation must open the Desk cabinet");
check(html.includes("← Mission Control"), "Desk must return visibly to private Mission Control");
check(html.includes("kein öffentlicher A0-Einstieg"), "Desk must state that it is not the public A0 entrance");
check(!html.includes("/Users/tho2020"), "Desk frontstage must not expose absolute user paths");
check((html.match(/Lokaler Quellenmarker/g) || []).length === 3, "three local architecture visuals need neutral source markers");
check(html.includes("Inventar der 25 empfangenen Visuals anzeigen"), "visual inventory must remain readable without private links");
[
  "nexah-a0-context",
  "a0-work-index",
  "tours",
  "reader",
  "current-work",
  "backlog",
  "log",
  "results-tour",
  "tests",
  "scientific-position",
  "sources",
  "builder",
  "protocols",
  "engineering-returns-20261021",
].forEach((id) => check(html.includes(`id="${id}"`), `Desk cabinet target ${id} must exist`));

console.log(`PASS ${passed} · Science Desk starts with its hero; five drawers expose the existing work areas.`);
