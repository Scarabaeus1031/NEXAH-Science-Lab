# POLAR-LOD-EAM-01 — operational baseline qualification

Date: 2026-10-01
Status: `THIRD_REPAIR_IMPLEMENTED_PENDING_INDEPENDENT_REVIEW / HISTORICAL_METHOD_ONLY`
Classification: `HISTORICAL METHOD QUALIFICATION / NO PROSPECTIVE RESULT`

## Purpose

This package records the GFZ ESMGFZ historical source-vintage preflight and a
bounded qualification of the `B3` method required by `POLAR-LOD-01`. The
independent adversarial review supersedes the runner's package-local READY
label. The first repair closed M3–M5, while the independent repair review found
the M1/M2 trust root replaceable and M6 non-executable. The second repair
closed the trust-root and runtime findings but its review exposed a joint
M2/B3 missingness bypass. The third repair now binds an independent expected
target population and closes that path, pending independent acceptance. B3 is
therefore not yet a sealed
operational comparator. This package does not run the prospective candidate
test and creates no Research Result.

## Disposition

- all 365 named 2025 daily archive files were retrieved and are now enforced
  against a sealed byte-count/SHA-256 ledger before parsing;
- 359 files pass the strengthened structural rules; day 108 is corrupt and
  days 109–113 are rejected as Issue-Date/P-boundary-conflict backfills;
- the archive contains 344 unique valid Issue Dates after deterministic
  deduplication, or 94.2% calendar coverage;
- all accepted forecast targets are marked `P` by the source;
- the bound conversion is
  `LOD_hat(t+h) = 86400 * EAM90_x3(issue,t+h) + IERS_RG_ZONT2_DLOD(t+h)`;
- historical one-day B3 RMSE is `0.026479 ms` on 344 paired 2025 targets;
- on the same dates M2 RMSE is `0.034278 ms`; B3 is 22.75% lower relative to
  M2, equivalently M2 is 29.45% higher relative to B3;
- an independent clean replay reproduced the committed CSV outputs
  byte-for-byte and confirmed the sign, units and exact-date pairing;
- M1–M5 are closed; the third repair implements the remaining M6 population-
  custody control, pending another independent review before a B3 seal.

The last comparison qualifies comparator strength only. It is outcome-known,
retrospective and cannot count toward the future primary decision.

## Package map

- [Source-vintage preflight](01_SOURCE_VINTAGE_PREFLIGHT.md)
- [B3 implementation and historical qualification](02_B3_IMPLEMENTATION_AND_RESULT.md)
- [Independent adversarial review](03_INDEPENDENT_ADVERSARIAL_REVIEW.md)
- [Repair and pre-output lock](04_REPAIR_AND_PREOUTPUT_LOCK.md)
- [Repair execution report](05_REPAIR_EXECUTION_REPORT.md)
- [Independent repair review](06_INDEPENDENT_REPAIR_REVIEW.md)
- [Second repair execution report](07_SECOND_REPAIR_EXECUTION_REPORT.md)
- [Independent second-repair review](08_SECOND_REPAIR_INDEPENDENT_REVIEW.md)
- [Third repair execution report](09_THIRD_REPAIR_EXECUTION_REPORT.md)
- [Canonical sealed-replay trust root](SEALED_REPLAY_TRUST_ROOT.json)
- [Runtime receipt](RUNTIME_ENVIRONMENT.json)
- [Hash-locked runtime dependencies](requirements-macos-arm64.lock)
- [Sealed replay entrypoint](run_sealed_replay.py)
- [Execution dependency lock](EXECUTION_LOCK.json)
- [Expected raw-vintage ledger](EXPECTED_RAW_VINTAGE_LEDGER.csv)
- [Machine-readable result](qualification_results.json)
- [Complete 2025 vintage ledger](gfz_2025_vintage_ledger.csv)
- [Historical B3 predictions](b3_2025_predictions.csv)
- [Horizon metrics](b3_historical_metrics.csv)
- [Deterministic runner](eam_vintage_qualification.py)
- [SHA-256 manifest](SHA256_MANIFEST.txt)

## Boundary

Raw GFZ files are not redistributed. Sealed replay now enforces their URLs,
sizes and hashes and binds external dependencies and runtime. Structural
admission is fail closed, retrospective criteria are separated from evidence,
and the future operational-relevance rule is frozen. Historical UTC
availability at forecast origin remains unprovable and is explicitly labelled;
future use requires append-only first-seen receipts. No explicit redistribution
licence was inferred from public access. The third repair adds fail-closed
expected-population custody to the commit-bound trust root, reproducible
runtime and executable M6 evaluator; independent re-review remains mandatory.
