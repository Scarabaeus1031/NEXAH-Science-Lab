#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, "../../../..");
const manifestPath = path.join(here, "MANIFEST_SHA256.txt");
const admissionPath = path.resolve(repositoryRoot, "SCIENCE_LAB/NAVIGATION/NAVIGATOR_V2_ADMISSION_LIFE_ORBIT_2026-10-07.json");
const browserDataPath = path.resolve(repositoryRoot, "SCIENCE_LAB/NAVIGATION/APP/life-orbit.internal.js");
const p5rManifestPath = path.resolve(here, "../NAVIGATOR_INTERNAL_V1_RECONCILIATION_2026-10-07/MANIFEST_SHA256_RECONCILED.txt");
const p5rReportPath = path.resolve(here, "../NAVIGATOR_INTERNAL_V1_RECONCILIATION_2026-10-07/P5R_VALIDATION_REPORT.json");

const sha256 = (filePath) => crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
const failures = [];
const check = (name, condition, details = undefined) => {
  if (!condition) failures.push({ check: name, ...(details ? { details } : {}) });
};

const entries = fs.readFileSync(manifestPath, "utf8").trim().split("\n").filter(Boolean).map((line) => {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  if (!match) throw new Error(`INVALID_MANIFEST_LINE: ${line}`);
  return { expected: match[1], relativePath: match[2] };
});

for (const { expected, relativePath } of entries) {
  const absolutePath = path.resolve(repositoryRoot, relativePath);
  check(`file exists: ${relativePath}`, fs.existsSync(absolutePath));
  if (!fs.existsSync(absolutePath)) continue;
  const actual = sha256(absolutePath);
  check(`current hash: ${relativePath}`, actual === expected, { expected, actual });
}

const admission = JSON.parse(fs.readFileSync(admissionPath, "utf8"));
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(browserDataPath, "utf8"), context);
const browserData = context.window.NEXAH_LIFE_ORBIT_ADMISSION;
const entityIds = new Set(admission.entities.map((entity) => entity.entity_id));
const baseManifestContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.resolve(repositoryRoot, "SCIENCE_LAB/NAVIGATION/APP/data.internal.js"), "utf8"), baseManifestContext);
const baseIds = new Set(baseManifestContext.window.NEXAH_NAVIGATOR_MANIFEST.entities.map((entity) => entity.entity_id));
const resolvedIds = new Set([...baseIds, ...entityIds]);

check("nineteen frozen files", entries.length === 19, { actual: entries.length });
check("P5R manifest preserved", sha256(p5rManifestPath) === "212fd5716ab1d6e189fa893981660cfd8ad44dca89b3ad632ccddb186137cbe5");
check("P5R report preserved", sha256(p5rReportPath) === "674a7777b0490380bee6a7b514ad87e80c2a65b40240a9ba8f4657fbd1b5692b");
check("admission is internal", admission.status === "INTERNAL_ADMITTED" && admission.route === "#life-orbit");
check("browser data equals admission source", JSON.stringify(browserData) === JSON.stringify(admission));
check("three admitted entities", admission.entities.length === 3 && entityIds.size === 3);
check("three typed relations", admission.relations.length === 3 && new Set(admission.relations.map((relation) => relation.relation_type)).size === 3);
check("relation endpoints resolve", admission.relations.every((relation) => resolvedIds.has(relation.source_id) && resolvedIds.has(relation.target_id)));
check("five-family path", admission.family_route.map((step) => step.family_id).join("|") === "CF:F1|CF:F3|CF:F4|CF:F5|CF:F7");
check("no new family", admission.family_route.every((step) => /^CF:F[1-7]$/.test(step.family_id)));
check("nonidentity boundary", /no Life\/E8 mechanism identity/i.test(admission.claim_ceiling));
check("public release closed", admission.publication_authorized === false && admission.public_entity_count === 0 && admission.admission.public_release === false);
check("deployment closed", admission.admission.deployment === false);

const result = {
  freeze_id: "NEXAH:NAVIGATOR:INTERNAL_V2:LIFE_ORBIT:2026-10-07",
  status: failures.length ? "FAIL" : "PASS",
  files: entries.length,
  admitted_entities: admission.entities.length,
  admitted_relations: admission.relations.length,
  composed_entities: baseIds.size + admission.entities.length,
  composed_relations: baseManifestContext.window.NEXAH_NAVIGATOR_MANIFEST.relations.length + admission.relations.length,
  route: admission.route,
  public_entities: admission.public_entity_count,
  failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
