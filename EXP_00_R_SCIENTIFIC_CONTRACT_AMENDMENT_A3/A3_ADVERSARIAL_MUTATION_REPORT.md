# A3 Adversarial Mutation Report

## Result

**ADVERSARIAL MUTATION VALIDATION: PASS.**

The standard-library-only validator passed the canonical A3 package. The mutation suite altered in-memory contract objects only and rejected all 32/32 registered material mutations:

- all 17 minimum mutations required by the A3 mandate;
- every earlier material mutation from the A2 independent review;
- additional A3 checks for strict/float dominance references, null-specific support/population, N3 seed restriction, N4 merge/minimum/carrier mapping, retry, Monte Carlo boundary, N5 count/stage, P2 diagnostic status, and canonical exact-distance neighbor ties.

## Deterministic boundaries

Nine independent contract-logic tests passed:

1. `+PI/-PI` normalization;
2. every internal phase edge and immediately-below neighbor;
3. right insertion with duplicate quantile cutpoints;
4. clockwise wraparound and successive empties;
5. non-self-inverse N1 forward mapping;
6. exact SHA-256 payload/digest/64-bit big-endian seed fixture;
7. explicit N5 list equals the first twelve lexicographic determinant-`+1` transforms;
8. nearest-rank and Monte Carlo `k=4/5` boundaries.
9. exact-distance nearest-neighbor ties broken by canonical training row key.

## Capability boundary

The validator imports only Python standard-library modules, reads only A3 contract text, and has no scientific-pipeline import, registered-seed API, plant, integrator, estimator, outcome, null-execution, bootstrap, or classification capability.
