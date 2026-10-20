# A0-BL-025 — Science Lab Run Contract

```yaml
RECORD_ID: A0_BL_025_TYPED_SEAM_CHANNEL_UTILITY_RUN_001
PURPOSE: PRIMARY_AND_REPLAY
SOURCE_REPOSITORY: NEXAH-Science-Lab
SOURCE_REVISION: current working tree plus package-local LOCK.json
ENTRYPOINT: run_experiment.py
WORKING_DIRECTORY: SCIENCE_LAB/CASE_STUDIES/A0_BL_025_TYPED_SEAM_CHANNEL_UTILITY_2026-10-18
ENVIRONMENT_SPEC: local shell; Python standard library only
RUNTIME_VERSION: Python 3
DEPENDENCIES: Python standard library; no network; no third-party packages
INPUTS: 01_PREREGISTRATION.md; FROZEN_PROTOCOL.json; locked implementation
DATA_ACCESS: repository-local read; outputs only below artifacts/
LICENSE_AND_PRIVACY: no personal, private, licensed or human-subject data
COMMAND: python3 run_experiment.py --output artifacts/PRIMARY_RESULT.json
EXPECTED_OUTPUTS: deterministic JSON containing C0-C4 metrics, controls, H-U1 through H-U4 gates, boundaries and one registered decision
EXPECTED_HASHES_OR_TOLERANCES: all locked files must match LOCK.json; no numeric tolerance; Primary and Replay must be byte-identical
RESOURCE_BOUNDS: under 30 seconds; under 256 MiB RAM; exactly 140 raw incidences
NETWORK_REQUIRED: false
FILESYSTEM_SIDE_EFFECTS: creates or replaces only PRIMARY_RESULT.json and REPLAY_RESULT.json below this package's artifacts directory
FAILURE_SEMANTICS: any exception, lock mismatch, unexpected census, failed control, replay divergence or verifier failure yields INVALID_EXPERIMENT and stops interpretation
SCIENTIFIC_CLAIM_BOUNDARY: finite SCC-003 information accounting and explicitly designed local seam Return only; no physical flow, stability, historical zipper, Riemann, Human usability, universal architecture or publication claim
RESULT_REPORT: 02_RESULT_ASSESSMENT.md
ISSUE_ROUTE: Human Owner through Science Lab Research Director; preserve negative, null and invalid outcomes
OWNER: Human Owner
LAST_VERIFIED: pending execution
```

## Authorized sequence

```sh
python3 verify_lock.py
python3 run_experiment.py --output artifacts/PRIMARY_RESULT.json
python3 run_experiment.py --output artifacts/REPLAY_RESULT.json
python3 verify_result.py
```

The authorization stops after result exposure and verification.
