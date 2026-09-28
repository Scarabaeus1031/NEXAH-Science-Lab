# NEXAH Compare v0.1 — Deterministic Comparison Report

- Comparison: `CMP-WP5-FAMILY-OFFICE-REFINANCING-ADVISORY-01`
- Case: `CASE-WP5-FAMILY-OFFICE-REFINANCING`
- Reference analysis: `AN-WP5-FAMILY-OFFICE-REFERENCE`
- Canonical comparison SHA-256: `f1b04ad6b9b2ae517e725f85eb5f32598753eca5b6f7577b8576e01af80bb157`
- Status: `MACHINE_COMPARISON_ONLY / HUMAN_RETURN_REQUIRED`

## Classification counts

| Invariant | Lost | Added | Unavailable |
|---:|---:|---:|---:|
| 1 | 0 | 0 | 5 |

## Relations

| Relation | Classification | Reason | Criterion | Members |
|---|---|---|---|---|
| REL-WP5-FAMILY-OFFICE-REFINANCING-0001 | UNAVAILABLE | FORMULA\_MISMATCH | Total debt at the four-year horizon must incorporate four annual amortization periods | AN-WP5-FAMILY-OFFICE-REFERENCE:CLM-WP5-REFERENCE-0002:REFERENCE; AN-WP5-FAMILY-OFFICE-CANDIDATE:CLM-WP5-CANDIDATE-0002:COUNTERPART |
| REL-WP5-FAMILY-OFFICE-REFINANCING-0002 | UNAVAILABLE | FORMULA\_MISMATCH | Apply the new rate only to the refinanced principal and retain the declared legacy-rate remainder | AN-WP5-FAMILY-OFFICE-REFERENCE:CLM-WP5-REFERENCE-0003:REFERENCE; AN-WP5-FAMILY-OFFICE-CANDIDATE:CLM-WP5-CANDIDATE-0003:COUNTERPART |
| REL-WP5-FAMILY-OFFICE-REFINANCING-0003 | UNAVAILABLE | EVIDENCE\_MISSING | Do not treat reported liquidity as freely deployable while its reconciliation is unavailable | AN-WP5-FAMILY-OFFICE-REFERENCE:CLM-WP5-REFERENCE-0004:REFERENCE; AN-WP5-FAMILY-OFFICE-CANDIDATE:CLM-WP5-CANDIDATE-0004:COUNTERPART |
| REL-WP5-FAMILY-OFFICE-REFINANCING-0004 | UNAVAILABLE | DOMAIN\_INCOMPATIBLE | Separate an unavailable absolute operating-cost-base calculation from a declared operating-surplus shock | AN-WP5-FAMILY-OFFICE-REFERENCE:CLM-WP5-REFERENCE-0005:REFERENCE; AN-WP5-FAMILY-OFFICE-CANDIDATE:CLM-WP5-CANDIDATE-0005:COUNTERPART |
| REL-WP5-FAMILY-OFFICE-REFINANCING-0005 | UNAVAILABLE | EVIDENCE\_MISSING | Abstain from an immediate reserve-asset sale recommendation until tax and cross-collateral evidence is resolved | AN-WP5-FAMILY-OFFICE-REFERENCE:CLM-WP5-REFERENCE-0006:REFERENCE; AN-WP5-FAMILY-OFFICE-CANDIDATE:CLM-WP5-CANDIDATE-0006:COUNTERPART |
| REL-WP5-FAMILY-OFFICE-REFINANCING-0006 | INVARIANT | MATERIAL\_EQUIVALENCE | Confirm the shared four-year refinanced principal calculation | AN-WP5-FAMILY-OFFICE-REFERENCE:CLM-WP5-REFERENCE-0001:REFERENCE; AN-WP5-FAMILY-OFFICE-CANDIDATE:CLM-WP5-CANDIDATE-0001:COUNTERPART |

## Calculation checks

| Check | Status | Reason | Claims | Detail |
|---|---|---|---|---|
| CHK-WP5-FAMILY-OFFICE-REFINANCING-0001 | MISMATCH | FORMULA\_MISMATCH | CLM-WP5-CANDIDATE-0002, CLM-WP5-REFERENCE-0002 | Declared formulas differ |
| CHK-WP5-FAMILY-OFFICE-REFINANCING-0002 | MISMATCH | FORMULA\_MISMATCH | CLM-WP5-CANDIDATE-0003, CLM-WP5-REFERENCE-0003 | Declared formulas differ |
| CHK-WP5-FAMILY-OFFICE-REFINANCING-0003 | MATCH | FORMULA\_MATCH | CLM-WP5-CANDIDATE-0001, CLM-WP5-REFERENCE-0001 | Formula, operands, result, unit and time basis match exactly |

## Residuals

| Residual | Relation | Severity | Reason | Gate | Expected | Observed |
|---|---|---|---|---|---|---|
| RES-WP5-FAMILY-OFFICE-REFINANCING-0001 | REL-WP5-FAMILY-OFFICE-REFINANCING-0001 | CRITICAL | FORMULA\_MISMATCH | ABSTAIN | Total debt at the four-year horizon must incorporate four annual amortization periods | Declared formulas differ |
| RES-WP5-FAMILY-OFFICE-REFINANCING-0002 | REL-WP5-FAMILY-OFFICE-REFINANCING-0002 | CRITICAL | FORMULA\_MISMATCH | ABSTAIN | Apply the new rate only to the refinanced principal and retain the declared legacy-rate remainder | Declared formulas differ |
| RES-WP5-FAMILY-OFFICE-REFINANCING-0003 | REL-WP5-FAMILY-OFFICE-REFINANCING-0003 | MATERIAL | EVIDENCE\_MISSING | ABSTAIN | Do not treat reported liquidity as freely deployable while its reconciliation is unavailable | Evidence status or coverage differs |
| RES-WP5-FAMILY-OFFICE-REFINANCING-0004 | REL-WP5-FAMILY-OFFICE-REFINANCING-0004 | MATERIAL | DOMAIN\_INCOMPATIBLE | ABSTAIN | Separate an unavailable absolute operating-cost-base calculation from a declared operating-surplus shock | Claim kinds differ |
| RES-WP5-FAMILY-OFFICE-REFINANCING-0005 | REL-WP5-FAMILY-OFFICE-REFINANCING-0005 | MATERIAL | EVIDENCE\_MISSING | ABSTAIN | Abstain from an immediate reserve-asset sale recommendation until tax and cross-collateral evidence is resolved | Evidence status or coverage differs |

## Abstentions

- `REL-WP5-FAMILY-OFFICE-REFINANCING-0001` — `UNSUPPORTED\_OPERATION` — Comparison abstains for WP5-D01-FOUR-YEAR-DEBT-TIMELINE: Declared formulas differ
- `REL-WP5-FAMILY-OFFICE-REFINANCING-0002` — `UNSUPPORTED\_OPERATION` — Comparison abstains for WP5-D02-NEW-RATE-SCOPE: Declared formulas differ
- `REL-WP5-FAMILY-OFFICE-REFINANCING-0003` — `INSUFFICIENT\_EVIDENCE` — Comparison abstains for WP5-D03-FREE-LIQUIDITY-EVIDENCE: Evidence status or coverage differs
- `REL-WP5-FAMILY-OFFICE-REFINANCING-0004` — `UNSUPPORTED\_OPERATION` — Comparison abstains for WP5-D04-COST-STRESS-OPERATION: Claim kinds differ
- `REL-WP5-FAMILY-OFFICE-REFINANCING-0005` — `INSUFFICIENT\_EVIDENCE` — Comparison abstains for WP5-D05-RESERVE-ASSET-DECISION-BOUNDARY: Evidence status or coverage differs

## Claim ceiling

`DECLARED\_CONFIRMED\_RECORD\_COMPARISON\_ONLY\_NO\_TRUTH\_CORRECTNESS\_COMPLETENESS\_SAFETY\_SUITABILITY\_CAUSALITY\_RECOMMENDATION\_BUSINESS\_SUCCESS\_OR\_PRODUCT\_MARKET\_FIT\_CLAIM`

This report is a faithful projection of the canonical ComparisonRecord. It adds no recommendation, truth ranking or decision. A separate Human Return is required.
