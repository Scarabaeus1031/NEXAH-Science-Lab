# A0-BL-046 — Run Contract

SOURCE_REVISION: exact hashes in `LOCK.json`. ENVIRONMENT: Python 3 standard
library. DATA_ACCESS: one local Photos-library derivative for hash/dimension
verification plus frozen JSON coordinates. RESOURCE_BOUND: seven occurrences,
21 distances, 2,520 unique shuffles, ten nearby controls and 32 jitter trials;
under one minute; two small JSON outputs. SIDE_EFFECTS: two result JSON files.

```text
python3 verify_lock.py
python3 run_experiment.py --mode primary --output artifacts/PRIMARY_RESULT.json
python3 run_experiment.py --mode replay --output artifacts/REPLAY_RESULT.json
cmp artifacts/PRIMARY_RESULT.json artifacts/REPLAY_RESULT.json
python3 verify_result.py artifacts/PRIMARY_RESULT.json
python3 verify_result.py artifacts/REPLAY_RESULT.json
```

Failure means the registered non-pass class or `INVALID_DESIGN`; no repair,
anchor movement, candidate search, successor activation or publication after
result exposure. STOP after assessment and Owner disposition request.

