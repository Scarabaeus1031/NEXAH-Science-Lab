#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const binderPath = path.join(here, "GEOMETRIA_NOVA_P1_P13_BINDER_V1_2026-11-01.json");
const manifestPath = path.join(here, "SOURCE_INVENTORY_SHA256_2026-11-01.txt");
const scienceRoot = path.resolve(here, "../../..");
const registryPath = path.join(scienceRoot, "NAVIGATION/BUILD/registry-dist/navigator.internal.json");
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const sha256 = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

const binder = JSON.parse(fs.readFileSync(binderPath, "utf8"));
const sourceRoot = binder.source_authority.repository_root;
const corpusRoot = binder.source_authority.corpus_root;
const manifestText = fs.readFileSync(manifestPath, "utf8").trimEnd();
const lines = manifestText.split("\n").filter(Boolean);
const records = lines.map((line, index) => {
  const match = line.match(/^([0-9a-f]{64})  (.+)$/u);
  if (!match) {
    errors.push(`manifest line ${index + 1} is malformed`);
    return null;
  }
  return { hash: match[1], relativePath: match[2] };
}).filter(Boolean);

check(binder.status === "INTERNAL_SOURCE_BOUND_PROVENANCE_AND_CROSSWALK_LENS", "status must remain source-bound and internal");
for (const flag of ["publication_authorized", "science_run_activated", "changes_canonical_entity_counts", "changes_canonical_relation_counts", "creates_module_identity", "creates_family_identity"]) {
  check(binder[flag] === false, `${flag} must be false`);
}
check(records.length === 48, `expected 48 manifest records, found ${records.length}`);
check(binder.source_inventory.tracked_source_count === 48, "binder source count must be 48");
check(sha256(manifestPath) === binder.source_inventory.manifest_sha256, "manifest SHA-256 does not match binder");
check(fs.existsSync(sourceRoot), `source repository is unavailable: ${sourceRoot}`);

const expectedPaths = new Set();
for (const record of records) {
  check(record.relativePath.startsWith(`${corpusRoot}/`), `path escapes governed corpus: ${record.relativePath}`);
  const absolute = path.resolve(sourceRoot, record.relativePath);
  check(absolute.startsWith(path.resolve(sourceRoot) + path.sep), `path escapes source repository: ${record.relativePath}`);
  if (!fs.existsSync(absolute)) {
    errors.push(`missing source: ${record.relativePath}`);
    continue;
  }
  check(sha256(absolute) === record.hash, `hash mismatch: ${record.relativePath}`);
  expectedPaths.add(record.relativePath);
}

if (fs.existsSync(sourceRoot)) {
  const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: sourceRoot, encoding: "utf8" }).trim();
  check(head === binder.source_authority.inspected_revision, `source HEAD changed: ${head}`);
  const tracked = execFileSync("git", ["ls-files", "-z", "--", corpusRoot], { cwd: sourceRoot })
    .toString("utf8").split("\0").filter((entry) => entry && !entry.endsWith("/.gitkeep"));
  check(tracked.length === 48, `Git tree contains ${tracked.length} governed files, expected 48`);
  for (const entry of tracked) check(expectedPaths.has(entry), `unmanifested governed file: ${entry}`);
  for (const entry of expectedPaths) check(tracked.includes(entry), `manifest path is not tracked at inspected HEAD: ${entry}`);
}

const requiredTargets = [
  "MOD:NUMBER_VIEW_SUITE", "MOD:TESSAREC", "ART:A0:MATHEMATICAL_JOINTS", "ART:NUMBER:ELINE_POINCARE",
  "ART:HTML:AB9415A957FA", "ART:HTML:A2861493E920", "ART:HTML:82AB74C6E35F", "ART:HTML:829A060DB56E", "ART:HTML:2E64174F09E8"
];
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const ids = new Set(registry.entities.map((entity) => entity.entity_id));
for (const target of requiredTargets) check(ids.has(target), `Navigator identity missing: ${target}`);

check(binder.postulate_crosswalk.length === 7, "crosswalk must contain P7–P13");
check(JSON.stringify(binder.sequence_coverage.numbered_asset_labels_absent) === JSON.stringify(["P1", "P2", "P3", "P4", "P5", "P6"]), "P1–P6 absence boundary changed");
for (const entry of binder.postulate_crosswalk) {
  check(entry.does_not_imply?.length >= 3, `${entry.source_label} needs at least three non-implications`);
  check(entry.preserves?.length >= 2, `${entry.source_label} needs explicit preserved content`);
}
for (const layer of ["exact_or_classical_mathematics", "representation_or_design", "symbolic_or_unestablished", "open_provenance_or_definition_gaps"]) {
  check(Array.isArray(binder.claim_layers[layer]) && binder.claim_layers[layer].length > 0, `claim layer missing: ${layer}`);
}

if (errors.length) {
  console.error(JSON.stringify({ status: "FAIL", binder: binder.binder_id, errors }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({
  status: "PASS",
  binder: binder.binder_id,
  source_revision: binder.source_authority.inspected_revision,
  sources_verified: records.length,
  existing_identities_verified: requiredTargets.length,
  changes_canonical_entity_counts: false,
  changes_canonical_relation_counts: false
}, null, 2));
