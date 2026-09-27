"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const runtime = require("../../RUNTIME/NEXAH_COMMON_RUNTIME_ADAPTER_V0_1/nexah-runtime-adapter.js");
const { buildAttachment } = require("./attach_public_kernel_v07.js");

async function main() {
  const attachment = await buildAttachment({ noVisual: true });
  assert.equal((await runtime.verifyEvidenceAttachment(attachment)).ok, true);
  assert.equal(attachment.evidence.kernel.version, "0.7.0");
  assert.equal(attachment.effect, "SUPPLEMENT_ONLY_NO_PROFILE_ACTIVATION");
  assert.equal(Object.keys(attachment.evidence.analyses).length, 4);
  const robustness = JSON.parse(fs.readFileSync(path.join(__dirname, "ROBUSTNESS_RESULT.json"), "utf8"));
  assert.equal(robustness.nominal_cycle_windows_per_record, 16);
  assert.deepEqual(robustness.cycle_robustness.P05_BEFORE_AFTER_EQ.actuator_1.active_windows, [1,2,3,4,5,6,7,8,9,10]);
  assert.deepEqual(robustness.cycle_robustness.P10_BEFORE_AFTER_EQ.actuator_1.active_windows, [2,3,4,5,6,7,8,9]);
  assert.equal(Object.keys(robustness.kernel_sensitivity).length, 2);
  for (const pair of Object.values(robustness.kernel_sensitivity)) {
    assert.equal(pair.configurations.length, 6);
    assert.ok(pair.similarity_range.minimum >= 0 && pair.similarity_range.maximum <= 1);
  }
  const tampered = JSON.parse(JSON.stringify(attachment));
  tampered.evidence.kernel.version = "0.8.0";
  assert.equal((await runtime.verifyEvidenceAttachment(tampered)).ok, false);
  await assert.rejects(
    () => runtime.createEvidenceAttachment({
      profileRef: attachment.profile_ref,
      subject: { ...attachment.subject, source_archive_sha256: "0".repeat(64) },
      admission: attachment.admission,
      evidence: attachment.evidence,
      effect: attachment.effect
    }),
    (error) => error.code === "EVIDENCE_SOURCE_HASH_MISMATCH"
  );
  console.log(JSON.stringify({ tests: 10, passed: 10, attachment_sha256: attachment.canonical_sha256, profile_activation: false }, null, 2));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
