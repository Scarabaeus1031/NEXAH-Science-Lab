# NEXAH-CCR-01 — Capability, Usability and Priority Overview

Date: 2026-09-05  
Desk: 01  
Review type: bounded documentary and structural capability review  
Primary decision: **B — STRONG_RESEARCH_AND_ORIENTATION_ENVIRONMENT_INTEGRATED_PRODUCT_INCOMPLETE**

## Purpose

This package answers one practical question: which capabilities NEXAH actually possesses, and which can be used today without reconstructing the Owner–AI dialogue.

The review compresses repositories, reports, tests, interfaces, HTML instruments and visual archives into 23 capability families. A file count is not treated as a capability count. Documentation is not treated as implementation, passing tests are not treated as product validation, and visual quality is not treated as evidence.

## Core result

NEXAH is simultaneously:

- a strong Human orientation practice;
- a strong documented framework with OLS 1.0, governance and evidence boundaries;
- a working research environment with several tested standalone components;
- an early integrated software product;
- a moderately usable public experience through `nexah.de` and the bounded NEXAHEDRON Workspace.

Three capability families meet the review's M6 threshold: the public NEXAH Library/Living Atlas, NEXAHEDRON's browser-local bounded Workspace, and NEXAHEDRON's curated reference cases. The certified ORION Core, Kernel tools, THE EYE comparator/projection chain and NRRC validator are real software capabilities, but they are not one externally usable end-to-end product.

## Compressed workflow

```text
RECEIVE → ORIENT → COMPARE → PRESERVE → DECIDE
```

All five stages exist somewhere. The chain is strongest at ORIENT and PRESERVE. The weakest seam is routing: no single discoverable mechanism receives a user need, selects an appropriate tested capability, preserves its boundaries and returns the result through one stable public entry point.

Public shorthand:

```text
INPUT → DIFFERENCE → ORIENTATION → HUMAN DECISION
```

This is supported as a bounded description of the intended process, not as proof that every public session currently executes every machine stage.

## Compression counts

```text
TOTAL_ARTIFACTS_INSPECTED = 68
CAPABILITY_FAMILIES_CONFIRMED = 23
PRIMARY_ACTIVE_CAPABILITIES = 15
PUBLICLY_USABLE_FEATURES = 3
INTERACTIVE_DEMONSTRATOR_FAMILIES = 5
ARENA_ATLAS_CANDIDATES = 5
ARCHIVE_FAMILIES = 5
DISCONNECTED_CAPABILITIES = 9
DUPLICATE_OR_SUPERSEDED_FAMILIES = 4
```

## Priority calculation

Each capability receives an integer score from 0 to 3 for `USER_NEED`, `DISTINCTIVE_VALUE`, `CURRENT_MATURITY`, `EVIDENCE_STRENGTH`, `INTEGRATION_EFFORT_INVERSE`, `PUBLIC_EXPLAINABILITY` and `STRATEGIC_FIT`. For each ranking view:

```text
WEIGHTED_SCORE = sum(criterion_score × view_weight)
```

Weights appear in the same field order in `11_PRIORITY_MODEL_AND_RANKINGS.csv`:

| View | Weights | Maximum |
|---|---:|---:|
| Practical Human use | 3:2:2:2:2:3:2 | 48 |
| Software construction | 2:2:3:3:2:1:2 | 45 |
| Public communication | 3:2:1:1:2:3:2 | 42 |
| Research preservation | 1:2:2:3:1:1:3 | 39 |

Ties are resolved by distinctive value, then public explainability, then capability ID. Artifact count and visual quality receive no score. Actions use only the declared `P1 — EXPOSE_NOW` through `P7 — RETIRE_CANDIDATE_NO_DELETION` vocabulary.

## Evidence boundary

Local source evidence was inspected read-only. Current public availability was checked on 2026-09-05: `https://nexah.de`, `https://nexah.de/visitor-guide/`, the main NEXAHEDRON routes and `https://nexahedron.com` returned usable public pages. `https://nexahedron.com/the-eye` returned HTTP 404. HTTP reachability proves availability of a page, not complete operability, scientific validity or external validation.

No new experiment, research program, deployment, publication, source modification or canonical change was performed.

## Package map

- `01_AUTHORITY_SCOPE_AND_FREEZE.md` — authority, exclusions and freeze
- `02_SOURCE_AND_SYSTEM_INVENTORY.csv` — 68 evidence records with hashes where practical
- `03_CAPABILITY_FAMILIES.csv` — full capability records
- `04_CAPABILITY_MATURITY_MATRIX.csv` — M0–M7 assignments and evidence
- `05_USABILITY_ASSESSMENT.csv` — six-axis usability assessment
- `06_HTML_AND_VISUAL_CORPUS_CLASSIFICATION.csv` — corpus families and routing
- `07_SOFTWARE_REALITY_CHECK.md` — direct system-layer answers
- `08_DISCONNECTED_CAPABILITIES.csv` — unexposed, unregistered and missing connections
- `09_NEXAH_STAGE_COVERAGE.md` — RECEIVE through DECIDE coverage
- `10_DISTINCTIVE_VALUE_ASSESSMENT.md` — what is and is not distinctive
- `11_PRIORITY_MODEL_AND_RANKINGS.csv` — transparent four-view rankings
- `12_PUBLIC_ENTRY_POINTS.md` — verified and declared public routes
- `13_ARCHIVE_ARENA_ATLAS_OBSERVATORY_ROUTING.md` — conceptual routing without file operations
- `14_TOP_CAPABILITIES_NOW.md` — top 15 capability map
- `15_GAPS_AND_NONCLAIMS.md` — material gaps and claim ceilings
- `16_FINAL_DESK01_CAPABILITY_DECISION.md` — final decision and status block
- `MANIFEST_SHA256.txt` — hashes for every package file except the manifest
