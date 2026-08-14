# A2 Required Self-Audit

## Scope

Only contract metadata, prose, exact rational arithmetic, and static mutation fixtures were exercised. No scientific pipeline module was imported.

## Results

| Required case | Result |
|---|---|
| exact mathematical 0.50 | PASS via exact `2D3=G` |
| next binary64 above boundary | FAIL_DOMINATED as required |
| G=0 / G<0 | FAIL_AGGREGATE_NONPOSITIVE |
| signed negative contributions | retained |
| fewer than three seeds | INVALID_EXPERIMENT |
| NaN/Inf | INVALID_EXPERIMENT |
| N1 null support changes | original population fixed; incomplete score invalidates |
| N1 carrier action/outcome | null action selects existing all-action outcome; no simulation |
| N2–N4 carrier action/outcome | observed action/outcome fixed |
| fixed versus recomputed population | all families use original P_train/P_test; intersections prohibited |
| undefined null replicate | invalid experiment; no retry |
| N1/N2/N3/N4 semantics | all family arrows present |
| N5 prose/machine fields | tiers/count/parameters/support/transform/population/failure encoded |
| prose/YAML canonical validation | PASS |
| five required mutated contracts | all rejected |

## Automated evidence

- static validator: PASS;
- contract tests: 16/16 PASS;
- machine artifact: parses as JSON and therefore YAML 1.2;
- validator imports: Python standard library only;
- registered-data capability: none.

## Late ambiguity search

The audit checked support membership, row populations, carrier actions, outcome availability, baseline/augmented refits, donor failures, N4 carrier indexing/merging, numerical equality, nonfinite values, and failure mapping. No remaining implementer choice was identified inside R-01–R-07.

This self-audit is not independent acceptance. A2 remains review-ready only.
