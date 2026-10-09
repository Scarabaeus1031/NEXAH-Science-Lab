#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (name) => fs.readFileSync(path.join(here, name), "utf8");
const html = read("index.html");
const css = read("styles.css");
const js = read("app.js");
const data = read("data.internal.js");
const entryData = read("entry.internal.js");
const v1EntrySource = fs.readFileSync(path.resolve(here, "../NAVIGATOR_ENTRY_CONTENT_V1_2026-10-07.json"), "utf8");
const v2DeltaSource = fs.readFileSync(path.resolve(here, "../NAVIGATOR_V2_DELTA_MULTI_VIEW_RECONSTRUCTION_2026-10-07.json"), "utf8");
const lineageData = read("lineage.internal.js");
const utgData = read("utg.internal.js");
const ladderData = read("ladders.internal.js");
const lifeOrbitData = read("life-orbit.internal.js");
const lifeProgramData = read("life-program.internal.js");
const primeCrystalData = read("prime-crystal.internal.js");
const observatoryData = read("observatory.internal.js");
const root7Data = read("root7.internal.js");
const ilauOrientationData = read("ilau-orientation.internal.js");
const lifeUsefulnessPath = path.resolve(here, "../../CASE_STUDIES/NEXAH_LIFE_MULTI_VIEW_IDENTIFIABILITY_CA_IDENT_01_2026-10-08/results/CA_IDENT_01_RESULT.json");
const lifeUsefulness = JSON.parse(fs.readFileSync(lifeUsefulnessPath, "utf8"));
const lifeUtilityGatePath = path.resolve(here, "../../CASE_STUDIES/NEXAH_LIFE_MULTI_VIEW_UTILITY_CA_IDENT_02_2026-10-08/results/CA_IDENT_02_RESULT.json");
const lifeUtilityGate = JSON.parse(fs.readFileSync(lifeUtilityGatePath, "utf8"));
const lifeCubeGatePath = path.resolve(here, "../../CASE_STUDIES/NEXAH_LIFE_CUBE_MEMORY_FOURIER_CA_IDENT_03_2026-10-08/results/CA_IDENT_03_RESULT.json");
const lifeCubeGate = JSON.parse(fs.readFileSync(lifeCubeGatePath, "utf8"));
const lifeFusionAuditPath = path.resolve(here, "../../CASE_STUDIES/NEXAH_LIFE_BALANCED_FUSION_CA_IDENT_04_2026-10-08/results/CA_IDENT_04_RESULT.json");
const lifeFusionAudit = JSON.parse(fs.readFileSync(lifeFusionAuditPath, "utf8"));
const lifeAlphaBetaPath = path.resolve(here, "../../CASE_STUDIES/NEXAH_LIFE_ALPHA_BETA_RESIDUAL_CA_IDENT_05_2026-10-08/results/CA_IDENT_05_RESULT.json");
const lifeAlphaBeta = JSON.parse(fs.readFileSync(lifeAlphaBetaPath, "utf8"));
const lifeKappaOpenSetPath = path.resolve(here, "../../CASE_STUDIES/NEXAH_LIFE_KAPPA_OPEN_SET_CA_IDENT_06_2026-10-08/results/CA_IDENT_06_RESULT.json");
const lifeKappaOpenSet = JSON.parse(fs.readFileSync(lifeKappaOpenSetPath, "utf8"));
const lifeGenerationalBinderPath = path.resolve(here, "../../CASE_STUDIES/NEXAH_LIFE_GENERATIONAL_BINDER_CA_IDENT_07_2026-10-08/results/CA_IDENT_07_RESULT.json");
const lifeGenerationalBinder = JSON.parse(fs.readFileSync(lifeGenerationalBinderPath, "utf8"));
const lifeConditionalObserverPath = path.resolve(here, "../../CASE_STUDIES/NEXAH_LIFE_CONDITIONAL_RESIDUAL_OBSERVER_CA_IDENT_08_2026-10-08/results/CA_IDENT_08_RESULT.json");
const lifeConditionalObserver = JSON.parse(fs.readFileSync(lifeConditionalObserverPath, "utf8"));
const lifeOrbitSource = fs.readFileSync(path.resolve(here, "../NAVIGATOR_V2_ADMISSION_LIFE_ORBIT_2026-10-07.json"), "utf8");
const primeCrystalSource = fs.readFileSync(path.resolve(here, "../EVIDENCE/BREATHING_PRIME_CRYSTAL_INSTRUMENT_2026-10-08/BREATHING_PRIME_CRYSTAL_BINDER_V1_2026-10-08.json"), "utf8");
const ilauOrientationSource = fs.readFileSync(path.resolve(here, "../EVIDENCE/ILAU_ORIENTATION_INSTRUMENTS_2026-10-09/ILAU_ORIENTATION_INSTRUMENTS_BINDER_V1_2026-10-09.json"), "utf8");
const handbook = fs.readFileSync(path.resolve(here, "../../NEXAH_SCIENCE_LAB_AND_NAVIGATOR_HANDBOOK_2026-10-07.md"), "utf8");
const familyMap = fs.readFileSync(path.resolve(here, "../../NEXAH_FAMILY_CONNECTION_MAP_V2.html"), "utf8");
const ringNavigation = fs.readFileSync(path.resolve(here, "../NEXAH_NAVIGATION_RING1.js"), "utf8");
const context = { window: {} };
vm.runInNewContext(data, context);
vm.runInNewContext(entryData, context);
vm.runInNewContext(ladderData, context);
vm.runInNewContext(lifeOrbitData, context);
vm.runInNewContext(lifeProgramData, context);
vm.runInNewContext(primeCrystalData, context);
vm.runInNewContext(observatoryData, context);
vm.runInNewContext(root7Data, context);
vm.runInNewContext(ilauOrientationData, context);
const manifest = context.window.NEXAH_NAVIGATOR_MANIFEST;
const entry = context.window.NEXAH_NAVIGATOR_ENTRY;
const admission = context.window.NEXAH_NAVIGATOR_ADMISSION;
const release = context.window.NEXAH_NAVIGATOR_RELEASE;
const ladderBinder = context.window.NEXAH_LADDER_ATLAS_BINDER;
const lifeOrbit = context.window.NEXAH_LIFE_ORBIT_ADMISSION;
const lifeProgram = context.window.NEXAH_LIFE_PROGRAM;
const primeCrystal = context.window.NEXAH_PRIME_CRYSTAL_INSTRUMENT;
const observatoryBinding = context.window.NEXAH_OBSERVATORY_BINDING;
const root7Look = context.window.NEXAH_ROOT7_LOOK;
const ilauOrientation = context.window.NEXAH_ILAU_ORIENTATION_INSTRUMENTS;
const lifeOrbitJson = JSON.parse(lifeOrbitSource);
const primeCrystalJson = JSON.parse(primeCrystalSource);
const ilauOrientationJson = JSON.parse(ilauOrientationSource);

const checks = [
  ["internal profile", manifest?.profile === "internal"],
  ["registry entities loaded", manifest?.entities?.length === 173],
  ["29 typed relations", manifest?.relations?.length === 29],
  ["no public authorization", release?.publication_authorized === false && release?.public_entity_count === 0],
  ["entry content fail-closed", entry?.profile === "internal" && entry?.publication_authorized === false],
  ["six governed domains", entry?.domains?.length === 6 && /nav-domain/.test(html + css)],
  ["five current-focus records with plain status", entry?.current_focus?.length === 5 && /plainFocusStatus/.test(js) && /focus-grid/.test(css)],
  ["homepage navigator compass", /Find the record/.test(js) && /Five moves/.test(js) && /navigator-compass/.test(css)],
  ["homepage LIFE and E8 remain bounded laboratories", /Two comparison laboratories/.test(js) && /not the whole map/.test(js) && /do not define the Navigator/.test(js)],
  ["homepage four deeper routes", /7×8 Observatory/.test(js) && /Transversum · Two-Cut/.test(js) && /Tessarec · LOKI/.test(js) && /ROOT7 · beautiful bridge, bounded negative/.test(js) && /depth-grid/.test(css)],
  ["homepage human status and optional A0 orientation", /Human View · If the map feels too dense/.test(js) && /Verified record/.test(js) && /Candidate \/ open/.test(js) && /not the Navigator structure/.test(js) && /navigator-human-view/.test(css)],
  ["ROOT7 source-first lens wired", /root7\.internal\.js/.test(html) && /data-route-link="root7"/.test(html) && /case "root7": renderRoot7Look/.test(js) && root7Look?.status === "INTERNAL_READ_ONLY_ORIENTATION_LENS"],
  ["ROOT7 exact distinctions retained", root7Look?.exact?.q3 === "2^3 = 8" && root7Look?.exact?.q4 === "2^4 = 16" && root7Look?.exact?.norm_squared === 7 && /Metric calculation, not state-count identity/.test(js)],
  ["ROOT7 negative closeout retained", JSON.stringify(root7Look?.decisions?.map((item) => item.result)) === JSON.stringify(["NON_IDENTIFIABLE","ENDPOINT_INSUFFICIENT_HISTORY_REQUIRED","NOT_IDENTIFIED"])],
  ["ROOT7 lens changes no canonical counts", root7Look?.changes_canonical_module_count === false && root7Look?.changes_canonical_family_count === false && root7Look?.publication_authorized === false],
  ["ILAU source-bound lens wired", /ilau-orientation\.internal\.js/.test(html) && /data-route-link="ilau-orientation"/.test(html) && /case "ilau-orientation": renderIlauOrientation/.test(js) && ilauOrientation?.status === "INTERNAL_READ_ONLY_SOURCE_BOUND_LENS"],
  ["ILAU three curated instruments retained", ilauOrientation?.instruments?.length === 3 && JSON.stringify(ilauOrientation.instruments.map((item) => item.instrument_id)) === JSON.stringify(["ILAU:ORIENTATION_MACHINE","ILAU:CARTOGRAPHY_EXTENSION","ILAU:RETURN_RESIDUAL_LOCK"])],
  ["ILAU instrument hashes bound", ilauOrientation?.instruments?.every((item) => /^[a-f0-9]{64}$/.test(item.sha256)) && JSON.stringify(ilauOrientation?.instruments) === JSON.stringify(ilauOrientationJson?.instruments)],
  ["ILAU vocabulary and decision boundary visible", ilauOrientation?.ilau?.map((item) => item.code).join("") === "ILAU" && /classification remains distinct from decision/i.test(js) && /ILAU classification != causal explanation != decision rule/.test(ilauOrientation?.claim_ceiling || "")],
  ["ILAU lens changes no canonical counts", ilauOrientation?.changes_canonical_registry_counts === false && ilauOrientation?.changes_canonical_family_count === false && ilauOrientation?.publication_authorized === false],
  ["controlled vocabulary records", entry?.terms?.length === 12 && /renderGlossary/.test(js) && /data-route-link="glossary"/.test(html)],
  ["framework handbook linked from About", /NEXAH_SCIENCE_LAB_AND_NAVIGATOR_HANDBOOK_2026-10-07\.md/.test(js) && /Read the framework handbook/.test(js)],
  ["framework handbook baseline current", /16 conceptual modules/.test(handbook) && /44 registered module surfaces/.test(handbook) && /140 of 140 inventoried HTML artifacts/.test(handbook) && /173 deduplicated internal entities/.test(handbook) && /29 typed relations/.test(handbook) && /0 publicly admitted entities/.test(handbook)],
  ["all entities fail-closed", admission?.rejected?.length === manifest?.entities?.length && admission?.reason_summary?.NO_PUBLIC_ALLOWLIST === manifest?.entities?.length],
  ["semantic main", /<main\b/.test(html)],
  ["semantic navigation", /<nav\b/.test(html)],
  ["skip link", /skip-link/.test(html)],
  ["internal v2 preview status label", /Internal \/ v2 preview \/ not public/i.test(html) && /v1 freeze retained/i.test(html)],
  ["Mission Control header link works under file and local server", /<a class="scope-label mission-control-link" href="\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/00%20EXECUTIVE\/NEXAH-Mission-Control\/INTERNAL_NAVIGATOR\/index\.html#home"/.test(html)],
  ["v1 entry source retained", /NEXAH:NAVIGATOR:ENTRY:V1/.test(v1EntrySource) && !/featured_evidence_case/.test(v1EntrySource)],
  ["Multi-View v2 delta staged", /STAGED_NOT_ADMITTED/.test(v2DeltaSource) && entry?.content_id === "NEXAH:NAVIGATOR:ENTRY:V2:PREVIEW"],
  ["Multi-View feature visible on Start Evidence and Atlas", /renderFeaturedEvidenceCase\("home"\)/.test(js) && /renderFeaturedEvidenceCase\("evidence"\)/.test(js) && /renderFeaturedEvidenceCase\("atlas"\)/.test(js) && /Current Evidence Case/.test(js)],
  ["persistent claim boundary", /Persistent boundary/.test(html)],
  ["search control", /type="search"/.test(js)],
  ["role filters", /name=\"role\"/.test(js)],
  ["typed relations view", /renderRelations/.test(js)],
  ["evidence pair", /Package-local verdict/.test(js) && /Current interpretation/.test(js)],
  ["source receipt", /Source receipt/.test(js)],
  ["local path safety guard", /safeLocalHref/.test(js) && /\.includes\("\.\."\)/.test(js)],
  ["deep-link routes", /hashchange/.test(js) && /#entity=/.test(js)],
  ["relation deep links", /#relation=/.test(js) && /renderRelation/.test(js)],
  ["public admission inspector", /renderAdmission/.test(js) && /NO_PUBLIC_ALLOWLIST/.test(js)],
  ["primary instrument action", /Open primary instrument/.test(js)],
  ["surface direct HTML action", /Open HTML/.test(js) && /renderSurfaceLink/.test(js)],
  ["BLOCK-01 registered as bounded Tessarec support", manifest?.entities?.some((entity) => entity.entity_id === "ART:TESSAREC:BLOCK01_CUBE_LAB" && entity.status === "current_bounded" && entity.related_entity_ids?.includes("MOD:TESSAREC") && entity.internal?.local_path === "SCIENCE_LAB/CASE_STUDIES/NEXAH_BLOCK01_CUBE_FACE_PROJECTION_RETURN_2026-10-06/NEXAH_BLOCK01_CUBE_LAB.html")],
  ["Primegrid five-block chain registered", ["ART:TESSAREC:PRIMEGRID_BLOCK01_STATE_LIFT", "ART:TESSAREC:PRIMEGRID_BLOCK02_DFT_RETURN", "ART:NUMBER:PRIMEGRID_BLOCK02A_PASCAL", "ART:NUMBER:PRIMEGRID_BLOCK02B_TRINARY_ANTIPODE", "ART:NUMBER:PRIMEGRID_BLOCK03_PRIME_CONTROL"].every((id) => manifest?.entities?.some((entity) => entity.entity_id === id && entity.status === "current_bounded"))],
  ["readout reconstruction module registered", manifest?.entities?.some((entity) => entity.entity_id === "MOD:READOUT_RECONSTRUCTION" && entity.attributes?.current_master_surface === "ART:READOUT:GLB_GATEWAY") && manifest?.entities?.some((entity) => entity.entity_id === "ART:READOUT:GLB_GATEWAY" && entity.status === "current_bounded")],
  ["readout reconstruction relations bounded", ["REL:NUMBER_READOUT_RECONSTRUCTION", "REL:READOUT_MULTI_LENS_COMPASS"].every((id) => manifest?.relations?.some((relation) => relation.relation_id === id && relation.status === "bounded"))],
  ["IEEE-300 Graph-to-Grid module registered", manifest?.entities?.some((entity) => entity.entity_id === "MOD:IEEE300_GRAPH_GRID" && entity.attributes?.current_master_surface === "ART:IEEE300:GRAPH_GRID:R2" && /no early-warning, resonance, E8/i.test(entity.claim_ceiling || ""))],
  ["IEEE-300 Graph-to-Grid surface registered", manifest?.entities?.some((entity) => entity.entity_id === "ART:IEEE300:GRAPH_GRID:R2" && entity.status === "current_bounded" && entity.internal?.local_path.endsWith("artifacts_r2/graph-grid-report-r2.html"))],
  ["IEEE-300 Morphology 01 surface registered", manifest?.entities?.some((entity) => entity.entity_id === "ART:IEEE300:GRAPH_GRID:MORPHOLOGY01" && entity.status === "current_bounded" && entity.internal?.local_path.endsWith("morphology_01/artifacts/graph-grid-morphology-01.html") && /mixed-negative/i.test(entity.claim_ceiling || ""))],
  ["IEEE-300 E8 boundary remains non-identity", manifest?.relations?.some((relation) => relation.relation_id === "REL:IEEE300_GRAPH_GRID_E8_BOUNDARY" && relation.source_id === "MOD:IEEE300_GRAPH_GRID" && relation.target_id === "MOD:E8_COXETER" && relation.relation_type === "non-identity" && /untested future question/i.test(relation.claim_boundary || ""))],
  ["IEEE-300 open Number and H3 bridges retain valid-negative specificity", ["REL:IEEE300_GRAPH_GRID_NUMBER_ADDRESS", "REL:IEEE300_GRAPH_GRID_H3_VIEW"].every((id) => manifest?.relations?.some((relation) => relation.relation_id === id && relation.status === "open" && /valid negative specificity result/i.test(relation.claim_boundary || "")))],
  ["IEEE-300 persistent-address translation remains typed", manifest?.relations?.some((relation) => relation.relation_id === "REL:IEEE300_GRAPH_GRID_PERSISTENT_ADDRESS" && relation.source_id === "MOD:IEEE300_GRAPH_GRID" && relation.target_id === "MOD:ROSETTA_GEODESIC" && relation.relation_type === "method-grammar" && /64=49\+14\+1/.test(relation.explanation || "") && /not an IEEE carrier/i.test(relation.claim_boundary || ""))],
  ["Pascal return relation bounded", manifest?.relations?.some((relation) => relation.relation_id === "REL:TESSAREC_NUMBER_PASCAL_RETURN" && relation.source_id === "MOD:TESSAREC" && relation.target_id === "MOD:NUMBER_VIEW_SUITE" && relation.status === "bounded")],
  ["Primegrid representation circle visible", /Primegrid representation circle/.test(js) && /ART:TESSAREC:PRIMEGRID_BLOCK01_STATE_LIFT/.test(js) && /ART:TESSAREC:PRIMEGRID_BLOCK02_DFT_RETURN/.test(js) && /ART:NUMBER:PRIMEGRID_BLOCK02A_PASCAL/.test(js) && /ART:NUMBER:PRIMEGRID_BLOCK02B_TRINARY_ANTIPODE/.test(js) && /ART:NUMBER:PRIMEGRID_BLOCK03_PRIME_CONTROL/.test(js) && /count bridge only/.test(js)],
  ["readout and GLB sequence visible", /Readout \/ reconstruction \/ GLB/.test(js) && /ART:READOUT:GLB_GATEWAY/.test(js) && /ACR-42 FONT QUARANTINE/.test(js)],
  ["Block 3 valid negative retained", /10\/10 GATES · VALID NEGATIVE/.test(js) && /rejects a prime-specific coding advantage/.test(js) && /reproducible prime selection does not imply coding gain/.test(js)],
  ["view-operator comparison visible and bounded", /VIEW-OPERATOR AUDIT 01 · 9\/9 PASS/.test(js) && /Q\(z\)=1\/z/.test(js) && /Origin angle is not identifiable/.test(js) && /Magnitude alone has 8-way collision/.test(js) && /Source missing · historical visual only/.test(js)],
  ["view-operator audit source linked", /NEXAH_VIEW_OPERATOR_AUDIT_01_RECIPROCAL_POLAR_DFT_2026-10-07/.test(js) && /distinct operators/.test(js)],
  ["instrument and record labels distinct", /Open HTML instrument/.test(js) && /Open controlling record/.test(js)],
  ["clickable system atlas", /renderAtlas/.test(js) && /system-map/.test(css)],
  ["full family map launch", /Open (?:full )?Family Connection Map/.test(js)],
  ["family map placed in Families", /renderFamilies[\s\S]*renderEntryFamilyMap/.test(js) && /Open Family Connection Map/.test(js)],
  ["relation and inventory views distinguished", /RELATION VIEW/.test(js) && /INVENTORY VIEW/.test(js) && /Family status ≠ bridge status/.test(js)],
  ["standalone map has public-facing title", /<title>NEXAH · Family Connection Map<\/title>/.test(familyMap) && /<h1>NEXAH Family Connection Map<\/h1>/.test(familyMap)],
  ["standalone map links into connection atlas", /Open Connection Atlas/.test(familyMap) && /index\.html#atlas/.test(familyMap)],
  ["standalone map uses registry family counts", /familyCounts/.test(familyMap) && /NEXAH_NAVIGATOR_MANIFEST/.test(familyMap)],
  ["ring navigation exposes both map levels", /connectionAtlas/.test(ringNavigation) && /Family Map/.test(ringNavigation)],
  ["atlas module and master links", /atlas-node-title/.test(js) && /Open master/.test(js)],
  ["directed sequence view", /renderSequence/.test(js) && /sequence-flow/.test(css)],
  ["prime bridge lineage data", /NEXAH_LINEAGE_BINDER/.test(html + js + data) && /lineage\.internal\.js/.test(html)],
  ["lineage route and visual register", /renderLineage/.test(js) && /lineage-gallery/.test(css) && /Owner-supplied visual register/.test(js)],
  ["UTG binder wired", /NEXAH_UTG_BINDER/.test(html + js + utgData) && /utg\.internal\.js/.test(html)],
  ["UTG route and mission", /renderUTG/.test(js) && /Mission statement/.test(js) && /Unified Transition Geometry/.test(utgData)],
  ["comparative dynamics route", /renderDynamics/.test(js) && /data-route-link="dynamics"/.test(html) && /Comparative Dynamics/.test(utgData)],
  ["Envelope route and controlled definition", /renderEnvelope/.test(js) && /data-route-link="envelope"/.test(html) && /NEXAH:UTG:ENVELOPE:V1/.test(utgData)],
  ["Envelope remains transversal not F8", /Nine typed uses/.test(js) && /NO_NEW_FAMILY/.test(utgData) && /not CF:F8/.test(utgData)],
  ["Stability Envelope remains candidate", /S = g\(zeta\)/.test(js) && /ENV-STAB/.test(utgData) && /FORMAL CANDIDATE/.test(utgData)],
  ["Ladder Atlas binder wired", /NEXAH_LADDER_ATLAS_BINDER/.test(html + js + ladderData) && /ladders\.internal\.js/.test(html)],
  ["Ladder Atlas route and navigation", /renderLadders/.test(js) && /case "ladders"/.test(js) && /data-route-link="ladders"/.test(html)],
  ["Ladder Atlas bounded eight-card core", ladderBinder?.core_ladders?.length === 8 && /Compare the contract, not the silhouette/.test(js)],
  ["historical metaphors explicitly quarantined", /HISTORICAL METAPHOR · PROVENANCE ONLY · NOT EVIDENCE OF A MECHANISM/.test(js) && ladderBinder?.historical_metaphors?.every((item) => /only|not evidence|not a mechanism|not a mechanism class|no upgrade/i.test(item.boundary))],
  ["Russell periodic dual status retained", ladderBinder?.core_ladders?.some((item) => item.ladder_id === "LAD:RUSSELL_PERIODIC" && item.status_class === "historical-bounded" && /NOT ALTERNATIVE CHEMISTRY/.test(item.status))],
  ["EMP-05 poster lag disclosed", ladderBinder?.known_version_conflicts?.some((item) => /EMP-05 poster lag/.test(item.title) && /Run 06 PASS/.test(item.resolution))],
  ["CON-DAO Breath Sequencer bound", ladderBinder?.breath_sequencer?.sequencer_id === "NEXAH:CON_DAO_BREATH:V1" && /renderBreathBridge/.test(js) && /Open Breath Sequencer/.test(js)],
  ["Breath lenses remain one carrier", ladderBinder?.breath_sequencer?.lenses?.length === 3 && /6\|1\|6/.test(ladderData) && /7\+5/.test(ladderData) && /8\+4/.test(ladderData)],
  ["historical Root Breath trace bounded", ladderBinder?.breath_sequencer?.source_trace?.length === 21 && /historical provenance, not an identified generator/.test(ladderBinder?.breath_sequencer?.claim_boundary || "")],
  ["public allowlist unchanged by Ladder Atlas", release?.publication_authorized === false && /internal and read-only/i.test(ladderBinder?.editorial_rules?.join(" ") || "")],
  ["LIFE ORBIT P6 admission data wired", /life-orbit\.internal\.js/.test(html) && /NEXAH_LIFE_ORBIT_ADMISSION/.test(js + lifeOrbitData)],
  ["LIFE ORBIT admission source and browser data agree", JSON.stringify(lifeOrbit) === JSON.stringify(lifeOrbitJson)],
  ["LIFE ORBIT internally admitted not public", lifeOrbit?.status === "INTERNAL_ADMITTED" && lifeOrbit?.publication_authorized === false && lifeOrbit?.public_entity_count === 0],
  ["LIFE ORBIT route and navigation", lifeOrbit?.route === "#life-orbit" && /data-route-link="life-orbit"/.test(html) && /case "life-orbit": renderLifeOrbit/.test(js)],
  ["complete LIFE program lens wired", /life-program\.internal\.js/.test(html) && lifeProgram?.status === "INTERNAL_READ_ONLY_PROGRAM_LENS" && lifeProgram?.records?.length === 20 && lifeProgram?.program_lines?.length === 4],
  ["LIFE HTML inventory retained", lifeProgram?.counts?.dedicated_html_apps === 18 && lifeProgram?.counts?.html_surfaces_total === 19 && lifeProgram?.counts?.non_html_engine_packages === 1],
  ["LIFE program lens visible", /Complete LIFE program/.test(js) && /lifeProgram\.program_lines/.test(js) && /All twenty records/.test(js)],
  ["LIFE closing visual series integrated and bounded", ["NEXAH_LIFE_FROM_CELL_TO_EVIDENCE_2026-10-08.png", "NEXAH_LIFE_HIT_BECAME_METHOD_2026-10-08.png", "NEXAH_LIFE_EVENT_CRYSTAL_2026-10-08.png"].every((name) => js.includes(name)) && /life-visual-story/.test(css) && /add no samples, tests or evidence/.test(js)],
  ["CA-IDENT-01 usefulness result visible and bounded", lifeUsefulness?.verdict === "LIMITED_VIEW_SIGNAL" && lifeUsefulness?.holdout_rows === 84 && /Do the extra views add usefulness/.test(js) && /E8 adapter does not/.test(js) && /External utility<\/dt><dd>not tested/.test(js)],
  ["CA-IDENT-01 instrument linked from LIFE", /NEXAH_LIFE_MULTI_VIEW_IDENTIFIABILITY_CA_IDENT_01_2026-10-08\/index\.html/.test(js) && /Open Multi-View Lab/.test(js) && /life-usefulness-card/.test(css)],
  ["CA-IDENT-02 preregistered utility gate retained", lifeUtilityGate?.verdict === "PARTIAL_SIGNAL_GATE_FAIL" && lifeUtilityGate?.success_threshold_met === false && lifeUtilityGate?.holdout_rows === 750 && /Memory and radial Fourier help/.test(js)],
  ["CA-IDENT-02 Cathedral route linked and bounded", /NEXAH_LIFE_MULTI_VIEW_UTILITY_CA_IDENT_02_2026-10-08\/index\.html/.test(js) && /Open CA-IDENT-02 Cathedral/.test(js) && /evidence-preserving layer registry/.test(js) && /No physical resonance/.test(js)],
  ["CA-IDENT-03 exact cube return and failed fusion retained", lifeCubeGate?.verdict === "FUSION_NO_GAIN" && lifeCubeGate?.success_threshold_met === false && lifeCubeGate?.holdout_rows === 100 && lifeCubeGate?.return_audit?.pass === true && lifeCubeGate?.return_audit?.carriers_differ === true],
  ["CA-IDENT-03 Cube Gate linked and bounded", /NEXAH_LIFE_CUBE_MEMORY_FOURIER_CA_IDENT_03_2026-10-08\/index\.html/.test(js) && /Open CA-IDENT-03 Cube Gate/.test(js) && /Fourier \/ CRT annex/.test(js) && /return and information-loss transept/.test(js) && /not the primary LIFE predictor/.test(js) && /life-cube-gate/.test(css)],
  ["CA-IDENT-04 balanced fusion failure retained", lifeFusionAudit?.verdict === "BALANCED_FUSION_NO_GAIN" && lifeFusionAudit?.primary_gate_pass === false && lifeFusionAudit?.cube_increment_gate_pass === false && lifeFusionAudit?.best_single === "fourier_radial" && lifeFusionAudit?.holdout_distribution?.transient === 1],
  ["CA-IDENT-04 fresh-holdout audit linked and bounded", /NEXAH_LIFE_BALANCED_FUSION_CA_IDENT_04_2026-10-08\/index\.html/.test(js) && /Open CA-IDENT-04 Fusion Audit/.test(js) && /coverage before architecture/i.test(js) && /No Cube, CRT, resonance or quantum claim/.test(js)],
  ["CA-IDENT-05 alpha-beta result retained", lifeAlphaBeta?.verdict === "ALPHA_BETA_NO_GAIN" && lifeAlphaBeta?.coverage_gate_pass === true && lifeAlphaBeta?.primary_gate_pass === false && lifeAlphaBeta?.specificity_gate_pass === false && lifeAlphaBeta?.holdout_rows === 2000 && lifeAlphaBeta?.novel_holdout_classes?.includes("constant-count motion")],
  ["CA-IDENT-05 complement test linked and bounded", /NEXAH_LIFE_ALPHA_BETA_RESIDUAL_CA_IDENT_05_2026-10-08\/index\.html/.test(js) && /Open CA-IDENT-05 Alpha\/Beta Audit/.test(js) && /exact bookkeeping/.test(js) && /open-set class discovery/.test(js) && /not a universal predictive orientation/.test(js)],
  ["CA-IDENT-06 Kappa coverage stop retained", lifeKappaOpenSet?.verdict === "COVERAGE_GATE_FAIL" && lifeKappaOpenSet?.coverage_gate_pass === false && lifeKappaOpenSet?.unknown_support === 0 && lifeKappaOpenSet?.known_abstained === 13 && lifeKappaOpenSet?.known_specificity === 0.9935],
  ["CA-IDENT-06 Kappa abstention route linked and bounded", /NEXAH_LIFE_KAPPA_OPEN_SET_CA_IDENT_06_2026-10-08\/index\.html/.test(js) && /Open CA-IDENT-06 Kappa Audit/.test(js) && /ABSTAIN_UNKNOWN/.test(js) && /not a forced class or physical field/.test(js) && /event quota or maximum seed budget/.test(js)],
  ["CA-IDENT-07 generational coverage stop retained", lifeGenerationalBinder?.verdict === "COVERAGE_GATE_FAIL" && lifeGenerationalBinder?.coverage_gate_pass === false && lifeGenerationalBinder?.evaluation_rows === 2000 && lifeGenerationalBinder?.evaluation_distribution?.["constant-count motion"] === undefined && lifeGenerationalBinder?.primary_gate_pass === false],
  ["CA-IDENT-07 temporal residual route linked and bounded", /NEXAH_LIFE_GENERATIONAL_BINDER_CA_IDENT_07_2026-10-08\/index\.html/.test(js) && /Open CA-IDENT-07 Generation Audit/.test(js) && /Relations can arrive later/.test(js) && /training-only conditional residual gate/.test(js) && /not a physical Kappa field/.test(js)],
  ["CA-IDENT-07 C taxonomy linked without symbol collapse", /C_TAXONOMY_AND_OBSERVATION_CLASS_CROSSWALK\.md/.test(js) && /C taxonomy/.test(js) && /comparator, intersection, closure, cycle and observer class/.test(js)],
  ["CA-IDENT-08 quota and mixed gate result retained", lifeConditionalObserver?.verdict === "GAIN_WITHOUT_GATE_SPECIFICITY" && lifeConditionalObserver?.coverage_gate_pass === true && lifeConditionalObserver?.collection?.stop_reason === "EVENT_QUOTA_REACHED" && lifeConditionalObserver?.collection?.registered_event_rows === 16 && lifeConditionalObserver?.primary_gate_pass === true && lifeConditionalObserver?.specificity_gate_pass === false],
  ["CA-IDENT-08 observer resolution retained", lifeConditionalObserver?.observer_resolution_audit_pass === true && JSON.stringify(lifeConditionalObserver?.observer_resolution?.sweep?.map((item) => item.N_epsilon)) === JSON.stringify([7,5,5,2,2,2,1,1])],
  ["CA-IDENT-08 route linked and bounded", /NEXAH_LIFE_CONDITIONAL_RESIDUAL_OBSERVER_CA_IDENT_08_2026-10-08\/index\.html/.test(js) && /Open CA-IDENT-08 Conditional Gate/.test(js) && /History helps/.test(js) && /state count from observable class count/.test(js) && /universal observer law/.test(js)],
  ["Breathing Prime Crystal binder wired", /prime-crystal\.internal\.js/.test(html) && primeCrystal?.status === "INTERNAL_READ_ONLY_CALIBRATION_FAMILY" && primeCrystalJson?.instrument_id === primeCrystal?.instrument_id],
  ["Prime Crystal three-cut control retained", JSON.stringify(primeCrystal?.three_cut_control?.map((cut) => [cut.columns, cut.view_edges_total])) === JSON.stringify([[19,1],[20,108],[21,2]]) && /Same carrier\. Three cuts\. Different apparent topology\./.test(js)],
  ["Prime Crystal exact inventory retained", primeCrystal?.exact_inventory?.primes === 430 && primeCrystal?.exact_inventory?.twin_prime_members === 162 && primeCrystal?.exact_inventory?.euler_41_values === 54 && primeCrystal?.exact_inventory?.root_band_primes === 37],
  ["Prime Crystal ILAU and LIFE control visible", /I · retained/.test(js) && /L · lost/.test(js) && /A · introduced/.test(js) && /U · unresolved/.test(js) && /LIFE \/ CA-IDENT negative control/.test(primeCrystalData)],
  ["Prime Crystal remains calibration not promotion", primeCrystal?.publication_authorized === false && primeCrystal?.changes_canonical_family_count === false && /No new prime theory/.test(primeCrystal?.claim_ceiling || "") && /Prime\/LIFE causality/.test(primeCrystal?.claim_ceiling || "")],
  ["Prime Crystal controlling sources linked", /Breathing Crystal viewer/.test(js) && /Machine binder/.test(js) && /Forensic control/.test(js) && /Scene specification/.test(js) && /prime-crystal-instrument/.test(css)],
  ["CA-IDENT-09 result bound to Prime Crystal", primeCrystal?.calibration_result?.verdict === "CALIBRATION_PASS_VIEW_NONINVARIANT" && primeCrystal?.calibration_result?.gates_passed === "5/5" && primeCrystal?.calibration_result?.exact_returns === 9000 && /CA-IDENT-09 calibration/.test(js) && /Prime preregistration lock/.test(js)],
  ["CA-IDENT-09 separates stable and view channels", primeCrystal?.calibration_result?.stable_prediction_disagreement?.width_19 === 0 && primeCrystal?.calibration_result?.stable_prediction_disagreement?.width_21 === 0 && primeCrystal?.calibration_result?.view_prediction_disagreement?.width_19 === 0.504 && primeCrystal?.calibration_result?.view_prediction_disagreement?.width_21 === 0.513],
  ["CA-IDENT-10 LIFE transfer bound", primeCrystal?.life_transfer_result?.verdict === "TRANSFER_PASS_VIEW_NONINVARIANT" && primeCrystal?.life_transfer_result?.gates_passed === "6/6" && primeCrystal?.life_transfer_result?.identity_mismatches === 0 && primeCrystal?.life_transfer_result?.exact_returns === 42396],
  ["CA-IDENT-10 stable-view split visible", primeCrystal?.life_transfer_result?.stable_prediction_disagreement?.width_31 === 0 && primeCrystal?.life_transfer_result?.stable_prediction_disagreement?.width_33 === 0 && primeCrystal?.life_transfer_result?.view_prediction_disagreement?.width_31 === 0.226629 && primeCrystal?.life_transfer_result?.view_prediction_disagreement?.width_33 === 0.268839 && /prime-life-transfer/.test(css)],
  ["CA-IDENT-10 controlling records linked", /CA-IDENT-10 LIFE transfer/.test(js) && /LIFE frozen metrics/.test(js) && /LIFE preregistration lock/.test(js) && /LIFE Mission Control/.test(js)],
  ["Carrier-view synthesis and consolidated Mission Control linked", /Open condensed finding/.test(js) && /Consolidated Mission Control/.test(js) && /NEXAH_CARRIER_VIEW_RESIDUAL_FINDING_2026-10-08/.test(primeCrystalData) && /MISSION_CONTROL_RETURN_CA_IDENT_09_10_CARRIER_VIEW_RESIDUAL_2026-10-08/.test(primeCrystalData) && primeCrystalJson?.canonical_synthesis?.short_rule === "Preserve identity, declare the cut, compare relations, keep the residual."],
  ["Closed carrier-view control lineage retained", JSON.stringify(primeCrystal?.closed_control_lineage?.map((item) => item.control_id)) === JSON.stringify(["WNI-01","ETRI-01","NOS-01","TITAN-01"]) && primeCrystalJson?.closed_control_lineage?.every((item) => item.status === "CLOSED")],
  ["Control lineage and contextual boundaries visible", /CLOSED CONTROL LINEAGE/.test(js) && /WNI closure marker/.test(js) && /CRT \/ Janus examples/.test(js) && /HMA visual-only boundary/.test(js) && /closed-control-ladder/.test(css) && primeCrystal?.contextual_examples?.status === "EXPLANATORY_ONLY_NOT_ADDITIONAL_EVIDENCE"],
  ["NAV-UTILITY-01 remains an open human gate", primeCrystal?.utility_assessment?.status === "READY_FOR_FIRST_HUMAN_OWNER_RUN" && primeCrystal?.utility_assessment?.result === "UNKNOWN_PENDING_HUMAN_INPUT" && primeCrystal?.utility_assessment?.execution_disposition === "DEFERRED_BY_HUMAN_OWNER_NO_DATE" && primeCrystalJson?.utility_assessment?.result === "UNKNOWN_PENDING_HUMAN_INPUT" && primeCrystalJson?.utility_assessment?.execution_disposition === "DEFERRED_BY_HUMAN_OWNER_NO_DATE"],
  ["NAV-UTILITY-01 instrument and boundaries linked", /Start usefulness test/.test(js) && /Frozen protocol/.test(js) && /Hash lock/.test(js) && /independent-reader and external utility remain open/.test(primeCrystalData) && /nav-utility-gate-card/.test(css)],
  ["LIFE negative and mixed stages retained", ["LIFE04_PROJECTION_BENCHMARK", "LIFE04B_ANTIPODAL_RESIDUAL_RETURN", "LIFE06C_PRIME_COMPOSITE_WINDOW_BENCHMARK"].every((id) => /NEGATIVE/.test(lifeProgram?.records?.find((record) => record.id === id)?.status || "")) && /MIXED|NON_IDENTIFIABLE/.test(lifeProgram?.records?.find((record) => record.id === "LIFE05D_CELL_EVENT_HOLDOUT")?.status || "")],
  ["LIFE global claim ceiling retained", /No biological-life/.test(lifeProgram?.global_claim_ceiling || "") && /public release/.test(lifeProgram?.global_claim_ceiling || "")],
  ["Transition Observatory closeout route", /data-route-link="observatory"/.test(html) && /renderObservatory/.test(js) && /case "observatory": renderObservatory/.test(js) && /observatory\.internal\.js/.test(html)],
  ["Observatory lens loaded", observatoryBinding?.status === "INTERNAL_READ_ONLY_LENS" && observatoryBinding?.release === "OBSERVATORY_V1.3_RECOVERY_AND_GRID_OPERATOR_ADDENDUM"],
  ["Observatory 7x8 namespaces separated", observatoryBinding?.typed_field_namespace === "TF" && observatoryBinding?.typed_fields?.length === 8 && observatoryBinding?.family_bindings?.length === 7 && observatoryBinding.family_bindings.every((family) => /^CF:F[1-7]$/.test(family.family_id))],
  ["Observatory V1.3 highlights retained", ["11 / 11", "15 / 15", "492 / 494", "5 / 5", "6 / 6", "53 / 53"].every((value) => observatoryBinding?.highlights?.some((item) => item.value === value))],
  ["Observatory four evidence gaps retained", observatoryBinding?.open_residuals?.length === 4 && /USDZ binaries/.test(observatoryBinding.open_residuals.join(" ")) && /historical multi-grid authoring generator/.test(observatoryBinding.open_residuals.join(" "))],
  ["Transition Observatory retains claim ceiling", /no eighth Functional Family/i.test(observatoryBinding?.claim_ceiling || "") && /public admission/.test(observatoryBinding?.claim_ceiling || "") && /navigational and non-exclusive/.test(js)],
  ["Connection Map loads governed LIFE and Observatory data", /NAVIGATION\/APP\/life-program\.internal\.js/.test(familyMap) && /NAVIGATION\/APP\/observatory\.internal\.js/.test(familyMap)],
  ["Connection Map exposes LIFE and 7x8 routes", /life:\{label:'LIFE01–LIFE06D'/.test(familyMap) && /observatory:\{label:'7×8 Observatory'/.test(familyMap) && /id="typedFieldMap"/.test(familyMap)],
  ["Connection Map keeps 7x8 namespace boundary", /TF:01–TF:08 · Inspection fields/.test(familyMap) && /keine achte Family/.test(familyMap) && /CF:F1–F7 × TF:01–TF:08/.test(familyMap)],
  ["LIFE ORBIT three admitted entities", lifeOrbit?.entities?.length === 3 && ["MOD:LIFE_ORBIT", "ART:LIFE:GLB_P3", "ART:LIFE:TYPED_COMPARISON_P4"].every((id) => lifeOrbit.entities.some((entity) => entity.entity_id === id))],
  ["LIFE ORBIT three typed relations", lifeOrbit?.relations?.length === 3 && ["version-successor", "application-analogy", "method-grammar"].every((type) => lifeOrbit.relations.some((relation) => relation.relation_type === type))],
  ["LIFE ORBIT relation endpoints resolve", lifeOrbit?.relations?.every((relation) => [...manifest.entities, ...lifeOrbit.entities].some((entity) => entity.entity_id === relation.source_id) && [...manifest.entities, ...lifeOrbit.entities].some((entity) => entity.entity_id === relation.target_id))],
  ["LIFE ORBIT five-family path preserved", JSON.stringify(lifeOrbit?.family_route?.map((step) => step.family_id)) === JSON.stringify(["CF:F1", "CF:F3", "CF:F4", "CF:F5", "CF:F7"])],
  ["LIFE ORBIT nonidentity boundary preserved", /no Life\/E8 mechanism identity/i.test(lifeOrbit?.claim_ceiling || "") && /carrier identity/.test(lifeOrbit?.relations?.find((relation) => relation.relation_type === "application-analogy")?.does_not_imply?.join(" ") || "")],
  ["LIFE ORBIT P5 and P5R receipts bound", lifeOrbit?.candidate_source?.p5_validation_sha256 === "5cbab9f9f0c3af79e69c5ad99eaa918324f3bfc032fdf5f9252f0e9605e8c873" && lifeOrbit?.candidate_source?.p5r_validation_sha256 === "674a7777b0490380bee6a7b514ad87e80c2a65b40240a9ba8f4657fbd1b5692b"],
  ["LIFE ORBIT instrument sandboxed", /NEXAH LIFE ORBIT P4 instrument/.test(js) && /sandbox="allow-scripts allow-same-origin allow-downloads"/.test(js)],
  ["comparative evidence labels", /FORMAL CONTROL/.test(js) && /COMPUTATIONAL CANDIDATE/.test(js) && /HISTORICAL VISUAL/.test(js) && /MEASUREMENT LAYER/.test(js)],
  ["cross-system test remains unexecuted", /Registered next test · not executed/.test(js) && /UTG-FORMAL-02/.test(utgData)],
  ["V69 field classification", /Field is a representation layer/.test(js) && /CF:F4/.test(utgData) && /Reconstructed extension field/.test(js)],
  ["curated dynamics collections", /COL:DYN:CORE_FLOW/.test(utgData) && /COL:DYN:IEEE_FIELD/.test(utgData) && /COL:DYN:EXTENDED_CARRIERS/.test(utgData)],
  ["UTG maturity boundary", /Framework is not validation/.test(js) && /NOT ESTABLISHED FOR UTG AS A WHOLE/.test(utgData)],
  ["UTG media constellations", /Media constellation model/.test(js) && /CONST:UTG:FORMAL_CANDIDATES/.test(utgData)],
  ["interactive entry family map", /renderEntryFamilyMap/.test(js) && /Interactive orientation map/.test(js) && /entry-map-grid/.test(css)],
  ["plain-language value proposition", /Find the record/.test(js) && /What was tested/.test(js) && /keep the unresolved remainder visible/.test(js)],
  ["framework family object evidence hierarchy", /Framework → families → objects → evidence/.test(js) && /package-local/.test(js)],
  ["central research question", /Can transitions across different systems share a common, inspectable grammar/.test(js)],
  ["about route and navigation", /renderAboutV2/.test(js) && /case "about": renderAboutV2/.test(js) && /data-route-link="about"/.test(html)],
  ["ecosystem responsibility map", /One ecosystem · distinct responsibilities/.test(js) && /NEXAHEDRON/.test(js) && /ORION/.test(js)],
  ["cross-system visual retained in governed data", /MEDIA:DYN:CROSS_SYSTEM_STRUCTURE/.test(js + utgData) && /renderDynamics/.test(js)],
  ["first-use terminology boundaries", /Multi-view reconstruction is the human-facing method/.test(entryData) && /OIL = outer orbit, inner orbit, link\/transfer orbit/.test(entryData) && /empty set ∅/.test(entryData) && /standard mathematical operator/.test(entryData)],
  ["ACR expansion remains unresolved", entry?.terms?.some((term) => term.term_id === "TERM:ACR" && term.status === "unresolved" && /established series-wide expansion/.test(term.does_not_mean?.join(" ") || ""))],
  ["canonical and candidate family separation", /No canonical F8 or F9 is currently registered/.test(js) && /CAND:F8/.test(js) && /HL:F8/.test(js)],
  ["first UTG formal candidate", /Aperture is not automatically a transition gate/.test(js) && /UTG:FORMAL:APERTURE_TRANSITION:V0\.1/.test(utgData)],
  ["UTG mathematical glossary link", /Open mathematical glossary/.test(js) && /11_MATHEMATICAL_FOUNDATIONS_GLOSSARY\.md/.test(utgData)],
  ["typed 2-3 and 8.8 distinction", /8×8 is not 8\|8/.test(js) && /v8\.8 or PG88/.test(js)],
  ["3187 and PG88 boundaries", /3187/.test(lineageData) && /Census only · path missing/.test(js)],
  ["functional-first naming", /FUNCTIONAL_NAMES/.test(js) && /Naming rule/.test(js)],
  ["retained native aliases", /native-alias/.test(js) && /ERITH · Tessarec/.test(js)],
  ["canonical CF family names", /Observation \/ Record/.test(js) && /Synchronization \/ Control/.test(js) && /Validation \/ Governance/.test(js)],
  ["CF and HL namespace guard", /HTML_SHELF_NAMES/.test(js) && /namespace-guard/.test(css)],
  ["candidate F8 distinct from HL F8", /CAND:F8_AXIS_EXTENSION ≠ HL:F8/.test(js) && /Human Instruments \/ Games \/ Cultural Orientation/.test(js)],
  ["sender receiver remains owner model", /CF:F4 sender · CF:F5 axis carrier · CF:F6 receiver/.test(js) && /OWNER MODEL \+ OPEN_BRIDGE/.test(js)],
  ["carrier non-identity boundary", /Q4 has 16 sign states/.test(js) && /E8 has a registered 240-root carrier/.test(js) && /P6R01/.test(js)],
  ["open F6 boundary", /F4→F6 and F5→F6 remain OPEN_BRIDGE/.test(js)],
  ["responsive layout", /@media \(max-width:/.test(css)],
  ["reduced motion", /prefers-reduced-motion/.test(css)],
  ["visible keyboard focus", /:focus-visible/.test(css)],
  ["no remote runtime dependency", !/(https?:\/\/|cdn\.|unpkg|jsdelivr)/i.test(html)],
  ["no public manifest wired", !/navigator\.public\.json|data\.public\.js/.test(html + js)]
];

const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
const result = { status: failed.length ? "FAIL" : "PASS", checks: checks.length, passed: checks.length - failed.length, failed };
console.log(JSON.stringify(result, null, 2));
if (failed.length) process.exitCode = 1;
