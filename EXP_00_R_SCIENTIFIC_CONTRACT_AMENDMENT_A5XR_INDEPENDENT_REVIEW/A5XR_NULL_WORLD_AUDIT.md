# A5XR Null-World Audit

## What A5XR verifies

A5XR checks five names, a metadata dictionary, count `200`, four statistic names, finite constant values and a synthetic provenance tuple. It then expands each constant to 200 identical numbers.

## What it does not reconstruct

- canonical namespace payload, hash, seed and PCG64 draw for each random object;
- N1 forward label maps, relabeled records, OOF/full refits, physical outcome lookup and null carrier outcomes;
- N2 within-split/seed donor assignments;
- N3 clockwise bins, donor constraints and recipient bindings;
- N4 LOO cutpoints, carrier strata, merge labels and permutations;
- fixed row membership and outcome-row identity at record level;
- invalid-replicate behavior from actual missing donor/refit/model states;
- per-carrier coefficient distributions, which are mandatory diagnostics;
- per-replicate statistic provenance.

The metadata strings correctly name many accepted rules, but a producer can supply any 200 finite values after performing no null transformation. Exact counts and labels are not a reconstruction of a null world.

The Monte Carlo boundary is correctly coded (`k<=4`), but its inputs are unaudited. **N1–N4 raw derivation: FAIL.**
