#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ecosystemRoot = path.resolve(here, "../../../../../..");
const binderPath = path.join(here, "FINDINGS_AND_FRONTIERS_BINDER_V1_2026-10-10.json");
const binder = JSON.parse(fs.readFileSync(binderPath, "utf8"));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

expect(binder.schema === "nexah.navigator.findings-frontiers-binder/1.0.0", "unexpected schema");
expect(binder.status === "INTERNAL_READ_ONLY_SOURCE_BOUND_LEAD_LENS", "unexpected status");
expect(binder.publication_authorized === false, "publication must remain unauthorized");
expect(binder.changes_canonical_registry_counts === false, "lead lens must not change canonical counts");
expect(binder.changes_canonical_family_count === false, "lead lens must not change family count");
expect(binder.inspection_grammar?.length === 8, "expected eight inspection fields");
expect(binder.sources?.length === 11, "expected eleven controlling sources");
expect(binder.classes?.length === 5, "expected five evidence classes");
expect(binder.navigator_evidence_surfaces?.length === 9, "expected nine evidence surfaces");
expect(binder.governance_records?.length === 1, "expected one controlling governance record");
expect(binder.frontier?.activation_status === "OWNER_SELECTED_RESEARCH_BACKLOG_PREPARATION_ONLY_NOT_ACTIVE", "frontier must remain preparation-only and inactive");
expect(binder.frontier?.owner_selection?.authorization === "PREPARATION_ONLY", "owner selection must authorize preparation only");
expect(binder.frontier?.readiness_gates?.length === 6, "expected six readiness gates");
expect(binder.frontier?.readiness_gates?.find((item) => item.gate_id === "GATE:05")?.status === "OPEN_NEXT_DECISIVE_GATE", "Gate 5 must remain the next decisive open gate");
expect(binder.frontier?.readiness_gates?.find((item) => item.gate_id === "GATE:06")?.status === "OPEN_DOWNSTREAM_OF_GATE_5", "Gate 6 must remain downstream of Gate 5");

const sourceIds = binder.sources.map((item) => item.source_id);
expect(new Set(sourceIds).size === sourceIds.length, "source IDs must be unique");
const sourceIdSet = new Set(sourceIds);
expect(["SRC:FF:A0_BL021_LABREPORT", "SRC:FF:A0_BL035_LABREPORT", "SRC:FF:A0_BL045_LABREPORT"].every((id) => sourceIdSet.has(id)), "expected all three closed A0 Labreports");
expect(binder.classes.find((item) => item.class_id === "FF:NEGATIVE")?.source_ids?.includes("SRC:FF:A0_BL021_LABREPORT"), "A0-BL-021 must remain bound as a negative result");
expect(binder.classes.find((item) => item.class_id === "FF:METHOD")?.source_ids?.includes("SRC:FF:A0_BL035_LABREPORT"), "A0-BL-035 must remain bound as a bounded method result");
expect(binder.classes.find((item) => item.class_id === "FF:EXACT")?.source_ids?.includes("SRC:FF:A0_BL045_LABREPORT"), "A0-BL-045 conditional exact identity must remain source-bound");
expect(binder.navigator_evidence_surfaces?.some((item) => item.route === "#a0-orientation-evidence"), "A0 evidence surface must be linked");

for (const source of binder.sources) {
  const sourcePath = path.resolve(ecosystemRoot, source.ecosystem_path);
  expect(sourcePath.startsWith(ecosystemRoot + path.sep), `source escapes ecosystem: ${source.source_id}`);
  expect(fs.existsSync(sourcePath), `missing source: ${source.source_id}`);
  if (fs.existsSync(sourcePath)) expect(hash(sourcePath) === source.sha256, `hash mismatch: ${source.source_id}`);
}

for (const record of binder.governance_records || []) {
  const recordPath = path.resolve(ecosystemRoot, record.ecosystem_path);
  expect(recordPath.startsWith(ecosystemRoot + path.sep), `governance record escapes ecosystem: ${record.record_id}`);
  expect(fs.existsSync(recordPath), `missing governance record: ${record.record_id}`);
  if (fs.existsSync(recordPath)) expect(hash(recordPath) === record.sha256, `governance hash mismatch: ${record.record_id}`);
}

for (const item of binder.classes) {
  expect(item.items?.length > 0, `class has no items: ${item.class_id}`);
  expect(item.source_ids?.every((id) => sourceIdSet.has(id)), `class has unknown source: ${item.class_id}`);
  expect(item.claim_boundary?.length > 30, `class claim boundary too short: ${item.class_id}`);
}

const result = {
  status: failures.length ? "FAIL" : "PASS",
  checks: {
    sources: binder.sources.length,
    evidence_classes: binder.classes.length,
    evidence_surfaces: binder.navigator_evidence_surfaces.length,
    inspection_fields: binder.inspection_grammar.length,
    governance_records: binder.governance_records.length,
    readiness_gates: binder.frontier.readiness_gates.length
  },
  failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;

