# POLAR-LOD-EAM-01 — operational baseline qualification

Date: 2026-10-01
Status: `CONDITIONAL_PASS / HISTORICAL_METHOD_QUALIFICATION_ONLY`
Classification: `HISTORICAL METHOD QUALIFICATION / NO PROSPECTIVE RESULT`

## Purpose

This package records the GFZ ESMGFZ historical source-vintage preflight and a
bounded qualification of the `B3` method required by `POLAR-LOD-01`. The
independent adversarial review supersedes the runner's package-local READY
label: the historical diagnostic is supported, but B3 is not yet a sealed
operational comparator. This package does not run the prospective candidate
test and creates no Research Result.

## Disposition

- all 365 named 2025 daily archive files were retrieved and SHA-256 ledgered;
- 364 files are structurally usable; day-of-year 108 is physically and
  structurally invalid and was rejected without repair;
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
- six major integrity and protocol findings remain open before B3 can be
  sealed for prospective operational-relevance use.

The last comparison qualifies comparator strength only. It is outcome-known,
retrospective and cannot count toward the future primary decision.

## Package map

- [Source-vintage preflight](01_SOURCE_VINTAGE_PREFLIGHT.md)
- [B3 implementation and historical qualification](02_B3_IMPLEMENTATION_AND_RESULT.md)
- [Independent adversarial review](03_INDEPENDENT_ADVERSARIAL_REVIEW.md)
- [Machine-readable result](qualification_results.json)
- [Complete 2025 vintage ledger](gfz_2025_vintage_ledger.csv)
- [Historical B3 predictions](b3_2025_predictions.csv)
- [Horizon metrics](b3_historical_metrics.csv)
- [Deterministic runner](eam_vintage_qualification.py)
- [SHA-256 manifest](SHA256_MANIFEST.txt)

## Boundary

Raw GFZ files are not redistributed. The current ledger records their provider
URLs, sizes and hashes, but the runner does not yet enforce that ledger on
replay. It also does not fully bind external dependencies, prove UTC
availability at forecast origin, fail closed on every structural predicate, or
carry independently preregistered readiness and operational-relevance rules.
No explicit redistribution licence was inferred from public access. These six
major findings do not overturn the bounded historical diagnostic; they block a
sealed operational-baseline claim and must be closed by a separate repair and
re-review before prospective use.
