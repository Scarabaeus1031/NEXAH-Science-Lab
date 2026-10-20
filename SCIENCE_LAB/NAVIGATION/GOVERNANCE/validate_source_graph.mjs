#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ecosystemRoot = path.resolve(here, "../../../../..");
const indexPath = path.join(here, "SOURCE_GRAPH_INDEX_V1_2026-10-10.json");
const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

check(index.schema === "nexah.science-lab.source-graph-index/1.0.0", "schema mismatch");
check(index.status === "CURRENT_INTERNAL_GOVERNED_NOT_PUBLIC", "status mismatch");
check(index.publication_authorized === false && index.public_entity_count === 0, "public gate must fail closed");
check(index.components?.length === 19, "expected nineteen governed components");

const ids = index.components.map((item) => item.component_id);
const paths = index.components.map((item) => item.ecosystem_path);
check(new Set(ids).size === ids.length, "duplicate component ID");
check(new Set(paths).size === paths.length, "duplicate component path");
check(index.components.filter((item) => item.class === "canonical-base").length === 1, "exactly one canonical base required");
check(index.components.filter((item) => item.class === "admitted-overlay").length === 1, "exactly one admitted overlay expected");
check(index.components.filter((item) => item.class !== "canonical-base").every((item) => item.changes_canonical_counts === false), "non-base component changes canonical counts");

for (const component of index.components) {
  const file = path.resolve(ecosystemRoot, component.ecosystem_path);
  check(file.startsWith(ecosystemRoot + path.sep), `${component.component_id}: path escapes ecosystem root`);
  check(fs.existsSync(file), `${component.component_id}: source missing`);
  if (fs.existsSync(file)) check(hash(file) === component.sha256, `${component.component_id}: hash mismatch`);
}

const validatedComponents = [];
for (const component of index.components.filter((item) => item.validator_path)) {
  const validator = path.resolve(ecosystemRoot, component.validator_path);
  check(validator.startsWith(ecosystemRoot + path.sep), `${component.component_id}: validator path escapes ecosystem root`);
  check(fs.existsSync(validator), `${component.component_id}: validator missing`);
  if (!validator.startsWith(ecosystemRoot + path.sep) || !fs.existsSync(validator)) continue;
  const result = spawnSync(process.execPath, [validator], {
    cwd: path.dirname(validator),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  validatedComponents.push(component.component_id);
  if (result.status !== 0) {
    const detail = (result.stdout || result.stderr || "validator returned no diagnostic").trim().replace(/\s+/g, " ").slice(0, 500);
    failures.push(`${component.component_id}: declared component validator failed: ${detail}`);
  }
}

for (const record of index.required_governance_records || []) {
  const file = path.resolve(ecosystemRoot, record);
  check(file.startsWith(ecosystemRoot + path.sep) && fs.existsSync(file), `governance record missing: ${record}`);
}

const basePath = path.resolve(ecosystemRoot, index.components.find((item) => item.class === "canonical-base").ecosystem_path);
if (fs.existsSync(basePath)) {
  const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
  check(base.entities?.length === index.canonical_counts.base_entities, "base entity count mismatch");
  check(base.relations?.length === index.canonical_counts.base_relations, "base relation count mismatch");
}

const lifePath = path.resolve(ecosystemRoot, index.components.find((item) => item.class === "admitted-overlay").ecosystem_path);
if (fs.existsSync(lifePath)) {
  const life = JSON.parse(fs.readFileSync(lifePath, "utf8"));
  check(life.entities?.length === index.canonical_counts.admitted_overlay_entities, "overlay entity count mismatch");
  check(life.relations?.length === index.canonical_counts.admitted_overlay_relations, "overlay relation count mismatch");
  check(life.publication_authorized === false, "overlay publication gate open");
}

check(index.canonical_counts.base_entities + index.canonical_counts.admitted_overlay_entities === index.canonical_counts.composed_entities, "composed entity arithmetic mismatch");
check(index.canonical_counts.base_relations + index.canonical_counts.admitted_overlay_relations === index.canonical_counts.composed_relations, "composed relation arithmetic mismatch");

const result = {
  status: failures.length ? "FAIL" : "PASS",
  checks: {
    components: index.components.length,
    component_validators: validatedComponents.length,
    governance_records: index.required_governance_records.length,
    base: `${index.canonical_counts.base_entities}/${index.canonical_counts.base_relations}`,
    composed: `${index.canonical_counts.composed_entities}/${index.canonical_counts.composed_relations}`
  },
  failures
};
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
