const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const book = __dirname;
const pkg = path.resolve(book, "..");
const read = (file) => fs.readFileSync(file, "utf8");
let checks = 0;
const ok = (value, label) => { assert.ok(value, label); checks++; };

const result = JSON.parse(read(path.join(book, "results/a0-ullinium-methods-1-5-result-2026-11-11.json")));
const findings = read(path.join(pkg, "32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md"));
const paperCSource = read(path.join(pkg, "34_A0_RETURN_WITHOUT_IDENTITY_PAPER_DRAFT_2026-10-11.md"));
const paperESource = read(path.join(pkg, "35_NEXAH_ORIENTATION_METHOD_POSITION_PAPER_DRAFT_2026-10-12.md"));
const paperCHtml = read(path.join(book, "A0_RETURN_WITHOUT_IDENTITY_PAPER.html"));
const paperEHtml = read(path.join(book, "A0_NEXAH_FAMILY_METHOD_WHITE_PAPER.html"));
const desk = read(path.join(book, "A0_RESEARCH_DESK.html"));
const position = read(path.join(book, "A0_SCIENTIFIC_POSITION_REPORT.html"));

ok(result.valid_comparison === true && result.conclusion === "EQUIVALENT_RECOVERY_WITH_EXPLICIT_GOVERNANCE_OVERHEAD", "machine result retained without promotion");
ok(result.comparison.distinct_reconstruction_advantage === false, "no reconstruction advantage");
ok(result.comparison.distinct_robustness_advantage === false, "no robustness advantage");
ok(result.comparison.nexah_byte_ratio_vs_best_standard > 2, "payload overhead remains explicit");

ok(findings.includes("`EF-FN-06`") && findings.includes("PAPER_C_METHOD_COMPARATOR"), "Findings workspace routes the bounded comparator");
ok(findings.includes("NO_NEW_F-A0") && findings.includes("NO_CLAIM_PROMOTION"), "Findings boundary remains unchanged");
ok(paperCSource.includes('<a id="ullinium-methods-1-5-comparator"></a>') && paperCSource.includes("not a sixth formal"), "Paper C source keeps comparator documentary");
ok(paperCHtml.includes('id="methods-1-5"') && paperCHtml.includes("Exact Return needs provenance"), "Paper C reader exposes comparator");
ok(paperESource.includes('<a id="ullinium-methods-1-5-method-case"></a>') && paperESource.includes("keinen neuen"), "Paper E source keeps method boundary");
ok(paperEHtml.includes('id="ullinium-methods-1-5-method-case"') && paperEHtml.includes("Die Methode darf ihren eigenen Vorteil verwerfen"), "Paper E reader exposes falsifiable method lesson");
ok(desk.includes("NEXAH METHOD ADVANTAGE NOT SHOWN"), "Science Desk remains controlling return");
ok(position.includes('id="ullinium-methods-1-5-benchmark-20261111"'), "Scientific Position carries currentness result");

for (const [document, base] of [[paperCHtml, book], [paperEHtml, book]]) {
  const section = document.match(/<section[^>]+id="(?:methods-1-5|ullinium-methods-1-5-method-case)"[\s\S]*?<\/section>/)?.[0] || "";
  ok(section.length > 0, "paper section located");
  for (const [, href] of section.matchAll(/href="([^"]+)"/g)) {
    const target = path.resolve(base, decodeURIComponent(href.split("#")[0]));
    ok(fs.existsSync(target), `paper link exists: ${href}`);
  }
}

console.log(`A0 Ullinium methods 1–5 paper integration: ${checks} checks PASS`);
