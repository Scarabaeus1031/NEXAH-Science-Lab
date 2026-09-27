# Utility-01R terminal capability stop — evidence slice

```text
EVIDENCE_CLASS: STOPPED_PREEXECUTION_DEVELOPMENT_CANDIDATE
LOCK: UNLOCKED
AUTHORITY: NONAUTHORITATIVE
UTILITY_RESULT: NONE
ORIGINAL_U2: D_INVALID_OR_INSUFFICIENT_TEST
R1_DECISION: D_R1_EQUAL_INFORMATION_FAILED
SERIES_DISPOSITION: D_INVALID_AFTER_SINGLE_REPAIR_ATTEMPT
HARD_EXIT: STOP_NO_FURTHER_REDESIGN
```

This is a minimal, unsealed evidence slice from a stopped Development
candidate. It is not an R1 machine lock, a complete utility comparison or an
A/B/C result. [R1_STOP.md](R1_STOP.md) gives the capability finding and claim
boundary. The two pre-existing carriers under `processor_inputs/` are one
valid Development carrier and one actual D01 residual-removal carrier; the
remaining 112 Development candidates and their separate gold are **not** in
this evidence slice. No Evaluation or Replay input was materialized.

`capability_gate.py` checks the real residual state in both carriers, runs the
pinned-Core syntax adapter and the independent baseline on the same directory
bytes, and compares their statuses. `gate_raw_outputs.json` preserves the raw
Development outputs and exact carrier-file SHA-256 values. `manifest.py`
verifies the explicit SHA-256 package inventory. Neither script reads the
Keychain or invokes a generator, HMAC bridge, scorer, Evaluation or Replay.
The two byte-exact JSON carriers retain neutral trailing-space padding from
the metadata-leakage gate. `.gitattributes` suppresses textual diffs for
those data files; the SHA-256 manifest, not whitespace normalization, binds
their content.

Requirements for local reproduction: Python 3.12 with NumPy 2.3.5 and the
NEXAH Core checkout at the path declared in `nexah_adapter.py`, pinned to
`ead4223a9bea103ad2266fc3b71b433974de37dd`. From this directory:

```bash
python3 -B manifest.py --verify
python3 -B capability_gate.py --verify
```

The existing bound-key Digest is
`86ddbff4ba34451807e5cce0f0f69b9596a125f63d6e3437118ee6a860975d2e`.
The Keychain entry is retained dormant. This slice contains no key material,
HMAC helper, test key, Human-authoring-hour assertion or utility statistic.
Local replay is not independent custody or external replication.

The local untracked candidate also contains excluded generator, recipes,
scorer, run-contract and Development-test sources, 112 other Development
carriers, and evaluator-only Development gold/parent records. They were not
staged or pushed. No pre-existing untracked material was deleted.
