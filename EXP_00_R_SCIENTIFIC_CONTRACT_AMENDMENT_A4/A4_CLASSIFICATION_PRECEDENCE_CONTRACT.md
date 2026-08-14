# A4 Classification Precedence Contract

## Rössler

**NEW PROSPECTIVE SCIENTIFIC CHOICE.** V1's partial and non-replication prose overlaps. A4 resolves it prospectively with this ordered, mutually exclusive, exhaustive tree:

1. If any mandatory validity gate fails: `INVALID EXPERIMENT`.
2. Else if P1, P2, P3, P4, and P5 all pass, both carriers have positive primary coefficient and positive primary log-loss gain, and neither carrier is statistically resolved negative: `REPLICATED`.
3. Else if at least one carrier has both positive primary coefficient and positive primary log-loss gain and neither carrier is statistically resolved negative: `PARTIALLY REPLICATED`.
4. Else: `NOT REPLICATED`.

“Statistically resolved negative” means the carrier's seed-clustered 95% coefficient interval upper endpoint is strictly `<0`. A carrier cannot simultaneously be positive-core and resolved-negative; such an internally inconsistent input is a failed provenance/model-consistency validity gate, not a scientific state.

This gives required null failure a single effect: P1/P3 cannot pass, so replication is unavailable. With an otherwise coherent positive core it is partial; without one it is not replicated. The decision reports every failed P and carrier condition.

## Cross-system

1. Invalid Rössler → `INCONCLUSIVE`.
2. Valid Rössler with P1, P2, and P3 all true and Rössler label `REPLICATED` or `PARTIALLY REPLICATED` → `PARTIAL CROSS-SYSTEM REPLICATION`.
3. Every other valid Rössler state → `NON-REPLICATION`.

`CROSS-SYSTEM REPLICATION` is unreachable under A4 because frozen Lorenz v2 fails carrier-balanced P4. No positive Rössler state can override this ceiling. No pooling is authorized.

The standard-library truth-table test enumerates all Boolean combinations of validity, P1–P5, carrier positive cores, and resolved-negative flags, rejects inconsistent inputs, and proves exactly one label for every consistent state.

