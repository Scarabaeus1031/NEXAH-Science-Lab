# Research Institute Audit

Status: `READ-ONLY ARCHAEOLOGICAL ASSESSMENT`

Date: `2026-08-02`

Operational effect: `NONE`

## Purpose

This package reconstructs the research institute already present across the
canonical NEXAH repository, the Science Lab evidence packages and the bounded
Control Desk research homes. It does not create an institute, Lab, question,
operator, status, authority or repository structure.

## Audit method

The audit used four levels:

1. complete path inventory of the canonical NEXAH checkout;
2. complete reading of constitutional, architecture, repository-map,
   Research, OLS, Library, Evidence and Control Desk entry authorities;
3. structured extraction of questions, experiment families, reports,
   definitions, claims and status language;
4. targeted reading of the principal research packages and existing Science
   Lab distillations.

The canonical NEXAH inventory contained approximately `9,478` files after
excluding Git internals, virtual environments and cache trees, including `984`
Markdown documents. File presence was inventoried exhaustively. Scientific
meaning was assessed through the owning documents and indexes; the audit did
not semantically reinterpret every generated image, output array or historical
script.

## Source ledger

| ID | Source |
|---|---|
| `N-CON` | canonical NEXAH `GOVERNANCE/ECOSYSTEM_CONSTITUTION.md` |
| `N-MAP` | canonical NEXAH `README.md` and `REPOSITORY_MAP.md` |
| `N-ARCH` | canonical NEXAH `ARCHITECTURE/README.md`, `SYSTEM_STATE.md` and adopted Research & Ecosystem Architecture |
| `N-RES` | canonical NEXAH `RESEARCH/README.md`, `RESEARCH_INDEX.md`, `RESEARCH_VISION.md` and local indexes |
| `N-OLS` | canonical NEXAH `ORIENTATION_LANGUAGE/README.md` and OLS 1.0 release |
| `N-LIB` | canonical NEXAH `LIBRARY/README.md`, Registry and Website Catalog status |
| `N-EVID` | canonical NEXAH Evidence Atlas and owning validation packages |
| `N-APP` | canonical NEXAH Applications and application-local research packages |
| `N-EXP` | canonical NEXAH Experimental index, Observer Geometry Lab and Builder Lab inventories |
| `CD` | Control Desk Constitution, Mission Control, Registries and scientific audit |
| `RO` | Rödelheim Observatory bundle index and Labs 0.2–0.4 |
| `M01` | Mission 01 Scientific Backbone |
| `M02` | Mission 02 Hidden Architecture |
| `PA–PG` | Research Programs A–G |

All references in this package are descriptive pointers. Source authority
remains with the cited owner.

## Deliverables

1. [Repository Archaeology Report](01_REPOSITORY_ARCHAEOLOGY_REPORT.md)
2. [Existing Research Program Map](02_EXISTING_RESEARCH_PROGRAM_MAP.md)
3. [Existing and Candidate Lab Catalogue](03_EXISTING_AND_CANDIDATE_LAB_CATALOGUE.md)
4. [Research Question Catalogue](04_RESEARCH_QUESTION_CATALOGUE.md)
5. [Reusable Mathematical Objects Catalogue](05_REUSABLE_MATHEMATICAL_OBJECTS_CATALOGUE.md)
6. [Research Flow Assessment](06_RESEARCH_FLOW_ASSESSMENT.md)
7. [Constitution Compatibility Review](07_CONSTITUTION_COMPATIBILITY_REVIEW.md)
8. [Minimal Additive Research Institute Proposal](08_MINIMAL_ADDITIVE_RESEARCH_INSTITUTE_PROPOSAL.md)
9. [Critical Self Review](09_CRITICAL_SELF_REVIEW.md)
10. [Owner Decision List](10_OWNER_DECISION_LIST.md)

Later status-neutral documentation: [Research Institute Phase B](../RESEARCH_INSTITUTE_PHASE_B/README.md).

## Audit boundary

- No canonical repository was modified.
- No Control Desk file was modified.
- No Lab or question was activated.
- No maturity or evidence state was changed.
- No file move, rename, archive, merge or deletion was performed.
- No scientific execution or external literature search was performed.
