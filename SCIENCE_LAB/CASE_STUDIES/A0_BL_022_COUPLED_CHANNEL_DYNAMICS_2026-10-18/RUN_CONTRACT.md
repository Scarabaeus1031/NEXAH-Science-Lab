# A0-BL-022 — Run Contract

SOURCE_REVISION: exact hashes in `LOCK.json`. ENVIRONMENT: Python 3 standard
library. DATA_ACCESS: local frozen documents only. RESOURCE_BOUND: 60 states,
`6^5` direct maps, under one minute, small JSON outputs. SIDE_EFFECTS: two
result JSON files only.

```text
python3 verify_lock.py
python3 run_experiment.py --mode primary --output artifacts/PRIMARY_RESULT.json
python3 run_experiment.py --mode replay --output artifacts/REPLAY_RESULT.json
cmp artifacts/PRIMARY_RESULT.json artifacts/REPLAY_RESULT.json
python3 verify_result.py artifacts/PRIMARY_RESULT.json
python3 verify_result.py artifacts/REPLAY_RESULT.json
```

Failure means `INVALID_DESIGN` or the registered non-pass class; no repair,
parameter search, mechanism import, successor activation or publication after
result exposure. STOP after assessment and Owner disposition request.
