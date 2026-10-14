# A0-BL-052 — Run Contract

```yaml
RECORD_ID: A0_BL_052_PASCAL_QUATERNION_FOUR_CHANNEL_RETURN_RUN_001
PURPOSE: PRIMARY_AND_REPLAY
SOURCE_REPOSITORY: NEXAH-Science-Lab
SOURCE_REVISION: working tree plus LOCK.json frozen before execution
ENTRYPOINT: run_test.py
WORKING_DIRECTORY: SCIENCE_LAB/CASE_STUDIES/A0_BL_052_PASCAL_QUATERNION_FOUR_CHANNEL_RETURN_2026-10-11
ENVIRONMENT: Python 3.9+ standard library; no network; no third-party packages
INPUT: FROZEN_PROTOCOL.json and exact maps embedded in run_test.py, both pinned by LOCK.json
COMMANDS: python3 verify_lock.py; python3 run_test.py --output artifacts/PRIMARY_RESULT.json; python3 run_test.py --output artifacts/REPLAY_RESULT.json; python3 verify_result.py artifacts/PRIMARY_RESULT.json artifacts/REPLAY_RESULT.json
EXPECTED_OUTPUTS: two byte-identical deterministic JSON result files; T1-T10 complete; independent structural verifier PASS
HASHES_AND_TOLERANCES: LOCK.json pins protocol, runner, verifier and preregistration; exact arithmetic for positive tests; 1e-9 only for the declared generic-view integer-membership negative control
RESOURCE_BOUNDS: under 60 seconds per command; under 512 MiB RAM; no network
SIDE_EFFECTS: writes only artifacts/PRIMARY_RESULT.json and artifacts/REPLAY_RESULT.json; verifier writes no files
FAILURE: any lock, test, count, tolerance, replay or verifier failure yields INVALID_EXPERIMENT and stops interpretation
CLAIM_BOUNDARY: exact finite representation connector only; no Pascal generation by quaternions, fifth quaternion component, historical intent, physical mechanism, prime selector, Family admission or identity between quaternion Return and Q_432
OWNER: Human Owner
```

The command sequence is authorized once under the bounded reopen. Frozen files
must not change after result exposure.
