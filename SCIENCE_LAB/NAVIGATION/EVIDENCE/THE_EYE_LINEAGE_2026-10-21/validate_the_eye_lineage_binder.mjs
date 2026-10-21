import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ecosystemRoot = path.resolve(here, "../../../../../..");
const binderPath = path.join(here, "THE_EYE_LINEAGE_BINDER_V1_2026-10-21.json");
const binder = JSON.parse(fs.readFileSync(binderPath, "utf8"));
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };

check(binder.schema === "nexah.navigator.the-eye-lineage-binder/1.0.0", "Unexpected binder schema");
check(binder.status === "INTERNAL_READ_ONLY_SOURCE_BOUND_LENS", "Lens must remain internal and read-only");
check(binder.publication_authorized === false && binder.public_allowlist_state === "EMPTY_FAIL_CLOSED", "Publication must fail closed");
check(binder.changes_canonical_registry_counts === false && binder.changes_canonical_family_count === false, "Lens must not change canonical counts");
check(binder.identity_decision === "REUSE_EXISTING_THE_EYE_NEXAHEDRON_AND_ORION_IDENTITIES", "Identity decision must reuse existing identities");
check(binder.stages?.length === 7, "Expected seven lineage stages");
check(binder.relations?.length === 7, "Expected seven bounded lineage relations");
check(binder.sources?.length === 5, "Expected five public-safe sources");
check(binder.reused_identity_ids?.length === 6, "Expected six reused stable identities");
check(binder.relations?.some((item) => item.status === "non-identity" && item.to === "ORION V1 Gateway"), "ORION non-identity boundary missing");

for (const [index, source] of (binder.sources || []).entries()) {
  const resolved = path.resolve(ecosystemRoot, source.path || "");
  check(Boolean(source.path) && resolved.startsWith(ecosystemRoot + path.sep) && fs.existsSync(resolved), `sources[${index}] missing: ${source.path || "(empty)"}`);
  check(source.visibility === "public-source", `sources[${index}] must be public-source`);
  check(!source.path.includes("00 EXECUTIVE") && !source.path.startsWith("/"), `sources[${index}] leaks private or absolute path`);
}

const serialized = JSON.stringify(binder);
check(!serialized.includes("/Users/") && !serialized.includes("NEXAH-Mission-Control/REVIEWS"), "Binder exposes a private local or review path");
check(/does not activate THE EYE/i.test(binder.claim_ceiling || ""), "Claim ceiling must preserve activation boundary");

if (errors.length) {
  console.error(errors.map((error) => `FAIL ${error}`).join("\n"));
  process.exit(1);
}
console.log(`PASS ${binder.binder_id} · ${binder.stages.length} stages · ${binder.relations.length} bounded relations · public allowlist empty`);
