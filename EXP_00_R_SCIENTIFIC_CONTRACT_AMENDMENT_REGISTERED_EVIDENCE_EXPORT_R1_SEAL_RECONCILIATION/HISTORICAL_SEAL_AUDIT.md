# Historical Seal Audit

## Export R1 package

| Check | Result |
|---|---|
| Declared members | 10 |
| Actual non-seal members | Same exact 10 basenames |
| Member byte lengths | 10/10 MATCH |
| Member SHA-256 values | 10/10 MATCH |
| Declared algorithm | SHA-256 of LF-terminated `hash␠␠basename` records sorted bytewise by basename |
| Hash under declared algorithm | `8e7ca6710290e8774427569500e09ce212f0345e1af6697d7cdbf49cb1f16cf1` |
| Declared tree hash | `726132aa49973e32f420554c44d0a0ab891f0582301535de0c4fa80d02c5bc33` |
| Declared method reproduces | FAIL |
| Historical method reproduces | PASS |

## Independent Export R1 review

| Check | Result |
|---|---|
| Declared members | 7 |
| Actual non-seal members | Same exact 7 basenames |
| Member byte lengths | 7/7 MATCH |
| Member SHA-256 values | 7/7 MATCH |
| Declared algorithm | SHA-256 of LF-terminated `hash␠␠basename` records sorted bytewise by basename |
| Hash under declared algorithm | `38de0b34b8e1d2751a529cc1400cc0d85c4e69b0b28b8e8f3095146cf5061a42` |
| Declared tree hash | `5f7bdde15d9ca00e7212480562062f226010759ebccd2c8678162e68724fee35` |
| Declared method reproduces | FAIL |
| Historical method reproduces | PASS |

The mismatch is not evidence of corruption. Both member manifests independently and completely identify their packages, and every identified byte object matches.

Root cause: **C + D + F** — sort-order, delimiter, and documentation mismatches. The primary package used digest-order records with the two-space delimiter. The review package used digest-order records with no delimiter. Both seal descriptions incorrectly state basename ordering and the same two-space record encoding.
