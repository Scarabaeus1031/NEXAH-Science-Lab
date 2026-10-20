# A0-BL-048 — Run Contract

SOURCE_REVISION: frozen by `LOCK.json` before execution.

ENVIRONMENT: local Python 3 standard library; no network and no external data.

DATA_ACCESS: three literal target strings plus four read-only source records.

COMMANDS:

```text
python3 verify_lock.py
python3 run_experiment.py artifacts/PRIMARY_RESULT.json
python3 run_experiment.py artifacts/REPLAY_RESULT.json
python3 verify_result.py artifacts/PRIMARY_RESULT.json
python3 verify_result.py artifacts/REPLAY_RESULT.json
cmp artifacts/PRIMARY_RESULT.json artifacts/REPLAY_RESULT.json
```

EXPECTED_OUTPUTS: two canonical JSON results with complete class summaries,
joint histograms, exact tail fractions, gates and classification.

HASHES/TOLERANCES: input SHA-256 values must match exactly; integer counts and
rational numerators/denominators are exact; decimal displays are derived.

RESOURCE_BOUND: at most 540 joint tuples and all contiguous substrings of the
three declared strings.

SIDE_EFFECTS: writes only the requested result JSON.

FAILURE_SEMANTICS: lock drift, incomplete enumeration, verifier failure or
Primary/Replay difference invalidates the run.

CLAIM_BOUNDARY: exact finite representation audit only.

