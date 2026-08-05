# Calibration and Device Qualification

Status: `DRAFT — THRESHOLDS UNASSIGNED`

Nominal resolution is not measured accuracy. Before Human acquisition, qualify
spatial accuracy, repeatability, latency, timestamp jitter, clock drift,
packet coalescing, sampling irregularity, contact behavior and hidden smoothing.

Calibration requires repeated grid observations covering corners, edges and
interior; separate fitting and held-out points; an independent physical scale
check; pre/post-run checks; and drift assessment without refitting a completed
run. Exact grid, repetitions and tolerances remain Owner decisions.

The error budget includes reference-target uncertainty, device accuracy and
precision, fit uncertainty, held-out error, drift, timing/interpolation and
serialization. QC and metric thresholds require an explicit relationship to
this budget.

Missing qualification, held-out validation, scale check, post-run check, error
budget or approved limits sets the run to `BLOCKED`.

```text
DEVICE: UNASSIGNED
DEVICE_QUALIFICATION: MISSING
CALIBRATION_GRID: OWNER DECISION PENDING
ERROR_BUDGET: MISSING
HUMAN_ACQUISITION: BLOCKED
```
