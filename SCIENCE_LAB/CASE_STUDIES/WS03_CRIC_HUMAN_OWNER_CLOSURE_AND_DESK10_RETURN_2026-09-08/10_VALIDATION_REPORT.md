# Validation Report

## Closure gate

| Check | Result |
|---|---|
| Desk-10 manifest before and after synchronization | `PASS` |
| Desk-04 manifest before and after closure | `PASS` |
| Desk-05 manifest before and after closure | `PASS` |
| WS03 allowlist | `25` packages |
| Exact-once WS03 bindings | `25/25`; bad bindings `0` |
| Canonical Labreport required fields | `31/31 PASS` |
| Lab Register WS03 closed rows | `1` |
| Labreport Index WS03 rows | `1` |
| Negative/boundary rows added | `4` |
| Capability ledger | `CREATED_PROFILE_BOUND` |
| Mission Control D-032 table/detail | `1/1` |
| Mission Control closed handoff | `1` |
| Mission Control currentness pointer | `1` |
| THE EYE currentness target | `OVERVIEW.md`, exactly one note |
| Sealed 2026-09-03 THE EYE audit | `UNCHANGED` |
| Other workstream lifecycle change | `NONE` |
| Ticket or capability activation | `NONE` |
| CRIC execution or allowance creation | `NONE` |
| Prime Genesis delta import | `NONE` |

## Modified Mission Control files

| File | Before SHA-256 | After SHA-256 |
|---|---|---|
| `DECISION_LOG.md` | `462cb5f1a2b146cfb90a22dacc52b771e133c78c8140944704688a31ae3fbaac` | `1dea4ab1615a40ef269e5eaefb35f5922cfbddf57ed0f8e110e4c56dde4a80d7` |
| `REGISTRIES.md` | `a45a01326270df233eb6fda62984282199615e6b37245891edb6e369a365b25c` | `8c0dc0705ddb5a5ce047503067db52fe0f7dc4d7e0b111a2436b0914405eba0a` |
| `MISSION_CONTROL.md` | `4443fe133b08365f193d331089e99ff789b7f6b9f0139198c56e7fc3f39fae8e` | `ccd4db1717dce0fbd9be9d007ccb686c36e525ba1424767677e8a066871b0bd3` |
| `OVERVIEW.md` | `fd3b4ace1d35998ad868b8ca7bf90360536b91a52b76960aed84b0cd4c815c8e` | `477b33e9acab252500ef70d35c36fbd293830ba7be6ec7e30d5aed351212cb75` |

Detailed Science Lab and Mission Control hashes are in `results/modified_file_hash_ledger.json`.

`CLOSURE_VALIDATION = PASS`
