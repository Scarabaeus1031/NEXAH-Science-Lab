# SCN / NCS / 404 gate bridge — preregistration shell

Date: `2026-09-29`

Status: `BLOCKED PENDING INDEPENDENT SOURCE-BOUND H / DO NOT FIT TO TARGETS`

## Target question

Does a predeclared interface

```text
H(n_k, measurement_state) -> (a, b, x(t))
```

carry an SCN track, an NCS292 state or a dyadic carrier into either the
Knickfield `gate404(a,b)` predicate or the JANUS Lorenz lobe-switch detector?

## Required fields before execution

The Human Owner or an independently dated source must supply all of:

1. input track and domain (`7801+8k`, `101*2^k`, measured samples, or another
   explicitly identified series);
2. units and sampling/step convention;
3. formulas producing `a`, `b` and, if used, `x(t)`;
4. the exact role of `292` (value, threshold, state, index or label);
5. predicted gate outcomes before inspecting results;
6. at least one same-residue/different-integer control;
7. at least one shuffled-phase or permuted-order control;
8. missing-data and out-of-range handling;
9. pass/fail criterion and multiplicity correction if parameters are scanned;
10. source identifier and SHA-256 for the frozen mapping.

## Prohibited completion methods

- choosing `(a,b)` separately for each desired integer outcome;
- tuning thresholds after seeing `404`, `808`, `1212`, `1616` or `292`;
- treating a shared modulo-11 residue as a full state identity;
- treating `A404`, dyadic lift, decimal reversal and `gate404` as synonyms;
- interpreting `NOT_EVALUABLE` as a failed gate observation.

## Current readiness decision

The bound sources provide an executable Knickfield gate and an executable
Lorenz switch detector, but no independent `H`. Therefore this experiment is
scientifically specified but not executable. Its current result is
`NOT_EVALUABLE`, not `PASS` or `FAIL`.
