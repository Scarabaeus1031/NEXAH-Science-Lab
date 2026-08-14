# Package Integrity Review

## R1 object

- Expected tree SHA-256: `726132aa49973e32f420554c44d0a0ab891f0582301535de0c4fa80d02c5bc33`
- Recomputed tree SHA-256: `726132aa49973e32f420554c44d0a0ab891f0582301535de0c4fa80d02c5bc33`
- Every sealed member path, byte count, and SHA-256: **MATCH**
- Result: **PASS**

## Preserved lineage

The following immutable inputs were independently rechecked without modification:

| Object | Integrity evidence | Result |
|---|---|---|
| Rejected predecessor amendment | tree SHA-256 `7bb09e9680423c26b9e2d03fc57799c3e5210759ba6f384809ce100f9000a2b4` unchanged | PASS |
| Previous independent review | tree SHA-256 `bb2498493911fbff472f8923bb5e734e949f5e7bdf8823312495ce90d538a4d4` unchanged | PASS |
| V3R6 material-callable integrity package | all 16 sealed member hashes and byte counts match | PASS |
| Upstream frozen contracts | required V1, A3, A4, A5XEF, and A5XEFR lineage objects remain present and were read only | PASS |

No historical or frozen object was edited by this review.
