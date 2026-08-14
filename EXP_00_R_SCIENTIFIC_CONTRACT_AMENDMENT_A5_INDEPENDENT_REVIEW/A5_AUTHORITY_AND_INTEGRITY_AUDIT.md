# A5 Authority and Integrity Audit

## Independent snapshots

Package composites use sorted relative POSIX paths and `sha256  path\n` ledger hashing.

| Package | Files | Pre-review composite |
|---|---:|---|
| V1 | 34 | `977c7b5cf6d40985f1e69827615bdea65c32dc8b92f4b671908fca72a7e548af` |
| A1 | 9 | `6b9e297491ff138277db2875ff5624a1e7e3e9572f1c636ce42913314f8f3ba5` |
| A1 review | 8 | `39431c757e567a049ecd816cbe2c85d00a41f0aec863fd2e86acdbcaa1f5049d` |
| A2 | 14 | `d258da1d2dd2c0f547efb2198f4562fc946b7f4ed225431ea1aba2d441c91986` |
| A2 review | 9 | `fdc8b7662576de11dbe8812b3477ee2d480f2c629d210fc5f52af1e9a1a972c4` |
| A3 | 17 | `435d40aa5fdd906f558d1291baac126e62237297a8bddf2e960286d81fa5e33c` |
| A3 review | 12 | `b46fdb4c34566d17028d7631f614a70892c1df9e0a2cdce8e766439ea198cbb5` |
| A4 | 21 | `17f528e59096ce9f35cc510d6f5ac765104dd9e30d92ce14d7b9f743279b7f90` |
| A4 review | 13 | `87017ad2e932b0b5456add88ba23a0fabc585e81027cc4b28839802484fd5c6f` |
| A5 | 19 | `14dee8762d1226feb111bc71b281ea89219675ae8914919f59096c6a2a63e4cd` |

The independent V1 scientific composite is exactly the expected 24-file digest. A5 also correctly checks fixed external file hashes when those files are independently mutated.

All ten package composites were recomputed after the review and exactly matched the pre-review table. A5 and every upstream authoritative package therefore remained byte-unchanged.

## Sealing attacks

| Attack | Result |
|---|---|
| mutate V1 composite member | rejected |
| mutate A5 prose without manifest update | rejected |
| mutate A5 machine without manifest update | rejected |
| remove operative artifact | rejected |
| add unmanifested contradictory Markdown | rejected |
| replace anchored external authority | rejected by SHA-256 |
| mutate manifest `member_count`, `package`, or member `role` | **accepted** |
| mutate prose and update its manifest hash/size | **accepted** |
| mutate validator and update its manifest hash/size | **accepted** |

The manifest excludes itself and has no detached immutable digest or upstream freeze anchor. `validate_manifest` ignores `member_count`, `package`, `hash_algorithm`, and roles. Therefore it is an editable checksum list, not an immutable seal. The post-access mutation gate cannot cure pre-access contract substitution and is itself only a string predicate. **A4-R24: FAIL (Class B).**
