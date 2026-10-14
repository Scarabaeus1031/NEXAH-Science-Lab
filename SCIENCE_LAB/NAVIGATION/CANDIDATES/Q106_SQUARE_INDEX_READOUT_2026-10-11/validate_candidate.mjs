#!/usr/bin/env node

import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ecosystemRoot = path.resolve(here, "../../../../../..");
const candidate = JSON.parse(fs.readFileSync(path.join(here, "CANDIDATE.json"), "utf8"));
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

assert.equal(candidate.schema, "nexah.navigator.unbound-lens-candidate/1.0.0");
assert.equal(candidate.status, "INTERNAL_CANDIDATE_NOT_ADMITTED_NOT_PUBLIC");
assert.equal(candidate.stable_identity, null);
assert.equal(candidate.identity_status, "UNBOUND_NO_STABLE_NAVIGATOR_ID");
assert.equal(candidate.thematic_home, "NEXAH_NAVIGATOR");
assert.deepEqual(candidate.contrast.direct_carriers, { k3: 46, k4: 106, k5: 194 });
assert.deepEqual(candidate.contrast.finite_scan.hits, [4]);
assert.deepEqual(candidate.contrast.local_perturbation_window.hits, [106]);
assert.equal(candidate.relation_boundary.relation_type, "evidence-supported-by");
assert.ok(candidate.relation_boundary.does_not_imply.includes("identity with A0"));
assert.ok(candidate.relation_boundary.does_not_imply.includes("canonical Navigator admission"));

for (const binding of candidate.evidence_bindings) {
  const source = path.resolve(ecosystemRoot, binding.path);
  assert.ok(source.startsWith(ecosystemRoot + path.sep));
  assert.ok(fs.existsSync(source), `missing evidence source: ${binding.path}`);
  assert.equal(hash(source), binding.sha256, `evidence hash mismatch: ${binding.path}`);
  const result = JSON.parse(fs.readFileSync(source, "utf8"));
  assert.equal(result.classification, binding.classification);
}

process.stdout.write(JSON.stringify({
  status: "PASS",
  checks: 14,
  identity_status: candidate.identity_status,
  thematic_home: candidate.thematic_home,
  evidence_bindings: candidate.evidence_bindings.length
}, null, 2) + "\n");
