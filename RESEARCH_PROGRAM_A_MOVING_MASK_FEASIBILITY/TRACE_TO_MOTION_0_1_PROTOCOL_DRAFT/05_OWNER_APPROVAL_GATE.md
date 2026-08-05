# Owner Approval Gate

Status: `OPEN — PROTOCOL REMAINS DRAFT`

Every choice below is proposed and frozen inside the draft. None is accepted
for Human-data acquisition until Thomas explicitly approves it.

## Scientific choices requiring approval

| ID | Proposed choice | Current state |
|---|---|---|
| O-01 | bounded question: planar trajectory → direction-free trace → masked reconstruction | `OWNER APPROVAL REQUIRED` |
| O-02 | exactly six geometries and twelve F/R samples | `OWNER APPROVAL REQUIRED` |
| O-03 | formulas and diagnostic roles for P01–P06 | `OWNER APPROVAL REQUIRED` |
| O-04 | fixed acquisition order | `OWNER APPROVAL REQUIRED` |
| O-05 | `200 x 200 mm` right-handed coordinate frame | `OWNER APPROVAL REQUIRED` |
| O-06 | device minimums: `>=120 Hz`, `<=1 ms`, `<=0.10 mm` resolution | `OWNER APPROVAL REQUIRED` |
| O-07 | affine four-fiducial calibration and `0.25/0.50 mm` limits | `OWNER APPROVAL REQUIRED` |
| O-08 | sample duration, timestamp-gap and one-replacement rules | `OWNER APPROVAL REQUIRED` |
| O-09 | template-adherence QC thresholds | `OWNER APPROVAL REQUIRED` |
| O-10 | normalization to `1001` uniform-time samples without smoothing | `OWNER APPROVAL REQUIRED` |
| O-11 | direction-free arc-length trace canonicalization, `2.0 mm` closure rule and deterministic `2000 x 2000` PGM rendering | `OWNER APPROVAL REQUIRED` |
| O-12 | opaque UUID identity and sealed F/R mapping | `OWNER APPROVAL REQUIRED` |
| O-13 | `40 mm` static and moving vertical strips | `OWNER APPROVAL REQUIRED` |
| O-14 | moving center `20+55 tau mm`; per-sample static center selected by the frozen exact-match rule | `OWNER APPROVAL REQUIRED` |
| O-15 | masked spatiotemporal area exactly `0.20` for both masks | `OWNER APPROVAL REQUIRED` |
| O-16 | exact per-sample equality of masked sample count; temporal/geometric arrangement deliberately differs | `OWNER APPROVAL REQUIRED` |
| O-17 | coordinate-wise linear interpolation as the sole baseline | `OWNER APPROVAL REQUIRED` |
| O-18 | segmentation markers and window rules | `OWNER APPROVAL REQUIRED` |
| O-19 | identity registration for scoring; rigid fit restricted to QC | `OWNER APPROVAL REQUIRED` |
| O-20 | representation, reconstruction and pair metrics | `OWNER APPROVAL REQUIRED` |
| O-21 | all numerical tolerances, four-of-six pair rule and terminal result rules | `OWNER APPROVAL REQUIRED` |
| O-22 | no significance test or population inference | `OWNER APPROVAL REQUIRED` |
| O-23 | CSV/JSON schemas, decimal precision, UUID filenames and SHA-256 manifest | `OWNER APPROVAL REQUIRED` |
| O-24 | leakage checks, negative controls and BLOCKED conditions | `OWNER APPROVAL REQUIRED` |
| O-25 | one adult Human participant produces all twelve samples; identity remains `UNASSIGNED`; no population inference | `OWNER APPROVAL REQUIRED` |
| O-26 | consent, privacy, retention and deletion rules must be approved before acquisition | `OWNER APPROVAL REQUIRED` |
| O-27 | scientific owner, data owner, acquisition operator, analysis operator and independent reviewer assignments | `OWNER APPROVAL REQUIRED` |
| O-28 | repository identity, implementation hash and replay location | `OWNER APPROVAL REQUIRED` |

## Required external checks before approval can become executable

- independent protocol review completed;
- applicable Human-data ethics and privacy requirements identified;
- actual device confirmed against the minimum contract;
- acquisition and analysis implementations independently verified;
- protocol snapshot and hashes frozen;
- roles assigned without reviewer conflict;
- explicit separate Owner authorization for acquisition.

## Current decision

```text
PROTOCOL_STATUS: DRAFT
OWNER_APPROVAL: PENDING
INDEPENDENT_REVIEW: PENDING
HUMAN_DATA_AUTHORIZED: NO
EXECUTION_AUTHORIZED: NO
SCIENTIFIC_RESULT: NONE
```

## Next permitted action

Independent review of the draft, followed by Owner acceptance, revision or
rejection of O-01 through O-28. Acquisition remains prohibited.
