# Provenance and Evidence Review

| Case | Claim→artifact→code→config→input | Verdict |
|---|---|---|
| A | callable/commit known; threshold known; historical `X,Y,Z`/RNG unavailable | `PARTIAL_BUT_SUFFICIENT` for algorithm, `PARTIAL_AND_CONSEQUENTIAL` for artifact replay |
| B | callable/commit and exact scan known; historical basin raster unavailable | `PARTIAL_BUT_SUFFICIENT` for operator semantics |
| C | runner/protocol/result hashes and replay known | `COMPLETE_FOR_CLAIM` |
| D | study protocol/runner/results/synthesis known; component ledger edges absent | `COMPLETE_FOR_CLAIM` for aggregate failure, partial for edge graph |

The schema's evidence `basis` values are categorical, not an ordered hierarchy; that is correct. Mathematics, code, data, external references, and audits answer different questions. However `verification` is ambiguous between integrity of the cited object and authority for the scoped claim. These should be separate.

Provenance is operational only for repository-backed computational edges. The schema forces repository and commit even when genuinely unknown or inapplicable, while endpoint artifacts are always mandatory. It therefore encourages placeholder or fabricated provenance in legitimate analytical/historical cases.

