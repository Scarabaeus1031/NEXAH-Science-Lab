#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../..");
const binderPath = path.join(here, "FOLD_ENVELOPE_FRAME_STATE_CROSSWALK_BINDER_V1_2026-10-14.json");
const binder = JSON.parse(fs.readFileSync(binderPath, "utf8"));
const failures = [];
let checks = 0;
const check = (condition, message) => { checks += 1; if (!condition) failures.push(message); };
const sha256 = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

check(binder.node_id === "NN:FOLD_ENVELOPE_FRAME_STATE_CROSSWALK", "stable node id");
check(binder.status === "INTERNAL_SOURCE_BOUND_COMPARISON_LENS", "bounded comparison status");
check(binder.publication_authorized === false, "publication gate must remain closed");
check(binder.science_run_activated === false, "science run must remain inactive");
check(binder.changes_canonical_entity_count === false, "entity count must not change");
check(binder.changes_canonical_relation_count === false, "relation count must not change");
check(binder.changes_canonical_module_count === false, "module count must not change");
check(binder.changes_canonical_family_count === false, "family count must not change");
check(binder.identity_reuse.module_ids.includes("MOD:TESSAREC"), "Tessarec identity reuse");
check(binder.identity_reuse.module_ids.includes("MOD:NUMBER_VIEW_SUITE"), "Number/View identity reuse");
check(binder.identity_reuse.module_ids.includes("MOD:TRANSVERSUM_TWO_CUT"), "Two-Cut identity reuse");
check(binder.identity_reuse.artifact_ids.includes("ART:HTML:3EF48700E12A"), "Blue Body artifact reuse");
check(binder.identity_reuse.artifact_ids.includes("ART:HTML:D671E2655A18"), "Lunar artifact reuse");
check(binder.identity_reuse.artifact_ids.includes("ART:HTML:9DFCB2983C26"), "Ninefold Return artifact reuse");
check(binder.identity_reuse.artifact_ids.includes("ART:HTML:5EA92A749063"), "Record Play 432 artifact reuse");
check(binder.artifact_hierarchy.length === 2, "exactly two artifact records");

const blue = binder.artifact_hierarchy.find((item) => item.artifact_id === "ART:HTML:3EF48700E12A");
const lunar = binder.artifact_hierarchy.find((item) => item.artifact_id === "ART:HTML:D671E2655A18");
check(blue?.capture_group === "OWNER_CAPTURES_1_TO_3", "first three captures grouped under Blue Body");
check(blue?.capture_interpretation === "ONE_ARTIFACT_ONE_CHECK_MULTIPLE_MODES_AND_STATES", "capture interpretation");
check(blue?.check_id === "A0:CHECK:63", "Check 63 binding");
check(blue?.modes.length === 2, "two Check 63 modes");
check(blue?.states.length === 4, "four Check 63 state classes");
check(lunar?.capture_group === "OWNER_CAPTURE_4", "fourth capture remains separate");
check(lunar?.source_numbers.channel_mask_left === 110 && lunar?.source_numbers.channel_mask_right === 112, "source-local Lunar channel mask");
check(binder.number_view_sidecar.status === "OPEN_UNBOUND_OWNER_PROPOSAL", "181/202 proposal remains open");
check(binder.number_view_sidecar.binding_decision === "DO_NOT_IDENTIFY", "channel pairs must not collapse");
check(JSON.stringify(binder.number_view_sidecar.owner_proposed_channel_addresses) === JSON.stringify([181, 202]), "owner-proposed 181/202 retained");
check(JSON.stringify(binder.number_view_sidecar.source_local_lunar_channel_mask) === JSON.stringify([110, 112]), "source-local 110/112 retained");
check(binder.typed_crosswalk.length === 7, "seven local typed crosswalk records");
check(binder.typed_crosswalk.every((item) => item.does_not_imply.length >= 3), "non-identity boundaries required");
check(binder.visual_number_return_extension.status === "INTERNAL_SOURCE_BOUND_EXTENSION_NO_NEW_IDENTITY", "visual extension status");
check(binder.visual_number_return_extension.custody.length === 8, "eight owner visual custody records");
check(binder.visual_number_return_extension.typed_number_ledger.length === 6, "six typed number records");
check(binder.visual_number_return_extension.typed_number_ledger.find((item) => item.record_id === "FESN:11357")?.statement.includes("41×277"), "11357 correction retained");
check(binder.visual_number_return_extension.typed_number_ledger.find((item) => item.record_id === "FESN:4774")?.classification === "EXACT_PALINDROME_PLUS_CONSTRUCTED_ROLE_CODE", "4774 remains typed role code");
check(binder.visual_number_return_extension.typed_number_ledger.find((item) => item.record_id === "FESN:1_21_MOBIUS")?.classification === "OPEN_VIEW_RELATION_NOT_IDENTITY", "1.21/Möbius non-identity retained");
check(binder.visual_number_return_extension.custody.find((item) => item.visual_id === "OWNER_VISUAL:MOBIUS_STARWHEEL_4774")?.custody_status === "EXACT_REPOSITORY_SOURCE_HASH_BOUND", "Starwheel exact custody binding");
check(binder.visual_number_return_extension.custody.find((item) => item.visual_id === "OWNER_VISUAL:MODULAR_SHADOW_WHEEL_11357")?.custody_status === "OWNER_LOCAL_REFERENCE_CORRECTION_REQUIRED", "11357 correction gate");
check(binder.owner_transition_hypothesis.status === "OWNER_PROPOSED_OPERATIONAL_GRAMMAR_NOT_ESTABLISHED_MECHANISM", "portal mechanism claim remains bounded");
check(binder.owner_transition_hypothesis.cycle.length === 5, "five-phase portal grammar");
check(binder.owner_transition_hypothesis.cycle.some((item) => item.alias === "THETA_APERTURE"), "Theta aperture alias retained");
check(binder.owner_transition_hypothesis.cycle.some((item) => item.alias === "AU_NA_RETURN"), "AU-NA return alias retained");
check(binder.owner_transition_hypothesis.cycle.some((item) => item.alias === "DAO_CIRCLE"), "DAO circle alias retained");
check(Boolean(binder.owner_transition_hypothesis.portal_operator_contract.falsifier), "portal falsifier required");
check(binder.sources.length === 10, "ten hash-bound sources");

for (const source of binder.sources) {
  const absolute = path.resolve(repoRoot, source.path);
  check(absolute.startsWith(repoRoot + path.sep), `source path escapes repository: ${source.path}`);
  check(fs.existsSync(absolute), `source exists: ${source.path}`);
  if (fs.existsSync(absolute)) check(sha256(absolute) === source.sha256, `source hash: ${source.path}`);
}

const result = {
  status: failures.length ? "FAIL" : "PASS",
  checks,
  artifacts: binder.artifact_hierarchy.length,
  sources: binder.sources.length,
  canonical_count_changes: false,
  failures
};
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
