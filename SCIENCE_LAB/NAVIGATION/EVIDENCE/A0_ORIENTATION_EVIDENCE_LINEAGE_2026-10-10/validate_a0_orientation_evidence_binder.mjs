#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ecosystemRoot = path.resolve(here, "../../../../../..");
const binderPath = path.join(here, "A0_ORIENTATION_EVIDENCE_LINEAGE_BINDER_V1_2026-10-10.json");
const binder = JSON.parse(fs.readFileSync(binderPath, "utf8"));
const coveragePath = path.join(here, "A0_MODULE_SURFACE_COVERAGE_V1_2026-10-14.json");
const coverage = JSON.parse(fs.readFileSync(coveragePath, "utf8"));
const manifestPath = path.resolve(ecosystemRoot, coverage.source_manifest);
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

if (process.argv.includes("--nsn-glb-artwork-only")) {
  const update = binder.documentary_update_20261018.nsn_glb_artwork_cluster_return_20261023;
  expect(update?.status === "SOURCE_BOUND_BUILD_PASS_BROWSER_ACCEPTANCE_OPEN", "A0 GLB artwork status");
  expect(update?.existing_identity === "MOD:NUMBER_VIEW_SUITE" && update?.identity_action === "REUSE_EXISTING_IDENTITY", "existing module identity reused");
  expect(update?.canonical_count_effect === 0 && update?.publication_authorized === false && update?.new_global_ids?.length === 0, "no identity, count or publication effect");
  expect(update?.strongest_visual_match === "Phi_Nest_Quasicrystal.glb", "Phi Nest visual match recorded");
  expect(update?.models?.join(",") === "Phi_Nest_Quasicrystal.glb,ether_eye_dual_show.glb,ethercodex_final_poster.glb,P9_crystal_tessarec.glb,breathing_crystal_v2_1.glb,Breathing_Crystal_nBands_Prime_Wiring_FULL.glb", "six-model artwork cluster");
  expect(update?.tests?.source_integrity === 220 && update?.tests?.status === "PASS", "source integrity receipt");
  for (const source of update?.sources || []) {
    const target = path.resolve(ecosystemRoot, source.ecosystem_path);
    expect(target.startsWith(ecosystemRoot + path.sep) && fs.existsSync(target), "artwork source exists");
    if (fs.existsSync(target)) expect(hash(target) === source.sha256, "artwork source hash");
  }
  console.log(JSON.stringify({status:failures.length ? "FAIL" : "PASS", scope:"A0/NSN GLB artwork cluster currentness only", failures}, null, 2));
  process.exit(failures.length ? 1 : 0);
}

if (process.argv.includes("--finite-structure-return-only")) {
  const finiteReturn = binder.orion_finite_structure_return_20261022;
  expect(finiteReturn?.status === "PASS_EXACT_FINITE_RECALCULATION_NO_EVIDENCE_PROMOTION", "finite structure return status");
  expect(finiteReturn?.identity_reuse?.join(",") === "ART:A0:MATHEMATICAL_JOINTS,NEXAH:ORION:CAPABILITY_EVIDENCE:V1", "existing A0 and ORION identities reused");
  expect(finiteReturn?.new_canonical_ids?.length === 0 && finiteReturn?.canonical_count_effect === "NONE" && finiteReturn?.activation_effect === "NONE", "no identity, count or activation effect");
  expect(finiteReturn?.codex_provenance_axes?.map((item) => item.registry_record).join(",") === "NCX-0710,NCX-0334", "GURT and THOTH source axes retained separately");
  expect(/no direct GURT-to-THOTH/.test(finiteReturn?.codex_axis_relation || ""), "no direct GURT to THOTH link claimed");
  expect(finiteReturn?.publication_authorized === false, "publication remains unauthorized");
  for (const key of ["report", "runner", "receipt"]) {
    const target = path.resolve(ecosystemRoot, finiteReturn?.[key] || "");
    expect(target.startsWith(ecosystemRoot + path.sep) && fs.existsSync(target), `finite structure ${key} exists`);
  }
  const receiptPath = path.resolve(ecosystemRoot, finiteReturn?.receipt || "");
  if (fs.existsSync(receiptPath)) {
    const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
    expect(receipt.status === "PASS_EXACT_FINITE_RECALCULATION", "receipt status");
    expect(receipt.crt_lift?.five_fold_orbit_lift === true, "five-fold CRT orbit lift");
    expect(receipt.audits?.map((item) => item.orbit_count).join(",") === "147,75,200,1000", "declared orbit totals");
  }
  console.log(JSON.stringify({status:failures.length ? "FAIL" : "PASS", scope:"A0 to ORION exact finite structure return only", failures}, null, 2));
  process.exit(failures.length ? 1 : 0);
}

// Scope check for current documentary receipts; default historical validation
// remains unchanged and continues to report its pre-existing hash drift.
if (process.argv.includes("--documentary-only")) {
  const update = binder.documentary_update_20261018;
  expect(update?.status === "DOCUMENTARY_CURRENT_SOURCE_RETURN_NO_EVIDENCE_PROMOTION", "documentary status");
  expect(update?.sources?.length === 9, "nine current documentary sources");
  expect(update?.canonical_count_effect === "NONE" && update?.activation_effect === "NONE" && update?.publication_authorized === false, "documentary authority boundary");
  expect(update?.bench_build === "PARKED_NO_AUTOMATIC_RESUMPTION", "Bench pause retained");
  expect(update?.scientific_return === "A0_SCIENCE_DESK", "Science Desk is central return");
  expect(update?.historical_integrity?.mismatched_source_ids?.length === 10, "historical hash drift disclosed");
  const appDir = path.resolve(here, "../../APP");
  for (const source of update?.sources || []) {
    const target = path.resolve(ecosystemRoot, source.ecosystem_path);
    expect(target.startsWith(ecosystemRoot + path.sep), "documentary source within ecosystem");
    expect(fs.existsSync(target), "documentary source exists: " + source.title);
    if (!fs.existsSync(target)) continue;
    expect(hash(target) === source.sha256, "documentary source hash: " + source.title);
    const [href, anchor] = source.href.split("#");
    expect(path.resolve(appDir, decodeURIComponent(href)) === target, "documentary href matches source: " + source.title);
    if (anchor) expect(fs.readFileSync(target, "utf8").includes('id="' + anchor + '"'), "documentary anchor: " + source.title);
  }
  const desk = update?.sources?.find(source => source.title.startsWith("Science Desk"));
  if (desk) {
    const html = fs.readFileSync(path.resolve(ecosystemRoot, desk.ecosystem_path), "utf8");
    expect(html.includes('id="documentary-return-20261018"'), "Desk chronology updated");
  }
  console.log(JSON.stringify({status:failures.length ? "FAIL" : "PASS", scope:"nine current documentary receipts only; not historical binder integrity", failures}, null, 2));
  process.exit(failures.length ? 1 : 0);
}

expect(binder.schema === "nexah.navigator.a0-orientation-evidence-lineage-binder/1.0.0", "schema");
expect(binder.status === "INTERNAL_READ_ONLY_SOURCE_BOUND_LENS", "status");
expect(binder.route === "#a0-orientation-evidence", "route");
expect(binder.publication_authorized === false, "publication boundary");
expect(binder.changes_canonical_registry_counts === false, "registry count boundary");
expect(binder.changes_canonical_family_count === false, "family count boundary");
expect(binder.identity_reuse?.a0_surface_entity_id === "ART:A0:MATHEMATICAL_JOINTS", "A0 identity reuse");
expect(binder.identity_reuse?.a0_module_entity_id === "MOD:NUMBER_VIEW_SUITE", "module identity reuse");
expect(binder.identity_reuse?.ols_release_id === "OLS-RELEASE-1.0.0", "OLS release identity");
expect(binder.spin_to_bloom_measurement_return_20261029?.status === "SOURCE_BOUND_ENGINEERING_MEASUREMENT_NO_ADMISSION", "Spin to Bloom bounded measurement status");
expect(binder.spin_to_bloom_measurement_return_20261029?.identity_reuse?.includes("ART:A0:MATHEMATICAL_JOINTS"), "Spin to Bloom reuses Mathematical Joints identity");
expect(binder.spin_to_bloom_measurement_return_20261029?.measurement?.return_candidate?.tips === 11 && binder.spin_to_bloom_measurement_return_20261029?.measurement?.return_candidate?.yz_events === 11 && binder.spin_to_bloom_measurement_return_20261029?.measurement?.return_candidate?.address_slots === 121, "Spin to Bloom 5:6 finite measurement");
expect(binder.spin_to_bloom_measurement_return_20261029?.measurement?.control_tip_counts?.join(",") === "10,10,11,12,13", "Spin to Bloom declared finite controls");
expect(binder.spin_to_bloom_measurement_return_20261029?.identity_reuse?.includes("MOD:TESSAREC"), "Spin to Bloom reuses Tessarec identity for subordinate System D adapter");
expect(binder.spin_to_bloom_measurement_return_20261029?.measurement?.software_checks === 306, "Spin to Bloom Root Field Edelweiss adapter, master transport, guided tour, membrane rig, wiggle diagnostic and Lamella Bridge software checks");
expect(binder.spin_to_bloom_measurement_return_20261029?.measurement?.membrane_rig_demonstrator?.status === "PASS_BOUNDED_KINEMATIC_VIEW_MATERIAL_HOLD" && binder.spin_to_bloom_measurement_return_20261029?.measurement?.membrane_rig_demonstrator?.rod_count === 11 && binder.spin_to_bloom_measurement_return_20261029?.measurement?.membrane_rig_demonstrator?.panel_count === 11 && binder.spin_to_bloom_measurement_return_20261029?.measurement?.membrane_rig_demonstrator?.edge_cut_count === 11, "Spin to Bloom membrane rig bounded counts and material hold");
expect(binder.spin_to_bloom_measurement_return_20261029?.measurement?.counterrotation_shadow_view?.status === "PASS_BACKWARD_HOLD_FORWARD_VIEW" && binder.spin_to_bloom_measurement_return_20261029?.measurement?.counterrotation_shadow_view?.apparent_direction_sequence?.slice(0, 3).join(",") === "BACKWARD,HOLD,FORWARD", "Spin to Bloom counterrotation apparent shadow reversal view");
expect(binder.spin_to_bloom_measurement_return_20261029?.measurement?.wiggle_return_diagnostic?.status === "PASS_DECLARED_CAPTURE" && binder.spin_to_bloom_measurement_return_20261029?.measurement?.wiggle_return_diagnostic?.channels === 11, "Spin to Bloom declared wiggle capture diagnostic");
expect(binder.spin_to_bloom_measurement_return_20261029?.measurement?.root_field_edelweiss_bench_adapter?.status === "PASS_SOURCE_OWNED_TYPED_ADAPTER" && binder.spin_to_bloom_measurement_return_20261029?.measurement?.root_field_edelweiss_bench_adapter?.runtime_global === "A0SpinToBloomBench", "Spin to Bloom source-owned Bench adapter");
expect(binder.spin_to_bloom_measurement_return_20261029?.measurement?.root_field_edelweiss_bench_adapter?.attachment === "SYSTEM D · NATIVE DODECA / MOD:TESSAREC" && binder.spin_to_bloom_measurement_return_20261029?.measurement?.root_field_edelweiss_bench_adapter?.new_system === false, "Edelweiss remains subordinate to existing System D and Tessarec");
expect(binder.spin_to_bloom_measurement_return_20261029?.measurement?.root_field_edelweiss_bench_adapter?.bloom_tips === 12 && binder.spin_to_bloom_measurement_return_20261029?.measurement?.root_field_edelweiss_bench_adapter?.white_dodeca_slots === 12 && binder.spin_to_bloom_measurement_return_20261029?.measurement?.root_field_edelweiss_bench_adapter?.exact_fit === true, "Edelweiss exact 12-tip to 12-slot display fit");
expect(binder.spin_to_bloom_measurement_return_20261029?.measurement?.root_field_edelweiss_bench_adapter?.methods?.includes("startAll") && binder.spin_to_bloom_measurement_return_20261029?.measurement?.root_field_edelweiss_bench_adapter?.methods?.includes("pauseAll") && binder.spin_to_bloom_measurement_return_20261029?.measurement?.root_field_edelweiss_bench_adapter?.methods?.includes("holdReturn"), "Spin to Bloom master transport methods remain on source-owned Bench adapter");
expect(binder.spin_to_bloom_measurement_return_20261029?.measurement?.guided_tour?.status === "PASS_CLICK_INITIATED_GUIDED_VIEW" && binder.spin_to_bloom_measurement_return_20261029?.measurement?.guided_tour?.runtime_global === "A0SpinToBloomTour" && binder.spin_to_bloom_measurement_return_20261029?.measurement?.guided_tour?.stations === 8 && binder.spin_to_bloom_measurement_return_20261029?.measurement?.guided_tour?.autostart === false, "Spin to Bloom guided tour is click-initiated and bounded");
expect(binder.spin_to_bloom_measurement_return_20261029?.measurement?.klein_lamella_return_bridge?.lamella_ids === 11 && binder.spin_to_bloom_measurement_return_20261029?.measurement?.klein_lamella_return_bridge?.ring_planes === 11, "Klein Lamella 11-to-11 crosswalk");
expect(binder.spin_to_bloom_measurement_return_20261029?.measurement?.klein_lamella_return_bridge?.return === "PASS_EXACT_DECLARED_SOURCE_STATE_RETURN", "Klein Lamella exact declared source-state return");
expect(binder.spin_to_bloom_measurement_return_20261029?.new_canonical_ids?.length === 0 && binder.spin_to_bloom_measurement_return_20261029?.relation_changes?.length === 0 && binder.spin_to_bloom_measurement_return_20261029?.finding_or_manuscript_effect === "NONE", "Spin to Bloom no identity relation or manuscript effect");
for (const relative of [binder.spin_to_bloom_measurement_return_20261029?.instrument, binder.spin_to_bloom_measurement_return_20261029?.machine_return]) expect(fs.existsSync(path.resolve(ecosystemRoot, "30 SCIENCE LAB/NEXAH-Science-Lab/RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01", relative || "")), "Spin to Bloom source exists: " + relative);
const panelVReturn = binder.lantern_panel_v_control_lens_return_20261029;
expect(panelVReturn?.status === "SOURCE_BOUND_ENGINEERING_VIEW_RETURN_NO_ADMISSION", "Panel V source-bound engineering return status");
expect(panelVReturn?.identity_reuse?.join(",") === "ART:A0:MATHEMATICAL_JOINTS,NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1", "Panel V reuses Mathematical Joints and A0 Evidence identities");
expect(Object.keys(panelVReturn?.role_routes || {}).join(",") === "source_asset,module_tool,bench_configuration,demonstrator,toy_store_consumer_cut,record_return,glb_view,science_return,mathfield_return,paper_triage,a0_register_locator", "Panel V production roles remain explicit");
expect(panelVReturn?.new_canonical_ids?.length === 0 && panelVReturn?.relation_changes?.length === 0 && panelVReturn?.finding_or_manuscript_effect === "NONE", "Panel V no identity relation or manuscript effect");
expect(panelVReturn?.working_notation_hold?.length === 5 && /File proximity/.test(panelVReturn?.claim_boundary || ""), "Panel V Working Notation and file-proximity boundary");
expect(panelVReturn?.fold_pocket_contract?.pairs === 5 && panelVReturn?.fold_pocket_contract?.view_sequence?.join("→") === "LEAF_CLOSED→SLIT_RELEASE→POCKET_OPEN→EXACT_RETURN", "Panel V five Fold Pockets and exact view return");
expect(panelVReturn?.fold_pocket_contract?.tip_observation_register === 11 && panelVReturn?.fold_pocket_contract?.ordered_address_slots === 121 && panelVReturn?.fold_pocket_contract?.notation_status === "WORKING_NOTATION_HOLD", "Panel V 11-tip n-squared register and notation HOLD");
for (const relative of [...Object.values(panelVReturn?.role_routes || {}).map((item) => String(item).split("#")[0]), ...Object.values(panelVReturn?.source_inventory || {})]) {
  const target = path.resolve(ecosystemRoot, "30 SCIENCE LAB/NEXAH-Science-Lab/RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01", relative);
  expect(target.startsWith(ecosystemRoot + path.sep) && fs.existsSync(target), "Panel V bound route exists: " + relative);
}
const benchReturnCrosswalk = binder.bench_science_return_crosswalk_20261029;
expect(benchReturnCrosswalk?.status === "SOURCE_BOUND_ROUTE_CROSSWALK_NO_ADMISSION", "Bench to Science return crosswalk status");
expect(benchReturnCrosswalk?.route_stages?.join("→") === "source→module→bench_configuration→demonstrator→receipt→science_desk→evidence_status", "Bench return seven-stage route");
expect(benchReturnCrosswalk?.artifacts?.length === 6, "Bench return crosswalk binds six existing artifacts");
expect(benchReturnCrosswalk?.artifacts?.some((item) => item.name === "Pentagon Crown demonstrator UI cut" && item.evidence_status === "PASS_WITH_MECHANISM_AND_CALIBRATION_HOLDS"), "Pentagon Crown receipt reaches existing Science Desk authority");
expect(benchReturnCrosswalk?.artifacts?.some((item) => item.name === "Panel V Fold Pocket and Joint Microscope" && /N2_121_WORKING_NOTATION_HOLD/.test(item.evidence_status || "")), "Panel V Fold Pocket and Joint Microscope return bound");
expect(benchReturnCrosswalk?.artifacts?.some((item) => /Root→Field→Edelweiss adapter/.test(item.name || "") && /EDELWEISS_12_SLOT_TYPED_ADAPTER/.test(item.evidence_status || "") && /#edelweissBridge$/.test(item.demonstrator || "")), "Root Field Edelweiss adapter reaches existing Science Desk route");
expect(benchReturnCrosswalk?.new_canonical_ids?.length === 0 && benchReturnCrosswalk?.relation_changes?.length === 0 && benchReturnCrosswalk?.finding_or_manuscript_effect === "NONE", "Bench return crosswalk creates no identity relation or Finding");
for (const artifact of benchReturnCrosswalk?.artifacts || []) {
  for (const field of benchReturnCrosswalk.route_stages.slice(0, -1)) {
    const relative = String(artifact[field] || "").split("#")[0];
    const target = path.resolve(ecosystemRoot, "30 SCIENCE LAB/NEXAH-Science-Lab/RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01", relative);
    expect(target.startsWith(ecosystemRoot + path.sep) && fs.existsSync(target), `Bench return ${artifact.name} ${field} exists: ${relative}`);
  }
}
const canonicalFlagship = binder.canonical_flagship_reference_20261029;
expect(canonicalFlagship?.status === "CURRENT_CANONICAL_SOURCE_BOUND_REFERENCE_FROZEN", "canonical Panel V Crown return reference frozen");
expect(canonicalFlagship?.identity_reuse?.join(",") === "ART:A0:MATHEMATICAL_JOINTS,NEXAH:A0_ORIENTATION_EVIDENCE_LINEAGE:V1,NEXAH_A0_ORIENTATION_CONTROLLER_BENCH", "canonical flagship reuses existing identities");
expect(Object.values(canonicalFlagship?.authority_bindings || {}).join(",") === "I-46Q,I-46R,I-46S,I-46S.2,I-46S.4", "I-46Q through I-46S.4 authority bindings retained");
expect(canonicalFlagship?.chain?.map((item) => item.stage).join("→") === "Lantern / Panel V→Pentagon Crown→Exact Return→Science Desk Receipt", "canonical flagship four-stage route");
expect(canonicalFlagship?.new_canonical_ids?.length === 0 && canonicalFlagship?.relation_changes?.length === 0 && canonicalFlagship?.finding_or_manuscript_effect === "NONE" && canonicalFlagship?.publication_authorized === false, "canonical flagship has no identity relation Finding or publication effect");
for (const item of canonicalFlagship?.chain || []) {
  for (const route of [item.href, item.receipt]) {
    const relative = String(route || "").split("#")[0];
    const target = path.resolve(ecosystemRoot, "30 SCIENCE LAB/NEXAH-Science-Lab/RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01", relative);
    expect(target.startsWith(ecosystemRoot + path.sep) && fs.existsSync(target), `canonical flagship route exists: ${relative}`);
  }
}
expect(binder.reader_architecture?.status === "EDITORIAL_NAVIGATION_FRAME_NO_NEW_IDENTITY", "A0 reader architecture status");
expect(binder.reader_architecture?.works?.length === 6, "six A0 reader works");
expect(binder.reader_architecture?.works?.map((item) => item.label).join("→") === "A0 Book→Mathfield→Pascal Joint→SCC-003 Paper→Return Paper→Backlog", "A0 reader work order");
expect(binder.reader_architecture?.current_research_entry?.status === "READ_ONLY_EDITORIAL_CURRENTNESS_NO_OPERATIONAL_EFFECT", "A0 current research entry status");
expect(binder.reader_architecture?.current_research_entry?.entries?.map((item) => item.label).join("→") === "Living Protocol→Backlog→Findings & Papers→SCC-003 Review Packet→Scientific Assessment→Paper C · Return→Evidence Lineage", "A0 current research entry order");
expect(/non-executable/.test(binder.reader_architecture?.current_research_entry?.closeout || ""), "A0-BL-051 remains non-executable");
expect(/not additional A0 works/.test(binder.reader_architecture?.instrument_boundary || ""), "embedded instrument boundary");
expect(binder.sources?.length === 119, "one hundred nineteen controlling sources");
expect(["SRC:A0OE:PENTAGON_KNICK_APERTURE_INTAKE_README", "SRC:A0OE:PENTAGON_KNICK_APERTURE_LAB", "SRC:A0OE:PENTAGON_11_WINDS_REFERENCE", "SRC:A0OE:PENTAGON_CURTAIN_LAB", "SRC:A0OE:PENTAGON_CURTAIN_SEAM_TEST", "SRC:A0OE:PENTAGON_CURTAIN_CONSTRUCTION_VISUAL", "SRC:A0OE:PENTAGON_GELENKLATERNE_LAB", "SRC:A0OE:PENTAGON_GELENKLATERNE_REPORT", "SRC:A0OE:A9_SIX_STRIP_PACKAGE", "SRC:A0OE:TEILER_STREIFEN_DESK_V4"].every((id) => binder.sources.some((item) => item.source_id === id)), "Pentagon Curtain, Gelenklaterne and A9 intake sources hash-bound");
expect(binder.pentagon_knick_aperture_intake_20261025?.status === "PARKED_SOURCE_BOUND_INTAKE_NO_ADMISSION" && binder.pentagon_knick_aperture_intake_20261025?.relation_changes?.length === 0 && /not an eleven-fold symmetry/.test(binder.pentagon_knick_aperture_intake_20261025?.boundary || "") && /A9 is a newly constructed geometry candidate/.test(binder.pentagon_knick_aperture_intake_20261025?.boundary || "") && /Community remains a Mathfield partition role/.test(binder.pentagon_knick_aperture_intake_20261025?.boundary || ""), "Pentagon Curtain A9 and F8/F9/Community boundary");
expect(binder.pentagon_knick_aperture_intake_20261025?.instrument_atlas?.status === "SOURCE_BOUND_NAVIGATION_LAYER_NO_NEW_IDENTITY" && binder.pentagon_knick_aperture_intake_20261025?.instrument_atlas?.door_count === 12 && binder.pentagon_knick_aperture_intake_20261025?.instrument_atlas?.contract_fields?.join("→") === "carrier→view→return→boundary" && /not the controlling Mission Control Builder Atlas/.test(binder.pentagon_knick_aperture_intake_20261025?.instrument_atlas?.boundary || ""), "Instrument Atlas return and non-authority boundary");
expect(binder.sources?.some((item) => item.source_id === "SRC:A0OE:A0_EXPERIENCE_NAVIGATION_FREEZE_RETURN" && /zero canonical-count/.test(item.authority_role)), "A0 experience freeze return retained with no-count boundary");
expect(binder.sources?.some((item) => item.source_id === "SRC:A0OE:A0_EXPERIENCE_NAVIGATION_FREEZE_MC_RETURN" && /reciprocal Mission Control/.test(item.authority_role)), "reciprocal Mission Control experience-freeze return retained");
expect(binder.a0_surface_coverage?.coverage_id === coverage.coverage_id && binder.a0_surface_coverage?.bound_surfaces === 83 && binder.a0_surface_coverage?.work_groups === 13, "A0 83-of-83 surface coverage binding");
expect(coverage.status === "INTERNAL_SOURCE_BOUND_COVERAGE_NO_NEW_IDENTITY", "A0 surface coverage status");
expect(coverage.expected_surface_count === 83 && coverage.bound_surface_count === 83 && coverage.unbound_surfaces?.length === 0, "A0 surface coverage counts");
expect(coverage.policy_effect?.changes_canonical_counts === false && coverage.policy_effect?.creates_module_identity === false && coverage.policy_effect?.activates_study === false && coverage.policy_effect?.promotes_evidence === false && coverage.policy_effect?.authorizes_publication === false, "A0 surface coverage policy boundary");
const coveredSurfaces = coverage.work_bindings.flatMap((item) => item.surfaces).sort();
const manifestSurfaces = manifest.surface_registry.map((item) => item.surface).sort();
expect(new Set(coveredSurfaces).size === coverage.expected_surface_count && JSON.stringify(coveredSurfaces) === JSON.stringify(manifestSurfaces), "A0 surface coverage exactly matches manifest registry");
expect(binder.sources?.some((item) => item.source_id === "SRC:A0OE:A0_MODULE_SURFACE_COVERAGE" && item.sha256 === hash(coveragePath)), "A0 coverage sidecar source and hash");
expect(["SRC:A0OE:PINK_DIAMOND_GRID_ATLAS", "SRC:A0OE:VISUAL_FIELD_LIBRARY", "SRC:A0OE:VISUAL_FIELD_LIBRARY_REGISTRY", "SRC:A0OE:DEMONSTRATOR_CONSOLIDATION_101_106"].every((id) => binder.sources.some((item) => item.source_id === id)), "A0 grid atlas, visual library, registry and consolidation source-bound");
expect(binder.demonstrator_source_registry?.owner === "NEXAH Science Lab" && binder.demonstrator_source_registry?.records?.length === 9 && binder.demonstrator_source_registry?.new_demonstrator_template?.required_fields?.includes("return_path"), "Science Lab-owned demonstrator source registry and reusable template");
for (const record of binder.demonstrator_source_registry?.records?.slice(3) || []) {
  for (const field of binder.demonstrator_source_registry.new_demonstrator_template.required_fields) expect(record[field] !== undefined, `registered current demonstrator carries ${field}: ${record.label}`);
  const relativePath = String(record.canonical_path || "").split("#")[0];
  const target = path.resolve(ecosystemRoot, "30 SCIENCE LAB/NEXAH-Science-Lab/RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01", relativePath);
  expect(target.startsWith(ecosystemRoot + path.sep) && fs.existsSync(target), `registered current demonstrator source exists: ${record.label}`);
  if (fs.existsSync(target)) expect(hash(target) === record.sha256, `registered current demonstrator hash matches: ${record.label}`);
}
expect(["SRC:A0OE:A0_CHECK58_CLOSEOUT", "SRC:A0OE:A0_AXIAL_CARRIER_SUITE", "SRC:A0OE:A0_AXIAL_CARRIER_MACHINE_RECORD", "SRC:A0OE:A0_COVERAGE_LINK_AUDIT", "SRC:A0OE:A0_BOOK_MANIFEST_CHECK58", "SRC:A0OE:A0_ORIENTATION_MACHINE", "SRC:A0OE:A0_RESEARCH_DESK_CHECK58", "SRC:A0OE:A0_CHECK58_FREEZE_RECORD", "SRC:A0OE:A0_CHECK58_FREEZE_MANIFEST", "SRC:A0OE:A0_CHECK58_MISSION_CONTROL_RETURN"].every((id) => binder.sources.some((item) => item.source_id === id)), "Check 58 integration freeze and Mission Control return sources bound");
expect(["SRC:A0OE:FINDINGS_PAPER_WORKSPACE", "SRC:A0OE:PASCAL_ROSETTA_D30_PAPER_DRAFT", "SRC:A0OE:RETURN_WITHOUT_IDENTITY_PAPER_DRAFT"].every((id) => binder.sources.some((item) => item.source_id === id)), "A0 findings workspace, D30 companion and Return-without-identity paper source-bound");
expect(["SRC:A0OE:SCIENTIFIC_POSITION_ASSESSMENT", "SRC:A0OE:SCIENTIFIC_POSITION_REPORT_HTML", "SRC:A0OE:SCIENTIFIC_POSITION_MISSION_CONTROL_RETURN"].every((id) => binder.sources.some((item) => item.source_id === id)), "A0 scientific assessment, reader report and Mission Control return source-bound");
expect(["SRC:A0OE:SCC003_EXTERNAL_REVIEW_PACKET_MANIFEST", "SRC:A0OE:SCC003_EXTERNAL_REVIEW_OWNER_DECISION"].every((id) => binder.sources.some((item) => item.source_id === id)), "SCC-003 external review packet and Owner decision source-bound");
expect(["SRC:A0OE:A0_CONTEXT_NAVIGATION_CSS", "SRC:A0OE:A0_CONTEXT_NAVIGATION_JS"].every((id) => binder.sources.some((item) => item.source_id === id)), "A0 context navigation assets source-bound");
expect(binder.nodes?.length === 28, "twenty-eight lens nodes");
expect(binder.relations?.length === 41, "forty-one typed relations");
expect(binder.aliases?.length === 22, "twenty-two alias groups");
expect(binder.human_view?.view_id === "A0OE:ONE_LOOP_HUMAN_VIEW" && binder.human_view?.status === "HISTORICAL_SOURCE_BOUND_NON_EVIDENTIARY", "ONE LOOP Human View status and identity");
expect(binder.human_view?.source_ids?.length === 5 && binder.human_view?.a0_theme_bindings?.length === 5, "ONE LOOP Human View source and A0 theme bindings");
expect(binder.human_view?.mathematical_check?.status === "EXACT_ELEMENTARY_HYPERCUBE_COMBINATORICS" && binder.human_view?.mathematical_check?.general_rule?.vertices === "V(Q_n)=2^n" && binder.human_view?.mathematical_check?.general_rule?.edges === "E(Q_n)=n*2^(n-1)", "Human View exact hypercube counting rule");
expect(binder.human_view?.mathematical_check?.q3?.vertices === 8 && binder.human_view?.mathematical_check?.q3?.edges === 12 && binder.human_view?.mathematical_check?.q4?.vertices === 16 && binder.human_view?.mathematical_check?.q4?.edges === 32, "Q3 and Q4 exact vertex and edge counts");
expect(binder.human_view?.mathematical_check?.q4?.layer_counts?.vertices === "8+8=16" && binder.human_view?.mathematical_check?.q4?.layer_counts?.edges === "12+12+8=32" && /P1 and P2 remain source or projection labels/.test(binder.human_view?.mathematical_check?.label_boundary || "") && /no Numbermagick or NEXAH Codex/.test(binder.human_view?.mathematical_check?.claim_boundary || ""), "Q4 two-layer decomposition and label/claim boundaries");
expect(["SRC:A0OE:ONE_LOOP_README", "SRC:A0OE:ONE_LOOP_PRIME_PETALS", "SRC:A0OE:ONE_LOOP_PETALS", "SRC:A0OE:ONE_LOOP_SPIRAL_PULSE", "SRC:A0OE:ONE_LOOP_JANUS_NEON"].every((id) => binder.sources.some((item) => item.source_id === id)), "ONE LOOP Human View sources hash-bound");
expect(binder.nodes.some((item) => item.node_id === "A0OE:ONE_LOOP_HUMAN_VIEW" && item.kind === "historical-human-view" && item.source_ids?.length === 5), "ONE LOOP Human View lens-local node");
expect(binder.relations.some((item) => item.relation_id === "A0OE:REL:ONE_LOOP_A0" && item.type === "historical-predecessor" && /does not recover/.test(item.claim_boundary || "")), "ONE LOOP to A0 historical visual lineage boundary");
expect(binder.relations.some((item) => item.relation_id === "A0OE:REL:ONE_LOOP_ORIENTATION_DEMONSTRATORS" && item.type === "illustrative-crosswalk" && /do not establish version succession/.test(item.claim_boundary || "")), "ONE LOOP Orientation Demonstrator crosswalk boundary");
expect(binder.sources.some((item) => item.source_id === "SRC:A0OE:A0_BOUNDARY_GRAPH_DEMONSTRATOR" && /no new Study/.test(item.authority_role || "")), "A0 Boundary Graph view and no-new-study boundary");
expect(binder.nodes.some((item) => item.node_id === "ART:A0:MATHEMATICAL_JOINTS" && item.source_ids.includes("SRC:A0OE:A0_BOUNDARY_GRAPH_DEMONSTRATOR")), "A0 Boundary Graph reuses Mathematical Joints identity");
expect(binder.nodes.some((item) => item.node_id === "ART:A0:MATHEMATICAL_JOINTS" && ["SRC:A0OE:A0_AXIAL_CARRIER_SUITE", "SRC:A0OE:A0_CHECK58_FREEZE_MANIFEST"].every((id) => item.source_ids.includes(id))), "Check 58 reuses Mathematical Joints identity");
expect(binder.nodes.some((item) => item.node_id === "ART:A0:MATHEMATICAL_JOINTS" && ["SRC:A0OE:SCIENTIFIC_POSITION_ASSESSMENT", "SRC:A0OE:SCIENTIFIC_POSITION_REPORT_HTML", "SRC:A0OE:SCIENTIFIC_POSITION_MISSION_CONTROL_RETURN"].every((id) => item.source_ids.includes(id))), "A0 scientific assessment reuses Mathematical Joints identity");
expect(binder.nodes.some((item) => item.node_id === "A0OE:PASCAL_PENTAGON_D5_TEST" && ["SRC:A0OE:SCC003_EXTERNAL_REVIEW_PACKET_MANIFEST", "SRC:A0OE:SCC003_EXTERNAL_REVIEW_OWNER_DECISION"].every((id) => item.source_ids.includes(id))), "SCC-003 external review reuses Pascal pentagon identity");
expect(binder.pascal_pentagon_suite?.external_review?.state === "OWNER_AUTHORIZED_PACKET_VALIDATED_AWAITING_NAMED_REVIEWER" && /No novelty promotion/.test(binder.pascal_pentagon_suite?.external_review?.claim_boundary || ""), "SCC-003 external review authorization and claim boundary");
expect(binder.nodes.some((item) => item.node_id === "ART:A0:MATHEMATICAL_JOINTS" && item.source_ids.includes("SRC:A0OE:PASCAL_FIBONACCI_MOBIUS_ARCHAEOLOGY") && item.source_ids.includes("SRC:A0OE:ROOT_ROOM_537_CONTRACT")), "A0 archaeology and Root-Room contract reuse Mathematical Joints identity");
expect(binder.nodes.some((item) => item.node_id === "ART:A0:MATHEMATICAL_JOINTS" && item.source_ids.includes("SRC:A0OE:OPERATOR_ORDER_RETURN_ARCHAEOLOGY")), "operator/order/return archaeology reuses Mathematical Joints identity");
expect(binder.nodes.some((item) => item.node_id === "ART:A0:MATHEMATICAL_JOINTS" && item.source_ids.includes("SRC:A0OE:PASCAL_GENERATION_CORNER_CROSSWALK")), "Pascal/Generation Corner crosswalk reuses Mathematical Joints identity");
expect(binder.nodes.some((item) => item.node_id === "ART:A0:MATHEMATICAL_JOINTS" && item.source_ids.includes("SRC:A0OE:PASCAL_GENERATION_CORNER_INSTRUMENT") && item.source_ids.includes("SRC:A0OE:PASCAL_GENERATION_RETURN_TEST_DRAFT")), "Pascal/Generation Corner instrument and test draft reuse Mathematical Joints identity");
expect(binder.sources.some((item) => item.source_id === "SRC:A0OE:PASCAL_ROSETTA_D30_AUDIT" && /non-factorization/.test(item.authority_role || "")), "Pascal–Rosetta D30 formal audit source-bound");
expect(binder.nodes.some((item) => item.node_id === "A0OE:PASCAL_PENTAGON_D5_TEST" && item.source_ids.includes("SRC:A0OE:PASCAL_ROSETTA_D30_AUDIT")), "D30 audit reuses Pascal pentagon lens identity");
expect(["SRC:A0OE:PASCAL_LISSAJOUS_MOBIUS_RETURN", "SRC:A0OE:PASCAL_INTRINSIC_SEAM_HOLONOMY", "SRC:A0OE:NCS_292_DUAL_AXIS_Q106_BRIDGE", "SRC:A0OE:NCS_292_Q106_INTERTWINER_RETURN", "SRC:A0OE:NCS_292_Q106_INTERTWINER_EXPLORER", "SRC:A0OE:NCS_X20_Q106_ADJACENCY_INTERTWINER_AUDIT", "SRC:A0OE:NCS_X20_TYPED_CARRIER_PCPD_Q106_AUDIT", "SRC:A0OE:TRIPLE19_X40_C2_ORIENTATION_FACTOR_AUDIT", "SRC:A0OE:TRIPLESIX_S3_CUBE_GRID_FOLD_AUDIT", "SRC:A0OE:GENERAL_COORDINATE_FOLD_RETURN_AUDIT", "SRC:A0OE:GRID_FOLD_CHANNEL_CONTRACT_AUDIT"].every((id) => binder.sources.some((item) => item.source_id === id)), "Pascal NCS Q106 return and Grid-Fold-Channel sources bound");
expect(binder.identity_reuse?.nn_return_crosswalk_node_id === "NN:MRB_ACR_NCS_Q106_RETURN_CROSSWALK" && binder.sources.some((item) => item.source_id === "SRC:A0OE:NN_MRB_ACR_NCS_Q106_RETURN_CROSSWALK"), "existing NN return crosswalk source-bound without duplicate identity");

const sourceIds = new Set(binder.sources.map((item) => item.source_id));
expect(sourceIds.size === binder.sources.length, "unique source IDs");
for (const source of binder.sources || []) {
  const sourcePath = path.resolve(ecosystemRoot, source.ecosystem_path);
  expect(sourcePath.startsWith(ecosystemRoot + path.sep), `source escapes ecosystem: ${source.source_id}`);
  expect(fs.existsSync(sourcePath), `missing source: ${source.source_id}`);
  if (fs.existsSync(sourcePath)) expect(hash(sourcePath) === source.sha256, `hash mismatch: ${source.source_id}`);
}

const nodeIds = new Set(binder.nodes.map((item) => item.node_id));
expect(nodeIds.size === binder.nodes.length, "unique node IDs");
for (const node of binder.nodes || []) {
  expect(node.source_ids?.every((id) => sourceIds.has(id)), `unknown node source: ${node.node_id}`);
}

const allowedTypes = new Set(["contains-view", "method-grammar", "tested-transform", "empirical-support", "negative-control", "historical-predecessor", "negative-boundary", "non-identity", "qualified-comparator", "illustrative-crosswalk", "contextualizes", "documentary-source"]);
const allowedStatuses = new Set(["verified", "bounded", "historical"]);
const relationIds = new Set();
for (const relation of binder.relations || []) {
  expect(!relationIds.has(relation.relation_id), `duplicate relation ID: ${relation.relation_id}`);
  relationIds.add(relation.relation_id);
  expect(nodeIds.has(relation.source) && nodeIds.has(relation.target), `unknown relation endpoint: ${relation.relation_id}`);
  expect(allowedTypes.has(relation.type), `unknown relation type: ${relation.relation_id}`);
  expect(allowedStatuses.has(relation.status), `unknown relation status: ${relation.relation_id}`);
  expect(relation.claim_boundary?.length > 30, `short relation boundary: ${relation.relation_id}`);
}

expect(binder.relations.some((item) => item.type === "non-identity" && item.source === "A0OE:OVR_NVC" && item.target === "OLS-RELEASE-1.0.0"), "OVR/NVC to OLS non-identity boundary");
expect(binder.relations.some((item) => item.type === "qualified-comparator" && item.source === "A0OE:GLF01" && /Complexity is ambiguous without a declared metric/.test(item.claim_boundary)), "GLF-01 comparator and metric boundary");
expect(binder.relations.some((item) => item.type === "method-grammar" && item.source === "A0OE:GAVP01" && /operation rule, application event, result object/.test(item.statement)), "GAVP-01 operation typing");
expect(binder.relations.some((item) => item.type === "negative-boundary" && item.source === "A0OE:RRR01" && /Return is not erasure/.test(item.claim_boundary)), "RRR-01 return boundary");
expect(binder.relations.some((item) => item.type === "method-grammar" && item.source === "A0OE:EMP04" && /spatial partition, hierarchy, orthogonal state/.test(item.statement)), "EMP-04 state-transition separation");
expect(binder.relations.some((item) => item.type === "qualified-comparator" && item.source === "A0OE:ZERO01" && /standard control structure only/.test(item.claim_boundary)), "ZERO-01 standard-control boundary");
expect(binder.relations.some((item) => item.type === "empirical-support" && item.source === "A0OE:TEST_ATLAS" && /incomplete source record/.test(item.claim_boundary)), "Test Atlas source boundary");
expect(binder.relations.some((item) => item.type === "tested-transform" && item.source === "A0OE:T1_T7" && /T5–T7 remain discovery candidates/.test(item.claim_boundary)), "T1-T7 candidate boundary");
expect(binder.relations.some((item) => item.type === "illustrative-crosswalk" && item.source === "A0OE:ORIENTATION_OPERATOR_CYCLE" && item.target === "MOD:ORIENTATION_DEMONSTRATORS" && /positions 8, 9, 12 and 13 remain explicit source gaps/.test(item.claim_boundary)), "operator-cycle demonstrator crosswalk and source gaps");
expect(binder.relations.some((item) => item.type === "contextualizes" && item.source === "A0OE:ORIENTATION_OPERATOR_CYCLE" && item.target === "A0OE:T1_T7" && /no one-to-one equivalence/.test(item.claim_boundary)), "operator-cycle and T1-T7 non-identity boundary");
expect(binder.orientation_operator_cycle?.status === "WORKING_CROSSWALK_NOT_CANONICAL", "operator-cycle status");
expect(binder.orientation_operator_cycle?.stages?.length === 4, "four orientation stages");
expect(binder.orientation_operator_cycle?.stages?.flatMap((stage) => stage.operators || []).length === 12, "twelve orientation operators");
expect(binder.orientation_operator_cycle?.visual_reference === "HP-007/PART_I_Index.png_SOURCE_BOUND_NONCANONICAL", "source-bound noncanonical storyboard boundary");
expect(binder.relations.some((item) => item.type === "documentary-source" && item.source === "HP-007" && item.target === "A0OE:ORIENTATION_OPERATOR_CYCLE" && /completion of all twelve operator pages/.test(item.claim_boundary)), "HP-007 documentary source and completion boundary");
expect(binder.relations.some((item) => item.type === "tested-transform" && item.source === "A0OE:PASCAL_QUATERNION_TEST" && item.target === "ART:NUMBER:PRIMEGRID_BLOCK02B_TRINARY_ANTIPODE" && /not quaternion generation/.test(item.claim_boundary)), "Pascal/quaternion carrier test and generative boundary");
expect(binder.relations.some((item) => item.type === "non-identity" && item.source === "A0OE:PASCAL_QUATERNION_TEST" && item.target === "NEXAH_PCA_PHASE_SPACE_CORE_2026_10_03" && /transfers no F40 encoding/.test(item.claim_boundary)), "Pascal/quaternion and F40/Hopf non-identity boundary");
expect(binder.relations.some((item) => item.type === "tested-transform" && item.source === "A0OE:PASCAL_PENTAGON_D5_TEST" && item.target === "A0OE:PASCAL_QUATERNION_TEST" && /finite binomial face-complex/.test(item.claim_boundary)), "Pascal pentagon finite carrier and working-label boundary");
expect(binder.relations.some((item) => item.type === "contextualizes" && item.source === "A0OE:PASCAL_PENTAGON_D5_TEST" && item.target === "A0OE:T1_T7" && /four inner layers/.test(item.claim_boundary)), "Pascal pentagon four-inner-layers undefined boundary");
expect(binder.relations.some((item) => item.relation_id === "A0OE:REL:PPD5_GENERATION_CORNER" && item.type === "illustrative-crosswalk" && /S\(t,g_R,g_P,g_M\)/.test(item.statement) && /not the Generation Corner/.test(item.claim_boundary)), "Pascal/Generation Corner bounded crosswalk and generation-coordinate boundary");
expect(binder.relations.some((item) => item.relation_id === "A0OE:REL:PPD5_GENERATION_CORNER_NONIDENTITY" && item.type === "non-identity" && /four different predicates/.test(item.statement) && /ART:HTML:888E61A125CA/.test(item.claim_boundary)), "Pascal/Generation Corner non-identity and existing surface reuse");
expect(binder.relations.some((item) => item.type === "qualified-comparator" && item.source === "A0OE:PASCAL_PENTAGON_D5_TEST" && item.target === "A0OE:GLF01" && /phi does not generate Pascal coefficients/.test(item.claim_boundary)), "Pascal pentagon metric realization and phi boundary");
expect(binder.relations.some((item) => item.type === "negative-boundary" && item.source === "A0OE:PASCAL_PENTAGON_D5_TEST" && item.target === "ART:A0:MATHEMATICAL_JOINTS" && /five-position sequence sums to 443/.test(item.statement) && /does not validate the prime labels/.test(item.claim_boundary)), "Pascal pentagon label boundary retained after 3D lift");
expect(binder.relations.some((item) => item.relation_id === "A0OE:REL:PPD5_3D_T1_T7" && item.type === "tested-transform" && /7 vertices, 15 edges, 10 faces, 182 glued Pascal nodes/.test(item.statement) && /four-inner-layer claim/.test(item.claim_boundary)), "Pascal pentagon bounded 3D lift and claim ceiling");
expect(binder.relations.some((item) => item.relation_id === "A0OE:REL:PPD5_ROOT_GLF01" && item.type === "qualified-comparator" && /H2 direct-sum A1/.test(item.statement) && /not a crystallographic Lie root system/.test(item.claim_boundary) && /full five-position orbit is 100/.test(item.claim_boundary)), "Pascal pentagon H2+A1 root completion and 80/100 boundary");
expect(binder.relations.some((item) => item.relation_id === "A0OE:REL:PPD5_DYNAMIC_T1_T7" && item.type === "tested-transform" && /28, 49, 70, 91 and 112/.test(item.statement) && /recovers the 106-node carrier/.test(item.statement) && /No map from that historical fixture/.test(item.claim_boundary)), "Pascal pentagon dynamic boundary and C5+C6+C6 non-identity boundary");
expect(binder.relations.some((item) => item.relation_id === "A0OE:REL:PPD5_COUPLING_GLF01" && item.type === "qualified-comparator" && /direct C5-to-C6 cycle identification fails/.test(item.statement) && /twelve reference axes rather than inferring them/.test(item.claim_boundary) && /110\/111\/112 remain provenance markers/.test(item.claim_boundary)), "Pascal pentagon/hexagon typed coupling and modular-marker boundary");
expect(binder.nodes.some((item) => item.node_id === "A0_BL_021_DYNAMIC_BOUNDARY_CONFLUENCE_2026_10_10" && item.kind === "admitted-bounded-study" && item.state === "CLOSED_VALIDATED_NEGATIVE_RESULT"), "A0-BL-021 admitted Study closed state");
expect(binder.relations.some((item) => item.relation_id === "A0OE:REL:A0_BL021_PENT06" && item.type === "tested-transform" && /9 six-face histories, 100 seven-face histories and 56 exact typed terminal classes/.test(item.statement) && /no successor is active/.test(item.claim_boundary)), "A0-BL-021 bounded enumeration and closed successor gate");
expect(binder.relations.some((item) => item.relation_id === "A0OE:REL:A0_BL021_A0" && item.type === "negative-boundary" && /258 versus 264/.test(item.statement) && /7×8 slot-address grid/.test(item.statement) && /does not identify address cells with terminal classes/.test(item.claim_boundary)), "A0-BL-021 typed non-confluence witness and 7x8 non-identity boundary");
expect(binder.nodes.some((item) => item.node_id === "A0_BL_035_SPLINTER_LOCAL_EXTRACTION_2026_10_10" && item.state === "CLOSED_OWNER_ACCEPTED_SPLINTER_PARTIAL" && item.source_ids.includes("SRC:A0OE:A0_BL035_LABREPORT")), "A0-BL-035 closed Owner-accepted Study state and Labreport binding");
expect(binder.relations.some((item) => item.relation_id === "A0OE:REL:A0_BL035_A0_BL021" && /54 cross-class collision pairs/.test(item.statement) && /no compressed selector/.test(item.claim_boundary)), "A0-BL-035 partial extraction result and compression boundary");
expect(binder.pascal_pentagon_suite?.node_id === "A0OE:PASCAL_PENTAGON_D5_TEST" && binder.pascal_pentagon_suite?.instrument_source_id === "SRC:A0OE:PASCAL_PENTAGON_EXPLORER", "Pascal pentagon explorer reuses the existing lens identity");
expect(binder.pascal_pentagon_suite?.d30_formal_extension?.status === "FORMAL_DESIGN_VALIDATION_NOT_ADMITTED" && /24\/24/.test(binder.pascal_pentagon_suite?.d30_formal_extension?.word_audit || "") && /D1\.\.D5/.test(binder.pascal_pentagon_suite?.d30_formal_extension?.d_register_view || "") && /65 of 150/.test(binder.pascal_pentagon_suite?.d30_formal_extension?.d_register_view || "") && /source-bound view/.test(binder.pascal_pentagon_suite?.d30_formal_extension?.interactive_view || "") && /not a replay or eighth test/.test(binder.pascal_pentagon_suite?.d30_formal_extension?.interactive_view || "") && /0 of 900/.test(binder.pascal_pentagon_suite?.d30_formal_extension?.negative_result || "") && /480 unselected/.test(binder.pascal_pentagon_suite?.d30_formal_extension?.carrier_boundary || "") && /no PENT-08/.test(binder.pascal_pentagon_suite?.d30_formal_extension?.claim_boundary || ""), "D30 five-register audit, interactive view, non-factorization and H3/E8 non-identity boundary");
expect(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.status === "FORMAL_DESIGN_VALIDATION_PASS_WITH_OPEN_INTERTWINER_NOT_ADMITTED" && /dim H1=0/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.intrinsic_seam_result || "") && /sizes 15 and 20/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_interface_result || "") && /25\/25/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_interface_result || "") && /PASS_WITH_OPEN_INTERTWINER/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.classification || "") && binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.open_maps?.length === 4, "Pascal NCS Q106 return extension and open intertwiner boundary");
expect(/p_\(2\^4\)=p_16=53/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_prime_index_binding || "") && /Q106=2\*p_16/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_prime_index_binding || "") && /p_19=67/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_prime_index_binding || "") && /does not assert 2\*19=53/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_prime_index_binding || ""), "Q106 prime-index binding and value/index non-identity boundary");
expect(/p_\(4\^2\)=p_16=53/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_c_closure || "") && /4\*p_5=44/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_c_closure || "") && /p_\(5\^2\)=p_25=97/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_c_closure || "") && /3\^2=9/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_c_closure || "") && /106=53\+44\+9=2\*p_16/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_c_closure || "") && /no new universal closure operator/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_c_closure || ""), "Q106 C-closure and no-new-operator boundary");
expect(/PASS 17\/17/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_square_index_prime_readout || "") && /\(9,16,25\)=\(3\^2,4\^2,5\^2\)/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_square_index_prime_readout || "") && /\(23,53,97\)/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_square_index_prime_readout || "") && /not \(p_n\)\^2/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_square_index_prime_readout || "") && /no D5-invariant 53-node subcarrier/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_square_index_prime_readout || "") && /not a new Prime Pascal Pyramid identity/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_square_index_prime_readout || ""), "Q106 square-index prime readout, type controls and no-new-identity boundary");
expect(/PASS 16\/16/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_46_106_194_contrast || "") && /\(46,106,194\)/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_46_106_194_contrast || "") && /only k=4/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_46_106_194_contrast || "") && /2<=k<=1000/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_46_106_194_contrast || "") && /no R\(Q46\), R\(Q194\)/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_46_106_194_contrast || ""), "Q106 46/106/194 bounded selectivity and undefined-R boundary");
expect(/PASS 22\/22/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.x20_q106_adjacency_intertwiner_audit || "") && /15000 C5-equivariant/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.x20_q106_adjacency_intertwiner_audit || "") && /24 D5-equivariant/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.x20_q106_adjacency_intertwiner_audit || "") && /UNDEFINED_CONTRACT_ADJACENCY_MISSING/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.x20_q106_adjacency_intertwiner_audit || "") && /prohibited as circular/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.x20_q106_adjacency_intertwiner_audit || ""), "X20 to Q106 adjacency-intertwiner audit and non-circularity boundary");
expect(/PASS 60\/60/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.x20_typed_carrier_pcpd_source_audit || "") && /SOURCE_CONTRACT_UNRECOVERED/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.x20_typed_carrier_pcpd_source_audit || "") && /P_c and P_d.*constructors/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.x20_typed_carrier_pcpd_source_audit || "") && /zero adjacency or antipode-compatibility tests/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.x20_typed_carrier_pcpd_source_audit || ""), "X20 typed carrier and Triple-19 source-contract gate retained");
expect(/PASS 50\/50/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.triple19_x40_c2_orientation_factor_audit || "") && /SHARED_C2_FACTOR_ORIENTATION_LOST_IN_X20_QUOTIENT/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.triple19_x40_c2_orientation_factor_audit || "") && /no rho:X20->C2/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.triple19_x40_c2_orientation_factor_audit || "") && /does not select J_c or J_d/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.triple19_x40_c2_orientation_factor_audit || ""), "Triple-19 X40 shared C2 factor and quotient-loss boundary retained");
expect(/Thematic home.*NN \/ NEXAH Navigator/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_lens_routing || "") && /evidence-supported-by/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_lens_routing || "") && /does not identify the lens with A0/.test(binder.pascal_pentagon_suite?.return_and_intertwiner_extension?.q106_lens_routing || ""), "NN thematic home and A0 evidence-only boundary");
expect(binder.pascal_pentagon_suite?.companion_paper_draft?.status === "INTERNAL_R0_FORMAL_DESIGN_NOTE_NOT_ADMITTED_NOT_SUBMITTED" && binder.pascal_pentagon_suite?.companion_paper_draft?.source_id === "SRC:A0OE:PASCAL_ROSETTA_D30_PAPER_DRAFT" && /outside the SCC-003 quotient theorem/.test(binder.pascal_pentagon_suite?.companion_paper_draft?.claim_boundary || ""), "D30 companion paper remains separate, internal and non-admitted");
expect(binder.pascal_pentagon_suite?.reference_package?.status === "REPRODUCIBILITY_INFRASTRUCTURE_NOT_NEW_TEST" && binder.pascal_pentagon_suite?.reference_package?.reference_metrics?.nodes === 106 && binder.pascal_pentagon_suite?.reference_package?.reference_metrics?.directed_edges === 180, "Pascal pentagon canonical reference package and metrics");
expect(binder.pascal_pentagon_suite?.reference_package?.verification === "PASS_177_OF_177_INDEPENDENT_UNION_FIND_RECONSTRUCTION" && /no PENT-08/.test(binder.pascal_pentagon_suite?.reference_package?.claim_boundary || ""), "Pascal pentagon independent verifier and no-new-test boundary");
expect(binder.pascal_pentagon_suite?.tests?.length === 7 && binder.pascal_pentagon_suite.tests.map((item) => item.test_id).join("→") === "PENT-01→PENT-02→PENT-03→PENT-04→PENT-05→PENT-06→PENT-07", "Pascal pentagon seven-layer test sequence");
expect(binder.pascal_pentagon_suite?.embedded_surfaces?.length === 3 && binder.pascal_pentagon_suite.embedded_surfaces.filter((item) => /#(?:pascal-pentagon-demo|demonstrator)$/.test(item.href)).length === 2 && binder.pascal_pentagon_suite.embedded_surfaces.some((item) => /A0_SCC_003_PASCAL_PENTAGON_PAPER\.html$/.test(item.href)), "Pascal pentagon suite has two explorer embeddings and one paper surface");
expect(binder.pascal_pentagon_suite?.a0_bl_045_return_fork?.status === "CLOSED_OWNER_ACCEPTED_2026_10_10" && binder.pascal_pentagon_suite?.a0_bl_045_return_fork?.labreport_source_id === "SRC:A0OE:A0_BL045_LABREPORT" && /\(Q'_epsilon\)\^2=epsilon I/.test(binder.pascal_pentagon_suite?.a0_bl_045_return_fork?.exact_result || ""), "A0-BL-045 signed double-pentagon result closed and Labreport-bound");
expect(binder.pascal_pentagon_suite?.a0_bl_045_return_fork?.pillar_result_source_id === "SRC:A0OE:A0_BL045_PILLAR_DISTANCE_RESULT" && /non-orthogonal/.test(binder.pascal_pentagon_suite?.a0_bl_045_return_fork?.pillar_result || "") && /89/.test(binder.pascal_pentagon_suite?.a0_bl_045_return_fork?.pillar_result || ""), "A0-BL-045 pillar-distance result and operator separation");
expect(/2\^\(3\^2\)=512/.test(binder.pascal_pentagon_suite?.a0_bl_045_return_fork?.operator_order_return_control || "") && /fundamental return is 42/.test(binder.pascal_pentagon_suite?.a0_bl_045_return_fork?.operator_order_return_control || "") && /tenfold refinement/.test(binder.pascal_pentagon_suite?.a0_bl_045_return_fork?.operator_order_return_control || ""), "operator-order-return exact control and period/refinement boundary");
expect(/no PENT-08/.test(binder.pascal_pentagon_suite?.a0_bl_045_return_fork?.claim_boundary || "") && /explicit inputs/.test(binder.pascal_pentagon_suite?.a0_bl_045_return_fork?.claim_boundary || ""), "A0-BL-045 reciprocal bridge and level-sign boundary");
expect(/not an eighth test/.test(binder.pascal_pentagon_suite?.claim_boundary || "") && /closed historical demonstrator series/.test(binder.pascal_pentagon_suite?.claim_boundary || ""), "Pascal pentagon instrument authority boundary");
expect(binder.findings_paper_flow?.status === "DOCUMENTARY_FINDING_TO_PAPER_ROUTING_PREPARATION_ONLY" && binder.findings_paper_flow?.workspace_source_id === "SRC:A0OE:FINDINGS_PAPER_WORKSPACE", "A0 finding-to-paper flow remains documentary preparation");
expect(binder.findings_paper_flow?.findings?.map((item) => item.finding_id).join("→") === "F-A0-01→F-A0-02→F-A0-03→F-A0-04→F-A0-05→F-A0-06→F-A0-07→F-A0-08→F-A0-09→F-A0-10→F-A0-11→F-A0-12→F-A0-13→F-A0-14→F-A0-15→F-A0-16", "sixteen A0 finding records retained");
expect(binder.findings_paper_flow?.findings?.some((item) => item.finding_id === "F-A0-14" && /eight-state fibres/.test(item.statement) && /Paper C methods extension/.test(item.disposition)), "F-A0-14 axis-side fold and multi-axis fibre boundary retained");
expect(binder.findings_paper_flow?.findings?.some((item) => item.finding_id === "F-A0-15" && /C\(d,k\)/.test(item.statement) && /full A0-BL-025 remains open/.test(item.disposition)), "F-A0-15 general fibre theorem and package boundary retained");
expect(binder.findings_paper_flow?.findings?.some((item) => item.finding_id === "F-A0-16" && /2\^\(k\+g\)/.test(item.statement) && /formal-design checklist complete/.test(item.disposition)), "F-A0-16 interface assembly and minimal Return boundary retained");
expect(binder.nn_return_crosswalk_binding?.status === "EXISTING_SOURCE_BOUND_LENS_REUSED_NO_NEW_IDENTITY" && binder.nn_return_crosswalk_binding?.node_id === "NN:MRB_ACR_NCS_Q106_RETURN_CROSSWALK" && binder.nn_return_crosswalk_binding?.a0_finding_id === "F-A0-16" && /55\/55/.test(binder.nn_return_crosswalk_binding?.completed_formal_question || "") && /Owner admission/.test(binder.nn_return_crosswalk_binding?.next_formal_question || "") && /no cube-grid identity/.test(binder.nn_return_crosswalk_binding?.claim_boundary || ""), "A0-to-NN binding, completed Grid-Fold-Channel design and next admission boundary retained");
expect(binder.sources?.some((item) => item.source_id === "SRC:A0OE:A0_BL052_RESULT" && /Owner-accepted closed bounded formal result/.test(item.authority_role) && /no publication or Family authority/.test(item.authority_role)), "A0-BL-052 closed bounded result source and authority boundary");
expect(binder.sources?.some((item) => item.source_id === "SRC:A0OE:A0_BL053_RESULT" && /qualified-generalization/.test(item.authority_role) && /not external independent review/.test(item.authority_role)), "A0-BL-053 internal review and independence boundary");
expect(binder.sources?.some((item) => item.source_id === "SRC:A0OE:RETURN_WITHOUT_IDENTITY_PAPER_HTML" && /no new Study/.test(item.authority_role)), "Paper C reader source and no-new-identity boundary");
expect(binder.sources?.some((item) => item.source_id === "SRC:A0OE:ILAU_ORIENTATION_BINDER" && /non-evidentiary/.test(item.authority_role)), "ILAU binder reused as illustrative source authority only");
expect(binder.paper_c_visual_layer?.status === "ILLUSTRATIVE_SOURCE_BOUND_NO_EVIDENCE_PROMOTION" && binder.paper_c_visual_layer?.governed_instruments?.length === 4 && binder.paper_c_visual_layer?.evidence_authority?.length === 5 && /do not replace/.test(binder.paper_c_visual_layer?.claim_boundary || ""), "Paper C visual layer remains source-bound and non-evidentiary");
expect(binder.nodes?.some((item) => item.node_id === "A0OE:PASCAL_QUATERNION_TEST" && item.state === "CLOSED_OWNER_ACCEPTED_ALL_N_QUALIFIED_GENERALIZATION_R2_INTERNAL" && item.source_ids?.includes("SRC:A0OE:A0_BL052_RESULT") && item.source_ids?.includes("SRC:A0OE:A0_BL053_RESULT") && item.source_ids?.includes("SRC:A0OE:A0_BL053_LABREPORT")), "Pascal/quaternion node extended by Owner-accepted qualified generalization without duplicate identity");
expect(binder.findings_paper_flow?.paper_lanes?.map((item) => item.lane).join("→") === "A→B→C→D" && binder.findings_paper_flow?.paper_lanes?.every((item) => item.next_gate && item.href), "four A0 paper lanes have explicit gates and sources");
expect(/creates no Study/.test(binder.findings_paper_flow?.claim_boundary || "") && /publication authorization/.test(binder.findings_paper_flow?.claim_boundary || ""), "A0 paper-routing authority boundary");
expect(binder.a0_entry_map?.status === "HISTORICAL_CROSSCUTS_DOCUMENTATION_ONLY", "A0 entry-map status");
expect(binder.a0_entry_map?.verified_local_source_date === "2026-07-02" && binder.a0_entry_map?.source_asset_count === 4, "A0 entry-map source date and asset count");
expect(binder.a0_entry_map?.vertical_crosscut?.length === 5 && binder.a0_entry_map?.horizontal_crosscut?.length === 10, "A0 entry-map crosscuts");
expect(binder.a0_entry_map?.numeric_anchors?.map((item) => item.label).join("/") === "540 / 1080/14/1729", "A0 entry-map numeric anchors");
expect(/sigma=\+1 at 1080°/.test(binder.a0_entry_map?.numeric_anchors?.[0]?.return_levels || "") && /generation g=6/.test(binder.a0_entry_map?.numeric_anchors?.[0]?.return_levels || ""), "A0 four-layer flip return and generation boundary");
expect(/1³\+12³ = 9³\+10³/.test(binder.a0_entry_map?.numeric_anchors?.find((item) => item.label === "1729")?.exact || ""), "A0 entry-map Ramanujan identity");
expect(binder.a0_entry_map?.unresolved_aliases?.includes("U-field") && /not identical maps/.test(binder.a0_entry_map?.claim_boundary || ""), "A0 entry-map U-field and non-identity boundary");
expect(binder.grid_interaction_atlas?.status === "HISTORICAL_GRID_INTERACTION_CROSSWALK_DOCUMENTATION_ONLY", "A0 grid-interaction atlas status");
expect(binder.grid_interaction_atlas?.layers?.map((item) => item.layer).join("→") === "address-grid→residue-seams→cyclic-phase-cover→envelope-channel", "A0 grid-interaction layer sequence");
expect(binder.grid_interaction_atlas?.channel_contract?.length === 6 && binder.grid_interaction_atlas?.source_asset_count === 3, "A0 channel contract and source markers");
expect(/C30 phase embedding are exact/.test(binder.grid_interaction_atlas?.claim_boundary || "") && /documentary hypotheses/.test(binder.grid_interaction_atlas?.claim_boundary || ""), "A0 exact/open grid boundary");
expect(binder.a0_core_statement?.typed_chain?.join("→") === "SOURCE→OPERATION→EVENT→RESULT→OBSERVATION→VIEW", "A0 typed chain");
expect(/return to the state/i.test(binder.a0_core_statement?.strongest_statement || "") && /return to the history/i.test(binder.a0_core_statement?.strongest_statement || ""), "A0 strongest statement");
expect(/not the normative OLS itself/i.test(binder.vocabulary_boundary?.answer || ""), "OLS vocabulary answer");
expect(/executes no experiment/i.test(binder.claim_ceiling || ""), "experiment boundary");
const nlkGridReturn = binder.nlk_lshell_finite_grid_observatory_return_20261030;
expect(nlkGridReturn?.status === "SOURCE_BOUND_ENGINEERING_DEMONSTRATOR_PASS_NO_SCIENCE_ADMISSION", "NLK L-Shell engineering return status");
expect(nlkGridReturn?.engineering_finding_ids?.join("→") === "EF-NLK-01→EF-NLK-02→EF-NLK-03→EF-NLK-04→EF-NLK-05→EF-NLK-06", "six bounded NLK engineering findings");
expect(nlkGridReturn?.new_canonical_ids?.length === 0 && nlkGridReturn?.relation_changes?.length === 0 && nlkGridReturn?.study_activation === false && nlkGridReturn?.new_f_a0_finding === false && nlkGridReturn?.publication_authorized === false, "NLK return has no canonical science or publication effect");
expect(nlkGridReturn?.instrument_sha256 === hash(path.resolve(ecosystemRoot, "30 SCIENCE LAB/NEXAH-Science-Lab/RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01", nlkGridReturn.instrument)), "NLK instrument hash-bound");
expect(nlkGridReturn?.receipt_sha256 === hash(path.resolve(ecosystemRoot, "30 SCIENCE LAB/NEXAH-Science-Lab/RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/AXIOM0_QMODE_ORIENTATION_TO_MEASUREMENT_FOUNDATION_PACKAGE_2026-10-01", nlkGridReturn.receipt)), "NLK receipt hash-bound");
expect(nlkGridReturn?.machina_consumer?.classification === "SOURCE_BOUND_LIVE_INTERFACE_CONSUMER" && nlkGridReturn?.machina_consumer?.assembly_route?.join("→") === "viewer→cockpit→parts→bench→relation→return→viewer" && nlkGridReturn?.machina_consumer?.exact_return === true, "Machina Relation Chamber consumes Tri-View through exact typed return");
expect(nlkGridReturn?.machina_consumer?.ninth_body === false && nlkGridReturn?.machina_consumer?.fifth_glb_cockpit === false && nlkGridReturn?.machina_consumer?.guided_tour_changed === false && nlkGridReturn?.machina_consumer?.new_identity === false && nlkGridReturn?.machina_consumer?.relation_change === false, "Machina consumer does not alter body, cockpit, tour, identity or relation counts");

const result = {
  status: failures.length ? "FAIL" : "PASS",
  checks: { sources: binder.sources.length, nodes: binder.nodes.length, relations: binder.relations.length, aliases: binder.aliases.length },
  failures
};
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
