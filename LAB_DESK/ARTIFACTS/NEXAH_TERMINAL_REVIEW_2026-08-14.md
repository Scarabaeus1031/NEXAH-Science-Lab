# NEXAH Terminal-Candidate Reconciliation Review

Status date: 2026-08-14

Disposition: **ONE_SEPARATE_SCIENCE_CANDIDATE; ALL_OTHER_ROOTS_ROUTED_OR_EMBEDDED**

This review classifies the 21 untracked NEXAH roots that contain terminal-looking
documents. It does not adopt them, delete them, or change a scientific result.

## Reconciliation matrix

| Root | Reconciliation class | Reason / next route |
|---|---|---|
| `NEXAH_APPLICATION_AND_USEFULNESS_ROADMAP_V1` | `ROUTE_APPLICATION_STRATEGY` | Roadmap ready with blockers; contract remains not adopted |
| `NEXAH_APPLICATION_PHASE_1` | `ROUTE_APPLICATION_STRATEGY` | Explicitly `PROPOSED / NOT_ADOPTED`; no Lab science registration |
| `NEXAH_CODEX_ARCHITECTURE_EXTRACTION_REVIEW` | `OWNER_REVIEW_CONTEXT` | Review lens only; not ready as canonical contract |
| `NEXAH_ECOSYSTEM_REPOSITORY_CURRENTNESS_FREEZE_REPORT.md` | `REPOSITORY_MAINTENANCE_RECORD` | `NO_ARCHITECTURE_IMPACT`; not a scientific endpoint |
| `NEXAH_EXP_T02_ADVERSARIAL_PREREGISTRATION_REVIEW` | `HISTORICAL_T02_DESIGN_PROVENANCE` | Do-not-run v1 review; tracked v2 and v3 gate chain now controls T02 status |
| `NEXAH_LEGACY_REPRESENTATION_PIPELINE_AUDIT` | `SUPPORTING_METHOD_PROVENANCE` | No experiment/new discovery; useful context for prospective transition work |
| `NEXAH_MATHEMATICS_LAB_SERIES_I_FINAL_REDUCTION_REVIEW` | `OWNER_REVIEW_CONTEXT` | Series I disposition C; zero admitted research candidates; no operational effect |
| `NEXAH_MATHEMATICS_LAB_SERIES_I_FINAL_SCIENTIFIC_ASSESSMENT` | `OWNER_REVIEW_CONTEXT` | Series concluded; methodological result only; owner review remains |
| `NEXAH_OPERATOR_INVARIANCE_BATTERY` | `EMBEDDED_IN_TRACKED_RC1` | Exact mapped study/source files are preserved in the RC1 release bundle |
| `NEXAH_ORION_ECOSYSTEM_PHASE_4B_LUCY_OWNER_ADOPTION_AND_ARCHITECTURE_FREEZE` | `ROUTE_ARCHITECTURE_PROVENANCE` | Architecture decision history; no Lab-science adoption |
| `NEXAH_ORION_LUCY_ARCHITECTURE_RECONCILIATION_PHASE_4A` | `ROUTE_ARCHITECTURE_PROVENANCE` | Superseded decision-preparation state; no implementation effect |
| `NEXAH_ORION_REPOSITORY_SYNC_AND_PRE_APPLICATION_FREEZE_AUDIT` | `REPOSITORY_MAINTENANCE_RECORD` | Historical sync audit, not current Lab evidence authority |
| `NEXAH_POST_LEVEL1C_APPLICATION_DISCOVERY` | `ROUTE_APPLICATION_STRATEGY` | Application discovery only; Application 001 remains not adopted |
| `NEXAH_REPOSITORY_SCIENTIFIC_CLAIM_AUDIT` | `REPOSITORY_MAINTENANCE_RECORD` | Audit preceding the tracked reconciliation; no result changed |
| `NEXAH_SCIENTIFIC_CURRENTNESS_RECONCILIATION` | `REPOSITORY_MAINTENANCE_RECORD` | Currentness repair record with open authority items; not a new study |
| `NEXAH_TRANSLATION_FIDELITY_EXPERIMENT` | `EMBEDDED_IN_TRACKED_RC1` | Exact mapped Study-3/source files are preserved in the RC1 release bundle |
| `NEXAH_TRANSLATION_FIDELITY_LITERATURE_AUDIT` | `EMBEDDED_IN_TRACKED_RC1` | Exact mapped literature files are preserved in the RC1 release bundle |
| `NEXAH_TRANSLATION_FIDELITY_RECOVERY_LITERATURE_GAP_AUDIT` | `EMBEDDED_IN_TRACKED_RC1` | Exact mapped literature files are preserved in the RC1 release bundle |
| `NEXAH_TRANSLATION_FIDELITY_SYNTHESIS` | `EMBEDDED_IN_TRACKED_RC1` | Exact mapped synthesis files are preserved in the RC1 release bundle |
| `NEXAH_TRANSLATION_INVARIANT_REPLICATION` | `EMBEDDED_IN_TRACKED_RC1` | Exact mapped Study-2/source files are preserved in the RC1 release bundle |
| `NEXAH_TRANSLATION_RECOVERY_EXP_T01` | `SEPARATE_SCIENCE_CANDIDATE` | Independent frozen synthetic study; not one of the three RC1 studies |

## RC1 provenance verification

The tracked `TRANSLATION_FIDELITY_TECHNICAL_REPORT_RC1/SOURCE_PROVENANCE.md`
contains 46 source-to-release mappings across the six source roots classified
above as `EMBEDDED_IN_TRACKED_RC1`. Every mapped source/release hash comparison
passes. RC1 is self-contained; the source roots are retained locally as
historical source provenance and must not be blindly recommitted or deleted.

## T02 authority check

The tracked repository already contains the v1 package, v2 redesign,
information-limited design audit and v3 preregistration-gate audit. The current
Master Status records T02 as `FROZEN`, with no preregistration, implementation
or experiment authorized. The untracked adversarial v1 review is therefore
historical design provenance, not the current T02 endpoint.

## EXP-T01 candidate check

- Files: **27**
- Package hash-manifest bindings checked: **26 / 26 match**
- Authority: `SCIENCE_LAB_NOT_ADOPTED`
- New mathematical invariant: **NO**
- Canonical NEXAH changed: **NO**
- Physical or IEEE/PEGASE experiment: **NO**
- Preserved bounded result:
  `EXP_T01_TRANSLATION_CLASSIFIER_SUPPORTED`
- Preserved stillpoint result:
  `STILLPOINT_OPERATIONAL_EQUILIBRIUM_CONFIRMED`

Recommendation: review EXP-T01 as its own bounded registration candidate. Do
not fold it into RC1, T02, canonical NEXAH, ORION architecture, or an external
validation claim.

## Remaining owner gates

1. Approve or reject a separate exact EXP-T01 science-core registration.
2. Decide later whether the supporting legacy-pipeline audit should accompany
   T01/T02 as method provenance or remain local context.
3. Route Application, architecture and repository-maintenance records through
   their responsible Desks instead of adding them to the Lab science core.

No move or deletion is authorized by this review.
