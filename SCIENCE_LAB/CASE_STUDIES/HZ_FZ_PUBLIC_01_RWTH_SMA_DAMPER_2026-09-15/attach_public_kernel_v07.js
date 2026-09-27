#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const runtime = require("../../RUNTIME/NEXAH_COMMON_RUNTIME_ADAPTER_V0_1/nexah-runtime-adapter.js");

function fail(message) {
  const error = new Error(message);
  error.code = "PUBLIC_V07_FAIL_CLOSED";
  throw error;
}

async function buildAttachment(options = {}) {
  const root = __dirname;
  const intake = JSON.parse(fs.readFileSync(path.join(root, "SOURCE_INTAKE_RESULT.json"), "utf8"));
  const python = options.python || process.env.NEXAH_PUBLIC_PYTHON || "/opt/anaconda3/bin/python";
  const nexahRepo = path.resolve(options.nexahRepo || path.join(root, "../../../../../10 NEXAH CORE/NEXAH"));
  const args = [path.join(root, "run_public_kernel_v07.py"), "--nexah-repo", nexahRepo, "--output-dir", root];
  if (options.noVisual) args.push("--no-visual");
  const completed = spawnSync(python, args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (completed.status !== 0) fail(`public kernel process rejected input: ${(completed.stderr || completed.stdout).trim()}`);
  const evidence = JSON.parse(completed.stdout);
  if (evidence.source_archive_sha256 !== intake.source.archive_sha256) fail("kernel evidence and intake archive hashes differ");
  return runtime.createEvidenceAttachment({
    profileRef: "hz-fz-public-rwth-sma@0.1.0",
    subject: { case_id: "HZ_FZ_PUBLIC_01", source_archive_sha256: intake.source.archive_sha256, data_class: "OPEN_LABORATORY_DATA" },
    admission: intake,
    evidence,
    effect: "SUPPLEMENT_ONLY_NO_PROFILE_ACTIVATION"
  });
}

async function main() {
  const attachment = await buildAttachment();
  fs.writeFileSync(path.join(__dirname, "KERNEL_V07_ATTACHMENT.json"), `${JSON.stringify(attachment, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ classification: "ATTACHED_EXTERNAL_E2_ONLY", canonical_sha256: attachment.canonical_sha256 }, null, 2)}\n`);
}

if (require.main === module) main().catch((error) => {
  process.stderr.write(`${JSON.stringify({ classification: "FAIL_CLOSED", code: error.code || "ERROR", error: error.message }, null, 2)}\n`);
  process.exitCode = 2;
});

module.exports = { buildAttachment };
