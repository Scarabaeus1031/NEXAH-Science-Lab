const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const html = fs.readFileSync(path.join(__dirname, "A0_RESEARCH_DESK.html"), "utf8");
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks += 1; };

check(html.includes('data-desk-fold-action="open"'), "current view can be expanded");
check(html.includes('data-desk-fold-action="close"'), "current view can be collapsed");
check(html.includes('className = "desk-section-fold"'), "top-level Desk records receive a fold shell");
check(html.includes('fold.open = root.id === "desk-control"'), "only the primary control record opens by default");
check(html.includes('details.desk-section-fold'), "deep links know the generated fold shell");
check(html.includes('dossiers.forEach(dossier => { dossier.open = true; })'), "deep links open every containing dossier");
check(html.includes('shell.hidden = root.dataset.deskZone !== view'), "view filtering moves to the fold shell");
check(html.includes('Desk · Arbeitsgedächtnis'), "Desk role is explicit");
check(html.includes('Mathfield · formale Verdichtung'), "Mathfield role is explicit");
check(html.includes('NEXAH Core · Quellautorität'), "Core role is explicit");
check(html.includes('Science · freigegebene Projektion'), "public Science role is explicit");
check(!html.includes('id="mathfield-core-compression"'), "compression does not create a new research identity");
check(html.includes('id="inquiry-ledger"'), "I-26 through I-45 have one explanatory rubric");
check(html.includes('Desk-Akten · Question · Test · Gap · Return'), "record grammar is explained before details");
check(html.includes('<th>Akte</th><th>Gegenstand</th><th>Was liegt vor?</th><th>Reifegrad</th><th>Für wen / warum?</th><th>Entscheidung / nächstes Gate</th>'), "overview table separates subject, evidence type, maturity, audience and action");
check(html.includes('Eine Lücke ist noch kein To-do'), "open gaps are not silently promoted to tasks");
check(html.includes('Nur Zeilen mit einem ausdrücklich genannten nächsten Schritt und Owner-Priorität werden Arbeit'), "task threshold is explicit");
check(html.includes('I steht hier lokal für Investigation / Intake'), "the local I-record shorthand is explained");
check(html.includes('Die I‑Nummer ist keine Study-ID, keine Navigator-Identität, kein Finding und kein Beweis'), "I-records are distinguished from source and evidence identities");
check(html.includes('Beispiel I‑26 · Was ist die Laterne?'), "the lantern is explained as a worked example");
check(html.includes('Die Laterne ist nicht als vollständiges A0-System fertig integriert'), "the lantern integration gap is explicit");
check(html.includes('Für wen / warum?'), "the overview states audience and intention");
check(html.includes('setupInquiryLedger();'), "overview rows are assembled from the existing detail records");
check((html.match(/^\s+"I‑(?:2[6-9]|3\d|4[0-5])(?:[B-I])?": \[/gm) || []).length === 28, "all 28 existing I-26 through I-45I records are assessed once");
check(html.includes('root.id === "inquiry-ledger"'), "the explanatory rubric opens by default in the research view");
check(!html.includes('const history = document.createElement("div")'), "the global History API is not shadowed before fold setup");
check(html.includes('const historyBlock = document.createElement("div")'), "the backlog history block uses a non-conflicting binding");
check(html.includes('row.append(recordCell, subjectCell, kindCell, evaluationCell, intentCell, actionCell)'), "each I-record row includes audience and intent");
check(html.includes('00_OVERVIEW/SCIENCE_STATUS_REPORT.html#top'), "A0 Desk links directly to the Mission Control cross-desk status");
check(html.includes('erzeugt daraus den wissenschaftlichen Return'), "A0 Desk declares that it produces the scientific return");
check(html.includes('Mission Control empfängt ihn'), "A0 Desk declares Mission Control as the receiving integrator");
const guideRecords = [...html.matchAll(/^\s+"(I‑(?:2[6-9]|3\d|4[0-5])(?:[B-I])?)": \[/gm)].map(match => match[1]);
const detailRecords = [...html.matchAll(/<div class="no">(I‑(?:2[6-9]|3\d|4[0-5])(?:[B-I])?)<\/div>/g)].map(match => match[1]);
check(new Set(guideRecords).size === guideRecords.length, "the overview assesses each I-record only once");
check(JSON.stringify(guideRecords) === JSON.stringify(detailRecords), "the overview order and membership match the actual I-record details");

const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);
check(scripts.length > 0, "inline Desk runtime exists");
scripts.forEach(source => new Function(source));
checks += scripts.length;

console.log(JSON.stringify({
  status: "PASS",
  checks,
  scope: "Desk progressive folding, deep-link reveal and Desk/Mathfield/Core/Science compression boundary"
}, null, 2));
