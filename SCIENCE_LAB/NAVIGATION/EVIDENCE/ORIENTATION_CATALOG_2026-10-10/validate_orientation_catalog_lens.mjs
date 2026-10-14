#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ecosystemRoot = path.resolve(here, "../../../../../..");
const binderPath = path.join(here, "ORIENTATION_CATALOG_BINDER_V1_2026-10-10.json");
const binder = JSON.parse(fs.readFileSync(binderPath, "utf8"));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

expect(binder.schema === "nexah.navigator.orientation-catalog-lens/1.0.0", "schema mismatch");
expect(binder.status === "INTERNAL_READ_ONLY_SOURCE_BOUND_LENS", "status mismatch");
expect(binder.route === "#orientation-catalog", "route mismatch");
expect(binder.publication_authorized === false, "publication boundary open");
expect(binder.changes_canonical_registry_counts === false, "registry count boundary open");
expect(binder.changes_canonical_family_count === false, "family count boundary open");
expect(binder.source_catalog?.record_count === 61 && binder.records?.length === 61, "expected 61 catalog records");
expect(binder.featured_keys?.length === 12, "expected twelve orientation selections");
expect(binder.registered_works?.length === 10, "expected ten registered Library Works");
expect(binder.concepts?.length === 17, "expected seventeen registered Library Concepts");
expect(binder.navigator_pointers?.length === 11, "expected eleven bounded Navigator pointers");

const catalogPath = path.resolve(ecosystemRoot, binder.source_catalog.ecosystem_path);
expect(catalogPath.startsWith(ecosystemRoot + path.sep), "catalog path escapes ecosystem");
expect(fs.existsSync(catalogPath), "catalog source missing");
if (fs.existsSync(catalogPath)) expect(hash(catalogPath) === binder.source_catalog.sha256, "catalog source hash mismatch");

const catalogKeys = new Set(binder.records.map((record) => record.catalog_key));
expect(catalogKeys.size === binder.records.length, "duplicate catalog keys");
expect(binder.featured_keys.every((key) => catalogKeys.has(key)), "unknown featured key");
expect(binder.records.every((record) => /^arena:\d+$/.test(record.catalog_key)), "invalid catalog key");
expect(binder.records.every((record) => /^https:\/\/www\.are\.na\//.test(record.source_url)), "non-Are.na source URL");

const registeredIds = new Set(binder.registered_works.map((work) => work.work_id));
expect(registeredIds.size === binder.registered_works.length, "duplicate registered Work ID");
for (const work of binder.registered_works) {
  expect(/^NX-\d{6}$/.test(work.work_id), `invalid Work ID: ${work.work_id}`);
  expect(catalogKeys.has(work.catalog_key), `unknown Work catalog key: ${work.work_id}`);
  expect(work.concept_ids?.length > 0, `Work has no registered concepts: ${work.work_id}`);
  const sourcePath = path.resolve(ecosystemRoot, work.source.ecosystem_path);
  expect(sourcePath.startsWith(ecosystemRoot + path.sep) && fs.existsSync(sourcePath), `missing Work source: ${work.work_id}`);
  if (fs.existsSync(sourcePath)) expect(hash(sourcePath) === work.source.sha256, `Work hash mismatch: ${work.work_id}`);
}

const conceptIds = new Set(binder.concepts.map((concept) => concept.concept_id));
expect(conceptIds.size === binder.concepts.length, "duplicate Concept ID");
for (const concept of binder.concepts) {
  expect(/^NX-OP-\d{4}$/.test(concept.concept_id), `invalid Concept ID: ${concept.concept_id}`);
  expect(concept.label && concept.definition, `incomplete Concept: ${concept.concept_id}`);
  const sourcePath = path.resolve(ecosystemRoot, concept.source.ecosystem_path);
  expect(sourcePath.startsWith(ecosystemRoot + path.sep) && fs.existsSync(sourcePath), `missing Concept source: ${concept.concept_id}`);
  if (fs.existsSync(sourcePath)) expect(hash(sourcePath) === concept.source.sha256, `Concept hash mismatch: ${concept.concept_id}`);
}
expect(binder.registered_works.every((work) => work.concept_ids.every((id) => conceptIds.has(id))), "unknown Work-to-Concept reference");

const allowedTypes = new Set(["contextualizes", "introduces", "illustrates", "editorial-companion-of"]);
const allowedRoutes = new Set(["#findings-frontiers", "#atlas", "#about", "#a0-orientation-evidence", "#families", "#lineage", "#glossary", "#utg", "#observatory"]);
const pointerIds = new Set();
for (const pointer of binder.navigator_pointers) {
  expect(!pointerIds.has(pointer.pointer_id), `duplicate pointer: ${pointer.pointer_id}`);
  pointerIds.add(pointer.pointer_id);
  expect(catalogKeys.has(pointer.catalog_key), `unknown pointer catalog key: ${pointer.pointer_id}`);
  expect(allowedTypes.has(pointer.relation_type), `invalid pointer type: ${pointer.pointer_id}`);
  expect(allowedRoutes.has(pointer.target_route), `invalid pointer route: ${pointer.pointer_id}`);
  expect(pointer.claim_boundary?.length > 60, `short pointer boundary: ${pointer.pointer_id}`);
}

expect(/not a Connection Family/i.test(binder.claim_ceiling), "Connection Family boundary missing");
expect(/not ORION executable operators/i.test(binder.source_boundaries.join(" ")), "ORION operator boundary missing");
expect(/catalog-only/i.test(binder.source_boundaries.join(" ")), "catalog-only identity boundary missing");

const result = {
  status: failures.length ? "FAIL" : "PASS",
  checks: {
    records: binder.records.length,
    featured: binder.featured_keys.length,
    registered_works: binder.registered_works.length,
    concepts: binder.concepts.length,
    pointers: binder.navigator_pointers.length
  },
  failures
};
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;

