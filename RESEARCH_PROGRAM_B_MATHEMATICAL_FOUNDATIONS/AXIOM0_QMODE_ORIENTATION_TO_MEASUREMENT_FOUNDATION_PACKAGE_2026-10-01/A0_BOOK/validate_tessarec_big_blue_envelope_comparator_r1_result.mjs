import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const model = require("./assets/a0-tessarec-big-blue-envelope-comparator-r1.js");
const resultPath = path.join(here, "results", "a0-tessarec-big-blue-envelope-comparator-r1-result-2026-10-14.json");
const stored = JSON.parse(fs.readFileSync(resultPath, "utf8"));
const replay = model.evaluate(stored.fixture);

const fail = (message) => { throw new Error(message); };
if (stored.record_id !== "A0_TESSAREC_BIG_BLUE_ENVELOPE_COMPARATOR_RUN_001") fail("unexpected record id");
if (stored.status !== "PASS_BOUNDED_INTEGRATION_DEMONSTRATOR") fail("stored result is not a pass");
if (JSON.stringify(stored) !== JSON.stringify(replay)) fail("stored result differs from deterministic replay");
if (Object.values(stored.gates).some((gate) => gate.status !== "PASS")) fail("one or more gates failed");
if (stored.gates.I6_NAMESPACE_GUARD.registered_pentagon_16_17_connector !== false) fail("unsupported pentagon connector promotion");
if (stored.governance.new_navigator_identity || stored.governance.new_navigator_relation) fail("unexpected Navigator graph change");

const atlas = fs.readFileSync(path.join(here, "A0_FAMILY_CONNECTION_ATLAS.html"), "utf8");
for (const id of ["bigBlueComparator", "bbcPhase", "bbcEnvelope", "bbcHost", "bbcAdapters", "bbcRun"]) {
  if (!atlas.includes(`id="${id}"`)) fail(`missing Atlas UI element: ${id}`);
}

const lockPath = path.join(here, "assets", "a0-tessarec-big-blue-envelope-comparator-r1-result-lock.json");
const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
for (const [relativePath, expected] of Object.entries(lock.files)) {
  const target = path.resolve(path.dirname(lockPath), relativePath);
  const actual = crypto.createHash("sha256").update(fs.readFileSync(target)).digest("hex");
  if (actual !== expected) fail(`hash mismatch: ${relativePath}`);
}

console.log("PASS A0_TESSAREC_BIG_BLUE_ENVELOPE_COMPARATOR_RUN_001 · I1–I6 · UI + hash bound · namespaces retained");
