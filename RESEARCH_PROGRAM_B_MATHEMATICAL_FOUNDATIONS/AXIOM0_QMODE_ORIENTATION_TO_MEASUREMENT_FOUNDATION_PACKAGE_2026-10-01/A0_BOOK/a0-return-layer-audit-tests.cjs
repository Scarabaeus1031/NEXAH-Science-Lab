#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const core = require("./assets/return-layer-audit/return-layer-audit-core.js");

let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks += 1; };
const near = (actual, expected, message) => { assert.ok(Math.abs(actual - expected) < 1e-9, message); checks += 1; };

for (const t of [0, 0.25, 1, Math.PI, 2 * Math.PI]) {
  const row = core.sample(t);
  near(row.carrier, Math.sin(t), `carrier ${t}`);
  near(row.residual, row.carrier - row.witness, `residual ${t}`);
  near(row.carrierDefect, 0, `carrier return ${t}`);
  near(row.witnessDefect, row.exactWitnessDefect, `witness defect ${t}`);
  near(row.residualDefect, row.exactResidualDefect, `residual defect ${t}`);
}

for (const value of [-17, -1, 0, 3, Math.PI]) near(core.antipode(core.antipode(value)), value, `antipode ${value}`);

const here = __dirname;
const html = fs.readFileSync(path.join(here, "A0_MATHEMATICAL_JOINTS.html"), "utf8");
const contract = JSON.parse(fs.readFileSync(path.join(here, "assets/return-layer-audit/return-layer-audit-contract.json"), "utf8"));
[
  "return-layer-audit",
  "R_dyad(t)=sin(t)-e^t",
  "18/18",
  "14/14",
  "41/41",
  "49/49",
  "552/552",
  "CONDITIONAL",
  "NEW ID 0"
].forEach((token) => check(html.includes(token), `HTML token ${token}`));
check(contract.identity_effect.reuses === "ART:A0:MATHEMATICAL_JOINTS", "existing identity reused");
check(contract.identity_effect.new_identity === false, "no new identity");
check(contract.evidence_channels.find((item) => item.name.includes("SNCE")).unique_selector === false, "negative selector retained");
check(contract.evidence_channels.find((item) => item.name.includes("JANUS")).reproducible === false, "K-channel reproducibility boundary retained");
[
  "assets/return-layer-audit/return-layer-audit-core.js",
  "assets/return-layer-audit/return-layer-audit.js",
  "assets/return-layer-audit/return-layer-audit.css",
  "a0-prime-index-dyadic-channel-audit.mjs",
  "a0-tessarec-antipode-return-bridge-tests.cjs",
  "a0-snce-101-12928-connector-tests.cjs",
  "../../../NUMBER_OPERATOR_ARCHITECTURE_CONCORDANCE_AUDIT/dyadic_grid_source_checks_20261018.py",
  "../../../ORION_MATH_THE_MATH_VALIDATION_ARCHITECTURE_PASS/02_ORION_CLAIM_REGISTRY.md"
].forEach((relativePath) => check(fs.existsSync(path.resolve(here, relativePath)), `source exists ${relativePath}`));

console.log(JSON.stringify({ status: "PASS", checks, identity: contract.identity_effect.reuses, new_identity: false }));
