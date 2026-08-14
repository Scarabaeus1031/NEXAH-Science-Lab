# A3 Audit of A2-R08 Through A2-R15

| Defect | Original problem | A3 repair and locations | Fixture/evidence | Equivalence | Verdict |
|---|---|---|---|---|---|
| R08 | A2 reversed frozen clockwise N3 merge | decreasing index modulo 8 in `A3_N3_CLOCKWISE_AND_BIN_CONTRACT.md`; `N3.clockwise_merge` | interior, successive-empty, and wrap fixtures | restores geometric clockwise direction | PASS |
| R09 | namespaces did not determine identical draws | V1-prefix serialization, typed suffixes, SHA-256 first eight bytes big-endian, PCG64/NumPy 2.3.5, fresh object streams in RNG contract / `rng` | fixed payload digest/seed; mutation checks | deterministic extension of V1 mechanism | PASS |
| R10 | cutpoint equality, π, duplicates, and bin closure open | explicit binary64 phase edges, π normalization, right insertion, duplicate rules in N3 contract / `binning` | phase/quantile boundary fixtures | phase/assignment repair is sound; N4 source metric remains undefined | **FAIL** |
| R11 | `pi` versus `pi^-1` open | forward `a→pi(a)` and direct physical outcome lookup in N1 contract / `N1` | non-self-inverse 3-cycle fixture | prospective ambiguity completion | PASS |
| R12 | draw-to-object ordering open | canonical row/action/donor/stratum/neighbor orders in RNG contract / `ordering` | row/donor/neighbor mutations | randomization order fixed; sensitivity and universal analysis-row ordering absent | **FAIL** |
| R13 | N5 machine omitted accepted rules | explicit first-twelve matrices, tiers, paths, transforms, refits, support, inverse registration, min tau in N5 contract / `N5` | exact transform registry and mutations | accepted N5 preserved | PASS |
| R14 | accepted nearest-rank report missing | sorted values and rank 195 descriptive output in null reporting / `null_reporting` | `k=4/5`, rank-195 fixture | accepted reporting restored without inferential change | PASS |
| R15 | weak validator missed material mutations | canonical machine/prose digests plus 32 mutation cases | supplied suite passes | represented-field mutation coverage improved, but omitted semantics/external refs remain invisible | **FAIL** |

## Clockwise proof

Phase bins increase counterclockwise. For bin `b`, A3 searches `(b-d) mod 8`, `d=1..7`; angle therefore decreases. Empty 0 with occupied 7/2 maps to 7, empty 1 with only 5 occupied maps through 0/7/6 to 5, and empty 7 with occupied 6/0 maps to 6. These donor pools match the frozen clockwise semantic rule.

## R10 blocker in detail

`support.distance(training_row)` under the full support model includes the identical training row and is zero. The support-threshold construction instead uses leave-one-out nearest distances. OOF validation rows can use distances to fold-training rows. A3 names the population and quantile algorithm but not which of these three scientific quantities populates the N4 cutpoint vector. This is not a numerical formatting issue; it changes the null.
