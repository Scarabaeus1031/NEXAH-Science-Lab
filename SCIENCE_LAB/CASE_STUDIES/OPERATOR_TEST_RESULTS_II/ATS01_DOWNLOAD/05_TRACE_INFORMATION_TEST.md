# 05 — Trace Information Test

For the primary run:

```text
tau_full = (97,98,99,100,101)
tau_reduced = (97,101)
```

The full trace directly records start, end, transition count and all three
intermediate states. It also records their order.

The reduced trace directly records only the endpoints. Two interpretations
must be separated:

1. **Reconstruction with frozen model metadata:** because `T(n)=n+1` is known,
   deterministic and required to be applied without skips, `(97,101)` uniquely
   reconstructs `(97,98,99,100,101)` and four transitions.
2. **Trace as an empirical provenance record:** endpoints alone no longer
   demonstrate that the intermediate states were actually visited in that order
   or that the declared operator was followed. It loses path-attestation data.

Thus the reduced trace loses explicit provenance, not reconstructability inside
the already assumed deterministic model.

```text
TRACE_START_RECOVERABLE = YES
TRACE_END_RECOVERABLE = YES
TRACE_TRANSITION_COUNT_RECOVERABLE = YES_FROM_FULL_TRACE
TRACE_INTERMEDIATE_STATES_RECOVERABLE = YES_FROM_FULL_TRACE
REDUCED_TRACE_MODEL_RECONSTRUCTION = UNIQUE_GIVEN_FROZEN_T_AND_NO_SKIP_RULE
REDUCED_TRACE_INFORMATION_LOSS = EXPLICIT_VISITATION_AND_PATH_ATTESTATION
```
