# POLAR-LOD-BL-01 qualification result

Date: 2026-10-01
Decision: `BASELINE_READY / NO_PROSPECTIVE_RESULT`

## Gate result

| Gate | Result |
|---|---|
| official `RG_ZONT2` MJD 54465 reference case | PASS; `DLOD` absolute error `1.42e-19 s` |
| source continuity and required lags | PASS |
| same-day target mutation exclusion | PASS |
| B1 strength versus persistence and historical L5 | PASS |
| B2 execution and pooled improvement over B1 | PASS |
| hashes and deterministic outputs recorded | PASS |

## Historical development, 2018–2024

Pooled annual RMSE:

| Comparator | RMSE (ms) |
|---|---:|
| persistence B0 | 0.147798 |
| historical five-lag architecture L5 | 0.048107 |
| selected `B1-AR17` | 0.035114 |
| `B2-IERS-ZONT2` | 0.026276 |

`L17` was selected from the four declared lag banks using 2018–2024 only.
The geophysical baseline reduced pooled RMSE by about 25.17% relative to B1.
These are development metrics, not confirmatory evidence.

## Forensic reconstruction of the already-known 2025 holdout

After the architecture was selected without 2025, the frozen comparison was
applied to the historical Test-08 holdout:

| Model | RMSE (ms) | MAE (ms) |
|---|---:|---:|
| `B1-AR17` | 0.036292 | 0.028264 |
| `M2-AR17+six-period` | 0.034107 | 0.026465 |
| `B2-IERS-ZONT2` | 0.027584 | 0.021469 |

M2 improves on the stronger statistical baseline by about 6.02% RMSE, but is
about 23.65% worse than the established geophysical comparator. Thus the old
signal remains interesting as a representation of known long-period structure
but does not clear the comparator now required for a NEXAH application claim.

This is a retrospective forensic observation. It is not a new Research Result,
not a failed prospective test, and not grounds to tune M2.

## Consequence for `POLAR-LOD-01`

Readiness gate R4 can close. R3 remains open until at least 180 genuinely new
daily targets and six complete synodic cycles are available after the future
source/model freeze. R1 custody, independent review and R6 Human Owner release
also remain required.

The future primary comparison requires M2 to beat both B1 and B2 on the same
frozen evaluation window.
