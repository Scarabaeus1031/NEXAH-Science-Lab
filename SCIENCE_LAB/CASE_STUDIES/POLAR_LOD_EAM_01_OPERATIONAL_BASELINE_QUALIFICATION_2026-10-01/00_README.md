# POLAR-LOD-EAM-01 — operational baseline qualification

Date: 2026-10-01
Status: `REPAIR_REVIEW_FAIL / M1_M2_M6_OPEN / HISTORICAL_METHOD_ONLY`
Classification: `HISTORICAL METHOD QUALIFICATION / NO PROSPECTIVE RESULT`

## Purpose

This package records the GFZ ESMGFZ historical source-vintage preflight and a
bounded qualification of the `B3` method required by `POLAR-LOD-01`. The
independent adversarial review supersedes the runner's package-local READY
label. The first repair closes M3–M5, but the independent repair review found
that the M1/M2 trust root can still be replaced by caller-selected ledger and
lock files and that M6 is not executable. B3 is therefore not a sealed
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
- M3–M5 are closed; M1/M2 and M6 require a second repair and another
  independent review before a B3 operational seal.

The last comparison qualifies comparator strength only. It is outcome-known,
retrospective and cannot count toward the future primary decision.

## Package map

- [Source-vintage preflight](01_SOURCE_VINTAGE_PREFLIGHT.md)
- [B3 implementation and historical qualification](02_B3_IMPLEMENTATION_AND_RESULT.md)
- [Independent adversarial review](03_INDEPENDENT_ADVERSARIAL_REVIEW.md)
- [Repair and pre-output lock](04_REPAIR_AND_PREOUTPUT_LOCK.md)
- [Repair execution report](05_REPAIR_EXECUTION_REPORT.md)
- [Independent repair review](06_INDEPENDENT_REPAIR_REVIEW.md)
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
licence was inferred from public access. A second repair must establish an
external immutable trust root, a reproducibly provisioned runtime and an
executable M6 evaluator before another independent review.
