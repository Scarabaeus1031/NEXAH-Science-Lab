# Minimum Test Specification — Draft for Review

Status: `NOT_AUTHORIZED_FOR_EXECUTION`

## Method class

`TYPE_D_DESIGN_FEASIBILITY`

## Primary question

> Does an explicit `n+1` relation stack improve detection and localization of
> declared representation defects over a single-master-frame baseline when
> both systems receive the same source information?

## Minimum object

One synthetic source object with stable feature IDs is rendered into three
local records `A`, `B` and `C`. Each record has its own frame. Relations
`R_AB`, `R_BC`, `R_CA` and one direct comparison path are declared before the
defect is injected.

## Required conditions

1. identity/no-defect control;
2. reversible rigid transform;
3. lossy projection or cut;
4. introduced feature not present in the source;
5. ambiguous correspondence;
6. one corrupted relation record;
7. one missing relation record.

## Systems compared

### Baseline

One master coordinate frame with conventional transforms and final rendered
outputs. It receives the same source and defect conditions.

### Candidate

Three bounded local records plus one Binder containing typed mappings,
correspondence IDs, provenance, tolerances, I-L-A-U and cycle/direct-path
comparisons.

The first experiment must not add a CRT channel unless a separate ablation
compares the same architecture with and without that layer.

## Primary outcomes

- defect detection rate;
- correct edge/cut localization rate;
- false-positive rate under identity and reversible controls;
- correspondence retention and loss counts;
- introduced-feature identification;
- unresolved-ambiguity reporting;
- cycle/direct-path residual under a frozen metric;
- provenance completeness;
- exact serialization round trip.

## Human outcome candidate

If tested, human inspectability must use a separate blinded task:

> Can a reviewer identify which transition lost or introduced information from
> the Candidate record more accurately or quickly than from the Baseline?

No human-benefit claim may be inferred from visual appeal or developer
inspection.

## Scaling stages

| Stage | Purpose | Promotion condition |
|---|---|---|
| `3+1` | establish one nontrivial relation cycle | all controls and defect semantics pass |
| `4+1` | test whether extra paths improve localization | improvement over matched 3+1 baseline |
| `6+1` | evaluate sparse versus dense stacks and optional residue channels | preregistered ablation; complexity and benefit both reported |

No numerical privilege is assigned to `4`, `5` or `6` without an independent
task requirement.

## Candidate success

The Builder candidate succeeds at minimum if it:

1. serializes three bounded records and their relations without hidden master
   authority;
2. distinguishes reversible change, loss, introduction and unresolved
   ambiguity;
3. reproduces its outputs exactly from the same fixture;
4. detects injected inconsistencies without failing identity controls.

The scientific utility candidate requires a preregistered, matched comparison
showing incremental detection, localization or human-inspection value beyond
the baseline.

## Failure and elimination outcomes

Valid outcomes include:

- no improvement over a conventional transform/provenance graph;
- Binder duplicates established tooling without incremental value;
- cycle residual detects inconsistency but cannot localize it;
- I-L-A-U labels depend on evaluator access to hidden ground truth;
- added frames increase complexity without measurable benefit;
- residue layer is mathematically correct but irrelevant to the representation
  task;
- human interface increases confidence without increasing correctness.

These outcomes must be retained and may eliminate or narrow the candidate.

## Dependencies before execution

- freeze the exact record and relation schema;
- choose one baseline implementation;
- define information-loss ground truth;
- preregister metrics, tolerances and defect population;
- decide whether the Builder implementation uses glTF `extras`, a custom glTF
  extension, USD relations or a format-neutral JSON sidecar;
- perform targeted prior-art review against the frozen mechanism;
- obtain Human Owner authorization to leave Structure Freeze for this cycle.

## STOP

No implementation, benchmark, schema standardization, patent filing or public
scientific claim is authorized by this draft.
