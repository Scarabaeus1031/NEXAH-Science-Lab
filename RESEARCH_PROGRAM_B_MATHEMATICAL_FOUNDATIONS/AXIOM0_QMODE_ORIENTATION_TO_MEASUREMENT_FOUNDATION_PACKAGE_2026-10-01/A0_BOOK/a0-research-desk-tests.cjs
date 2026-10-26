const baseAssert = require('node:assert/strict');
let assertions = 0;
const assert = new Proxy(baseAssert, { get(target, key) { const value = target[key]; return typeof value === 'function' ? (...args) => { assertions++; return value(...args); } : value; } });
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const html = fs.readFileSync(path.join(__dirname, 'A0_RESEARCH_DESK.html'), 'utf8');
const position = fs.readFileSync(path.join(__dirname, 'A0_SCIENTIFIC_POSITION_REPORT.html'), 'utf8');
const hero = html.match(/<section class="hero"[\s\S]*?<\/section>/)?.[0] || '';
const topNav = html.match(/<header class="top">[\s\S]*?<\/header>/)?.[0] || '';
const currentWork = html.match(/<section class="desk-current"[\s\S]*?<section class="spread" id="method">/)?.[0] || '';
const inlineScript = html.match(/<script>\s*([\s\S]*?)\s*<\/script>/)?.[1] || '';

const intent = html.match(/<section class="spread" id="nexah-leitabsicht"[\s\S]*?<\/section>/)?.[0] || '';
assert.match(intent, /Kuratieren und Gestalten/);
assert.match(intent, /erzählerische und untersuchende Räume/);
assert.match(intent, /keine separate NEXAH-Theorie/);
const intentSource = intent.match(/href="([^"]+NEXAH_FOUNDATIONAL_DESCRIPTION\.md)#kuratieren-und-gestalten"/)?.[1];
assert.ok(intentSource, 'Science mirror returns to shared self-description');
const intentSourceText = fs.readFileSync(path.resolve(__dirname, decodeURIComponent(intentSource)), 'utf8');
assert.match(intentSourceText, /id="kuratieren-und-gestalten"/);
assert.match(intentSourceText, /Leseanweisung für die weitere Arbeit/);

assert.match(hero, /A0<br><span>Science Desk<\/span>/);
assert.match(hero, /A0 entscheidet hier/);
assert.match(hero, /OCB öffnen/);
assert.match(hero, /operative Science-Arbeitsfläche/);
assert.match(hero, /Aufgaben, Prüfstände/);
assert.match(hero, /Mission Control empfängt ihn, verbindet ihn mit Builder- und Portfolio-Status/);
assert.doesNotMatch(hero, /data-results-tour-open|Alle A0-Touren|Storyboard 0\.3/,'Reader tours belong to collapsed editorial reference, not the operational hero');
assert.match(html, /Arbeitsreferenz · Reader-Quellen/);
assert.match(html, /href="A0_SCIENCE.html#contributions"/);
assert.match(hero, /Meine Fächer öffnen/);
assert.match(hero, /id="mission-control-return"/);
assert.match(hero, /Owner Return · Auftrag &amp; Strategy/);
assert.match(hero, /Protokoll · Engineering-Returns/);
assert.doesNotMatch(hero, /Tessarec Validation/);
assert.doesNotMatch(hero, /A0 Science Einstieg/);
assert.doesNotMatch(hero, /Achievements ansehen/);
assert.doesNotMatch(hero, />Arbeitsstand<|href="#flagships"/);
assert.match(topNav, /INTERNAL_NAVIGATOR\/index\.html#a0-private-desk/);
assert.match(topNav, /A0_SCIENCE\.html#top/);
assert.match(topNav, /href="#top">Desk/);
assert.match(topNav, /A0_ORIENTATION_CONTROLLER_BENCH\.html/);
assert.match(topNav, /A0_ASSEMBLY_ATLAS\.html#map/);
assert.match(topNav, /B0_BUILDER_DECK\/a0-tools\.html#builder-log/);
assert.doesNotMatch(topNav, /Laboratory/);
assert.doesNotMatch(topNav, /#method/);
assert.match(html, /id="workbench"/);
assert.match(html, /id="coupled-channel-boundary-return-20261023"/);
assert.match(html, /A0_MATHEMATICAL_JOINTS\.html#zipper-four-seam-application/);
assert.match(html, /SOURCE → VIEW → CONTROL → APERTURE → RETURN/);
assert.match(html, /PULSE edge → Touch Point → Shutter → Transfer → Return/);
assert.match(html, /A0-SVR-01/);
assert.match(html, /id="a0-svr-01-governance-return"/);
assert.match(html, /SCIENCE DESK → SCIENCE NAVIGATOR → MISSION CONTROL/);
assert.match(html, /CURRENT\/NAVIGATOR_CONTROL\.md/);
assert.match(html, /kein Feedback, keine gemeinsame numerische Uhr/);
assert.match(html, /keine Vertiefung von Mandelbrot\/Julia ohne separaten Owner-autorisierten Run Contract/);
assert.match(html, /id="achievements-reader"/);
assert.match(html, /id="scientific-position"/);
assert.match(html, /Wo NEXAH wissenschaftlich steht/);
assert.match(html, /Assessment 13\.10\. \+ synchronized status 24\.10\./);
assert.match(html, /A0_SCIENTIFIC_POSITION_REPORT\.html/);
assert.match(html, /00_OVERVIEW\/ACHIEVEMENTS\.md/);
assert.match(html, /Papers sagen, was behauptet wird/);
assert.equal((html.match(/<details class="family-tools"/g) || []).length, 7);
assert.match(html, /F1–F7 sind funktionale Lesefamilien, keine Naturklassen/);
assert.match(html, /\["method", "lenses", "achievements", "flagships", "fields", "foundation", "findings"\]/);
assert.match(html, /backlogSection\.before\(workbench\)/);
assert.match(html, /Active research cycles/);
assert.match(html, /Structure freeze/);
assert.match(html, /not authorized/i);
assert.match(currentWork, /Aktueller Arbeitsfaden/);
assert.equal((currentWork.match(/<article class="current-work-card/g) || []).length, 12);
assert.match(currentWork, /Orientation Controller Bench/);
assert.match(currentWork, /A0-BL-054/);
assert.match(currentWork, /A0-BL-025/);
assert.match(currentWork, /A0-BL-023 \/ 051/);
assert.match(currentWork, /A0-BL-022/);
assert.match(currentWork, /A0-BL-046/);
assert.match(currentWork, /UNDERDETERMINED|underdetermined(?: coordinate grammar)?/);
assert.match(currentWork, /A0-BL-047/);
assert.match(currentWork, /closed typed family/);
assert.match(currentWork, /A0-BL-048/);
assert.match(currentWork, /closed selectivity fail/);
assert.match(currentWork, /228\/540/);
assert.match(currentWork, /A0-BL-049/);
assert.match(currentWork, /typed joint Return/);
assert.match(currentWork, /9000\/9000/);
assert.match(currentWork, /A0-BL-055/);
assert.match(currentWork, /Cross-Carrier Return Economy/);
assert.match(currentWork, /1\/3/);
assert.match(currentWork, /0\.464286/);
assert.match(currentWork, /Owner accepted · closed mixed result/);
assert.match(currentWork, /LABREPORT_A0_BL_055_CROSS_CARRIER_RETURN_ECONOMY_001\.md/);
assert.match(html, /110_A0_EXPERIMENT_LEARNING_MAP_2026-10-18\.md/);
assert.match(currentWork, /A0_ORIENTATION_CONTROLLER_BENCH\.html#returnEconomyDemonstrator/);
assert.match(currentWork, /OCB <code>v0\.17\.0<\/code>/);
assert.match(currentWork, /zwanzig Stationen/);
assert.match(currentWork, /A0-BL-036 Moving Aperture Window/);
assert.match(currentWork, /Zehn gekoppelte Arbeitsfenster/);
assert.match(currentWork, /Aperture Invariance|Observatory/);
assert.match(currentWork, /Session Ledger/);
assert.match(currentWork, /Owner accepted · closed typed joint Return/);
assert.match(currentWork, /LABREPORT_A0_BL_049_IOTA_THOOTH_OPERATOR_TYPING_001\.md/);
assert.match(html, /108_A0_EXPERIMENT_PORTFOLIO_REVIEW_2026-10-18\.md/);
assert.match(currentWork, /Three Lissajous · 3 \+ 1 Seam Mode/);
assert.match(currentWork, /Sie bedeutet nicht <code>ACTIVE<\/code>/);
assert.match(currentWork, /Lab-Zähler bleibt bei <code>0<\/code>/);
assert.match(html, /id="lissajous-seam-mode-return"/);
assert.match(html, /Drei Projektionen \+ ein Seam-Ereignis/);
assert.match(html, /D=0 ⇔ s₁=s₂=s₃/);
assert.match(html, /NEAR_SEAM_NOT_EXACT/);
assert.match(html, /105_A0_THREE_LISSAJOUS_3_PLUS_1_SEAM_MODE_SCIENCE_DESK_RETURN_2026-10-15\.md/);
assert.match(html, /RETURN_2026-10-15_A0_THREE_LISSAJOUS_3_PLUS_1_SEAM_MODE\.md/);
assert.match(html, /keine neue Navigator-Identität oder Relation/);
assert.match(position, /NEXAH untersucht <strong>Orientierung<\/strong>/);
assert.match(position, /Die stärkste Erkenntnis ist eine Disziplin des Returns/);
assert.match(position, /Die wichtigsten Vergleichsfelder – in normaler Sprache/);
assert.equal((position.match(/<div class="field-summary">[\s\S]*?<\/div><ul class="refs">/)?.[0].match(/<article>/g) || []).length, 4);
assert.doesNotThrow(() => new Function(inlineScript));

const engineering = html.match(/<section class="spread" id="engineering-20261017"[\s\S]*?<\/section>/)?.[0] || '';
assert.match(engineering, /Prüfstand/);
assert.match(engineering, /1160 lokale Checks/);
assert.match(engineering, /sechs|Sechs/);
assert.match(engineering, /Emergenz-Human-Bindung/);
assert.match(engineering, /16 bestehenden/);
assert.match(position, /id="engineering-currentness"/);
assert.match(position, /keine neue Topologie/);
assert.match(currentWork, /Technisch gebaut · visuell offen/);
assert.match(html, /A0_ORIENTATION_CONTROLLER_BENCH\.html#orientationBench/);
assert.doesNotMatch(currentWork, /jüngster Return/);
const record = JSON.parse(fs.readFileSync(path.join(__dirname, 'assets/a0-storyboard-human-crosswalk-engineering-return-v1.json'), 'utf8'));
assert.equal(record.primary_total, 1160);
assert.equal(record.primary_suites.reduce((sum, suite) => sum + suite.checks, 0), record.primary_total);
assert.equal(record.sources.length, 12);
const sourceCurrentness = record.sources.map(source => {
  assert.match(source.sha256, /^[0-9a-f]{64}$/, 'historical engineering receipt: ' + source.path);
  const hash = crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname, source.path))).digest('hex');
  return { path: source.path, current: hash === source.sha256 };
});
assert.deepEqual(sourceCurrentness.filter(source => !source.current).map(source => source.path), [
  'a0-theory-storyboard.js',
  'assets/a0-nexah-aperture-journey-v1.js',
  'A0_THEORY_STORYBOARD.html',
  'A0_NEXAH_APERTURE_JOURNEY.html',
  'A0_LIVING_BLUEPRINT.html',
  'a0-human-crosswalk-tests.cjs',
  'a0-nexah-aperture-journey-tests.cjs',
  'a0-living-blueprint-tests.cjs'
], 'historical receipt remains immutable while later source evolution is explicit');
assert.equal(sourceCurrentness.filter(source => source.current).length, 4, 'four historical inputs remain byte-current; later source evolution is documented separately');
const readingReturn=JSON.parse(fs.readFileSync(path.join(__dirname,'results/a0-explanation-reading-path-2026-10-19.json'),'utf8'));
const updatedStory=readingReturn.sources.find(s=>s.ecosystem_path.endsWith('/a0-theory-storyboard.js'));
assert.equal(updatedStory.sha256,crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'a0-theory-storyboard.js'))).digest('hex'),'later narrative edit has its own source receipt, not a rewritten historical receipt');
assert.equal(record.authority.new_study, false);
assert.equal(record.authority.claim_promotion, false);
assert.equal(record.authority.live_browser_pass, false);
const workspace = fs.readFileSync(path.join(__dirname, '../32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md'), 'utf8');
const rows = workspace.split('\n').filter(line => line.startsWith('| `F-A0-'));
assert.ok(rows.length >= 17, 'historical sixteen-row ledger plus additive findings retained');
assert.equal(crypto.createHash('sha256').update(rows.slice(0, 16).join('\n')).digest('hex'), record.formal_findings.rows_sha256, 'original formal ledger preserved byte-for-byte before additive F-A0-25');
const findingIds = rows.map(row => row.match(/F-A0-\d+/)?.[0]);
assert.equal(new Set(findingIds).size, rows.length, 'later additive findings retain unique IDs');
const economyFinding = rows.find(row => /F-A0-25/.test(row)) || '';
assert.match(economyFinding, /F-A0-25/);
assert.match(economyFinding, /ECONOMY_GENERALIZATION_FAIL/);
assert.match(workspace, /## Engineering observations — 2026-10-17/);
const protocol = fs.readFileSync(path.join(__dirname, '../22_A0_FORSCHUNGSPROTOKOLL_BUCH_UND_RAHMEN_2026-10-10.md'), 'utf8');
assert.match(protocol, /id="engineering-return-20261017"/);
assert.match(protocol, /NO_NEW_F_A0/);
assert.match(intentSourceText, /Version:\*\* `1.5`/);
assert.match(intentSourceText, /Erklärpfad/);
assert.equal(record.preflight.global_currentness_hash_mismatches, 6);
assert.equal(record.preflight.orientation_binder_hash_mismatches, 8);

const atlasReturn = html.match(/<section class="spread" id="three-domain-blue-body-return-20261021"[\s\S]*?<\/section>/)?.[0] || '';
assert.match(html, /id="three-domain-blue-body-return-20261021"/);
assert.match(atlasReturn, /neun gleichzeitige Ablesungen/);
assert.equal((atlasReturn.match(/<tbody>[\s\S]*?<\/tbody>/)?.[0].match(/<tr>/g) || []).length, 9);
for (const label of ['Reaction–Diffusion', 'Conway LIFE', 'Spin Field', 'Common Point', 'Euler', 'Fibonacci', 'Ihara', 'k·NEG / Q°', 'Blue Body · 48']) assert.match(atlasReturn, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
assert.match(atlasReturn, /Koordination heterogener Readouts/);
assert.match(atlasReturn, /Visuelle Browser-\/Mobile- und unabhängige Human-Utility-Abnahme bleiben offen/);
assert.match(atlasReturn, /MOD:NUMBER_VIEW_SUITE/);
assert.match(atlasReturn, /ART:A0:MATHEMATICAL_JOINTS/);
assert.match(atlasReturn, /MOD:TESSAREC/);
const atlasReceipt = JSON.parse(fs.readFileSync(path.join(__dirname, 'results/a0-game-of-worlds-three-domain-atlas-return-2026-10-21.json'), 'utf8'));
assert.equal(atlasReceipt.connections.length, 9);
assert.deepEqual(atlasReceipt.new_global_ids, []);
assert.deepEqual(atlasReceipt.new_canonical_relations, []);
assert.equal(atlasReceipt.authority.new_study, false);
assert.equal(atlasReceipt.authority.finding_or_claim_promotion, false);
assert.equal(atlasReceipt.authority.publication_authorized, false);
assert.match(atlasReturn, /a0-game-of-worlds-three-domain-atlas-currentness-2026-10-26\.json/);
assert.match(atlasReturn, /historische Byte-Snapshots unverändert/);
const atlasCurrentness = JSON.parse(fs.readFileSync(path.join(__dirname, 'results/a0-game-of-worlds-three-domain-atlas-currentness-2026-10-26.json'), 'utf8'));
assert.equal(atlasCurrentness.status, 'PASS');
assert.equal(atlasCurrentness.classification, 'ENGINEERING_CURRENTNESS_CHECK');
assert.equal(atlasCurrentness.historical_receipt, 'results/a0-game-of-worlds-three-domain-atlas-return-2026-10-21.json');
assert.equal(atlasCurrentness.historical_receipt_immutable, true);
assert.deepEqual(atlasCurrentness.sources.map(source => source.path), atlasReceipt.sources.map(source => source.path), 'currentness receipt covers the exact historical source set');
const atlasHistoricalDrift = [];
for (const source of atlasCurrentness.sources) {
  assert.match(source.sha256, /^[0-9a-f]{64}$/, 'current Atlas source hash: ' + source.path);
  const actual = crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname, source.path))).digest('hex');
  assert.equal(actual, source.sha256, 'byte-current Atlas source: ' + source.path);
  const historical = atlasReceipt.sources.find(candidate => candidate.path === source.path);
  if (historical.sha256 !== source.sha256) atlasHistoricalDrift.push(source.path);
}
assert.deepEqual(atlasHistoricalDrift, atlasReceipt.sources.map(source => source.path), 'all later source evolution is explicit while the historical receipt remains immutable');
assert.deepEqual(atlasCurrentness.authority.new_global_ids, []);
assert.deepEqual(atlasCurrentness.authority.new_canonical_relations, []);
assert.equal(atlasCurrentness.authority.new_study, false);
assert.equal(atlasCurrentness.authority.finding_or_claim_promotion, false);
assert.equal(atlasCurrentness.authority.publication_authorized, false);

console.log(JSON.stringify({
  status: 'PASS',
  assertions,
  surface: 'A0_RESEARCH_DESK',
  firstWorkSection: '17.10 · Erklär- und Engineering-Stand',
  families: 7,
  identity: 'existing A0 desk and tool identities reused; no new route or relation'
}, null, 2));
