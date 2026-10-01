# POLAR-LOD-EAM-01 — repair execution report

Date: 2026-10-01
Status: `REPAIR_ATTEMPT_RECORDED / SUPERSEDED_BY_REVIEW_FAIL`
Prospective data accessed: `NO`
Prospective execution authority: `NO`

## Execution

The repaired runner was executed in sealed `replay` mode with the reviewed
private 2025 cache and the bundled runtime bound in `EXECUTION_LOCK.json`:

- Python `3.12.14`;
- NumPy `2.3.5`;
- pandas `2.2.3`.

All 365 expected cache files passed byte-count and SHA-256 verification before
parsing. The runner verified every external code, source, manifest, contract
and runtime dependency in the execution lock.

## Structural result

- 359 vintages are fully admissible under the strengthened parser;
- day 108 remains corrupt and unrepaired;
- days 109–113 are now rejected as Issue-Date/P-boundary-conflict backfills;
- the excluded backfills were not selected in the prior historical scoring;
- 344 unique Issue Dates remain admitted;
- all 1,339 scored target rows remain source state `P`.

The prediction and metric CSVs are byte-identical to the independently
reviewed pre-repair outputs:

- `b3_2025_predictions.csv`:
  `19ced79bf121227602587e311204170cbd38fbcab6181660e756d8958e0cc51d`;
- `b3_historical_metrics.csv`:
  `47472398cce09e28214739d66e13a63df6082833b7b5b4078ebd069e7e352a02`.

The historical one-day B3 RMSE remains `0.026479 ms` on 344 paired targets.
This is preserved retrospective diagnostics, not new evidence.

## Negative controls

Eight parser tests passed for valid input, duplicate MJD, non-finite value,
grid disorder, unknown state, second C/P transition, Issue-Date boundary
conflict and physical-range violation.

A plausible isolated mutation of one x3 cache value was rejected before
parsing with a raw-vintage SHA-256 mismatch:

- expected:
  `aa75f743a951effed6ffdbbbfb8416811fbfd1625e2834d08d2f0c03ea70746e`;
- mutated:
  `569da1972b6e94fe4dcde008961d8edbd776b0e6b742c1e1f13da47efbfd0379`.

This closes the demonstrated M1 tamper path in sealed replay mode.

## Disposition

This document is the repair executor's self-report. The subsequent independent
review in `06_INDEPENDENT_REPAIR_REVIEW.md` supersedes its readiness assessment:
M3–M5 are closed, while M1/M2 remain bypassable through a replaceable trust root
and M6 remains a contract without an executable evaluator. The historical UTC
availability gap is preserved explicitly rather than retroactively repaired.
No operational-baseline seal or prospective use is authorized.
