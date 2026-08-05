# Synthetic Validation Plan

Status: `SELF-CONFORMANCE ONLY — NOT INDEPENDENT — NOT A SCIENTIFIC RESULT`

Run `python3 dry_run/validate_protocol.py`. It writes only
`dry_run/DRY_RUN_REPORT.json` and collects no Human data.

Fixture groups cover analytic paths and exact reversals, deterministic noise,
irregular timestamps, held-out calibration distortion and drift, malformed
schemas, bounded/unbounded gaps, common-support states, topology changes,
metadata leakage, hashes and deterministic PGM rendering/parsing.

`dry_run/FIXTURE_SHA256SUMS` freezes the external JSON fixture contracts. The
report records the validator hash separately.

The validator and fixtures share one implementation lineage. Therefore:

```text
INDEPENDENT_VALIDATION: PENDING
SCIENTIFIC_RESULT: NONE
```

Valid self-test outcomes are `PASS_SELF_CONFORMANCE`, `FAIL` and `ERROR`. No
outcome authorizes acquisition.
