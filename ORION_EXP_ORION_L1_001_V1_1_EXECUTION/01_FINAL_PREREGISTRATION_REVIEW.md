# EXP-ORION-L1-001 v1.1 — Final Preregistration Review

Review completed: 2026-08-10T16:57:44Z  
Review scope: corrected preregistration v1.1 only; no redesign  
Reviewed artifact: `../ORION_EXP_ORION_L1_001_INDEPENDENT_PREREGISTRATION_REVIEW/02_ORION_L1_PREREGISTRATION_V1_1.md`  
Verified SHA-256: `b8477914987bdc7a8f870aeaf7ca4e366396e1e645c7c5eda5b006f5980d15bc`

## Gate findings

| # | Required check | Finding | Determination |
|---:|---|---|---|
| 1 | Generator / observer-classifier / comparator separation | Three ordered stages and their information boundaries are explicitly required. | NONE |
| 2 | No expected-class leakage into observed classification | Generator cannot read expected classes; observer receives thresholds but not expected classes; comparison occurs only after the observations are sealed. | NONE |
| 3 | Independent R1/R2 transformed integrations | Both transformed systems have separately specified induced matrices, initial conditions, and RK4 integrations, distinct from mapped-source paths. | NONE |
| 4 | Algebraic versus trajectory tolerances | Trajectory defects use `1e-9`; pointwise algebraic field defects use `1e-12`. | NONE |
| 5 | Signed phase and unwrap | `theta_forward(t)=-t` is explicit; the nearest-branch recursion and its uniqueness condition are stated. | NONE |
| 6 | D2 time reversal | `s_rev[i]=s[N-i]` on the original increasing grid is operationally unique; reversed phase must be recomputed. | NONE |
| 7 | R4 x-only boundary | The claimant receives one scalar `x`; time, step, history, neighbors, source ID, equations, derivatives, and phase are expressly withheld. | NONE |
| 8 | D4 pair construction | The fixed set `(i,4096-i)`, `i=1,...,2047`, counts each pair once and has an analytic separation justification. | NONE |
| 9 | Numerical radius class | Numerical polar radius is correctly registered as `ROBUST`, not exact invariant. | NONE |
| 10 | Transported energy versus wrong metric | `E2` and raw scaled-space Euclidean energy are separately defined and tested. | NONE |
| 11 | Deterministic perturbation bound | The perturbation is deterministic and the norm bound is stated before execution, yielding `<2e-6`. | NONE |
| 12 | No result-dependent choices | Thresholds, classes, representations, pair set, controls, integration grid, and palette relation are frozen before execution. | NONE |
| 13 | Independent replay | Reuse of primary generated outputs is an explicit invalid condition; a clean replay and identical deterministic result hash are required. | NONE |

## Decision

No CRITICAL or MAJOR defect remains that could invalidate the experiment or let it pass for the wrong reason.

```text
REVIEW: PASS
HIGHEST FINDING: NONE
LOCK AUTHORIZED: YES
EXECUTION AUTHORIZED AFTER LOCK: YES
```

