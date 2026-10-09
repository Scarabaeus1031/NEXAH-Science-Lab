# ACR_EXTERNAL_BLIND_02 — Execution Report

Date: `2026-09-16`

Final decision: `PASS_EXTERNAL_BLIND_REPLICATION_CLEAN`

## What was prospectively frozen

Before acquiring record `101`, the protocol, machine-readable preregistration
and complete runner were frozen together in `PREREGISTRATION_SEAL_SHA256.txt`.
The runner independently verified all three frozen hashes before reading signal
values. The source selection was the next canonical MIT-BIH record after record
`100`; no annotation file or clinical label was acquired.

## Source identity

- PhysioNet MIT-BIH Arrhythmia Database `1.0.0`, record `101`
- header SHA-256: `d5f02fbe8673fa05465442191b98ca0d28a1670e7ef0e83fb9ef8723113a311c`
- signal SHA-256: `698d1ea6f472d23ca50317c72c96cda2698badd8578220ed0380cdf241e39006`
- decoded source metadata: two signals, `360 Hz`, WFDB `212`, `650000`
  frames, orientation keys `MLII` and `V1`, unit `mV`, gain `200` for both

Only the preregistered first `4096` aligned samples of each channel were used.

## Gate results

| Gate | Result | Evidence |
|---|---:|---|
| Seal verification | PASS | all three frozen hashes matched |
| ACR33 metadata and finite-value preflight | PASS | no metadata failures |
| ACR44 coordinate-lift round trip | PASS | max error `1.1102230246251565e-16 mV` vs. `1e-12 mV` limit |
| ACR35 Cartesian-polar round trip | PASS | max error `2.220446049250313e-16 mV` vs. `1e-12 mV` limit |
| ACR43/45 ordered receipt chain | PASS | seven-event chain verified |
| Destruction controls | PASS | all six mutations executed and rejected |
| Deterministic rerun | PASS | both output files were byte-identical |

The executed controls removed the orientation key, introduced a unit mismatch,
shifted Cut B by one sample, set a gain to zero, altered a source hash and
permuted two receipt events. Each produced `REJECT`; none was a static expected
result assertion.

## Reproducibility receipts

- sealed result file SHA-256:
  `b993ab6f5ccdd74ac66c6d3a1a9d7cf373fc782bde4fd43243bdf03abf4c1a56`
- sealed control file SHA-256:
  `c82a5488c1522e93d0ccf003bd6d611cf4174adf430b8954415a5c872fffe6da`
- internal result receipt:
  `3a736a93af5b249a4717b685acc17ac9f39bffce7f3105f69e11c628af45f4ec`

The same two file hashes were obtained immediately after a second execution.

## Interpretation boundary

This is a clean prospective replication of adapter, metadata, mutation-control
and receipt behavior on a second external record. It closes the implementation
gap found in the first record-100 run because all declared negative controls are
now constructed and executed inside the sealed code.

It is still a **record-level replication inside the same MIT-BIH dataset**, not
a cross-dataset replication. The numerical round trips test reversible coordinate
operations; they do not establish channel equivalence, coupling, physiology,
causality, diagnosis, a universal mechanism or profile activation. Descriptive
signal statistics are stored in the result for audit only and did not affect the
decision.

## Next research gate

Keep the current ACR behavior frozen and repeat the same protocol on a genuinely
different publisher/dataset with two declared, aligned measurement channels.
Only that step tests transport beyond the MIT-BIH source family.
