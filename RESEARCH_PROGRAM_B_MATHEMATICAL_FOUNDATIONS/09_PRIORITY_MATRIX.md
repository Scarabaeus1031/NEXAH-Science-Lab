# Priority Matrix

Scores use `0–5`. Higher evidence and tractability are favorable. Higher dependency burden and scope risk are unfavorable.

| ID | Existing evidence | Definition readiness | Tractability | Dependency burden | Scope risk | Priority |
|---|---:|---:|---:|---:|---:|---|
| FQ-01 | 5 | 4 | 5 | 1 | 2 | 1 |
| FQ-03 | 5 | 4 | 5 | 1 | 2 | 1 |
| RQ-01 | 5 | 4 | 4 | 2 | 2 | 1 |
| RQ-02 | 4 | 3 | 4 | 3 | 3 | 2 |
| FQ-02 | 3 | 3 | 3 | 3 | 3 | 2 |
| RQ-03 | 3 | 3 | 4 | 2 | 3 | 2 |
| RQ-05 | 4 | 2 | 3 | 3 | 4 | 3 |
| RQ-06 | 4 | 2 | 3 | 3 | 4 | 3 |
| FQ-04 | 3 | 2 | 3 | 3 | 4 | 4 |
| RQ-04 | 2 | 1 | 2 | 4 | 5 | 4 |

## Priority question

`FQ-01 — Representation maps and information loss`

It is upstream of reconstruction, moving masks, round-trip diagnostics, encoding invariance, and cross-method alignment. It also has two existing deterministic counterexamples and requires no new operator.

## Recommended starting point

Formal review of the existing Rödelheim Lab 0.4 projection map:

- state the source and target sets;
- state each projection domain;
- identify preserved source identity;
- characterize the A/B indistinguishability classes at the four declared views;
- state what additional view information separates them;
- retain the mask as a separate post-projection operation.

This is an analysis target already present in the repository, not a new experiment or proof claim.
