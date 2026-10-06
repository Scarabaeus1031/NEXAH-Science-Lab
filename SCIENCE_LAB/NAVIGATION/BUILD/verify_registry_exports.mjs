#!/usr/bin/env node

import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildRegistryExports } from "./build_registry_exports.mjs";

const first = mkdtempSync(join(tmpdir(), "nexah-nav-registry-a-"));
const second = mkdtempSync(join(tmpdir(), "nexah-nav-registry-b-"));
const runA = buildRegistryExports(first);
const runB = buildRegistryExports(second);
const failures = [];

for (const name of Object.keys(runA.files).sort()) {
  if (runA.files[name] !== runB.files[name]) failures.push(`non-deterministic hash: ${name}`);
  if (readFileSync(join(first, name), "utf8") !== readFileSync(join(second, name), "utf8")) {
    failures.push(`non-identical bytes: ${name}`);
  }
}
const internal = JSON.parse(readFileSync(join(first, "navigator.internal.json"), "utf8"));
const publicManifest = JSON.parse(readFileSync(join(first, "navigator.public.json"), "utf8"));
const rejected = JSON.parse(readFileSync(join(first, "rejected-public-items.json"), "utf8"));
const entityIds = new Set(internal.entities.map((entity) => entity.entity_id));
const relationIds = new Set();
if (entityIds.size !== internal.entities.length) failures.push("duplicate internal entity ID");
for (const relation of internal.relations) {
  if (relationIds.has(relation.relation_id)) failures.push(`duplicate relation ID: ${relation.relation_id}`);
  relationIds.add(relation.relation_id);
  if (!entityIds.has(relation.source_id)) failures.push(`missing source endpoint: ${relation.relation_id}`);
  if (!entityIds.has(relation.target_id)) failures.push(`missing target endpoint: ${relation.relation_id}`);
}
if (publicManifest.entities.length || publicManifest.relations.length) failures.push("public manifest is not fail-closed empty");
if (publicManifest.publication_authorized !== false) failures.push("public authority changed");
if (rejected.rejected.length !== internal.entities.length) failures.push("rejection report does not cover every internal entity");

console.log(JSON.stringify({
  status: failures.length === 0 ? "PASS" : "FAIL",
  byte_identical_runs: failures.every((failure) => !failure.includes("deterministic") && !failure.includes("identical")),
  internal_entities: internal.entities.length,
  internal_relations: internal.relations.length,
  public_entities: publicManifest.entities.length,
  rejected_entities: rejected.rejected.length,
  failures
}, null, 2));
process.exitCode = failures.length === 0 ? 0 : 1;
