import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(here, "../../../..");
const binderPath = path.join(here, "LADDER_ATLAS_BINDER_V1_2026-10-06.json");
const binder = JSON.parse(fs.readFileSync(binderPath, "utf8"));
const errors = [];
const required = ["ladder_id", "title", "family", "type", "status", "status_class", "summary", "carrier", "rungs", "operator", "invariant", "information_loss", "return_condition", "controlling_source", "last_verified", "claim_ceiling", "does_not_imply"];
const allowedClasses = new Set(["exact", "bounded", "constructed", "historical-bounded", "open", "rejected"]);

if (binder.schema !== "nexah.navigator.ladder-atlas-binder") errors.push("Unexpected binder schema");
if (!Array.isArray(binder.core_ladders) || binder.core_ladders.length !== 8) errors.push("Core must contain exactly eight ladders");
if (!Array.isArray(binder.questions) || binder.questions.length !== 4) errors.push("Exactly four orientation questions are required");
if (!binder.breath_sequencer || binder.breath_sequencer.source_trace?.length !== 21) errors.push("Breath Sequencer contract or 21-tick trace missing");
for (const key of ["instrument", "controlling_source", "historical_provenance"]) {
  if (binder.breath_sequencer?.[key] && !fs.existsSync(path.join(repositoryRoot, binder.breath_sequencer[key]))) errors.push(`Breath Sequencer missing ${key}`);
}

if (!binder.carrier_view_joint || binder.carrier_view_joint.grammar?.length !== 7) errors.push("Carrier/view joint or seven-field grammar missing");
if (!Array.isArray(binder.carrier_view_joint?.bindings) || binder.carrier_view_joint.bindings.length !== 4) errors.push("Carrier/view joint must contain four typed bindings");
for (const [index, binding] of (binder.carrier_view_joint?.bindings || []).entries()) {
  for (const key of ["source", "target", "relation", "preserves", "boundary", "evidence"]) {
    if (binding[key] === undefined || binding[key] === "" || (Array.isArray(binding[key]) && binding[key].length === 0)) errors.push(`carrier_view_joint.bindings[${index}] missing ${key}`);
  }
  for (const source of binding.evidence || []) {
    if (!fs.existsSync(path.join(repositoryRoot, source))) errors.push(`Carrier/view binding missing evidence ${source}`);
  }
}
if (binder.carrier_view_joint?.controlling_record && !fs.existsSync(path.join(repositoryRoot, binder.carrier_view_joint.controlling_record))) errors.push("Carrier/view joint controlling record missing");

if (binder.spectral_comparator?.status !== "OWNER_ACCEPTED_NEGATIVE_WITH_VALIDATED_SECONDARY_LOCALIZATION") errors.push("Euler spectral comparator must expose the accepted negative result and secondary localization");
for (const source of binder.spectral_comparator?.sources || []) {
  if (!fs.existsSync(path.join(repositoryRoot, source))) errors.push(`Spectral comparator missing source ${source}`);
}
for (const key of ["preregistration", "machine_contract", "run_contract_candidate", "implementation", "implementation_lock", "result_report", "result_json", "result_figure", "result_lock", "result_validator"]) {
  const source = binder.spectral_comparator?.[key];
  if (!source || !fs.existsSync(path.join(repositoryRoot, source))) errors.push(`Spectral comparator missing ${key}`);
}
for (const key of ["secondary_diagnostic_protocol", "secondary_diagnostic_report", "secondary_diagnostic_json", "secondary_diagnostic_figure"]) {
  const source = binder.spectral_comparator?.[key];
  if (!source || !fs.existsSync(path.join(repositoryRoot, source))) errors.push(`Spectral comparator missing ${key}`);
}
if (!/10000|10,000/.test(binder.spectral_comparator?.null_population || "")) errors.push("Spectral comparator matched-null count missing");
if (!/no best-c search/i.test(binder.spectral_comparator?.offset_guard || "")) errors.push("Spectral comparator offset/multiple-search guard missing");
if (!/descending/i.test(binder.spectral_comparator?.rank_direction_amendment || "")) errors.push("Spectral comparator rank-direction amendment missing");
if (binder.spectral_comparator?.result !== "NO_EULER_SPECIFIC_SPECTRAL_SUPPORT") errors.push("Spectral comparator result label changed");
if (binder.spectral_comparator?.secondary_diagnostic_result !== "EXTREME_CONCENTRATED") errors.push("Spectral comparator secondary localization changed");
if (binder.spectral_comparator?.owner_disposition !== "ACCEPTED_BOUNDED_NEGATIVE_2026-10-13") errors.push("Spectral comparator Owner disposition missing");

const ids = new Set();
for (const [index, ladder] of (binder.core_ladders || []).entries()) {
  for (const key of required) {
    if (ladder[key] === undefined || ladder[key] === "" || (Array.isArray(ladder[key]) && ladder[key].length === 0)) {
      errors.push(`core_ladders[${index}] missing ${key}`);
    }
  }
  if (ids.has(ladder.ladder_id)) errors.push(`Duplicate ladder_id ${ladder.ladder_id}`);
  ids.add(ladder.ladder_id);
  if (!allowedClasses.has(ladder.status_class)) errors.push(`Unknown status_class ${ladder.status_class}`);
  for (const key of ["controlling_source", "instrument", "visual"]) {
    if (ladder[key] && !fs.existsSync(path.join(repositoryRoot, ladder[key]))) errors.push(`${ladder.ladder_id}: missing ${key} ${ladder[key]}`);
  }
}

for (const item of binder.supporting_ladders || []) {
  if (item.source && !fs.existsSync(path.join(repositoryRoot, item.source))) errors.push(`Supporting ladder missing source ${item.source}`);
}

if (!(binder.historical_metaphors || []).every((item) => /only|not evidence|not a mechanism|not a mechanism class|no upgrade/i.test(item.boundary))) {
  errors.push("Every historical metaphor needs an explicit non-evidence boundary");
}

if (errors.length) {
  console.error(errors.map((error) => `FAIL ${error}`).join("\n"));
  process.exit(1);
}

console.log(`PASS ${binder.binder_id} · ${binder.core_ladders.length} core ladders · ${binder.supporting_ladders.length} supporting · ${binder.historical_metaphors.length} historical`);
