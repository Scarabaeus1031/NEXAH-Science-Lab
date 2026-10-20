# A0-BL-020 — Science Lab Run Contract

RECORD_ID: `A0_BL_020_GENERAL_PASCAL_QUOTIENTS_RUN_001`

AUTHORIZED_SEQUENCE: verify source lock; one Primary; one Replay; require
byte identity; verify both; write one bounded assessment; STOP.

WORKING_DIRECTORY: `SCIENCE_LAB/CASE_STUDIES/A0_BL_020_GENERAL_PASCAL_QUOTIENTS_2026-10-18`

COMMANDS:

```text
python3 verify_lock.py
python3 run_experiment.py --mode primary --output artifacts/PRIMARY_RESULT.json
python3 run_experiment.py --mode replay --output artifacts/REPLAY_RESULT.json
cmp artifacts/PRIMARY_RESULT.json artifacts/REPLAY_RESULT.json
python3 verify_result.py artifacts/PRIMARY_RESULT.json
python3 verify_result.py artifacts/REPLAY_RESULT.json
```

STOP: no protocol repair, parameter search, dynamic-history reinterpretation,
canonical carrier creation, successor activation or publication after result
exposure.
