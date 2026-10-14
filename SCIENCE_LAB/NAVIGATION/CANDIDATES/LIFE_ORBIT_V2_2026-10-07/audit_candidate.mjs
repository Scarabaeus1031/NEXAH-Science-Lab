import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(root, "../../../..");
const deltaPath = path.resolve(root, "../../NAVIGATOR_V2_DELTA_LIFE_ORBIT_2026-10-07.json");
const delta = JSON.parse(fs.readFileSync(deltaPath, "utf8"));
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const candidateJs = fs.readFileSync(path.join(root, "candidate.js"), "utf8");
const combined = `${html}\n${app}\n${css}\n${candidateJs}`;
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

assert.equal(delta.schema, "nexah.navigator.v2-delta-candidate.v1");
assert.equal(delta.status, "INTERNAL_CANDIDATE_IMPLEMENTED_NOT_ADMITTED");
assert.equal(delta.v1_files_modified_by_p5, false);
assert.equal(delta.candidate.route, "#life-orbit");
assert.deepEqual(delta.candidate.connection_family_ids, ["CF:F1", "CF:F3", "CF:F4", "CF:F5", "CF:F7"]);
assert.equal(delta.candidate.relations.length, 3);
assert.match(delta.candidate.claim_ceiling, /no Life\/E8 mechanism identity/i);
assert.match(delta.candidate.admission_gate, /separately decides/);

const instrument = path.join(repo, delta.candidate.instrument.path);
const validation = path.join(repo, delta.candidate.instrument.validation_record);
const packageManifest = path.join(repo, delta.candidate.instrument.package_manifest);
assert.equal(sha(instrument), delta.candidate.instrument.sha256);
assert.equal(sha(validation), delta.candidate.instrument.validation_sha256);
assert.equal(sha(packageManifest), delta.candidate.instrument.package_manifest_sha256);
delta.candidate.source_assets.forEach((asset) => assert.equal(sha(path.join(repo, asset.path)), asset.sha256));
const v1Baseline = JSON.parse(fs.readFileSync(path.join(root, "results/V1_P5_BASELINE.json"), "utf8"));
v1Baseline.snapshot.forEach((item) => assert.equal(sha(path.join(repo, item.file)), item.actual, `P5 changed v1 file ${item.file}`));

assert.match(combined, /id="life-orbit"/);
assert.match(combined, /id="route-spine"/);
assert.match(combined, /id="relations"/);
assert.match(combined, /sandbox="allow-scripts allow-same-origin allow-downloads"/);
assert.match(combined, /P5 CANDIDATE ROUTE · NOT PUBLIC · NOT ADMITTED/);
assert.match(combined, /V1 APP UNMODIFIED BY P5/);
assert.match(combined, /ART:E8:WORD_ORBIT/);
assert.doesNotMatch(combined, /https?:\/\//);

process.stdout.write(`${JSON.stringify({ status: "PASS", checks: 21, route: delta.candidate.route, v1_modified_by_p5: false })}\n`);
