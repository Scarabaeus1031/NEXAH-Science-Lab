#!/usr/bin/env node

import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildFixtureExports } from "./build_fixture_exports.mjs";

const first = mkdtempSync(join(tmpdir(), "nexah-nav-fixture-a-"));
const second = mkdtempSync(join(tmpdir(), "nexah-nav-fixture-b-"));
const runA = buildFixtureExports(first);
const runB = buildFixtureExports(second);
const failures = [];

for (const name of Object.keys(runA.files).sort()) {
  if (runA.files[name] !== runB.files[name]) failures.push(`non-deterministic hash: ${name}`);
  if (readFileSync(join(first, name), "utf8") !== readFileSync(join(second, name), "utf8")) {
    failures.push(`non-identical bytes: ${name}`);
  }
}

const publicManifest = JSON.parse(readFileSync(join(first, "navigator.public.json"), "utf8"));
const publicSerialized = JSON.stringify(publicManifest);
if (/(file:\/\/|\/Users\/|[A-Za-z]:\\)/i.test(publicSerialized)) failures.push("public local path leak");
if (publicManifest.entities.some((entity) => Object.hasOwn(entity, "internal"))) {
  failures.push("public internal block leak");
}
if (publicManifest.publication_authorized !== false || publicManifest.release_state !== "preview") {
  failures.push("fixture exporter changed publication authority");
}

const report = JSON.parse(readFileSync(join(first, "rejected-public-items.json"), "utf8"));
const expectedReasons = ["INTERNAL_BLOCK_EXPOSED", "LOCAL_PATH_EXPOSED", "RELEASE_NOT_AUTHORIZED"];
if (JSON.stringify(report.rejected[0]?.reasons) !== JSON.stringify(expectedReasons)) {
  failures.push("rejection reasons differ from fail-closed contract");
}

console.log(JSON.stringify({
  status: failures.length === 0 ? "PASS" : "FAIL",
  byte_identical_runs: failures.every((failure) => !failure.includes("deterministic") && !failure.includes("identical")),
  files_checked: Object.keys(runA.files).length,
  public_entities: publicManifest.entities.length,
  public_relations: publicManifest.relations.length,
  rejected_items: report.rejected.length,
  failures
}, null, 2));
process.exitCode = failures.length === 0 ? 0 : 1;
