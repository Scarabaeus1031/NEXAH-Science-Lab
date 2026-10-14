import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ecosystemRoot = path.resolve(here, "../../../../../..");
const binderPath = path.join(here, "ORION_CAPABILITY_EVIDENCE_BINDER_V1_2026-10-10.json");
const binder = JSON.parse(fs.readFileSync(binderPath, "utf8"));
const errors = [];
const requireSource = (source, label) => {
  const resolved = path.resolve(ecosystemRoot, source || "");
  if (!source || !resolved.startsWith(ecosystemRoot + path.sep) || !fs.existsSync(resolved)) errors.push(`${label}: missing source ${source || "(empty)"}`);
};

if (binder.schema !== "nexah.navigator.orion-capability-evidence-binder/1.0.0") errors.push("Unexpected binder schema");
if (binder.status !== "INTERNAL_READ_ONLY_SOURCE_BOUND_LENS") errors.push("Lens must remain internal and read-only");
if (binder.publication_authorized !== false) errors.push("Publication must fail closed");
if (binder.changes_canonical_registry_counts !== false || binder.changes_canonical_family_count !== false) errors.push("Lens must not change canonical counts");
if (binder.identity_decision !== "REUSE_EXISTING_ORION_OLS_SCIENCE_LAB_AND_BUILDER_IDENTITIES") errors.push("Identity decision must reuse existing authorities");
if (binder.authority_chain?.length !== 4 || binder.evidence_ladder?.length !== 5 || binder.interfaces?.length !== 4 || binder.open_gates?.length !== 5 || binder.non_identities?.length !== 6) errors.push("Binder cardinality mismatch");
if ((binder.evidence_ladder || []).map((item) => item.level).join(",") !== "L0,L1,L2,L3,L4") errors.push("Expected L0 through L4");
if ((binder.evidence_ladder || []).slice(0, 4).some((item) => item.status !== "IMPLEMENTED_AND_TESTED" || item.status_class !== "pass")) errors.push("L0-L3 status mismatch");
const l4 = binder.evidence_ladder?.[4];
if (l4?.status !== "INVALID_EXPERIMENT" || l4?.status_class !== "invalid") errors.push("L4 invalid result must remain explicit");

for (const [index, item] of (binder.authority_chain || []).entries()) requireSource(item.source, `authority_chain[${index}]`);
requireSource(binder.certified_core?.source, "certified_core");
for (const [index, item] of (binder.evidence_ladder || []).entries()) {
  requireSource(item.source, `evidence_ladder[${index}]`);
  if (item.secondary_source) requireSource(item.secondary_source, `evidence_ladder[${index}].secondary`);
}
for (const [index, item] of (binder.interfaces || []).entries()) requireSource(item.source, `interfaces[${index}]`);
for (const [index, source] of (binder.controlling_sources || []).entries()) requireSource(source, `controlling_sources[${index}]`);
if (!/does not extend ORION product authority/i.test(binder.claim_ceiling || "")) errors.push("Claim ceiling does not preserve ORION authority boundary");

if (errors.length) {
  console.error(errors.map((error) => `FAIL ${error}`).join("\n"));
  process.exit(1);
}
console.log(`PASS ${binder.binder_id} · ${binder.evidence_ladder.length} levels · ${binder.interfaces.length} interfaces · canonical counts unchanged`);
