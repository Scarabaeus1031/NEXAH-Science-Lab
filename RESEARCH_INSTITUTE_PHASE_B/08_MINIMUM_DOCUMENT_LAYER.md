# Minimum Document Layer

## Falsification test

The Phase A proposal was:

```text
QUESTIONS.md
LABS.md
LAB_REPORT_TEMPLATE.md
```

Each element was tested against existing sources.

## Can zero documents solve the gap?

`NO`

- `RESEARCH_INDEX.md` navigates the transition-geometry lineage, not the whole
  distributed institute.
- the adopted Research Architecture maps responsibilities and umbrella
  questions, not Lab/report identity;
- the Evidence Atlas maps selected claims to evidence, not questions to Labs;
- Control Desk maps missions and decisions, not scientific objects;
- Library maps Works and publication identity.

No current document joins these pointers without a reader reconstructing them.

## Are three documents necessary?

`NO FOR THE FIRST MANUAL LAYER`

### Separate `QUESTIONS.md`

Useful eventually, but not required if each navigation row begins with one
bounded question and stable identity.

### Separate `LABS.md`

Useful eventually, but the same row can point to Lab, result and report without
duplicating question state.

### Central `LAB_REPORT_TEMPLATE.md`

Not yet justified. Existing strong forms differ:

- Rödelheim Lab report;
- frozen `SPEC.md` + `RESULTS.md` validation package;
- IEEE manifest and multi-report package;
- Orientation Translation Pilot/Study Report;
- theorem/protocol design package.

A central template could flatten meaningful method differences. The minimum
common fields can be recorded in navigation without requiring report rewrites.

## Smallest sufficient layer

One future pointer-only document, after owner approval:

```text
RESEARCH/RESEARCH_NAVIGATION.md
```

Minimum row:

```text
question_id
bounded_question
owner
research_program_or_unassigned
research_area_or_unassigned
lab_or_study
scientific_object
experiment_or_method
result
report
evidence_disposition
current_state
missing_step
canonical_home
last_verified
```

`unassigned` must be allowed. The document observes existing identities; it
does not create Programs or Areas.

## Why not modify `RESEARCH_INDEX.md`?

That index explicitly scopes itself to one transition-geometry research
program. Expanding it silently would alter its identity. A separate bounded
navigator is cleaner unless the Research owner explicitly chooses to revise
the existing index.

## Conditions for later separation

Split into Question and Lab registries only if one manual navigator becomes
unmaintainable or if stable many-to-many relations appear. Adopt a report
template only after at least three method classes are compared and the shared
fields are shown not to erase local requirements.

## Non-requirements

- no new repository;
- no Lab folders by default;
- no Research Area documents;
- no central literature store;
- no new operator registry;
- no machine-readable catalog;
- no automatic extraction or promotion.

## Decision

The Phase A three-document proposal is reduced to one potential manual
navigator. This is a recommendation only. No navigator was created.

