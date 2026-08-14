# A5XR Raw P1–P5 Derivation Audit

## Findings by proposition

| Proposition | Correct encoded part | Blocking raw-derivation defect | Verdict |
|---|---|---|---|
| P1 | `k=count(null>=observed)`, adverse ties, `k<=4`, all five family/subworld comparisons | Null values are supplied constant columns, not statistics reconstructed from 200 randomized worlds. | FAIL |
| P2 | coefficient `>0`; linear `.025` quantile of 500 supplied values; both carriers | No bootstrap replicate IDs, TEST-seed draws, seed-cluster proof, seed `20260808`, no-redraw record or coefficient-null diagnostics. | FAIL |
| P3 | gain `>0`, Brier nonworse, correct N4 carrier map | Gains are supplied; null predictive worlds are not rebuilt; coefficient-null mandatory diagnostics are absent. | FAIL |
| P4 | critical T/F carrier conjunction, 21/30 boundary, exact dominance formula, report-only registry names | Directions are supplied constants rather than correlations from per-seed rows; report-only diagnostic values/provenance are absent; dominance failure aborts instead of returning false. | FAIL |
| P5 | exact amplitude IDs, both carriers, strict coefficient/gain sign, no extra interval gate | Sensitivity result provenance/support is internally underconstrained. | FAIL as end-to-end derivation |

Review-owned mutations flip each proposition separately while other summary fields remain fixed. That proves the Boolean formulas are reachable, not that the scientific inputs are raw-derived.

## Boundary checks

- Monte Carlo: `k=4` passes; `k=5` fails.
- P2 lower endpoint exactly zero fails.
- P3 Brier equality passes.
- P4 21/30 equality passes.
- P5 zero coefficient/gain fails.
- Coefficient-null distributions remain diagnostic only; A5XR omits them entirely rather than keeping them diagnostic.

Producer P1–P5 Booleans have zero authority. Producer-supplied summary statistics still have excessive authority because their generating records are absent.
