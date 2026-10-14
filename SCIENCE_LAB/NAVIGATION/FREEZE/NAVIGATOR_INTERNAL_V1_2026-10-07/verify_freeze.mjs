#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, "../../../..");
const manifestPath = path.join(here, "MANIFEST_SHA256.txt");
const lines = fs.readFileSync(manifestPath, "utf8").trim().split("\n").filter(Boolean);
const mismatches = [];

for (const line of lines) {
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  if (!match) {
    mismatches.push({ line, reason: "INVALID_MANIFEST_LINE" });
    continue;
  }
  const [, expected, relativePath] = match;
  const absolutePath = path.resolve(repositoryRoot, relativePath);
  if (!fs.existsSync(absolutePath)) {
    mismatches.push({ path: relativePath, reason: "MISSING" });
    continue;
  }
  const actual = crypto.createHash("sha256").update(fs.readFileSync(absolutePath)).digest("hex");
  if (actual !== expected) mismatches.push({ path: relativePath, reason: "HASH_MISMATCH", expected, actual });
}

const result = {
  freeze_id: "NEXAH:NAVIGATOR:INTERNAL_V1:2026-10-07",
  status: mismatches.length ? "FAIL" : "PASS",
  files: lines.length,
  matched: lines.length - mismatches.length,
  mismatches
};

console.log(JSON.stringify(result, null, 2));
if (mismatches.length) process.exitCode = 1;

