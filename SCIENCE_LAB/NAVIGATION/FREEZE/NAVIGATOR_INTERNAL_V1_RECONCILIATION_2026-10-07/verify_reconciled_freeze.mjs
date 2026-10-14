#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, "../../../..");
const originalManifestPath = path.resolve(here, "../NAVIGATOR_INTERNAL_V1_2026-10-07/MANIFEST_SHA256.txt");
const originalRecordPath = path.resolve(here, "../NAVIGATOR_INTERNAL_V1_2026-10-07/FREEZE_RECORD.md");
const baselinePath = path.resolve(here, "../../CANDIDATES/LIFE_ORBIT_V2_2026-10-07/results/V1_P5_BASELINE.json");
const reconciledManifestPath = path.join(here, "MANIFEST_SHA256_RECONCILED.txt");
const deltaPath = path.join(here, "RECONCILIATION_DELTA.json");

const sha256 = (filePath) => crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
const parseManifest = (filePath) => {
  const entries = new Map();
  for (const line of fs.readFileSync(filePath, "utf8").trim().split("\n").filter(Boolean)) {
    const match = line.match(/^([a-f0-9]{64})  (.+)$/);
    if (!match) throw new Error(`INVALID_MANIFEST_LINE: ${line}`);
    entries.set(match[2], match[1]);
  }
  return entries;
};

const delta = JSON.parse(fs.readFileSync(deltaPath, "utf8"));
const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
const original = parseManifest(originalManifestPath);
const reconciled = parseManifest(reconciledManifestPath);
const failures = [];

const check = (name, condition, details = undefined) => {
  if (!condition) failures.push({ check: name, ...(details ? { details } : {}) });
};

check("original manifest hash preserved", sha256(originalManifestPath) === delta.original_freeze.manifest_sha256);
check("original record hash preserved", sha256(originalRecordPath) === delta.original_freeze.record_sha256);
check("pre-P5 baseline hash preserved", sha256(baselinePath) === delta.pre_p5_baseline.sha256);
check("original manifest has 17 files", original.size === 17, { actual: original.size });
check("reconciled manifest has 17 files", reconciled.size === 17, { actual: reconciled.size });
check("delta has exactly six files", delta.delta.length === 6, { actual: delta.delta.length });
check("pre-P5 baseline records no P5 v1 edits", baseline.p5_modified_v1_files === false);
check("LIFE ORBIT remains unadmitted", delta.reconciled_state.life_orbit_candidate_admitted === false);

const deltaFiles = new Set(delta.delta.map((item) => item.file));
check("delta filenames are unique", deltaFiles.size === delta.delta.length);

for (const item of delta.delta) {
  check(`original hash bound: ${item.file}`, original.get(item.file) === item.original_sha256);
  check(`reconciled hash bound: ${item.file}`, reconciled.get(item.file) === item.reconciled_sha256);
  check(`hashes differ: ${item.file}`, item.original_sha256 !== item.reconciled_sha256);
}

let unchanged = 0;
for (const [relativePath, expected] of reconciled) {
  const absolutePath = path.resolve(repositoryRoot, relativePath);
  check(`file exists: ${relativePath}`, fs.existsSync(absolutePath));
  if (!fs.existsSync(absolutePath)) continue;
  const actual = sha256(absolutePath);
  check(`current hash: ${relativePath}`, actual === expected, { expected, actual });
  if (!deltaFiles.has(relativePath)) {
    check(`unchanged original hash: ${relativePath}`, original.get(relativePath) === expected);
    if (original.get(relativePath) === expected) unchanged += 1;
  }
}
check("eleven hashes remain unchanged", unchanged === 11, { actual: unchanged });

const result = {
  reconciliation_id: delta.reconciliation_id,
  status: failures.length ? "FAIL" : "PASS",
  original_files: original.size,
  reconciled_files: reconciled.size,
  delta_files: delta.delta.length,
  unchanged_files: unchanged,
  original_state_preserved: failures.every((failure) => !failure.check.startsWith("original")),
  life_orbit_candidate_admitted: false,
  failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
