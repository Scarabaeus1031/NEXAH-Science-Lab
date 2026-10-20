# A0-BL-049 — Run Contract

SOURCE_REVISION: frozen by `LOCK.json` before execution.

ENVIRONMENT: local Python 3 standard library; no network or external data.

DATA_ACCESS: exact enumeration of decimal strings `1000..9999` plus four
read-only source records.

COMMANDS:

```text
python3 verify_lock.py
python3 run_experiment.py artifacts/PRIMARY_RESULT.json
python3 run_experiment.py artifacts/REPLAY_RESULT.json
python3 verify_result.py artifacts/PRIMARY_RESULT.json
python3 verify_result.py artifacts/REPLAY_RESULT.json
cmp artifacts/PRIMARY_RESULT.json artifacts/REPLAY_RESULT.json
```

EXPECTED_OUTPUTS: canonical JSON with images, fibre histograms, collisions,
returns, controls, source-bound types, gates and classification.

HASHES/TOLERANCES: exact SHA-256, integer counts and string equality only.

RESOURCE_BOUND: 9,000 domain elements; in-memory finite maps only.

SIDE_EFFECTS: writes only the requested result JSON.

FAILURE_SEMANTICS: lock drift, incomplete domain, mismatched prediction,
verifier failure or non-identical Replay invalidates the run.

CLAIM_BOUNDARY: finite representation/operator typing only.

