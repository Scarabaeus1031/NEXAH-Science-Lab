# A3 Prose / Machine Equivalence Audit

## Bidirectional result

**PROSE ↔ MACHINE ISOMORPHISM: PASS (self-audit; independent review required).**

| Rule group | Prose | Machine |
|---|---|---|
| V1/A1/A2 authority and unchanged accepted rules | amendment/boundary documents | `authority`, `preserved_contract` |
| N3 geometry, clockwise search, exact phase bins | N3 contract | `binning.phase`, `N3.clockwise_merge` |
| quantile production/assignment/duplicates | N3 contract | `binning.quantiles` |
| canonical object ordering | RNG contract | `ordering` |
| serialization/hash/PCG64/draw calls | RNG contract | `rng` and each null `draw` |
| N1 forward permutation and outcome semantics | N1 contract | `N1` |
| N2/N3/N4 stream/population rules | RNG/N3 contracts plus accepted A2 | `N2`,`N3`,`N4`,`preserved_contract` |
| complete N5 transforms/tiers/refits/aggregation | N5 contract | `N5` |
| sorted nulls/nearest rank/Monte Carlo authority | reporting contract | `null_reporting` |
| failure/nonexecution boundaries | all contracts | `failure_rules`,`nonexecution` |

Every machine enum/formula has a prose counterpart. Every A3 operative prose rule has an exact field. The validator additionally compares the canonicalized complete machine object against its sealed contract digest, so unreviewed machine defaults cannot pass unnoticed.
