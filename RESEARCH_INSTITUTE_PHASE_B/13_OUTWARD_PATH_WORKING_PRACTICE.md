# Declared Outward Path — Working Practice

Date: `2026-08-06`

Status: `NON-BINDING WORKING PRACTICE`

Operational effect: `NONE`

Governance effect: `NONE`

Evidence effect: `NONE`

Application or publication effect: `NONE`

## 1. Purpose and disposition

This record documents a lightweight working practice for connecting bounded
comparison questions to evidence and, where separately appropriate, to an
inspectable demonstrator or application candidate.

> New work should have a declared outward path, even when that path is
> initially internal, deferred or explicitly closed.

The path is documentation, not a publication obligation or lifecycle. It does
not require every idea, Field Note, experiment or measurement to become public,
Research, Evidence, a Demonstrator or an Application.

Classification: `SMALL WORKING-PRACTICE RECORD`; no Backbone change.

## 2. Existing foundations

The rule consolidates existing local practices without replacing them:

- the [Existing Research Grammar](01_EXISTING_RESEARCH_GRAMMAR.md) records
  bounded Question → Object/Method → Result → Evidence → Review → Disposition,
  while publication remains optional;
- the [Research Hierarchy](02_RESEARCH_HIERARCHY.md) permits a reviewed result to
  stop, remain a Research reference, seek Application adoption or proceed toward
  publication under separate authority;
- [Field Notes Governance](../FIELD_NOTES/FIELD_NOTES_GOVERNANCE.md) protects
  exploratory work and prohibits automatic Research or Evidence promotion;
- the [Track-B I-L-A-U audit](../RESEARCH_PROGRAM_A_MOVING_MASK_FEASIBILITY/TRACE_TO_MOTION_0_1_PROTOCOL_DRAFT/TRACK_B_REVERSAL_RELATION_AND_ILAU_AUDIT_DE.md)
  contains a local Comparison Card with Objects, Cut, Map, retained/lost/
  introduced/unknown content, Confidence and Decision relevance;
- the [Application Roadmap](../RESEARCH_PROGRAM_D_APPLICATION_LANDSCAPE/09_APPLICATION_ROADMAP.md)
  routes existing evidence without authorizing implementation, validation,
  publication or outreach;
- the [Application readiness record](../RESEARCH_PROGRAM_D_APPLICATION_LANDSCAPE/03_READINESS_LEVELS.md)
  separates bounded public demonstrations from unvalidated or blocked use;
- [Translation Audit 01](../NEXAH_TRANSLATION_AUDIT_REPORT_01/README.md) freezes a
  report/visual/instrument chain while keeping unsupported external endpoints
  absent;
- the [Repository Baseline Freeze](12_BASELINE_FREEZE_2026_08_06.md) treats the
  Backbone as consolidated and directs new work toward bounded experiments and
  evidence rather than repeated Backbone restructuring.

No inspected source already states the complete outward-path rule or the status
set below. They are introduced only as non-authoritative documentation values
for this working practice.

## 3. Lightweight pull flow

Where a comparison is mature enough for bounded work, the preferred flow is:

```text
comparison question
→ partially completed Comparison Card
→ identified measurement need
→ minimal experiment
→ Evidence / report
→ completed Card
→ optional Demonstrator / Application candidate
```

This is a pull pattern, not a compulsory research pipeline. A run is especially
well justified when a specific open Card field requires a measurement. A result
does not automatically authorize the next arrow.

Existing authority boundaries remain in force at every step:

- a run does not automatically become Evidence;
- Evidence does not automatically become an Application;
- an Application candidate does not automatically become a public artifact;
- a public candidate does not change scientific or governance status.

## 4. Minimum Comparison Card

The existing Track-B card is suitable as a bounded local example, not as a
general template. For this working practice, the minimum Card sketch is:

```yaml
card_id:
status:
objects:
declared_cuts:
comparison_question:
decision_relevance:
evidence_refs:
missing_measurements:
outward_path:
claim_boundary:
```

Field meanings:

| Field | Minimum content |
| --- | --- |
| `card_id` | local stable identifier; it creates no registry identity |
| `status` | local documentation state such as sketch, open, sufficiently answered or closed |
| `objects` | the two or more items actually compared |
| `declared_cuts` | scope, exclusions, support, masks, tolerances or representation boundaries relevant to the comparison |
| `comparison_question` | one answerable contrast, not an umbrella theory question |
| `decision_relevance` | what decision the comparison can inform and what it cannot authorize |
| `evidence_refs` | owning reports, outputs, tests, replay records or claim records already available |
| `missing_measurements` | concrete unresolved fields requiring evidence; use `NONE` when the existing record is sufficient |
| `outward_path` | one documentation value from Section 5 |
| `claim_boundary` | strongest permitted reading and explicit non-transfer |

When the comparison is specifically about representation change, optional local
fields may include source support, map, `I`, `L`, `A`, `U`, confidence and
tolerance. They are not required for every Card and do not create a universal
I-L-A-U contract.

No JSON schema, validator, central registry or mandatory serialization is
created by this record.

## 5. Outward-path documentation values

| Value | Meaning in this working practice |
| --- | --- |
| `INTERNAL_CARD` | retained for internal comparison and planning |
| `PUBLIC_CANDIDATE` | potentially understandable as a bounded public artifact after separate review |
| `DEMONSTRATOR_CANDIDATE` | existing evidence may support an inspectable demonstration after separate authorization |
| `APPLICATION_CANDIDATE` | a practical use is identifiable but still subject to Application evidence and readiness gates |
| `DEFERRED` | outward work is intentionally postponed; the reason or missing gate is recorded |
| `NO_PUBLIC_PATH — REASON RECORDED` | the work remains internal or closed for a stated scientific, evidence, safety, provenance or scope reason |

These values classify intended documentation routes only. They are not
Governance states, Evidence classes, publication decisions, readiness levels or
promotion actions.

## 6. Pull and stop rules

### Pull rule

A new bounded experiment is particularly justified when:

1. the objects and comparison question are declared;
2. an open Card field identifies a concrete missing measurement;
3. a minimal experiment can answer that field within a declared claim boundary.

The rule does not forbid exploratory runs. It distinguishes an experiment pulled
by an explicit evidence gap from a run whose decision relevance remains unknown.

### Stop rule

Stop the run when the declared comparison question is sufficiently answered
under its protocol and claim boundary. Record additional interesting questions
in a backlog or separate Card; do not add them automatically to the same run.

`STOP` can retain a negative, null, limiting, deferred or closed result. It does
not require a Demonstrator, Application or publication.

## 7. Builder freedom

Exploratory work remains permitted:

- an early idea needs no complete Card;
- a Field Note needs no outward artifact;
- private, provisional and failed sketches may remain internal;
- publication is optional;
- a reasoned `NO_PUBLIC_PATH` is a valid route;
- no outward-path value changes scientific status.

Before a reproducible run or an Evidence claim, the owning record should at
least declare Objects, Cuts, Question and Claim boundary. This is the lightweight
point at which the outward path becomes useful without blocking early building.

## 8. First Card pilot — Translation Audit A1 versus A3

Exactly one existing pair is selected as the first proposed Card pilot:

```text
A1 — Lab 0.4 source report
versus
A3 — Lab 0.4 HTML instrument with its required model dependency
```

Reason for selection:

- both artifacts are present locally in the frozen Translation Audit package;
- their relation is documented as `DOCUMENTED_IMPLEMENTATION`;
- the comparison is understandable as report versus interactive instrument;
- the [Reference Relation Register](../NEXAH_TRANSLATION_AUDIT_REPORT_01/01_REFERENCE_RELATION_REGISTER.md)
  already records preserved, compressed, introduced and unavailable content;
- hashes, identities and the bounded chain are frozen;
- no new scientific measurement is required to draft a descriptive Card;
- the absent Experience and ORION endpoints remain excluded rather than being
  retrofitted;
- the independent Human reconstructability test remains pending and is not
  simulated by this pilot selection.

Proposed Card sketch:

```yaml
card_id: CARD-PILOT-TA01-A1-A3
status: PROPOSED_FROM_EXISTING_EVIDENCE
objects: A1 Lab 0.4 source report; A3 HTML instrument and A3-D1 dependency
declared_cuts: A1/A3 relation only; A2, A4 and A5 excluded from this pair
comparison_question: Which scientific identities, projection behaviors, mask classes and boundaries are preserved, compressed or introduced in the report-to-instrument implementation?
decision_relevance: Tests whether existing evidence is sufficient for one bounded public-facing Comparison Card; does not validate reader effect or a five-stage translation chain
evidence_refs: Translation Audit README; frozen chain manifest; Reference Relation Register; Lab 0.4 report; HTML/model artifacts
missing_measurements: NONE for the descriptive preservation/loss Card; independent Human reconstructability remains a separate open test
outward_path: PUBLIC_CANDIDATE
claim_boundary: Executable representation of one synthetic test; no independent validation, Experience transfer, ORION transfer, physical model or universal translation grammar
```

This selection creates no Card artifact, measurement, Demonstrator, website or
publication. Network Orientation V1/V2 and IEEE-9/14 remain strong future
candidates, but their owning evidence packages are referenced rather than
fully present in this local workspace.

## 9. Non-effects

This working practice does not:

- modify the frozen Backbone or Mission 01;
- modify Field Notes Governance, OLS, the Constitution or ORION;
- create a Governance requirement, lifecycle or publication obligation;
- create a new Research Program, framework, operator, Evidence class or
  Comparison Card registry;
- promote an artifact to Research, Evidence, Demonstrator, Application or
  Publication;
- reinterpret Track C or authorize a Field-Lab run;
- authorize a CLI, website, public release or external write;
- modify existing experiment, report, application or Translation-Audit status.

The practice remains optional, local and reversible as documentation.
