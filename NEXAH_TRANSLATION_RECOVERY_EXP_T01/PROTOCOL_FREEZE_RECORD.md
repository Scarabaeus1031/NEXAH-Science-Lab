# EXP-T01 Protocol Freeze Record

`PROTOCOL_FROZEN = YES`  
`STATUS_AT_FREEZE = PREREGISTERED_NOT_EXECUTED`  
`PROTOCOL_BUNDLE_SHA256 = 6f0b807d1d18c9db3825dbaa98dd413cba0d52ea5f8e9bc319aa137865119b53`

The bundle was frozen before any result-bearing run. At freeze time, no result,
replay-audit, or final-analysis artifact existed in this package. The bundle
digest is SHA-256 over the lexicographically sorted sequence
`filename + NUL + file_sha256 + newline`. The machine-readable file hashes are
recorded in `PROTOCOL_FREEZE_RECORD.json`.

Canonical read-only baseline:

- repository: `/Users/tho2020/Documents/GitHub/NEXAH`
- branch: `main`
- HEAD: `724814ea40351141350a1822d7c559a308ac0cfa`
- status: clean and aligned with `origin/main`
- canonical operators changed: no

Frozen files:

1. `00_SCOPE_AND_BOUNDARIES.md`
2. `01_FORMAL_TRANSLATION_MODEL.md`
3. `02_HYPOTHESES.md`
4. `03_FIXTURE_REGISTRY.md`
5. `04_TRANSFORMATION_REGISTRY.md`
6. `05_CERTIFICATE_REGISTRY.md`
7. `06_METRICS_AND_TOLERANCES.md`
8. `07_ADVERSARIAL_CONTROLS.md`
9. `08_STILLPOINT_PROTOCOL.md`
10. `experiment_protocol.json`
11. `run_exp_t01.py`
12. `verify_exp_t01.py`

The freeze record files are seal metadata and are excluded from the bundle to
avoid a circular self-hash. Any later change to a frozen file makes the runner
and verifier fail closed.
