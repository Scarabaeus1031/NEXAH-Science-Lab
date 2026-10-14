# Check 72 — Euler / Tessarec Residual and Fold Audit Protocol

Date: `2026-10-13`  
Status: `EXECUTED ONCE / STOP REACHED / RESULT IN CHECK 73`  
Parent result: `NO_EULER_SPECIFIC_SPECTRAL_SUPPORT` · Check 71  
Identity effect: `REUSES EXISTING IDENTITIES / NO NEW NAVIGATOR FAMILY OR RELATION`

## Question

Where does the registered Euler shape fail on the 48 descending Tessarec
eigenvalues, and which bounded feature explains why its relative disadvantage
is nevertheless smaller than in the matched cubic-null population?

This audit cannot alter or rescue the Check 71 primary disposition.

## Frozen diagnostics

1. Recompute the same eight contiguous six-rank held-out folds for `M0`, `M1`,
   `ME` and `M2`.
2. For every model and fold, report RMSE divided by the unchanged 48-value
   population standard deviation.
3. For each fold, report the Euler excess SSE `SSE_ME-SSE_M1` and its positive
   contribution share.
4. Define extremes as folds `F1` and `F8`; define the middle as `F2..F7`.
   `EXTREME_CONCENTRATED` requires at least 60% of positive Euler excess SSE
   in `F1+F8`; otherwise the label is `DISTRIBUTED_OR_MIDDLE_CONCENTRATED`.
5. Group eigenvalues with absolute difference at most `1e-10`. Compare mean
   absolute out-of-fold residuals at repeated versus singleton values.
6. Record observed second differences, their sign changes and the five largest
   absolute values. These are descriptive curvature diagnostics.
7. Run the already declared nontrivial-only 47-value track with deterministic
   balanced contiguous folds of sizes `6,6,6,6,6,6,6,5`. Report `A_E` and
   `G_Q` as secondary diagnostics only.

No new null ensemble, parameter search, rank reversal, smoothing, spline,
breakpoint selection or threshold optimization is permitted.

## Outputs and STOP

Emit one immutable JSON ledger and one immutable SVG with the 48 observed
values, out-of-fold curves and residuals. STOP after integrity validation and
return the localization result for Owner disposition.

```text
PARENT_NEGATIVE_RESULT_CAN_CHANGE   NO
BEST_C_SEARCH                       PROHIBITED
NEW_PRIMARY_TEST                    NO
GRAPH_NATIVE_SUCCESSOR_TEST         NOT_EXECUTED
PUBLICATION                         NO
```
