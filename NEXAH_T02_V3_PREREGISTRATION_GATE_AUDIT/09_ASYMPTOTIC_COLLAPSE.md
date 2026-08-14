# Asymptotic Collapse

## Expected limit

Under equal observations, a fixed externally defined loss, sufficient model
capacity, correct regularity/identifiability assumptions and unbounded information,
consistent methods should satisfy:

```text
R_N(n,b_n)  -> R*
R_B8(n,b_n) -> R*
Delta(n,b_n) -> 0
```

where the resource sequence `b_n` is large enough for both algorithms to realize
their consistent limits. This is the required sanity check, not a weakness.

If a fixed compute cap remains as `n -> infinity`, approximation/optimization
error may persist. That would be a resource-allocation result, not an information
advantage, and must be stated separately. If NEXAH uses a misspecified fixed
certificate family, it may instead retain asymptotic excess risk.

## Hidden-asymmetry triggers

An unexplained persistent NEXAH advantage requires an audit for:

- privileged correspondence, features, labels or preprocessing;
- a more expressive model or larger tuning/compute budget;
- method-specific abstention or remeasurement costs;
- scorer truth encoded in certificate thresholds;
- a B8 family artificially forbidden from visible structure;
- test-informed generator or hyperparameter selection.

## Permitted claim

Any future positive result is limited to the frozen finite `(n,b)`, task contract,
process population and implementation class. It cannot establish new information,
asymptotic dominance or a universal representation principle.

`ASYMPTOTIC_COLLAPSE_EXPECTED = YES`.

