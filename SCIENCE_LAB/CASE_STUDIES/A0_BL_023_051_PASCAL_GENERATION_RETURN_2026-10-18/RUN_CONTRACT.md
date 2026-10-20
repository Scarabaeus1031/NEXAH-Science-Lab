# A0-BL-023 / A0-BL-051 — Science Lab Run Contract

Status: `FROZEN / NOT ACTIVE / NOT EXECUTED`

```yaml
RECORD_ID: A0_BL_023_051_PASCAL_GENERATION_RETURN_RUN_001
PURPOSE: PRIMARY_AND_REPLAY
SOURCE_REPOSITORY: NEXAH-Science-Lab plus exact frozen NEXAH Core parent sources
SOURCE_REVISION: current working trees plus package-local LOCK.json
ENTRYPOINT: run_experiment.py
WORKING_DIRECTORY: SCIENCE_LAB/CASE_STUDIES/A0_BL_023_051_PASCAL_GENERATION_RETURN_2026-10-18
ENVIRONMENT_SPEC: Python 3 standard library only
DEPENDENCIES: none beyond Python standard library; no network
INPUTS: 01_PREREGISTRATION.md; FROZEN_PROTOCOL.json; seven exact parent-source hashes; locked implementation
COMMAND: python3 run_experiment.py --output artifacts/PRIMARY_RESULT.json
EXPECTED_OUTPUTS: deterministic JSON with five gates, control receipts and one registered result class
EXPECTED_HASHES_OR_TOLERANCES: all locks exact; integer and symbolic checks exact; Primary and Replay byte-identical
RESOURCE_BOUNDS: under 60 seconds; under 256 MiB RAM; depth at most six and exactly five faces
NETWORK_REQUIRED: false
FILESYSTEM_SIDE_EFFECTS: creates or replaces only PRIMARY_RESULT.json and REPLAY_RESULT.json below this package artifacts directory
FAILURE_SEMANTICS: lock, schema, target-leakage, replay or verifier failure yields INVALID_DESIGN and stops interpretation
SCIENTIFIC_CLAIM_BOUNDARY: finite internal formal-fixture audit only; no new quotient identity mechanism utility novelty public release or publication claim
RESULT_REPORT: 02_RESULT_ASSESSMENT.md
OWNER: Human Owner
LAST_VERIFIED: design and source lock pending; scientific execution not authorized
```

The predecessor dispositions are complete. Execution remains prohibited until
Mission Control separately activates this exact contract.

