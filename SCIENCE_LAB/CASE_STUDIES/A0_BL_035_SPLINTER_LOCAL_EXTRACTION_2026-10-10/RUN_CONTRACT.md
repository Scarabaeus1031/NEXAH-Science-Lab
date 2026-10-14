# A0-BL-035 — Run Contract

```yaml
RECORD_ID: A0_BL_035_SPLINTER_LOCAL_EXTRACTION_RUN_001
PURPOSE: PRIMARY_AND_REPLAY
SOURCE_REPOSITORY: NEXAH-Science-Lab
SOURCE_REVISION: bd3277e34c908edf96fe97f542103a2ddb2c9dc4 plus LOCK.json files
ENTRYPOINT: run_splinter_test.py
WORKING_DIRECTORY: SCIENCE_LAB/CASE_STUDIES/A0_BL_035_SPLINTER_LOCAL_EXTRACTION_2026-10-10
ENVIRONMENT: Python 3.9+ standard library; no network; no third-party packages
INPUT: frozen A0-BL-021 PRIMARY_RESULT.json at SHA-256 e8952baf391f430a6b02d7301461d8392d55bb24f85bb3f8e7415af77dfe4705
COMMANDS: python3 verify_lock.py; python3 run_splinter_test.py --output artifacts/PRIMARY_RESULT.json; python3 run_splinter_test.py --output artifacts/REPLAY_RESULT.json; python3 verify_result.py artifacts/PRIMARY_RESULT.json artifacts/REPLAY_RESULT.json
EXPECTED_OUTPUTS: two byte-identical deterministic JSON result files and a passing independent structural verifier
RESOURCE_BOUNDS: under 60 seconds; under 512 MiB RAM; exactly 100 input histories; no network
SIDE_EFFECTS: writes only artifacts/PRIMARY_RESULT.json and artifacts/REPLAY_RESULT.json
FAILURE: any lock, count, control, replay or verifier failure yields INVALID_EXPERIMENT and stops interpretation
CLAIM_BOUNDARY: one frozen finite history set; no physical Splinter, universal operator, C5 claim, PENT-08, generalized family or vocabulary promotion
OWNER: Human Owner
```

The command sequence is authorized once. Frozen files must not change after
result exposure.
