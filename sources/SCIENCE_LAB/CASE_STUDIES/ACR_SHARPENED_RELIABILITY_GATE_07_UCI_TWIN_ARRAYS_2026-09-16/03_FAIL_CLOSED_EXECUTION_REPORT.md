# Gate 07 — fail-closed execution report

Date: 2026-09-16  
Decision: `FAIL_CLOSED`  
Empirical decision: none  
Unit-5 score: not computed

## What happened

The runner verified the sealed Gate-06 handoff and Gate-07 contract, loaded development Units 1–4 and froze the `alpha=8` model before Unit-5 access. During deterministic loading of Unit 5, the parser stopped on the 69th of 80 members:

`data1/B5_GMe_F050_R1.txt`

The trace contained 19,284 distinct timestamps and covered 0.0–599.89 seconds, but two frozen feature windows fell below the preregistered minimum of 600 distinct timestamps:

| Window | Distinct timestamps |
|---|---:|
| 0–60 s | 6000 |
| 60–120 s | 6000 |
| 300–360 s | 487 |
| 540–600 s | 485 |

The maximum distinct-timestamp gap was only 0.14 s. Thus the trace was temporally continuous but sampled more sparsely in the later windows than the frozen count threshold permitted.

## Consequence

The fail-closed mechanism behaved correctly. No P2, P3 or P4 prediction vector, balanced accuracy, paired interval, pass or empirical fail was produced. `SEALED_GATE07_CONTROLS.json` was intentionally not emitted because execution never reached the completed control/result stage.

The deterministic prefix through the first failure comprised 69 Unit-5 members. The forensic replay opened no member after the failure and performed no classification or outcome scoring. Even without outcome scores, Unit 5 can no longer be described as untouched; it must not be reused as a pristine blind target for a confirmatory claim.

## Receipts

- Fail-closed result receipt: `4ba92ae31e1a19c2e50b9880431871e802c3ff4d891566a4575050426fdef8ea`.
- Parser-forensic receipt: `0ae39c01916fe46d9a72d9f669c759376118e1ecffb5400bbd6bad90563c10fb`.
- Gate-07 protocol, machine preregistration and runner still match their seal.

## Method lesson

Future blind gates must separate a target-wide, outcome-free acquisition/schema qualification from the later sealed model evaluation. A row-count threshold derived only from development devices is not necessarily transportable even when the feature statistic itself is robust to lower sampling density.

The next confirmatory test requires a new untouched external target. Unit 5 may be used only for explicitly labelled exploratory or pipeline-recovery work.

## Claim boundary

Gate 07 provides no evidence for or against the sharpened reliability hypothesis. It changes no theory, physics, chemistry, profile or product claim.
