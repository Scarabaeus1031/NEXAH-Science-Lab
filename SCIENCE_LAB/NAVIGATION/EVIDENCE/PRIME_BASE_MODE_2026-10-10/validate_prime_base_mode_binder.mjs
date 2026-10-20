#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ecosystemRoot = path.resolve(here, "../../../../../..");
const binderPath = path.join(here, "PRIME_BASE_MODE_BINDER_V1_2026-10-10.json");
const binder = JSON.parse(fs.readFileSync(binderPath, "utf8"));
const failures = [];

const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

expect(binder.schema === "nexah.navigator.prime-base-mode-binder/1.0.0", "unexpected schema");
expect(binder.status === "INTERNAL_READ_ONLY_SOURCE_BOUND_LENS", "unexpected status");
expect(binder.publication_authorized === false, "publication must remain unauthorized");
expect(binder.changes_canonical_registry_counts === false, "binder must not change canonical registry counts");
expect(binder.changes_canonical_family_count === false, "binder must not change canonical family count");
expect(binder.type_boundaries?.length === 8, "expected eight type boundaries");
expect(binder.sources?.length === 11, "expected eleven bound sources");
expect(binder.nodes?.length === 14, "expected fourteen archaeology nodes");
expect(binder.relations?.length === 17, "expected seventeen bounded relations");

const unique = (items) => new Set(items).size === items.length;
const sourceIds = binder.sources.map((item) => item.source_id);
const nodeIds = binder.nodes.map((item) => item.node_id);
const relationIds = binder.relations.map((item) => item.relation_id);
expect(unique(sourceIds), "source IDs must be unique");
expect(unique(nodeIds), "node IDs must be unique");
expect(unique(relationIds), "relation IDs must be unique");

const sourceIdSet = new Set(sourceIds);
const nodeIdSet = new Set(nodeIds);

for (const source of binder.sources) {
  const sourcePath = path.join(ecosystemRoot, source.ecosystem_path);
  expect(fs.existsSync(sourcePath), `missing source: ${source.source_id}`);
  if (!fs.existsSync(sourcePath)) continue;
  const observed = crypto.createHash("sha256").update(fs.readFileSync(sourcePath)).digest("hex");
  expect(observed === source.sha256, `hash mismatch: ${source.source_id}`);
}

for (const node of binder.nodes) {
  expect(node.source_ids?.length > 0, `node has no source: ${node.node_id}`);
  expect(node.source_ids?.every((id) => sourceIdSet.has(id)), `node has unknown source: ${node.node_id}`);
  expect(node.families?.every((id) => /^CF:F[1-7]$/.test(id)), `node has invalid family: ${node.node_id}`);
  expect(node.fields?.every((id) => /^TF:0[1-8]$/.test(id)), `node has invalid typed field: ${node.node_id}`);
  expect(node.claim_boundary?.length >= 20, `node claim boundary too short: ${node.node_id}`);
}

for (const relation of binder.relations) {
  expect(nodeIdSet.has(relation.source), `unknown relation source: ${relation.relation_id}`);
  expect(nodeIdSet.has(relation.target), `unknown relation target: ${relation.relation_id}`);
  expect(relation.preserves?.length > 0, `relation preserves nothing: ${relation.relation_id}`);
  expect(relation.does_not_imply?.length > 0, `relation lacks non-implication: ${relation.relation_id}`);
  expect(relation.evidence_source_ids?.every((id) => sourceIdSet.has(id)), `relation has unknown evidence: ${relation.relation_id}`);
}

const result = {
  status: failures.length ? "FAIL" : "PASS",
  checks: {
    sources: binder.sources.length,
    nodes: binder.nodes.length,
    relations: binder.relations.length,
    type_boundaries: binder.type_boundaries.length
  },
  failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;

