# H_Q_RECORD_01 execution log

## Attempt 1 — pre-result path failure

Date: `2026-09-29`

Status: `NO_SCIENTIFIC_RESULT / FAIL-CLOSED BEFORE SOURCE VERIFICATION`

The runner resolved the repository root as `PACKAGE.parents[3]`. For this
package layout the correct repository root is `PACKAGE.parents[2]`. The first
source hash lookup therefore raised `FileNotFoundError` before any phase record,
metric or result file was produced.

Repair: change only the repository-root index from `3` to `2`. No frozen input,
period, gate, metric, tolerance, control or decision rule changed.

## Attempt 2 — reporting-completeness repair

Date: `2026-09-29`

Status: `TECHNICAL_RESULT PRODUCED / SUPERSEDED BEFORE CLOSEOUT`

Attempt 2 passed `8/8` checks and two clean reruns were byte-identical. The
result JSON reported the 40-cell count and all aggregate metrics, but omitted
the already computed per-gate phase rows required by the frozen output list.

Repair: serialize the existing `canonical_rows` as `record.phase_register`.
No calculation, input, control, threshold, metric or decision rule changed.
Attempt 2 result SHA-256 was
`22baf35d808feb39dedccb2750877dbcf7b6b14d7d59a43d199636e80b747daa`.

## Final execution

Date: `2026-09-29`

Status:
`PASS_SOURCE_BOUND_RECORD_RECONSTRUCTION__PRIMARY_EFFECT_NOT_EVALUABLE_OPERATOR_ABSENT`

- checks: `8/8 PASS`;
- complete phase register: `40/40` unique cells;
- two clean replays: byte-identical;
- final result SHA-256:
  `79d767e7d4df682a663c09a87af6f46f185c9894c16763eca4c2a53bb1433480`;
- implementation SHA-256:
  `38371cf9a5c7b06279f2567ad6f093974fd41d896558d3100cec041695a63958`.
