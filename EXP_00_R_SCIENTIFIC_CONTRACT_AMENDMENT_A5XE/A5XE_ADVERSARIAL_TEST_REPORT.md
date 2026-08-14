# A5XE Adversarial Test Report

Runtime: bundled Python 3.12 with NumPy 2.3.5; synthetic identities only. The focused static/adversarial run executed 56 tests successfully. The reconstruction suite executed four additional full-pipeline tests successfully.

## Required attack coverage

| Required mutation | Test evidence | Outcome |
|---|---|---|
| Remove null world / replace with summaries | `test_17`, `test_01` | REJECTED |
| Mutate N1 permutation / N3 donor / N4 stratum / RNG order | `test_39`, `test_22`, `test_23`, `test_40` | REJECTED |
| Remove bootstrap draw / alter multiplicity / substitute coefficients | `test_24`, `test_26`, `test_41` | REJECTED |
| Remove N5 transform / mutate Q / rank / substitute tau | `test_42`, `test_27`, `test_29`, `test_43` | REJECTED |
| N5-SYNTH fails | `test_37` | `IMPLEMENTATION_FAILURE`; no classification |
| N5-RUN fails | `test_38` | `INVALID_EXPERIMENT`; no classification |
| `G <= 0` | `test_34`, `test_50` | Valid evidence, P4 condition false |
| Exact dominance above 50% | `test_35` | Valid evidence, P4 condition false |
| Exact 50% / below 50% | `test_48`, `test_49` | PASS |
| Negative signed contribution | `test_49` | Retained; no clipping |
| Invalid dominance population | `test_36` | Typed invalidity |
| Inconsistent support/bootstrap/sensitivity/attribution identity | `test_09`, `test_13`, `test_19`, `test_31`, `test_44` | REJECTED |
| Missing sensitivity / P5 evidence | `test_30`, `test_45` | REJECTED |
| Provenance parent/hash mutation | `test_32`, `test_33` | REJECTED |
| Upstream mutation plus locally updated manifest | static contract test | External ledger anchor rejects it |
| Producer P1/classification mutation | `test_02`, `test_03` | REJECTED |
| Positive summaries rescue invalid evidence | `test_46` | REJECTED |
| Classification after invalidity | `test_47` | Remains `INVALID EXPERIMENT` |

## Central falsification

The A5XR-like bundle supplies plausible observed, null, bootstrap and N5 summaries plus positive P1–P5 and `classification="REPLICATED"`, but lacks raw worlds, resamples, rank evidence, per-seed attribution and provenance. A5XE rejects it before classification. Producer assertions cannot rescue it.

Decision: **PASS**.
