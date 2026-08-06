# Minimal Additive Research Institute Proposal

Status: `PROPOSAL — OWNER DECISION REQUIRED`

## Design conclusion

Do not create a new repository and do not reorganize existing research. The
smallest useful Institute layer is three Research-owned documents added only
after owner approval:

```text
RESEARCH/
├── QUESTIONS.md
├── LABS.md
└── LAB_REPORT_TEMPLATE.md
```

One later link from the existing `RESEARCH/README.md` would expose them. No
other path change is required.

## 1. `QUESTIONS.md`

One record per owner-admitted bounded question:

```text
question_id
question
scope
owner
authority_source
status
required_definition
related_labs
current_answer
evidence_boundary
next_permitted_action
last_reviewed
```

Questions become first-class references, not independent files by default.

## 2. `LABS.md`

One cross-repository row per owner-admitted Lab:

```text
lab_id
question_id
canonical_home
scientific_object
protocol
result
review
lab_report
status
stop_condition
owner
```

This index must permit Labs in Research, Applications, validation and bounded
legacy homes. A folder called `Lab` is not required.

## 3. `LAB_REPORT_TEMPLATE.md`

Minimum endpoint:

```text
Question
Scope
Definitions and versions
Scientific object
Input
Method or protocol
Result
Evidence
Uncertainty
Counterexamples or negative findings
Interpretation
Explicit non-claims
Review
Disposition
STOP condition
Next permitted action
Provenance
```

The template may be used locally. Reports remain with the owning Lab.

## Decisions on the requested structural questions

| Question | Recommendation |
|---|---|
| Should Labs exist as folders? | Not necessarily. Use existing bounded folders; create a folder only when the Lab has multiple artifacts. |
| Should Questions become first-class objects? | Yes, as stable indexed records with owner and status. |
| Should Reports become canonical endpoints? | Yes within the Lab's Research authority, but never as universal truth or architecture authority. |
| Should Literature be centralized? | No. Keep literature local to the question/Lab; centralize only citations or review pointers. |
| Should Definitions become canonical objects? | Only stable, scoped definitions with an explicit owner. Do not centralize all working definitions. |
| Should Operators have another registry? | No. OLS, Library Concepts and namespaced research measures already have distinct owners. |
| Should Experiments remain distributed? | Yes. Index them from the Lab record. |

## Lab lifecycle

Use existing states rather than inventing a new universal state machine:

```text
DRAFT
→ ACTIVE
→ REVIEW
→ ACCEPTED | REJECTED | STOP_AND_RETAIN
→ ARCHIVED
```

Where a source already uses another governed state, preserve it and map only
for navigation. `ACCEPTED` means the report is accepted as an accurate record;
it does not make every interpretation true.

## Required exclusions

- no Catalog population;
- no automatic question extraction;
- no relocation of Labs 0.2–0.4;
- no duplication of Evidence Atlas;
- no new operator or semantic registry;
- no bulk renaming of experiments;
- no retroactive status assignment without owner review.

## Why this is minimal

The existing Repository Map, Research Index, Evidence Atlas, Control Desk,
Catalog architecture and governance already cover navigation, claims,
operations and authority. Reproducing them would increase maintenance. The
only uncovered relation is the stable path from a bounded question to its Lab
and terminal report.

