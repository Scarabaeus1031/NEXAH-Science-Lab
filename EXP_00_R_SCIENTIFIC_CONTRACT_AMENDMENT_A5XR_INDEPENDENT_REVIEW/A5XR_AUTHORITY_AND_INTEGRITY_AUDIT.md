# A5XR Authority and Integrity Audit

## Independent reconstruction

- V1 source/config/test composite over the authoritative 24 files: `971d4d947366f54692f72bbf20ac89ac4fcf7d11d4654f65bd4bfc6e1658bc05` — exact match.
- A5X authority-root SHA-256: `c5b35bbbbc7551fb5cddd8cc5468ba0aa8bcf4e895ef8bbe0b55f341821c4100` — exact match.
- A5XR authority-root SHA-256: `2cb5c5df75639dd69534a1c084ab35cdc16f9e378d6888e0a5cb8c1b114598a8` — exact match.
- A5XR root lists 23 members; sizes and raw/normalized hashes match. The root itself is the detached bootstrap artifact and is not a member.

The V1→A1→A2→A3→A4→A5→A5X authority history and each corresponding independent review were read as controlling history. Rejected amendment claims were not treated as authority; accepted repairs and prospective choices were reconstructed from their primary contract files.

## Pre/post whole-package snapshots

The following SHA-256 values hash the sorted `sha256  path` records for every file in each package, including existing bytecode. Pre-review and post-review values are identical.

| Package | Files | Composite |
|---|---:|---|
| V1 | 55 | `e179262f2513e439ea82445f363c55237ef21b803071193f55b797e5007dda9d` |
| A1 | 9 | `2c9cab89a5b484bd0cffcb0eda927a07a8ae519b418dc2f0deecdda7795f0ae3` |
| A1 review | 8 | `9168221a24f071980ece06eff85b72bbedc97bf9a77406147c58f1b4d7b1488f` |
| A2 | 14 | `b2aa6ef964aa0509e1e649a55eccb012a7c7920636d5e9a69dd5e59b469a2160` |
| A2 review | 9 | `c3c3615ae61acc4644bce3120c55ee84749fde26bf0bb20ceae0884d9b85bb2c` |
| A3 | 17 | `b1522876b3af65c1da6017a39d76eddf8b3b9e971df7096da519412e2b5c1f4d` |
| A3 review | 12 | `ec49c244e474f4ed709a155bf867a2f3d10040a8c070d9a0d0f2befa48dbc573` |
| A4 | 21 | `fdd0597193fb9d8569307ad533f22780a16519c872a507a077eb1dd551ae322e` |
| A4 review | 13 | `6b2215e96bb08a84bfc3a4467857fe3ba7d79799eb6e83975cd73f88a34f4464` |
| A5 | 19 | `2e777e4908cd6480692f8cfbdb05c6beb8b67d2ae11c21e89555cf12742af51c` |
| A5 review | 15 | `cb85aebc2c6d9565bd343027a4ba9345c95387e76dacfa2f377cbd2630165b0f` |
| A5X | 17 | `53dfb0fbeb1f025392ef4e40fc7f153610c480c7cb0290ee5e9b86754943d13f` |
| A5X review | 13 | `15c7da856e5c96fea4b5796903e47ec6336168e4cb66ed455eb5d5a6c92d5352` |
| A5XR | 24 | `a09aeb1c529dcc103feae2e5d78cc991927b6265f9562b9d607670d17f70742d` |

## Dependency defect

The local A5XR root is cryptographically effective for its members. Transitive authority is not. `validate_all` hashes the A5X root JSON but never invokes/reconstructs its member verification. It reads A4 matrices directly through `derive.a4()` without sealing that A4 file as an A5XR dependency. This is Class B; no scientific choice is implicated.

No registered seed registry, trajectory, fit, score, outcome or result was opened. Numeric seed ranges were read only as frozen prose/config values.
