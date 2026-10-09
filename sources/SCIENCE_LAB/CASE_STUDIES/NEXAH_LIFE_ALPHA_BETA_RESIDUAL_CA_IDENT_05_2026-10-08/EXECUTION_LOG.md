# CA-IDENT-05 execution log

Preregistration lock:
`f7520b7bcfa18792cf73af61850ed38bf9a65069c834c5ea5bdf7ea2508d1ede`.

The lock was verified before executing against fresh seeds `R25-R124`.

## Registered result

- holdout rows: `2,000`
- preregistered coverage gate: `PASS`
- `fourier_A`: `0.5307` macro-F1
- `P_63_1`: `0.5277` macro-F1
- `P_equal`: `0.5853` macro-F1
- `P_1_63_reverse_control`: `0.6084` macro-F1
- primary gate: `FAIL`
- specificity gate: `FAIL`
- verdict: `ALPHA_BETA_NO_GAIN`

The proposed assignment `A = 63/64 Fourier`, `B = 1/64 Memory` changes
macro-F1 by `-0.0031` versus Fourier alone. The reversed control is strongest.
The arithmetic mixture is well-defined; the registered predictive orientation
is not supported.

## New gap exposed

All six behavior classes present in training have at least ten holdout rows, so
the registered coverage gate passes. However, `constant-count motion` appears
19 times in holdout and zero times in training. Every registered classifier has
zero recall for it. The preregistration protected minimum support but did not
require closed-set class coverage. That missing condition is the next audit.
