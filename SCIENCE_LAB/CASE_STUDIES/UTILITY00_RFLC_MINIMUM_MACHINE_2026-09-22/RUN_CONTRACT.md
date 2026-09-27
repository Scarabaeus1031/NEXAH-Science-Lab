# Science Lab Run Contract — NEXAH-UTILITY-01 U1

```yaml
RECORD_ID: NEXAH-UTILITY-01-U1-MINIMUM-MACHINE-V1
PURPOSE: REPLAY
SOURCE_REPOSITORY: /Users/tho2020/Documents/NEXAH ECOSYSTEM/30 SCIENCE LAB/NEXAH-Science-Lab
SOURCE_REVISION: RECORDED_BY_SHA256_MANIFEST_AND_SCIENCE_LAB_COMMIT
ENTRYPOINT: run_u1_smoke.py
WORKING_DIRECTORY: SCIENCE_LAB/CASE_STUDIES/UTILITY00_RFLC_MINIMUM_MACHINE_2026-09-22
ENVIRONMENT_SPEC: macOS; offline; pinned Core checkout; bundled Codex Python runtime 26.909.61513
RUNTIME_VERSION: Python 3 from /Users/tho2020/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3
DEPENDENCIES: Python standard library plus bundled numpy; frozen NEXAH Core source at ead4223a9bea103ad2266fc3b71b433974de37dd; no network
INPUTS: fixtures/development_inputs.jsonl; labels stored separately in fixtures/development_ground_truth.jsonl
DATA_ACCESS: local committed development fixtures only; evaluation and replay are not materialized in U1
LICENSE_AND_PRIVACY: repository-local generated fixtures derived from committed NEXAH Core evidence; no personal data
COMMAND: python3 -B run_u1_smoke.py --core-root "/Users/tho2020/Documents/NEXAH ECOSYSTEM/10 NEXAH CORE/NEXAH" --fixtures fixtures --out results/u1_smoke_result.json
EXPECTED_OUTPUTS: results/u1_smoke_result.json with A_U1_MINIMUM_MACHINE_EXISTS and no utility calculation
EXPECTED_HASHES_OR_TOLERANCES: SHA256_MANIFEST.txt; exact semantic-result hashes on immediate replay; Core tolerance remains 1e-12
RESOURCE_BOUNDS: 30 seconds, 4 GiB peak RSS and 5 MiB result bytes per instance; smoke captures rather than compares costs
NETWORK_REQUIRED: false
FILESYSTEM_SIDE_EFFECTS: overwrites only the declared fixture/result files when replay commands are explicitly run
FAILURE_SEMANTICS: missing input -> ABSTAIN; ambiguity -> UNKNOWN or ABSTAIN; contract/integrity mismatch -> DEFECT; runtime failure -> nonzero exit
SCIENTIFIC_CLAIM_BOUNDARY: MACHINE_EXISTENCE_ONLY_NO_INCREMENTAL_UTILITY_OR_SCIENTIFIC_CLAIM
RESULT_REPORT: U1_VALIDATION_REPORT.md
ISSUE_ROUTE: Human Owner; stop on Core revision drift, seal violation, unequal input, or schema failure
OWNER: Human Owner
LAST_VERIFIED: 2026-09-22
```

The system `python3` on this host lacks dependencies used by the broad NEXAH
package front door. The declared bundled runtime is therefore part of this
replay contract. The NEXAH adapter imports only the frozen verifier module and
its direct typed dependencies; no Core file is changed.
