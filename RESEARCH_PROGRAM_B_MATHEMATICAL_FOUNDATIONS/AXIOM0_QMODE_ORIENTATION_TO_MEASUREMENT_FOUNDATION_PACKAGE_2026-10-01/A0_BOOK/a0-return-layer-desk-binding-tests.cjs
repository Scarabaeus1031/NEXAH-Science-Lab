#!/usr/bin/env node

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const here = __dirname;
const packageRoot = path.resolve(here, "..");
const ecosystemRoot = path.resolve(here, "../../../../..");
const missionControl = path.join(
  ecosystemRoot,
  "00 EXECUTIVE",
  "NEXAH-Mission-Control",
);

let passed = 0;
let failed = 0;

function check(condition, label) {
  if (condition) {
    passed += 1;
    console.log(`PASS ${label}`);
    return;
  }
  failed += 1;
  console.error(`FAIL ${label}`);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function includes(file, fragment, label) {
  check(read(file).includes(fragment), label);
}

const receiptPath = path.join(
  here,
  "results",
  "a0-return-layer-desk-binding-2026-11-15.json",
);
const receipt = JSON.parse(read(receiptPath));

check(receipt.schema_id === "nexah.a0.return-layer-desk-binding", "receipt schema");
check(receipt.status === "SOURCE_BOUND_INTEGRATION_RETURN", "receipt status");
check(receipt.exact_contract.carrier === "C(t)=sin(t)", "carrier contract");
check(receipt.exact_contract.witness === "E(t)=exp(t)", "witness contract");
check(
  receipt.exact_contract.residual === "R_dyad(t)=sin(t)-exp(t)",
  "residual contract",
);
check(receipt.exact_contract.carrier_defect_2pi === "0", "carrier closes exactly");
check(
  receipt.exact_contract.witness_defect_2pi === "exp(t)*(exp(2*pi)-1)",
  "witness defect is exact",
);
check(
  receipt.exact_contract.residual_defect_2pi === "-exp(t)*(exp(2*pi)-1)",
  "residual defect is exact",
);
check(
  receipt.paper_disposition === "PAPER_C_METHOD_NOTE_NOT_SIXTH_FORMAL_CASE",
  "Paper C method-note boundary",
);
check(
  receipt.separation_boundary === "RAMANUJAN_PENTAGON_REMAINS_SEPARATE_GEOMETRIC_LINE",
  "Ramanujan separation boundary",
);
for (const [name, value] of Object.entries(receipt.deltas)) {
  check(value === 0, `zero governance delta: ${name}`);
}

includes(
  path.join(here, "A0_MATHEMATICAL_JOINTS.html"),
  'id="return-layer-audit"',
  "Mathfield anchor",
);
includes(
  path.join(here, "A0_MATHEMATICAL_JOINTS.html"),
  'id="coin-egg-slice-projection-crosswalk"',
  "coin/egg slice-projection crosswalk",
);
includes(
  path.join(here, "A0_MATHEMATICAL_JOINTS.html"),
  "x²+y²=r(z)²",
  "rotation-body slice equation",
);
includes(
  path.join(here, "A0_RESEARCH_DESK.html"),
  'id="return-layer-paper-routing-20261115"',
  "Science Desk return",
);
includes(
  path.join(here, "A0_RESEARCH_DESK.html"),
  'id="coin-egg-slice-projection-return-20261115"',
  "Science Desk EMP crosswalk return",
);
includes(
  path.join(here, "A0_BUILDER_LOG.html"),
  'id="return-layer-mathfield-builder-return-20261115"',
  "Builder Desk return",
);
includes(
  path.join(packageRoot, "32_A0_FINDINGS_AND_PAPER_WORKSPACE_2026-10-11.md"),
  '<a id="carrier-witness-residual-return--2026-11-15"></a>',
  "Findings/Paper routing anchor",
);
includes(
  path.join(packageRoot, "34_A0_RETURN_WITHOUT_IDENTITY_PAPER_DRAFT_2026-10-11.md"),
  '<a id="carrier-witness-residual-comparator"></a>',
  "Paper C source anchor",
);
includes(
  path.join(here, "A0_RETURN_WITHOUT_IDENTITY_PAPER.html"),
  'id="carrier-witness-residual"',
  "Paper C reader anchor",
);
includes(
  path.join(here, "A0_SCIENCE.html"),
  'id="return-layer-currentness-20261115"',
  "A0 Science currentness anchor",
);
includes(
  path.join(packageRoot, "22_A0_FORSCHUNGSPROTOKOLL_BUCH_UND_RAHMEN_2026-10-10.md"),
  "Carrier / Witness / Residual Mathfield return",
  "research protocol return",
);
includes(
  path.join(packageRoot, "24_A0_RESEARCH_BACKLOG_AND_OPEN_JOINTS_2026-10-10.md"),
  "NO_NEW_BACKLOG_ITEM",
  "research backlog closeout",
);

const mcReturn = path.join(
  missionControl,
  "00_LAB_RESEARCH_DIRECTOR_DESK",
  "RETURN_2026-11-15_A0_CARRIER_WITNESS_RESIDUAL_INTEGRATION.md",
);
includes(mcReturn, "LOCAL_CURRENTNESS_RETURN / SOURCE_BOUND", "Mission Control status");
includes(mcReturn, "new canonical Findings: `0`", "Mission Control zero-Finding delta");
includes(mcReturn, "Next permitted action: `HOLD`", "Mission Control hold disposition");
includes(
  path.join(missionControl, "00_OVERVIEW", "SCIENCE_VIEW.md"),
  "A0 currentness return · Carrier / Witness / Residual",
  "Mission Control Science View return",
);

const mcHash = crypto.createHash("sha256").update(fs.readFileSync(mcReturn)).digest("hex");
const controllingSources = read(path.join(missionControl, "CURRENT", "CONTROLLING_SOURCES.csv"));
check(
  controllingSources.includes(
    `MISSION_CONTROL_A0_CARRIER_WITNESS_RESIDUAL_INTEGRATION,00_LAB_RESEARCH_DIRECTOR_DESK/RETURN_2026-11-15_A0_CARRIER_WITNESS_RESIDUAL_INTEGRATION.md,${mcHash},`,
  ),
  "Mission Control controlling-source hash",
);

console.log(`\n${passed}/${passed + failed} checks passed`);
if (failed > 0) process.exit(1);
