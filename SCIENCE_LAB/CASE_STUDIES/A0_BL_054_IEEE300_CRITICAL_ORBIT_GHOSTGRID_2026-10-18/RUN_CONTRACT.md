# A0-BL-054 — Science Lab Run Contract

Status: `FROZEN / NOT ACTIVE / NOT EXECUTED`

```yaml
RECORD_ID: A0_BL_054_IEEE300_CRITICAL_ORBIT_GHOSTGRID_RUN_001
PURPOSE: PRIMARY_AND_REPLAY
SOURCE_REPOSITORY: NEXAH-Science-Lab
SOURCE_REVISION: current working tree plus package-local LOCK.json and exact parent-source hashes
ENTRYPOINT: run_experiment.py
WORKING_DIRECTORY: SCIENCE_LAB/CASE_STUDIES/A0_BL_054_IEEE300_CRITICAL_ORBIT_GHOSTGRID_2026-10-18
ENVIRONMENT_SPEC: existing NEXAH_IEEE300_GRAPH_TO_GRID_VALIDATION_2026-10-08 study-local virtual environment
RUNTIME_VERSION: pinned by parent study environment and reported in result
DEPENDENCIES: numpy scipy pandapower from existing study-local environment; no network
INPUTS: 01_PREREGISTRATION.md; FROZEN_PROTOCOL.json; six exact parent-source hashes; locked implementation
DATA_ACCESS: repository-local IEEE-300 model through installed Pandapower; no external acquisition
LICENSE_AND_PRIVACY: no personal or human-subject data; existing source licenses retained
COMMAND: ../NEXAH_IEEE300_GRAPH_TO_GRID_VALIDATION_2026-10-08/.venv/bin/python run_experiment.py --output artifacts/PRIMARY_RESULT.json
EXPECTED_OUTPUTS: deterministic JSON with adapter records, late-orbit signatures, 81 view-stress records, load/topology/relabel/ablation gates, collision accounting, random-projection diagnostic and one registered result class
EXPECTED_HASHES_OR_TOLERANCES: all package and parent-source hashes must match; exact relabel signature equality; thresholds frozen in FROZEN_PROTOCOL.json; Primary and Replay byte-identical
RESOURCE_BOUNDS: under 20 minutes; under 4 GiB RAM; exactly seven baseline load states, one fixed topology state, one relabel state and one synthetic state
NETWORK_REQUIRED: false
FILESYSTEM_SIDE_EFFECTS: creates or replaces only PRIMARY_RESULT.json and REPLAY_RESULT.json below this package's artifacts directory
FAILURE_SEMANTICS: source/hash mismatch, solver divergence, non-finite or escaped orbit, early-iterate exposure, missing state, exception, replay divergence or verifier failure yields INVALID_EXPERIMENT or INVALID_ADAPTER and stops interpretation
SCIENTIFIC_CLAIM_BOUNDARY: finite internal representation-stress test only; no early-warning prediction control mechanism resonance physical Critical Orbit preferred geometry application utility public release or publication claim
RESULT_REPORT: 02_RESULT_ASSESSMENT.md
ISSUE_ROUTE: Human Owner through Science Lab Research Director; preserve positive negative mixed uninformative information-loss and invalid outcomes
OWNER: Human Owner
LAST_VERIFIED: design and source lock pending; scientific execution not authorized yet
```

## Sequence after separate activation

```sh
python3 verify_lock.py
../NEXAH_IEEE300_GRAPH_TO_GRID_VALIDATION_2026-10-08/.venv/bin/python run_experiment.py --output artifacts/PRIMARY_RESULT.json
../NEXAH_IEEE300_GRAPH_TO_GRID_VALIDATION_2026-10-08/.venv/bin/python run_experiment.py --output artifacts/REPLAY_RESULT.json
python3 verify_result.py
```

This contract is frozen but inactive. It must not be executed before the
preceding A0-BL-025 result receives Human Owner disposition and Mission Control
records activation of this exact cycle.
