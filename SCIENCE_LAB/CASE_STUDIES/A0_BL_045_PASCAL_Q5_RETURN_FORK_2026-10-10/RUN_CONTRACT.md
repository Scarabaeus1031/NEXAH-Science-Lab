# A0-BL-045 — Run Contract

```yaml
RECORD_ID: A0_BL_045_PASCAL_Q5_RETURN_FORK_RUN_001
PURPOSE: PRIMARY_AND_REPLAY
SOURCE_REPOSITORY: NEXAH-Science-Lab
SOURCE_REVISION: bd3277e34c908edf96fe97f542103a2ddb2c9dc4 plus FROZEN_PROTOCOL.json
ENTRYPOINT: run_return_fork.py
WORKING_DIRECTORY: SCIENCE_LAB/CASE_STUDIES/A0_BL_045_PASCAL_Q5_RETURN_FORK_2026-10-10
ENVIRONMENT: Python 3.9+ standard library; no network; no third-party packages
INPUT: FROZEN_PROTOCOL.json
COMMANDS: python3 run_return_fork.py --output artifacts/PRIMARY_RESULT.json; python3 run_return_fork.py --output artifacts/REPLAY_RESULT.json; python3 verify_result.py artifacts/PRIMARY_RESULT.json artifacts/REPLAY_RESULT.json
EXPECTED_OUTPUTS: two byte-identical deterministic JSON results and a passing independent verifier
RESOURCE_BOUNDS: under 10 seconds; under 128 MiB RAM; no network
SIDE_EFFECTS: writes only artifacts/PRIMARY_RESULT.json and artifacts/REPLAY_RESULT.json
FAILURE: any arithmetic, boundary-component, fixed-state, replay or verifier failure yields INVALID_EXPERIMENT and stops interpretation
CLAIM_BOUNDARY: finite exact separation of Q^5 monodromy and seam topology only; no canonical phi, physical Möbius mechanism, PENT-08, Family or publication claim
OWNER: Human Owner
```
