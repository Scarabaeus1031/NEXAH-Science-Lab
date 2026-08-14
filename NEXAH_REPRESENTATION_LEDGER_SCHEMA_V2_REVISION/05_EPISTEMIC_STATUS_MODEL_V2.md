# Epistemic-Status Model V2

The overloaded v1 `VERIFIED` state is removed.

| Dimension | Vocabulary |
|---|---|
| implementation | `LOCATED`, `PARTIAL`, `NOT_LOCATED`, `NOT_APPLICABLE`, `UNKNOWN` |
| execution | `NOT_EXECUTED`, `EXECUTED`, `REPRODUCED`, `FAILED`, `NOT_APPLICABLE`, `UNKNOWN` |
| reproducibility | `REPRODUCIBLE`, `PARTIAL`, `NOT_REPRODUCIBLE`, `NOT_TESTED`, `NOT_APPLICABLE`, `UNKNOWN` |
| provenance | `COMPLETE`, `PARTIAL`, `PROVENANCE_UNAVAILABLE`, `NOT_APPLICABLE`, `UNKNOWN` |
| aggregate claim support | `SUPPORTED`, `PARTIAL`, `REJECTED`, `MIXED`, `NOT_ASSESSED`, `UNKNOWN` |

Each dimension carries a judgment basis and evidence references. Individual scientific claims have their own history/status, so aggregate `MIXED` can coexist with precise supported and rejected claims.

Successful execution never upgrades scientific claim support. Case D deliberately uses `EXECUTION_STATUS=REPRODUCED`, `REPRODUCIBILITY_STATUS=REPRODUCIBLE`, and `CLAIM_SUPPORT_STATUS=MIXED`.

