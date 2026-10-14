#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const binderPath = path.join(here, "ILAU_ORIENTATION_INSTRUMENTS_BINDER_V1_2026-10-09.json");
const binder = JSON.parse(fs.readFileSync(binderPath, "utf8"));
const digest = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };

check(binder.status === "INTERNAL_READ_ONLY_SOURCE_BOUND_LENS", "status");
check(binder.route === "#ilau-orientation", "route");
check(binder.publication_authorized === false, "publication boundary");
check(binder.changes_canonical_registry_counts === false, "registry count boundary");
check(binder.changes_canonical_family_count === false, "family count boundary");
check(Array.isArray(binder.instruments) && binder.instruments.length === 19, "nineteen curated instruments");
check(Array.isArray(binder.ilau) && binder.ilau.map((item) => item.code).join("") === "ILAU", "ILAU order");

for (const instrument of binder.instruments || []) {
  const file = path.join(here, "INSTRUMENTS", instrument.source_filename);
  check(fs.existsSync(file), `missing ${instrument.source_filename}`);
  if (fs.existsSync(file)) {
    check(fs.statSync(file).size === instrument.bytes, `byte count ${instrument.source_filename}`);
    check(digest(file) === instrument.sha256, `sha256 ${instrument.source_filename}`);
  }
}

const result = { status: failures.length ? "FAIL" : "PASS", checks: 6 + (binder.instruments?.length || 0) * 3, failures };
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
