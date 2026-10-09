# ACR_PREDICTION_GATE_04 — Execution Report

Date: `2026-09-16`

Final decision: `FAIL_PREDICTION_GATE`

Control decision: `PASS_ALL_EXECUTED_CONTROLS`

## What was tested

The frozen target was the 60-minute future change in living-room temperature:

```text
T2(t+6) - T2(t)
```

The cross-cut model `P2` used the same two T2-history features as baseline `P1`
and added the current T1–T2 gap plus short and 60-minute T1 changes. Training
used feature rows `4096..8185`; the single chronological test used
`8192..12281`. Training targets ended before the first test feature row.

## Results

| Model / criterion | Result |
|---|---:|
| P0 zero-change MAE | `0.2922261614 C` |
| P1 T2-history MAE | `0.1939014265 C` |
| P2 cross-cut MAE | `0.1964824456 C` |
| P2 relative improvement vs. P1 | `-1.3311%` |
| Mean paired absolute-error improvement | `-0.0025810191 C` |
| Moving-block 95% interval | `[-0.0056954905, 0.0007155024] C` |

`P2` beat zero-change persistence, but it was 1.33% worse than the frozen
T2-only model. It therefore missed the preregistered 2% improvement threshold.
The bootstrap interval crossed zero and its lower bound was negative.

## Gate criteria

| Criterion | Result |
|---|---:|
| P2 beats P0 | PASS |
| P2 improves P1 by at least 2% | FAIL |
| 95% bootstrap lower bound is positive | FAIL |

All metadata, cadence, alignment, split and leakage preflight checks passed.
All six constructed negative controls were rejected: shifted Cut A, unit
mismatch, overlapping train/test target boundary, future-target feature,
altered source hash and permuted event order.

## Reproducibility

- result SHA-256:
  `c7183944a5d5fbeb25994bc6c4847537c9119e7c2346524637d7d88ce51ab53e`
- controls SHA-256:
  `76cc7ae82bd0173fc93dc4fe2972f4d48dd02b232709ce8f0646e824285868bd`
- internal result receipt:
  `bc439f68d825fa04ebb00c075f47570733f44146d39ab761c473116992b800d7`
- internal controls receipt:
  `8af669a848d2f0bdcc6e272e2b7bff309739e68c647ba6c3a8bfdff22cc7e906`

The immediate rerun produced byte-identical result and control files.

## Interpretation

The earlier cross-dataset adapter pass remains valid: metadata, alignment,
coordinate transforms, controls and receipts transported correctly. This new
test asked a different question and returned a negative answer. In this frozen
holdout, adding T1 did not improve 60-minute T2-change prediction beyond T2's
own recent history.

The high contemporaneous T1/T2 correlation observed earlier therefore must not
be promoted to incremental predictive coupling. Correlation, reversible
coordinate identity and predictive utility are distinct claims.

Theory/physics claims remain unchanged. No profile is activated.

## Next step

Do not tune this failed specification on the test interval. Any follow-up must
state a materially new hypothesis, use a fresh untouched holdout or new dataset,
and be preregistered before outcome access.
