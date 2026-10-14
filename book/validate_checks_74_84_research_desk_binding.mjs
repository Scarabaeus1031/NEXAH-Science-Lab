import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "..");
const binderPath = path.join(here, "results", "a0-checks-74-84-research-desk-binding-2026-10-14.json");
const binder = JSON.parse(fs.readFileSync(binderPath, "utf8"));
const fail = (message) => { throw new Error(message); };

if (binder.schema !== "nexah.a0.research-desk-check-binding") fail("unexpected schema");
if (binder.desk.source_id !== "NEXAH_A0_RESEARCH_DESK") fail("wrong desk identity");
if (binder.desk.new_navigator_identity || binder.desk.new_navigator_relation) fail("binding must reuse the existing desk identity");

const checks = binder.chains.flatMap((chain) => chain.checks).sort((a, b) => a - b);
const expected = Array.from({ length: 11 }, (_, index) => index + 74);
if (JSON.stringify(checks) !== JSON.stringify(expected)) fail(`check coverage mismatch: ${checks.join(",")}`);

const pathKeys = new Set([
  "protocol", "result_note", "crosscheck_note", "machine_protocol", "result", "crosscheck", "lock", "crosscheck_lock", "registry"
]);
for (const chain of binder.chains) {
  for (const [key, value] of Object.entries(chain)) {
    if (!pathKeys.has(key)) continue;
    const target = path.resolve(packageRoot, value);
    if (!fs.existsSync(target)) fail(`${chain.id}: missing ${key}: ${value}`);
  }
}
const evidenceLineage = path.resolve(packageRoot, binder.method_guards.evidence_lineage_binder);
if (!fs.existsSync(evidenceLineage)) fail(`missing evidence-lineage binder: ${binder.method_guards.evidence_lineage_binder}`);

const janus = binder.chains.find((chain) => chain.id === "A0_DESK_CHAIN_M64_JANUS_TRANSFER");
const janusResult = JSON.parse(fs.readFileSync(path.resolve(packageRoot, janus.result), "utf8"));
if (janusResult.transfer_verdict.code !== janus.verdict) fail("Janus transfer verdict mismatch");
if (janusResult.systems["365"].mirror_equalizer.enumerated_size !== 5) fail("Z365 equalizer must contain five states");
if (janusResult.systems["2501"].mirror_equalizer.enumerated_size !== 1) fail("Z2501 equalizer must contain only zero");

const desk = fs.readFileSync(path.join(here, "A0_RESEARCH_DESK.html"), "utf8");
if (!desk.includes('id="checks-74-84"')) fail("desk section checks-74-84 is missing");
if (!desk.includes("a0-checks-74-84-research-desk-binding-2026-10-14.json")) fail("desk does not link the machine binder");

console.log(`PASS ${binder.record_id} · ${binder.chains.length} chains · checks ${checks[0]}–${checks.at(-1)} · existing desk identity reused`);
