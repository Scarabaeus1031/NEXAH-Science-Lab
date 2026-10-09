# Gate 05 post-hoc drift diagnostic and forward plan

Status: `POSTHOC_EXPLORATORY_NOT_BLIND_NOT_CONFIRMATORY`

This analysis was performed only after the sealed Gate 05 result was known. It may generate a future hypothesis. It cannot rescue, confirm or replace the failed discrimination gate.

## What the diagnostic found

### 1. Sensor 2 carries separation and instability

In the training batches, Sensor 2 produced greater median class-centroid separation than Sensor 1:

| Training quantity | Sensor 1 | Sensor 2 |
|---|---:|---:|
| Minimum centroid distance | 0.0425 | 0.0630 |
| Median centroid distance | 1.2328 | 1.8870 |
| Maximum centroid distance | 3.9825 | 4.8848 |

That apparent benefit did not transport cleanly. Mean class-conditional shift, expressed in training standard deviations, was larger for Sensor 2:

| Evaluation batch | Sensor 1 | Sensor 2 |
|---|---:|---:|
| Batch 9 | 0.3312 | 0.5159 |
| Batch 10 | 0.2497 | 0.4724 |

Sensor 2 therefore offered a sharper training geometry but a less stable future geometry under this representation.

### 2. The loss was systematic, not one or two random cases

On Batch 10:

- P1 was correct while P2 was wrong for 766 observations.
- P2 was correct while P1 was wrong for 445 observations.
- both were correct for 787 observations;
- both were wrong for 1,602 observations.

The net loss of 321 correct decisions matches the 8.92-percentage-point deterioration over 3,600 observations.

### 3. A single global Sensor-2 weight is insufficient

An exploratory weight screen applied weights from 0 to 1 to the standardized Sensor-2 block. Batch 9 selected weight 0.5, but its own balanced accuracy was only 27.24%. Applying that already outcome-generated choice retrospectively to Batch 10 produced 40.97%, still below the 43.14% Sensor-1 baseline.

This screen is not a model result. It rejects the simplest follow-up idea: one scalar cannot reliably distinguish useful Sensor-2 directions from drifting ones.

### 4. Source metadata needs its own admission check

The downloaded files have stable numeric class codes, but their observed per-code batch counts conflict with the gas-name order stated in UCI's descriptive page. The primary six-class metric is invariant to label names, so Gate 05's decision is unchanged. Gas-specific interpretation is not allowed until the code-to-gas mapping is reconciled from an authoritative source.

## Feedback for NEXAH

The adapter layer behaved correctly: it preserved the declared cuts, split, receipt chain and fail-closed decisions. The failed part was the scientific task hypothesis that raw concatenation should improve discrimination.

The useful design correction is:

> A second cut should contribute according to its demonstrated stability across development environments, not merely because it exists or increases separation in one training aggregate.

This is a stronger and more falsifiable interpretation of the Cut-Binder. It replaces “more cuts are better” with “a binder must estimate which relations survive transport.”

## Proposed Gate 06 hypothesis

Working name: `ACR_RELIABILITY_BINDER_GATE_06`.

Candidate rule, to be finalized before acquiring the new target data:

1. Divide development data into declared chronological or device domains.
2. For every feature, compute class separation and class-conditional centroid drift using development domains only.
3. Assign a deterministic reliability weight from the ratio of stable separation to total separation-plus-drift.
4. Freeze the weighting formula, classifier, split, metric, uncertainty method and success threshold.
5. Compare:
   - P1: declared primary cut;
   - P2: raw two-cut concatenation;
   - P3: reliability-weighted two-cut binder.
6. Require P3 to improve P1 and P2 on a new untouched target domain with a positive paired lower confidence bound.

No parameter may be selected from Gate 05 Batch 10.

## Candidate external target

The strongest compact candidate is UCI dataset 361, *Twin gas sensor arrays*. It contains five replicates of an eight-sensor array exposed under the same protocol to four gases at ten concentration levels. That supports a clean cross-device question: develop the reliability rule on declared units and test it once on an untouched twin unit.

This candidate is preferable to UCI dataset 224 because dataset 224 is another packaging of the already used 13,910-measurement drift corpus and would not be an independent confirmation.

The newer Zenodo calibration dataset with two one-year-separated calibrations is relevant for a later calibration-transfer study, but its target and file structure require a separate source audit before preregistration.

## Ordered next steps

1. Reconcile the Gate 05 numeric class-code metadata and record the source discrepancy without changing the sealed result.
2. Audit only the metadata and file structure of UCI 361; do not inspect response values.
3. Specify the reliability-weight equation and deterministic development-domain scheme.
4. Seal the Gate 06 protocol and runner.
5. Acquire the frozen source and execute once.
6. Promote only the resulting decision and controls to Mission Control; keep theory and physics unchanged.

Diagnostic receipt: `1f8093b3403b51effee5bc037a7994813046e3699a3ff95112d3af5300db2c97`.
