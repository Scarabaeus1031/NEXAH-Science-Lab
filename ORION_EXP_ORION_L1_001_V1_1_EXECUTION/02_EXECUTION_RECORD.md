# EXP-ORION-L1-001 v1.1 — Execution Record

Lock timestamp: 2026-08-10T16:57:44Z  
Execution completed: 2026-08-10T17:01:39Z  
Locked preregistration SHA-256 reverified before primary execution and after replay: `b8477914987bdc7a8f870aeaf7ca4e366396e1e645c7c5eda5b006f5980d15bc`

## Information boundary

- `generate.py` accepts only the experiment configuration and a new output path; it has no expected-class argument.
- `observe.py` accepts only the experiment configuration and generated records; it has no expected-class argument.
- `observe.py` seals the complete blind observation before comparison.
- `compare.py` verifies that seal and only then reads `expected_classes.json`.
- The R4 claimant is the isolated function `x_only_claim(single_x)` and receives exactly one scalar value.

## Primary execution

Output directory: `primary/`

1. Generator independently integrated the source, R1, R2, and damped control and wrote all registered raw records.
2. Blind observer assigned categories and sealed `observed_classifications.json`.
3. Comparator verified the seal and produced `classification_results.json`.
4. All generated, observed, control, comparison, and environment outputs were retained.

## Independent replay

Output directory: `replay/`

The replay generator was invoked on a new, previously nonexistent directory. Its only inputs were the locked configuration and source code. No path under `primary/` was passed to generator, observer, or comparator. Every trajectory and representation record was regenerated before blind observation and comparison.

## Deterministic comparison

```text
PRIMARY HASH: 53ce0a2e0a1901abaa05462e4e7558e4b96113ab5645c81f1e0e3f740c98b84e
REPLAY HASH:  53ce0a2e0a1901abaa05462e4e7558e4b96113ab5645c81f1e0e3f740c98b84e
BYTE COMPARISON: IDENTICAL
```

