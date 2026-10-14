# A0-BL-021 — Science Lab Run Contract

```yaml
RECORD_ID: A0_BL_021_DYNAMIC_BOUNDARY_CONFLUENCE_RUN_001
PURPOSE: REPLAY
SOURCE_REPOSITORY: NEXAH-Science-Lab
SOURCE_REVISION: bd3277e34c908edf96fe97f542103a2ddb2c9dc4 plus case-local locked working-tree files listed in LOCK.json
ENTRYPOINT: run_confluence.py
WORKING_DIRECTORY: SCIENCE_LAB/CASE_STUDIES/A0_BL_021_DYNAMIC_BOUNDARY_CONFLUENCE_2026-10-10
ENVIRONMENT_SPEC: macOS local shell; Python standard library only
RUNTIME_VERSION: Python 3.9.6
DEPENDENCIES: Python standard library; no network; no third-party packages
INPUTS: FROZEN_PROTOCOL.json; 01_PREREGISTRATION.md; fixed algorithm in run_confluence.py
DATA_ACCESS: repository-local read; generated artifacts written only below artifacts/
LICENSE_AND_PRIVACY: no personal, private, licensed or human-subject data; repository license boundary retained
COMMAND: python3 run_confluence.py --output artifacts/PRIMARY_RESULT.json
EXPECTED_OUTPUTS: deterministic JSON with complete f=5 to f=7 history enumeration, exact typed-class partition, controls, expanded Pascal invariants and one allowed result class
EXPECTED_HASHES_OR_TOLERANCES: protocol and implementation hashes must match LOCK.json; no numeric tolerance; replay scientific bytes must equal primary scientific bytes exactly
RESOURCE_BOUNDS: under 60 seconds; under 512 MiB RAM; no more than 500 declared histories
NETWORK_REQUIRED: false
FILESYSTEM_SIDE_EFFECTS: creates or replaces only the explicitly named artifact JSON in this case package
FAILURE_SEMANTICS: any exception, invariant failure, count above resource bound, protocol/hash mismatch, control failure or replay divergence yields INVALID_EXPERIMENT and stops interpretation
SCIENTIFIC_CLAIM_BOUNDARY: finite combinatorial f=5,6,7 depth-six carrier only; no unrestricted confluence, general m/d family, metric polygon, solid, physical channel, resonance, MONAD(t), dodecahedron or canonical A0 promotion
RESULT_REPORT: 03_RESULT_ASSESSMENT.md
ISSUE_ROUTE: Human Owner through Science Lab Research Director; preserve all negative, null, invalid or path-dependent outcomes
OWNER: Human Owner
LAST_VERIFIED: 2026-10-10; lock PASS; primary/replay byte-identical; result verifier PASS; witness audit PASS
```

## Authorized sequence

```sh
python3 verify_lock.py
python3 run_confluence.py --output artifacts/PRIMARY_RESULT.json
python3 run_confluence.py --output artifacts/REPLAY_RESULT.json
python3 verify_result.py
```

The Run Contract authorizes this sequence only. It does not authorize edits to
the frozen protocol after result exposure.
