#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(here, '..', '..');
const catalogPath = join(here, 'HTML_CATALOG_SNAPSHOT_2026-10-05.json');
const moduleRegistryPath = join(here, 'NEXAH_MODULE_REGISTRY_V2_2026-10-05.json');
const outputPath = join(here, 'HTML_ARTIFACT_REGISTRY_V1_2026-10-06.json');
const reportPath = join(here, 'HTML_CURATION_COVERAGE_2026-10-06.md');

const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
const moduleRegistry = JSON.parse(readFileSync(moduleRegistryPath, 'utf8'));
const modules = new Map(moduleRegistry.modules.map((module) => [module.module_id, module]));
const curatedSurfaces = new Map(moduleRegistry.surfaces.map((surface) => [surface.path, surface]));
const duplicateGroups = new Map();

for (const [index, group] of catalog.exact_duplicate_groups.entries()) {
  const id = `DUP:HTML:${String(index + 1).padStart(3, '0')}`;
  group.paths.forEach((path, position) => duplicateGroups.set(path, {
    group_id: id,
    sha256: group.sha256,
    copy_role: position === 0 ? 'custody_primary' : 'exact_copy',
    primary_path: group.paths[0]
  }));
}

const moduleRules = [
  ['MOD:ROSETTA_GEODESIC', /^00_INCOMING\/NEXAH_DUAL_VIEW_ROSETTA_INTAKE/],
  ['MOD:THREAD_LOOM', /^NEXAH_TRANSLATION_AUDIT_REPORT_01\/.*THREAD_LOOM/i],
  ['MOD:E8_COXETER', /^SCIENCE_LAB\/CASE_STUDIES\/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21\/(?!SOURCE_SNAPSHOT\/E8 DEMOS\/MIWA)/],
  ['MOD:OPERATOR_DEMONSTRATOR', /^SCIENCE_LAB\/CASE_STUDIES\/NEXAH LAB Operator demonstrator\//],
  ['MOD:ORIENTATION_DEMONSTRATORS', /^SCIENCE_LAB\/CASE_STUDIES\/NEXAH_HTML_ORIENTATION_DEMONSTRATOR_SERIES\//],
  ['MOD:TESSAREC', /^SCIENCE_LAB\/CASE_STUDIES\/NEXAH_ROOT7_CUSTODY_2026-09-28\/.*Tesseract_Bridge/i],
  ['MOD:E8_COXETER', /^SCIENCE_LAB\/CASE_STUDIES\/NEXAH_ROOT7_CUSTODY_2026-09-28\/.*E8_/i],
  ['MOD:NUMBER_VIEW_SUITE', /^SCIENCE_LAB\/CASE_STUDIES\/NEXAH_ROOT7_EULER_MIRROR_CONCORDANCE_INTAKE_2026-09-28\//],
  ['MOD:OBSERVATORY_MIWA', /^SCIENCE_LAB\/EXPORTS\/(MIWA_|ROEDELHEIM_OBSERVATORY_SEVEN_VIEWS)/],
  ['MOD:RUNTIME_COMPARISON', /^SCIENCE_LAB\/EXPORTS\/NEXAH_COMMON_RUNTIME_ADAPTER\.html$/]
];

const candidateRules = [
  ['CAND:PRIME_GENESIS', /^00_INCOMING\/THe Prime Genesis\//],
  ['CAND:ROEDELHEIM_PROJECTION', /^MISSION_CONTROL_ROEDELHEIM_ORIENTATION_RETURN_/],
  ['CAND:ECOSYSTEM_ARCHITECTURE', /^NEXAH_ORION_ECOSYSTEM_ARCHITECTURE_/],
  ['CAND:CIKADA_ATRIUM', /^SCIENCE_LAB\/CASE_STUDIES\/CIKADA_3301_LATER_MARKER_PROVENANCE_INTAKE\//],
  ['CAND:LIGHT_SHADOW', /^SCIENCE_LAB\/CASE_STUDIES\/LQE01_/],
  ['CAND:OPEN_SHELL', /^SCIENCE_LAB\/CASE_STUDIES\/NEXAH_OPEN_SHELL_DOCUMENT_FAMILY_/],
  ['CAND:ORI04_READER', /^SCIENCE_LAB\/CASE_STUDIES\/NEXAH_ORI04_/],
  ['CAND:SOLAR_CLOCKWORK', /^SCIENCE_LAB\/CASE_STUDIES\/NEXAH_SOLAR_SYSTEM_CLOCKWORK_DOCUMENT_FAMILY_/],
  ['CAND:POLARPASS', /^SCIENCE_LAB\/CASE_STUDIES\/Orion_POLAR:Pass Maastricht\//],
  ['CAND:ROEDELHEIM_LANDSCAPE', /^SCIENCE_LAB\/CASE_STUDIES\/ROEDELHEIM_HISTORY_AND_TOPOGRAPHY_/],
  ['CAND:THREE_LIFE_SYSTEMS', /^SCIENCE_LAB\/CASE_STUDIES\/THREE_LIFE_SYSTEMS_PLUS_ONE_BINDER_VISUAL_SERIES_/],
  ['CAND:TRANSFORMATION', /^SCIENCE_LAB\/CASE_STUDIES\/T_RAN_S_FORMATION\//]
];

const candidateRecords = {
  'CAND:PRIME_GENESIS': {
    record: '00_INCOMING/THe Prime Genesis/00_OEIS_LOGIC_ILAU_MINIREPORT.md',
    claim_ceiling: 'Conceptual consolidation only; the minireport does not explicitly bind either HTML as a canonical module and makes no new empirical claim.'
  },
  'CAND:ROEDELHEIM_PROJECTION': {
    record: 'MISSION_CONTROL_ROEDELHEIM_ORIENTATION_RETURN_2026-09-16/03_VISUAL_SYNTHESIS_RECORD.md',
    claim_ceiling: 'Local explanatory projections only; Homebase is parked and no physical field or active investigation is implied.'
  },
  'CAND:ECOSYSTEM_ARCHITECTURE': {
    record: 'NEXAH_ORION_ECOSYSTEM_ARCHITECTURE_CONTINUITY_AND_DRIFT_CONTROL/06_MASTER_VISUAL_V1_REGISTRATION.md',
    claim_ceiling: 'Derived architecture artifact with no authority; status remains REVIEW_REQUIRED.'
  },
  'CAND:CIKADA_ATRIUM': {
    record: 'SCIENCE_LAB/CASE_STUDIES/CIKADA_3301_LATER_MARKER_PROVENANCE_INTAKE/FINAL_INTAKE_DECISION.md',
    claim_ceiling: 'HOLD_CONFLICTING_DEFINITIONS; provenance expansion without scientific adoption, test activation or cross-domain conclusion.'
  },
  'CAND:LIGHT_SHADOW': {
    record: 'SCIENCE_LAB/CASE_STUDIES/LQE01_LIGHT_OCCLUDER_RECEIVER_GEOMETRY_2026-09-09/06_LQE01_FINAL_CUSTODY_CLASSIFICATION.md',
    claim_ceiling: 'Preserved geometry replay and custody evidence; no broader light, observer or mechanism claim.'
  },
  'CAND:OPEN_SHELL': {
    record: 'SCIENCE_LAB/CASE_STUDIES/NEXAH_OPEN_SHELL_DOCUMENT_FAMILY_2026-09-14/00_README.md',
    claim_ceiling: 'OLS-compatible documentary material, not an OLS extension or normative OVS syntax.'
  },
  'CAND:ORI04_READER': {
    record: 'SCIENCE_LAB/CASE_STUDIES/NEXAH_ORI04_READER_HANDOFF_UTILITY_2026-09-26/FINAL_RETURN.md',
    claim_ceiling: 'Preflight instrument only; no participant data, utility result or recruitment authority exists.'
  },
  'CAND:SOLAR_CLOCKWORK': {
    record: 'SCIENCE_LAB/CASE_STUDIES/NEXAH_SOLAR_SYSTEM_CLOCKWORK_DOCUMENT_FAMILY_2026-09-14/00_README.md',
    claim_ceiling: 'Documentary orientation and application-benchmark family. Recurrence of the typed grammar may motivate TM-13, but does not establish one physical mechanism, a corpus-wide invariant or normative NEXAH definitions.',
    related_modules: ['MOD:TRANSVERSUM_TWO_CUT', 'MOD:ROSETTA_GEODESIC', 'MOD:OPERATOR_DEMONSTRATOR'],
    connection_families: ['CF:F1', 'CF:F2', 'CF:F3', 'CF:F4', 'CF:F7'],
    program_routes: ['SOL-10'],
    thesis_routes: ['TM-01', 'TM-07', 'TM-10', 'TM-13'],
    thesis_support_status: 'ORIENTATION_AND_TEST_CANDIDATE_NOT_CONFIRMATION',
    decision_sources: [
      'SCIENCE_LAB/NAVIGATION/SOLAR_CLOCKWORK_APPLICATION_BRIDGE_2026-10-06.md',
      'SCIENCE_LAB/CASE_STUDIES/NEXAH_SOLAR_SYSTEM_CLOCKWORK_DOCUMENT_FAMILY_2026-09-14/REVIEW_BINDING/05_SCIENTIFIC_RELEVANCE_ASSESSMENT.md',
      'SCIENCE_LAB/REVIEWS/THREE_D_MODULE_ATLAS_2026-09-29/SOLAR_SYSTEM_FAMILY_MAP.md',
      'SCIENCE_LAB/REVIEWS/THREE_D_MODULE_ATLAS_2026-09-29/SOLAR_MEDIA_SOURCE_REGISTER.csv',
      'RESEARCH_PROGRAM_B_MATHEMATICAL_FOUNDATIONS/14_NEXAH_THESIS_EVIDENCE_MATRIX.md'
    ]
  },
  'CAND:POLARPASS': {
    record: 'SCIENCE_LAB/CASE_STUDIES/INTAKE_REPORT_ORION_POLAR_PASS_MAASTRICHT_2026-08-22.md',
    claim_ceiling: 'Archived evidence case study; scientific claims are not adopted and research remains frozen.'
  },
  'CAND:ROEDELHEIM_LANDSCAPE': {
    record: 'SCIENCE_LAB/CASE_STUDIES/ROEDELHEIM_HISTORY_AND_TOPOGRAPHY_2026-09-25/README.md',
    claim_ceiling: 'Source-bound history and topography; visual resemblance does not establish a continuous hidden geometry or mechanism.'
  },
  'CAND:THREE_LIFE_SYSTEMS': {
    record: 'SCIENCE_LAB/CASE_STUDIES/THREE_LIFE_SYSTEMS_PLUS_ONE_BINDER_VISUAL_SERIES_2026-08-24/FINAL_VISUAL_SERIES_DECISION.md',
    claim_ceiling: 'Frozen conceptual visual sources; no biological, physical, architectural or ORION claim is adopted.'
  },
  'CAND:TRANSFORMATION': {
    record: 'SCIENCE_LAB/CASE_STUDIES/T_RAN_S_FORMATION/13_DESK10_FINAL_STEWARD_DECISION.md',
    claim_ceiling: 'Historical transformation package; authority follows the status and supersession ledger, not a lone HTML fixture.'
  }
};

const orientationBase = 'SCIENCE_LAB/CASE_STUDIES/NEXAH_HTML_ORIENTATION_DEMONSTRATOR_SERIES/';
const rosettaBase = '00_INCOMING/NEXAH_DUAL_VIEW_ROSETTA_INTAKE_2026-09-05/';
const root7Base = 'SCIENCE_LAB/CASE_STUDIES/NEXAH_ROOT7_CUSTODY_2026-09-28/Nexah_Root7/';

function documentedDecision(path) {
  if (path.startsWith(orientationBase)) {
    const name = path.slice(orientationBase.length);
    const core = new Set([
      'subject-object-objectivity.html',
      'two-cuts-objectivation-standalone.html',
      'triadic-relation-observer-standalone.html',
      'recursive-triad-return-standalone.html',
      'point-relation-binder-standalone.html',
      'nexah-four-movements-standalone.html',
      'generation-corner-turn.html',
      'closed-loop-moving-world-standalone.html',
      'echo-time-perspective-field-standalone.html'
    ]);
    if (name === 'subject-object-objectivity-standalone.html') return {
      representation_role: 'wrapper-variant', content_role: 'explanatory_or_mapping_view', centrality_score: 1,
      evidence_status: 'CONCEPTUAL', note: 'DOM-equivalent wrapper variant of core position 1.'
    };
    if (['nexah-ghost-grid-mode-2-download.html', 'nexah-comparison-grid.html'].includes(name)) return {
      representation_role: 'extension-variant', content_role: 'explanatory_or_mapping_view', centrality_score: 2,
      evidence_status: 'CONCEPTUAL', note: 'Separate Ghost Grid/comparison extension family; not part of the 13-position core.'
    };
    if (name === 'triad-spiral-dynamics-standalone.html') return {
      representation_role: 'extension-variant', content_role: 'functional_instrument', centrality_score: 2,
      evidence_status: 'EXECUTABLE_DEMONSTRATOR', note: 'Later independent demonstrator; not a reconstruction of a missing core position.'
    };
    if (core.has(name)) return {
      representation_role: 'series-primary', content_role: name === 'point-relation-binder-standalone.html' ? 'functional_instrument' : 'explanatory_or_mapping_view', centrality_score: 3,
      evidence_status: name === 'point-relation-binder-standalone.html' ? 'EXECUTABLE_DEMONSTRATOR' : 'CONCEPTUAL', note: 'Documented executable core view in the incomplete 13-position series.'
    };
  }

  if (path.startsWith(rosettaBase)) {
    const name = path.split('/').at(-1);
    const decisions = {
      'NEXAH_GEODESIC_WEATHER_INSTRUMENT.html': ['provenance-variant', 1, 'EXECUTABLE_DEMONSTRATOR', 'Earlier three-frame provenance view.'],
      'NEXAH_GEODESIC_WEATHER_INSTRUMENT(1).html': ['preferred-incoming-view', 3, 'EXECUTABLE_DEMONSTRATOR', 'Documented Four-Frame functional entrance; still incoming and unadopted.'],
      'NEXAH_QRT_CODE_MECHANISM.html': ['supporting', 2, 'EXECUTABLE_DEMONSTRATOR', 'Bounded local QRT grammar; not a universal QRT operator.'],
      'Q_ROSETTA_THREE_MATRICES_LQ II.html': ['preferred-incoming-view', 3, 'EXECUTABLE_DEMONSTRATOR', 'Semantically richest matrix/view variant.'],
      'Q_ROSETTA_THREE_MATRICES_LQ.html': ['variant', 1, 'EXECUTABLE_DEMONSTRATOR', 'Earlier matrix/view variant.'],
      'Q_ROSETTA_THREE_MATRICES_LQ-2.html': ['variant', 1, 'EXECUTABLE_DEMONSTRATOR', 'Alternate matrix/view variant.'],
      'NEXAH_SORT_LAB_BUBBLE_VS_PANCAKE-2.html': ['preferred-incoming-view', 3, 'EXECUTABLE_DEMONSTRATOR', 'Preferred sort-lab view because the I/L/A/U selection is visible.'],
      'NEXAH_SORT_LAB_BUBBLE_VS_PANCAKE.html': ['variant', 1, 'EXECUTABLE_DEMONSTRATOR', 'Earlier sort-lab view.']
    };
    const decision = decisions[name];
    if (decision) return { representation_role: decision[0], content_role: 'functional_instrument', centrality_score: decision[1], evidence_status: decision[2], note: decision[3] };
    return { representation_role: 'incoming-support', content_role: 'explanatory_or_mapping_view', centrality_score: 2, evidence_status: 'VISUAL_EXPLANATION_OR_TEST_FIXTURE', note: 'Supporting incoming Rosetta surface; no canonical graph or universal operator is inferred.' };
  }

  if (path.startsWith(root7Base) && /NEXAH_Root7_Tesseract_Bridge/i.test(path)) {
    if (/copy 2\.html$/i.test(path)) return {
      representation_role: 'historical-family-master', content_role: 'functional_instrument', centrality_score: 3,
      evidence_status: 'EXECUTABLE_DEMONSTRATOR', note: 'Semantically richest of four cumulative Root7 bridge views; scientific authority remains with the bounded closeout.'
    };
    return { representation_role: 'historical-variant', content_role: 'explanatory_or_mapping_view', centrality_score: 1, evidence_status: 'CONCEPTUAL', note: 'Earlier cumulative Root7 bridge view, not a separate project.' };
  }

  if (path.startsWith('NEXAH_ORION_ECOSYSTEM_ARCHITECTURE_CONTINUITY_AND_DRIFT_CONTROL/master_visual_v1/')) return {
    representation_role: path.endsWith('-standalone.html') ? 'standalone-wrapper' : 'versioned-derived-master',
    content_role: 'explanatory_or_mapping_view', centrality_score: 2, evidence_status: 'DERIVED_REVIEW_REQUIRED',
    note: 'Registered derived architecture visual; controlling Markdown wins and visual authority is NONE.'
  };
  if (path.startsWith('MISSION_CONTROL_ROEDELHEIM_ORIENTATION_RETURN_2026-09-16/interactive/')) return {
    representation_role: 'supporting-explainer', content_role: 'explanatory_or_mapping_view', centrality_score: 2,
    evidence_status: 'CONCEPTUAL', note: 'Retained local explainer; it does not execute the historical/map/building test and Homebase is parked.'
  };
  if (path.startsWith('SCIENCE_LAB/CASE_STUDIES/CIKADA_3301_LATER_MARKER_PROVENANCE_INTAKE/')) return {
    representation_role: 'source-only', content_role: 'source_material', centrality_score: 1,
    evidence_status: 'HOLD_CONFLICTING_DEFINITIONS', note: 'Provenance corpus view; no uniquely prior cross-domain operator is adopted.'
  };
  if (path.startsWith('SCIENCE_LAB/CASE_STUDIES/THREE_LIFE_SYSTEMS_PLUS_ONE_BINDER_VISUAL_SERIES_2026-08-24/')) return {
    representation_role: 'source-only', content_role: 'explanatory_or_mapping_view', centrality_score: 1,
    evidence_status: 'CONCEPTUAL', note: 'Preserved visual primary in a frozen, non-normative source family.'
  };
  if (path.startsWith('SCIENCE_LAB/CASE_STUDIES/NEXAH_OPEN_SHELL_DOCUMENT_FAMILY_2026-09-14/')) return {
    representation_role: 'source-only', content_role: 'source_material', centrality_score: 1,
    evidence_status: 'DOCUMENTARY_CUSTODY', note: 'Preserved documentary source; not a normative OLS or OVS extension.'
  };
  if (path.startsWith('SCIENCE_LAB/CASE_STUDIES/NEXAH_SOLAR_SYSTEM_CLOCKWORK_DOCUMENT_FAMILY_2026-09-14/')) {
    if (path.includes('q-port-conic-gate')) return {
      representation_role: 'application-benchmark', content_role: 'functional_instrument', centrality_score: 3,
      evidence_status: 'BUILT_INTERACTIVE_WITH_DECLARED_VALUES', application_role: 'typed-method-transfer-benchmark',
      related_modules: ['MOD:TRANSVERSUM_TWO_CUT', 'MOD:OPERATOR_DEMONSTRATOR', 'MOD:ROSETTA_GEODESIC'],
      connection_families: ['CF:F2', 'CF:F3', 'CF:F7'], thesis_routes: ['TM-07', 'TM-10', 'TM-13'],
      relation_explanation: 'Applies boundary, gate and return typing to standard conic orbit classes. It tests whether the grammar transfers cleanly; it does not derive orbital mechanics or prove a shared physical mechanism.',
      note: 'SOL-10 application benchmark: established conic classification expressed through a NEXAH gate interface; displayed astronomical values still require provenance and verification.'
    };
    return {
      representation_role: 'application-demonstrator', content_role: 'explanatory_or_mapping_view', centrality_score: 2,
      evidence_status: 'BUILT_INTERACTIVE', application_role: 'orientation-analogy',
      related_modules: ['MOD:TRANSVERSUM_TWO_CUT', 'MOD:ROSETTA_GEODESIC'],
      connection_families: ['CF:F1', 'CF:F3', 'CF:F4'], thesis_routes: ['TM-01', 'TM-10', 'TM-13'],
      relation_explanation: 'Maps one carrier through selectable cuts into comparable traces and a return record. It demonstrates the vocabulary, not a measured Saturn–Titan transfer function.',
      note: 'SOL-10 orientation demonstrator inside the documentary Clockwork family; not an astronomical validation or a new QRT definition.'
    };
  }
  if (path.includes('/Orion_POLAR:Pass Maastricht/')) return {
    representation_role: path.endsWith('/transition-window-flow-mapping.html') ? 'historical-family-master' : 'supporting',
    content_role: path.endsWith('/transition-window-flow-mapping.html') ? 'functional_instrument' : 'explanatory_or_mapping_view',
    centrality_score: path.endsWith('/transition-window-flow-mapping.html') ? 3 : 2,
    evidence_status: 'ARCHIVED_EVIDENCE_CASE_STUDY', note: 'One view in the archived Maastricht family; scientific claims remain unadopted.'
  };
  if (path.includes('/NEXAH_ORI04_READER_HANDOFF_UTILITY_2026-09-26/participant_instrument.html')) return {
    representation_role: 'study-instrument', content_role: 'functional_instrument', centrality_score: 2,
    evidence_status: 'PREREGISTERED_PREFLIGHT', note: 'Participant instrument prepared and verified; no participant data or utility result exists.'
  };
  if (path.includes('/LQE01_LIGHT_OCCLUDER_RECEIVER_GEOMETRY_2026-09-09/')) return {
    representation_role: 'source-only', content_role: 'validation_or_test_surface', centrality_score: 1,
    evidence_status: 'CUSTODY_REPLAY', note: 'Preserved offline replay input; not an independent current instrument.'
  };
  if (path.includes('/ROEDELHEIM_HISTORY_AND_TOPOGRAPHY_2026-09-25/')) return {
    representation_role: 'source-only', content_role: 'source_material', centrality_score: 1,
    evidence_status: 'SOURCE_CORPUS', note: 'Historical/topographic source material; visual hypotheses remain below source-bound evidence.'
  };
  if (path.includes('/T_RAN_S_FORMATION/')) return {
    representation_role: 'historical-fixture', content_role: 'validation_or_test_surface', centrality_score: 1,
    evidence_status: 'HISTORICAL_PACKAGE', note: 'Fixture inside a larger status-ledgered transformation package; not a standalone module.'
  };
  if (path.startsWith('NEXAH_TRANSLATION_AUDIT_REPORT_01/') && path.includes('THREAD_LOOM')) return {
    representation_role: path.includes('/FROZEN_CHAIN/') ? 'frozen-primary' : 'exact-review-copy',
    content_role: path.includes('/FROZEN_CHAIN/') ? 'validation_or_test_surface' : 'custody_copy',
    centrality_score: path.includes('/FROZEN_CHAIN/') ? 3 : 1,
    evidence_status: 'TESTED_TRANSLATION_ARTIFACT', note: 'One byte-identical instrument distributed into blinded reviewer custody; review copies are not new modules.'
  };
  if (path.endsWith('/REPAIR_R1/E8_AXIS08_REPAIR_LAB.html')) return {
    representation_role: 'tested-successor', content_role: 'validation_or_test_surface', centrality_score: 3,
    evidence_status: 'TESTED_12_OF_12', note: 'Canonical bounded repair harness; it supersedes the original display formulas for current AXIS08 use without rewriting their provenance.'
  };
  if (path.endsWith('/SOURCE_SNAPSHOT/E8 DEMOS/NEXAH_E8_AXIS08_Coupling.html')) return {
    representation_role: 'source-only', content_role: 'source_material', centrality_score: 1,
    evidence_status: 'PRESERVED_MODEL_SOURCE', note: 'Focused source demonstrator preserved for lineage; Repair R1 is the tested numerical successor.'
  };
  if (path.includes('/NEXAH LAB Operator demonstrator/NEXAH_HTML_Package/') && !path.endsWith('/index.html')) return {
    representation_role: 'package-step', content_role: /06_representation/.test(path) ? 'validation_or_test_surface' : 'functional_instrument', centrality_score: 2,
    evidence_status: 'EXECUTABLE_DEMONSTRATOR', note: 'One ordered step in the seven-part operator/representation package, not a separate research programme.'
  };
  if (path.endsWith('/NEXAH LAB Operator demonstrator/NEXAH_Layered_Adaptive_Orientation_Lab.html')) return {
    representation_role: 'conceptual-prototype', content_role: 'functional_instrument', centrality_score: 2,
    evidence_status: 'CONCEPTUAL_INTERACTION_PROTOTYPE', note: 'Explanatory UI prototype; sliders alter decision variables without a validated world model.'
  };
  if (path.includes('/ROOT7_INTAKT_RECORD_TEST_01 4/E8_REP_03_BENCHMARK/visuals/')) return {
    representation_role: 'custody-validation-view', content_role: 'validation_or_test_surface', centrality_score: 1,
    evidence_status: 'HISTORICAL_BENCHMARK_VIEW', note: 'Visual output inside the Root7 intake benchmark; not a current E8 module entrance.'
  };
  return null;
}

function stableArtifactId(path) {
  return `ART:HTML:${createHash('sha256').update(path).digest('hex').slice(0, 12).toUpperCase()}`;
}

function inferredModule(path) {
  return moduleRules.find(([, pattern]) => pattern.test(path))?.[0] ?? null;
}

function candidateFamily(path) {
  return candidateRules.find(([, pattern]) => pattern.test(path))?.[0] ?? null;
}

function interactionLevel(entry) {
  const absolute = join(repositoryRoot, entry.path);
  const source = readFileSync(absolute, 'utf8');
  if (/<iframe/i.test(source)) return 'embedded_or_composite';
  if (/<canvas/i.test(source) || /addEventListener|requestAnimationFrame|<input|<button|<select/i.test(source)) return 'interactive';
  if (/<svg/i.test(source)) return 'visual_static_or_light_interaction';
  return 'document_static';
}

function inferredPurpose(entry, duplicate, curated) {
  const text = `${entry.path} ${entry.title}`;
  if (duplicate?.copy_role === 'exact_copy') return 'custody_copy';
  if (curated?.ring === 1 && curated.role === 'master') return 'navigation_or_primary_instrument';
  if (/\/index\.html$/i.test(entry.path) || entry.local_href_count >= 4) return 'gateway_or_index';
  if (/audit|test|benchmark|repair|invariance|result|validation/i.test(text)) return 'validation_or_test_surface';
  if (/instrument|lab|simulator|mechanism|operator|sequencer|workbench|runtime/i.test(text)) return 'functional_instrument';
  if (/map|overview|reference|guide|blueprint|poster|visual|projection|view|field/i.test(text)) return 'explanatory_or_mapping_view';
  if (entry.preliminary_class === 'preserved_source') return 'source_material';
  if (entry.preliminary_class === 'custody_or_frozen') return 'custody_artifact';
  return 'explanatory_or_unresolved_surface';
}

function representationRole(entry, duplicate, curated) {
  if (duplicate?.copy_role === 'exact_copy') return 'exact_copy';
  if (curated) return curated.role;
  if (entry.preliminary_class === 'preserved_source') return 'source-only';
  if (entry.preliminary_class === 'custody_or_frozen') return 'historical';
  if (entry.preliminary_class === 'incoming_unadopted') return 'incoming-variant';
  if (/copy|[-_ ]v\d|\(1\)|-2\.html|_1\.html/i.test(entry.path)) return 'variant';
  return 'unresolved';
}

function lifecycle(entry, curated) {
  if (curated) return curated.lifecycle;
  const map = {
    incoming_unadopted: 'incoming',
    preserved_source: 'preserved',
    custody_or_frozen: 'frozen',
    current_export_candidate: 'current_candidate',
    research_area_surface: 'research_current',
    case_study_surface: 'case_study',
    science_lab_root: 'current_root',
    repository_supporting_surface: 'supporting'
  };
  return map[entry.preliminary_class] ?? 'unresolved';
}

function centrality(entry, moduleId, curated, purpose, duplicate) {
  if (duplicate?.copy_role === 'exact_copy') return 1;
  if (curated?.ring === 1 && curated.role === 'master') return 5;
  if (curated?.ring === 1) return 4;
  if (curated?.role === 'master') return 4;
  if (curated && ['supporting', 'variant'].includes(curated.role) && !['preserved', 'frozen', 'custody'].includes(curated.lifecycle)) return 3;
  if (curated) return 2;
  if (entry.preliminary_class === 'current_export_candidate') return 3;
  if (moduleId && ['functional_instrument', 'validation_or_test_surface', 'gateway_or_index'].includes(purpose)) return 2;
  if (['preserved_source', 'custody_or_frozen'].includes(entry.preliminary_class)) return 1;
  if (purpose === 'gateway_or_index') return 3;
  if (purpose === 'functional_instrument' || purpose === 'validation_or_test_surface') return 2;
  return 1;
}

const centralityLabels = {
  5: 'system_entry',
  4: 'module_primary',
  3: 'important_support',
  2: 'specialized_or_explanatory',
  1: 'provenance_or_unresolved',
  0: 'excluded'
};

function explanation({ entry, moduleId, familyHint, purpose, representation, life, score, duplicate, basis, documented }) {
  const owner = moduleId ? `Sie ist dem Modul ${moduleId} zugeordnet.` : familyHint ? `Sie gehört vorläufig zur Kandidatenfamilie ${familyHint}.` : 'Eine belastbare Modulfamilie ist noch nicht zugewiesen.';
  const copy = duplicate?.copy_role === 'exact_copy' ? ` Sie ist eine byte-identische Kopie von ${duplicate.primary_path}.` : '';
  const state = basis === 'curated_registry_v2' ? 'Die Zuordnung ist kuratiert.' : basis === 'documented_family_decision' ? 'Die Rollenentscheidung ist durch vorhandene Familien- oder Intake-Dokumente belegt.' : 'Die Zuordnung ist regelbasiert und vor einer Promotion zu prüfen.';
  const note = documented?.note ? ` ${documented.note}` : '';
  return `${entry.title === '(no title)' ? 'Diese unbetitelte HTML' : `„${entry.title}“`} dient primär als ${purpose.replaceAll('_', ' ')}; Darstellungsrolle: ${representation}, Lebenszyklus: ${life}, Zentralität: ${score}/5. ${owner}${copy}${note} ${state}`;
}

const artifacts = catalog.entries.map((entry) => {
  const curated = curatedSurfaces.get(entry.path) ?? null;
  const documented = documentedDecision(entry.path);
  const moduleId = curated?.module_id ?? inferredModule(entry.path);
  const familyHint = moduleId ? null : candidateFamily(entry.path);
  const duplicate = duplicateGroups.get(entry.path) ?? null;
  const isExactCopy = duplicate?.copy_role === 'exact_copy';
  const purpose = isExactCopy ? 'custody_copy' : documented?.content_role ?? inferredPurpose(entry, duplicate, curated);
  const representation = isExactCopy ? 'exact_copy' : documented?.representation_role ?? representationRole(entry, duplicate, curated);
  const life = lifecycle(entry, curated);
  const score = isExactCopy ? 1 : documented?.centrality_score ?? centrality(entry, moduleId, curated, purpose, duplicate);
  const basis = curated ? 'curated_registry_v2' : documented ? 'documented_family_decision' : moduleId || familyHint ? 'path_family_rule' : 'catalog_rule';
  const confidence = curated || documented ? 'high' : moduleId || familyHint ? 'medium' : 'low';
  const artifactId = curated?.surface_id ?? stableArtifactId(entry.path);
  const module = moduleId ? modules.get(moduleId) : null;
  const candidateRecord = familyHint ? candidateRecords[familyHint] : null;
  const curationState = curated ? 'curated' : documented ? 'documented' : 'provisional';

  return {
    artifact_id: artifactId,
    path: entry.path,
    title: entry.title,
    sha256: entry.sha256,
    bytes: entry.bytes,
    module_id: moduleId,
    candidate_family: familyHint,
    representation_group: moduleId ?? familyHint,
    assessment: {
      centrality_score: score,
      centrality_label: centralityLabels[score],
      content_role: purpose,
      representation_role: representation,
      interaction_level: interactionLevel(entry),
      lifecycle: life,
      curation_state: curationState,
      confidence,
      basis,
      evidence_status: documented?.evidence_status ?? (curated ? module?.evidence_class ?? 'CURATED' : 'UNASSESSED')
    },
    relationship: {
      current_master_surface: module?.current_master_surface ?? null,
      predecessor: curated?.predecessor ?? null,
      successor: curated?.successor ?? null,
      related_modules: module?.related_modules ?? documented?.related_modules ?? candidateRecord?.related_modules ?? [],
      connection_families: module?.connection_families ?? documented?.connection_families ?? candidateRecord?.connection_families ?? [],
      program_routes: candidateRecord?.program_routes ?? [],
      thesis_routes: documented?.thesis_routes ?? candidateRecord?.thesis_routes ?? [],
      thesis_support_status: candidateRecord?.thesis_support_status ?? null,
      application_role: documented?.application_role ?? null,
      relation_explanation: documented?.relation_explanation ?? null,
      duplicate
    },
    record: module?.owning_record ?? candidateRecord?.record ?? null,
    decision_sources: [
      module?.owning_record,
      candidateRecord?.record,
      ...(candidateRecord?.decision_sources ?? []),
      documented && entry.path.startsWith(orientationBase) ? 'SCIENCE_LAB/CASE_STUDIES/NEXAH_HTML_ORIENTATION_DEMONSTRATOR_SERIES/01_ARTIFACT_ROLE_LEDGER.md' : null,
      documented && entry.path.startsWith(rosettaBase) ? 'SCIENCE_LAB/CASE_STUDIES/NEXAH_ROSETTA_QRT_MODULE_AUDIT_2026-09-22/NEXAH_ROSETTA_QRT_MODULE_AUDIT.md' : null,
      documented && entry.path.startsWith(root7Base) ? 'SCIENCE_LAB/CASE_STUDIES/NEXAH_ROOT7_CUSTODY_2026-09-28/NEXAH_ROOT7_BOUNDED_CLOSEOUT_2026-09-28/FINAL_REPORT.md' : null,
      documented && entry.path.startsWith('NEXAH_ORION_ECOSYSTEM_ARCHITECTURE_') ? 'NEXAH_ORION_ECOSYSTEM_ARCHITECTURE_CONTINUITY_AND_DRIFT_CONTROL/04_MASTER_VISUAL_VERSIONING_RULE.md' : null,
      documented && entry.path.startsWith('MISSION_CONTROL_ROEDELHEIM_') ? 'MISSION_CONTROL_ROEDELHEIM_ORIENTATION_RETURN_2026-09-16/07_HOMEBASE_PARKING_DECISION.md' : null,
      documented && entry.path.startsWith('NEXAH_TRANSLATION_AUDIT_REPORT_01/') ? 'NEXAH_TRANSLATION_AUDIT_REPORT_01/README.md' : null,
      documented && entry.path.includes('/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/') ? 'SCIENCE_LAB/CASE_STUDIES/E8_DEMOS_INTERACTIVE_ORIENTATION_2026-09-21/E8_DEMOS_VALIDATION_REPORT.md' : null,
      documented && entry.path.includes('/NEXAH LAB Operator demonstrator/') ? 'SCIENCE_LAB/CASE_STUDIES/NEXAH LAB Operator demonstrator/NEXAH_Operator_HTML_Prototypes_Description.md' : null,
      documented && entry.path.includes('/ROOT7_INTAKT_RECORD_TEST_01 4/') ? 'SCIENCE_LAB/CASE_STUDIES/NEXAH_ROOT7_CUSTODY_2026-09-28/Nexah_Root7/ROOT7_INTAKT_RECORD_TEST_01 4/README.md' : null
    ].filter(Boolean).filter((value, index, values) => values.indexOf(value) === index),
    claim_ceiling: module?.claim_ceiling ?? candidateRecord?.claim_ceiling ?? 'UNRESOLVED — no module-level claim boundary assigned.',
    explanation: explanation({ entry, moduleId, familyHint, purpose, representation, life, score, duplicate, basis, documented }),
    technology: entry.technology,
    concepts: entry.concepts,
    assessment_review_required: curationState === 'provisional',
    promotion_review_required: !curated || !['active', 'current', 'current_bounded'].includes(life)
  };
});

const count = (values, key) => Object.fromEntries([...new Set(values.map((value) => key(value)))].sort().map((name) => [name, values.filter((value) => key(value) === name).length]));
const assigned = artifacts.filter((artifact) => artifact.module_id);
const candidates = artifacts.filter((artifact) => !artifact.module_id && artifact.candidate_family);
const unresolved = artifacts.filter((artifact) => !artifact.module_id && !artifact.candidate_family);
const provisionalArtifacts = artifacts.filter((artifact) => artifact.assessment.curation_state === 'provisional');

const registry = {
  schema: 'nexah.html-artifact-registry/1.0.0',
  generated_at: '2026-10-06',
  status: 'COMPLETE_FILE_COVERAGE / CURATED_DOCUMENTED_AND_PROVISIONAL_ASSESSMENT / NO_AUTOMATIC_PROMOTION',
  sources: {
    html_catalog: 'SCIENCE_LAB/NAVIGATION/HTML_CATALOG_SNAPSHOT_2026-10-05.json',
    module_registry: 'SCIENCE_LAB/NAVIGATION/NEXAH_MODULE_REGISTRY_V2_2026-10-05.json',
    taxonomy_crosswalk: 'SCIENCE_LAB/NAVIGATION/NEXAH_TAXONOMY_CROSSWALK_V2_2026-10-05.md'
  },
  assessment_axes: {
    centrality: '0 excluded; 1 provenance/unresolved; 2 specialized/explanatory; 3 important support; 4 module primary; 5 system entry',
    content_role: 'what the page does',
    representation_role: 'master, support, variant, historical, source, copy or unresolved',
    interaction_level: 'document, visual, interactive or embedded/composite',
    lifecycle: 'current, candidate, incoming, case study, preserved or frozen',
    curation_state: 'curated is Module Registry data; documented is supported by existing family/intake decisions; provisional is deterministic routing and requires review'
  },
  summary: {
    total_html: artifacts.length,
    curated: artifacts.filter((artifact) => artifact.assessment.curation_state === 'curated').length,
    documented: artifacts.filter((artifact) => artifact.assessment.curation_state === 'documented').length,
    provisional: artifacts.filter((artifact) => artifact.assessment.curation_state === 'provisional').length,
    assigned_to_modules: assigned.length,
    assigned_to_candidate_families: candidates.length,
    unresolved_family: unresolved.length,
    exact_copy_artifacts: artifacts.filter((artifact) => artifact.relationship.duplicate?.copy_role === 'exact_copy').length,
    by_centrality: count(artifacts, (artifact) => String(artifact.assessment.centrality_score)),
    by_content_role: count(artifacts, (artifact) => artifact.assessment.content_role),
    by_lifecycle: count(artifacts, (artifact) => artifact.assessment.lifecycle)
  },
  artifacts
};

writeFileSync(outputPath, `${JSON.stringify(registry, null, 2)}\n`);

const lines = [];
lines.push('# NEXAH HTML Curation Coverage');
lines.push('');
lines.push('Date: `2026-10-06`');
lines.push('');
lines.push('Status: `111/111 COVERED / CURATED + DOCUMENTED + PROVISIONAL / NO AUTOMATIC PROMOTION`');
lines.push('');
lines.push('## Coverage result');
lines.push('');
lines.push(`- HTML files: **${artifacts.length}**`);
lines.push(`- manually curated through Module Registry v2: **${registry.summary.curated}**`);
lines.push(`- classified from existing family/intake decisions: **${registry.summary.documented}**`);
lines.push(`- provisionally assessed by deterministic rules: **${registry.summary.provisional}**`);
lines.push(`- assigned to established modules: **${registry.summary.assigned_to_modules}**`);
lines.push(`- assigned to candidate families: **${registry.summary.assigned_to_candidate_families}**`);
lines.push(`- still without family: **${registry.summary.unresolved_family}**`);
lines.push(`- byte-identical secondary copies: **${registry.summary.exact_copy_artifacts}**`);
lines.push('');
lines.push('Every HTML now has an artifact ID, compact explanation, centrality score,');
lines.push('content role, representation role, interaction level, lifecycle, relationship');
lines.push('record and claim-boundary field. Existing decision documents are reused rather');
lines.push('than rewritten. Provisional values are explicitly marked and must not be');
lines.push('treated as a Mission Control promotion.');
lines.push('');
lines.push('## Centrality model');
lines.push('');
lines.push('| Score | Meaning | Count |');
lines.push('|---:|---|---:|');
for (const score of [5, 4, 3, 2, 1, 0]) lines.push(`| ${score} | ${centralityLabels[score]} | ${registry.summary.by_centrality[String(score)] ?? 0} |`);
lines.push('');
lines.push('Centrality is a navigation assessment, not scientific importance. A frozen');
lines.push('source can be scientifically important while remaining a low-priority current');
lines.push('entrance.');
lines.push('');
lines.push('## System and module entrances');
lines.push('');
lines.push('| Score | Artifact | Module | Role |');
lines.push('|---:|---|---|---|');
for (const artifact of artifacts.filter((item) => item.assessment.centrality_score >= 4).sort((a, b) => b.assessment.centrality_score - a.assessment.centrality_score || a.title.localeCompare(b.title))) {
  lines.push(`| ${artifact.assessment.centrality_score} | \`${artifact.title}\` | \`${artifact.module_id ?? '—'}\` | ${artifact.assessment.representation_role} |`);
}
lines.push('');
lines.push('## Representation families');
lines.push('');
lines.push('| Group | HTMLs | Curated | Documented | Centrality max |');
lines.push('|---|---:|---:|---:|---:|');
const groups = new Map();
for (const artifact of artifacts.filter((item) => item.representation_group)) {
  if (!groups.has(artifact.representation_group)) groups.set(artifact.representation_group, []);
  groups.get(artifact.representation_group).push(artifact);
}
for (const [group, items] of [...groups.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))) {
  lines.push(`| \`${group}\` | ${items.length} | ${items.filter((item) => item.assessment.curation_state === 'curated').length} | ${items.filter((item) => item.assessment.curation_state === 'documented').length} | ${Math.max(...items.map((item) => item.assessment.centrality_score))} |`);
}
lines.push('');
lines.push('## Review queue');
lines.push('');
lines.push('The document pass has reduced the open assessment queue to the pages below.');
lines.push('They already have a family hint, but no existing decision record explicitly');
lines.push('binds either HTML as a canonical module surface. They therefore remain');
lines.push('provisional instead of being promoted from filename or visual resemblance.');
lines.push('');
lines.push('### Remaining provisional assessments');
lines.push('');
for (const artifact of provisionalArtifacts.sort((a, b) => b.assessment.centrality_score - a.assessment.centrality_score || a.path.localeCompare(b.path))) {
  lines.push(`- **${artifact.assessment.centrality_score}/5 · ${artifact.assessment.content_role}:** \`${artifact.path}\``);
}
lines.push('');
lines.push('### Unresolved family assignments');
lines.push('');
if (unresolved.length === 0) lines.push('- None. Every HTML has either an established module or a candidate family.');
else for (const artifact of unresolved.sort((a, b) => b.assessment.centrality_score - a.assessment.centrality_score || a.path.localeCompare(b.path))) lines.push(`- **${artifact.assessment.centrality_score}/5 · ${artifact.assessment.content_role}:** \`${artifact.path}\``);
lines.push('');
lines.push('## Data source');
lines.push('');
lines.push('[`HTML_ARTIFACT_REGISTRY_V1_2026-10-06.json`](HTML_ARTIFACT_REGISTRY_V1_2026-10-06.json)');

writeFileSync(reportPath, `${lines.join('\n')}\n`);
console.log(JSON.stringify(registry.summary, null, 2));
