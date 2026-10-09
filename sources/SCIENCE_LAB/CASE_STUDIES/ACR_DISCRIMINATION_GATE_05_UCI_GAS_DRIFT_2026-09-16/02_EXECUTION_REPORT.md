# Execution report — ACR_DISCRIMINATION_GATE_05

**Decision: `FAIL_DISCRIMINATION_GATE` (valid empirical negative)**

Execution date: 2026-09-16  
Dataset: UCI *Gas Sensor Array Drift at Different Concentrations* (ID 270, DOI `10.24432/C5MK6M`)  
Official record: <https://archive.ics.uci.edu/dataset/270/gas%2Bsensor%2Barray%2Bdrift%2Bdataset%2Bat%2Bdifferent%2Bconcentrations>

## What was tested

The protocol and runner were frozen and SHA-256 sealed before the measurement archive was acquired.

- Train: batches 1–8, 9,840 rows
- Guard: batch 9, 470 rows, not used by either model
- Blind test: batch 10, 3,600 rows, exactly 600 per gas class
- P1: Sensor 1, source features 1–8
- P2: Sensor 1+2, source features 1–16
- Same frozen learner for both: training-standardized nearest centroid
- Metric: six-class macro balanced accuracy

## Result

| Quantity | Frozen result |
|---|---:|
| P1 balanced accuracy | 0.431389 |
| P2 balanced accuracy | 0.342222 |
| P2 − P1 | −0.089167 |
| Paired class-stratified bootstrap 95% interval | [−0.106667, −0.071667] |
| Required P2 accuracy | ≥ 0.50 |
| Required P2 − P1 | ≥ +0.03 |
| Required lower interval bound | > 0 |

P2 missed all three frozen empirical criteria. Its measured accuracy was 8.92 percentage points below P1, and the entire paired interval was negative.

Per-class recall is reported by the numeric source code. The gas-name mapping stated on the UCI page is inconsistent with the per-class counts in the downloaded batch files (for example, the archive's batch 1 codes contain 90, 98, 83, 30, 70 and 74 rows for codes 1–6, while the published table assigns those counts to a different gas order). This metadata discrepancy does not affect the six-class score, but it prevents a defensible gas-name assignment without an additional authoritative reconciliation.

| Source class | P1 | P2 |
|---|---:|---:|
| 1 | 0.3400 | 0.2600 |
| 2 | 0.3583 | 0.3633 |
| 3 | 0.7400 | 0.3167 |
| 4 | 0.1933 | 0.3600 |
| 5 | 0.6883 | 0.7533 |
| 6 | 0.2683 | 0.0000 |

The second sensor helped source classes 2, 4 and 5, but harmed the others enough to reduce the balanced total. In particular, the frozen P2 model classified none of the month-36 class-6 observations correctly.

## Integrity and reproducibility

- 13 / 13 integrity and destruction controls passed.
- The official archive contained the expected 13,910 rows, ten batch files and 128 features.
- Source archive SHA-256: `98fe3a30981a222dd4518fbcc3dddd45d5c0ce9b03ef6dc6fe5cf7a04cfbff5e`
- Result file SHA-256: `9812956efae971b744227b3538ae05940a218a4e9c5f081b8f7853d5cc646ae4`
- Control file SHA-256: `4abbb2f336734e8e4a9b319abe23304962fb4af8564b0bedbd3936f8c5fa5dd8`
- A complete rerun produced byte-identical result and control files.

## Meaning for NEXAH

This is evidence against the tested raw two-cut concatenation rule under long-term sensor drift. It shows that an additional cut is not automatically useful: the binder must handle cut reliability, drift and geometry rather than merely append channels.

This result does **not** show that Sensor 2 is intrinsically useless, that all two-cut binders fail, or that the NEXAH runtime adapter failed. The adapter executed the prospective contract correctly; the empirical hypothesis failed.

The appropriate next research move is a new, separately preregistered drift-aware discrimination hypothesis (for example, training-only reliability weighting or invariant contrast features) on a genuinely untouched test target. Batch 10 must not be reused as a blind confirmation set.

## Claim boundary

No theory or physics claim is promoted. There is no causal chemistry, universal coupling, HZ/FZ physics, profile activation or product claim in this result.
