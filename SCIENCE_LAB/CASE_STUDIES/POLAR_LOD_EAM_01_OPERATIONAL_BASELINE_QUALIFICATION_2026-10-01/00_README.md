# POLAR-LOD-EAM-01 — operational baseline qualification

Date: 2026-10-01
Status: `B3_READY_WITH_DECLARED_SOURCE_EXCEPTIONS`
Classification: `HISTORICAL METHOD QUALIFICATION / NO PROSPECTIVE RESULT`

## Purpose

This package closes the GFZ ESMGFZ source-vintage preflight and qualifies the
operational-geophysical comparator `B3` required by `POLAR-LOD-01`. It does not
run the prospective candidate test and creates no Research Result.

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
- on the same dates M2 RMSE is `0.034278 ms`, so B3 is 29.45% lower relative
  to B3.

The last comparison qualifies comparator strength only. It is outcome-known,
retrospective and cannot count toward the future primary decision.

## Package map

- [Source-vintage preflight](01_SOURCE_VINTAGE_PREFLIGHT.md)
- [B3 implementation and historical qualification](02_B3_IMPLEMENTATION_AND_RESULT.md)
- [Machine-readable result](qualification_results.json)
- [Complete 2025 vintage ledger](gfz_2025_vintage_ledger.csv)
- [Historical B3 predictions](b3_2025_predictions.csv)
- [Horizon metrics](b3_historical_metrics.csv)
- [Deterministic runner](eam_vintage_qualification.py)
- [SHA-256 manifest](SHA256_MANIFEST.txt)

## Boundary

Raw GFZ files are not redistributed. The ledger binds their provider URLs,
sizes and hashes. No explicit redistribution licence was inferred from public
access; a future release must re-fetch provider files or separately establish
redistribution authority. This exception does not alter the numeric
qualification but remains a custody/release boundary.
