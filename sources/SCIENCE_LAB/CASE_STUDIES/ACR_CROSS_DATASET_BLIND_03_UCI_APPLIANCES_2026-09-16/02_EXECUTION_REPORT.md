# ACR_CROSS_DATASET_BLIND_03 — Execution Report

Date: `2026-09-16`

Final decision: `PASS_CROSS_DATASET_BLIND_REPLICATION`

## Prospective boundary

The protocol, preregistration and complete runner were sealed before the UCI
archive was downloaded. Source selection and the two cuts came from official
metadata only: `T1` is kitchen temperature and `T2` is living-room temperature,
both in Celsius. The first 4096 data rows were frozen without value inspection.

This source differs from the previous tests in publisher, dataset, domain and
file format: UCI building-sensor CSV rather than PhysioNet ECG/WFDB.

## Source identity

- UCI Appliances Energy Prediction, DOI `10.24432/C5VC8G`, CC BY 4.0
- archive SHA-256: `2fccf354445d886e7917620b0195db1f3e3e34d5a067a93b844694a4c561255a`
- CSV member SHA-256: `2820bf712ad0275cb18b85a05250926100d8e65ebb9f4d2d016ca91ea152a25d`
- observed data rows: `19735`, exactly as preregistered
- selected cadence: exactly `600 s`, no failure in the frozen segment

## Gate results

| Gate | Result | Evidence |
|---|---:|---|
| Seal verification | PASS | protocol, JSON and runner hashes matched |
| ACR33 schema/orientation/unit/alignment/cadence preflight | PASS | no failure; all selected values finite |
| ACR44 coordinate-lift round trip | PASS | max error `3.552713678800501e-15 C` vs. `1e-12 C` limit |
| ACR35 Cartesian-polar round trip | PASS | max error `7.105427357601002e-15 C` vs. `1e-12 C` limit |
| ACR43/45 ordered receipt chain | PASS | seven-event chain verified |
| Destruction controls | PASS | all six mutations executed and rejected |
| Deterministic rerun | PASS | result and control files byte-identical |

The executed mutations removed orientation keys, introduced a Celsius/Kelvin
unit mismatch without conversion, shifted Cut B by one row, duplicated a Cut-B
timestamp, altered the source hash and permuted two receipt events.

## Reproducibility receipts

- result file SHA-256:
  `f56b8dc492b630c790b3952b0e0d5b6c505c5a9f59b4ab94b1fc73a4f7826c7b`
- controls file SHA-256:
  `2482bc16cc667dab1e553d07ad3ae8356a5161a38c3de55e338bf4f4cb375b71`
- internal result receipt:
  `615c07c98e018d25db423bfb8f77062759ec60a90a449589713a6d918cb454b3`
- internal control receipt:
  `cb08b6ab2604eeb98685085bc2309d4911ecf8af96d36b4698b21afa58af59a6`

Both file hashes remained identical after immediate re-execution.

## Bounded interpretation

This is evidence that the current ACR contract transports across two materially
different source families when orientation, units, alignment, cadence and
receipt identity are explicit. It is stronger adapter evidence than another
record from the same dataset.

The observed zero-lag Pearson correlation (`0.986129724421883`) is descriptive
only. It was not used for source or channel selection and was not part of the
pass decision. It does not establish equivalence, coupling, causality, building
physics, energy prediction or a universal mechanism. The passed round trips are
expected properties of the specified reversible coordinate operations.

No profile was activated and no scientific claim was promoted.

## Next gate

Promote this result to Mission Control as a passed cross-dataset adapter gate,
while keeping theory/physics claims unchanged. The next empirical escalation
should test a preregistered nontrivial prediction or discrimination target,
rather than another reversible coordinate identity.
