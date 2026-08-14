# A3 Independent Adversarial Mutation Report

## Supplied validation

- canonical static validation: PASS;
- supplied tests: 11/11 PASS;
- supplied in-memory mutation registry: 32/32 rejected.

The supplied validator rejects every mutation to its canonical machine object because it seals the full canonical JSON digest. It similarly seals the 13-file prose composite in package mode.

## Independent mutations

The review independently exercised clockwise/wrap, same-seed donor, serialization, byte order, hash, generator, replicate count/index, row/donor/action order, N1 inverse map, boundary side, π normalization, duplicate cutpoints, N4 merge priority, support/population/outcome, retry, `199/201`, `k=5`, N5 count/order/support/minimum/stage/failure, exact-versus-float dominance, signed/clipped and row/equal weighting, P2 gating, and Lorenz-ceiling removal.

Every mutation of a represented machine field was rejected by the canonical digest or an independent deterministic semantic check. Exact external A2 dominance mutations were detected independently by mismatch with A3's stored A2 SHA-256.

## Material holes

Two semantic mutations cannot be rejected because no authoritative A3 field exists:

1. N4 support cutpoints from self-inclusive zero distances versus leave-one-out/OOF distances;
2. classification priority `PARTIAL` versus `NOT REPLICATED` for a positive-direction but null-comparison-failing result.

The validator also has no exact P4/P5/classification graph to mutate. Therefore **ADVERSARIAL MUTATION VALIDATION: FAIL** under the scientific completeness standard, despite perfect literal mutation detection on represented fields.
