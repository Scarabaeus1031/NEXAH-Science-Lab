# REE-G1-D1-R1 Review

## Required identity contract

| Population | Physical unsigned seed IDs |
|---|---|
| TRAIN | `5000`–`5029` |
| REGISTERED TEST | `6000`–`6029` |

## Findings

- R1 makes the physical unsigned seed ID the sole scientific identity and sole RNG identity.
- Ordinal pair IDs are explicitly metadata only.
- Pair IDs are prohibited from RNG namespaces, scientific grouping, bootstrap clustering, and attribution identities.
- The TRAIN and REGISTERED TEST physical seed ranges are preserved exactly and are not permuted.
- Canonical rows, null families, bootstrap clusters, carrier attribution, and frozen training-seed halves bind to physical seed identity.
- No rematching rule, cross-population mapping, future-test access, or leakage path is introduced.
- This mapping is compatible with the frozen upstream RNG authority, which addresses the physical integer seed directly.

## Decision

`REE-G1-D1-R1`: **PASS**  
Physical seed identity: **PASS**  
RNG identity: **PASS**

IR-A1 is closed.
