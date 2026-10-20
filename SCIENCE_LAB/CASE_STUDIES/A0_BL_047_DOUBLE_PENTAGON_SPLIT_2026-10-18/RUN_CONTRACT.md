# A0-BL-047 — Run Contract

SOURCE_REVISION: exact hashes in `LOCK.json`. ENVIRONMENT: Python 3 standard
library. DATA_ACCESS: local frozen documents only. RESOURCE_BOUND: ten extension
variants, twenty ordered distinct pairs, finite permutation checks below one
minute, two small JSON outputs. SIDE_EFFECTS: two result JSON files only.

```text
python3 verify_lock.py
python3 run_experiment.py --mode primary --output artifacts/PRIMARY_RESULT.json
python3 run_experiment.py --mode replay --output artifacts/REPLAY_RESULT.json
cmp artifacts/PRIMARY_RESULT.json artifacts/REPLAY_RESULT.json
python3 verify_result.py artifacts/PRIMARY_RESULT.json
python3 verify_result.py artifacts/REPLAY_RESULT.json
```

Failure means the registered non-pass class or `INVALID_DESIGN`. No repair,
selector search, visual alignment, new identity, successor or publication
after exposure. STOP for Owner disposition.

