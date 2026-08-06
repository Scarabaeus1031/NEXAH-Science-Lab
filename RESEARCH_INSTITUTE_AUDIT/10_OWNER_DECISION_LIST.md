# Owner Decision List

No decision is made by this audit.

## Required before any implementation

| ID | Owner decision | Why only the owner can decide |
|---|---|---|
| OD-01 | Is a Research Institute orientation layer wanted at all? | usefulness and maintenance burden are ownership judgments |
| OD-02 | Is canonical NEXAH `RESEARCH/` the owner of the layer? | placement would declare responsibility |
| OD-03 | Should the pilot use one combined index or separate Question and Lab indexes? | determines minimum maintenance surface |
| OD-04 | Who is the Research Index owner and reviewer? | no owner may be inferred |
| OD-05 | Which three existing Labs form the bounded pilot? | admission is an authority decision |
| OD-06 | May application-local and legacy Labs enter the index without moving? | cross-repository representation requires owner consent |
| OD-07 | Are existing Lab names and IDs retained exactly? | changing identity can rewrite provenance |
| OD-08 | Does `ACCEPTED` mean report acceptance only, and is `STOP_AND_RETAIN` retained? | lifecycle semantics require explicit governance |
| OD-09 | Is Program G / Phase B the preferred Lab-report and source-freeze exemplar? | adoption scope must not be inferred |
| OD-10 | Should Field Notes be visible as upstream observations but remain outside Research? | preserves the promotion boundary |
| OD-11 | Which current questions are admitted first-class rather than merely historical? | this changes maintained research state |
| OD-12 | Should the central transition-geometry narrative remain the primary Research entry? | only the owner can set research emphasis |

## Decisions that may remain deferred

- whether every historical experiment receives an ID;
- whether literature citations receive a shared bibliography;
- whether machine-readable records are ever warranted;
- whether application programs use the common Lab Report template;
- whether archived Labs receive successor links;
- whether question revision requires immutable versions.

## Recommended smallest owner review

Review only these propositions:

1. the institute already exists in distributed form;
2. the missing layer is question-to-Lab-to-report navigation;
3. no new repository, operator registry or artifact migration is required;
4. a three-Lab manual pilot is sufficient to test the proposal.

If accepted, the next permitted action is a documentation-only pilot design.
It is not index creation, catalog population, migration or research execution.

## Final state

```text
AUDIT_COMPLETED: YES
ARCHITECTURE_CREATED: NO
LAB_CREATED: NO
QUESTION_PROMOTED: NO
REPOSITORY_MODIFIED: NO
CANONICAL_NEXAH_MODIFIED: NO
CONTROL_DESK_MODIFIED: NO
SCIENTIFIC_EXECUTION: NONE
OPERATIONAL_EFFECT: NONE
NEXT_PERMITTED_ACTION: OWNER REVIEW
```
