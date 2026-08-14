# A5XR Raw P1–P5 Derivation

- P1: for mean coherence and top-action agreement, every N1/N2/N3/N4_T/N4_F comparison uses `k=count(null>=observed)` and passes iff `k<=4`.
- P2: both carrier coefficients are `>0`; NumPy-linear-equivalent `.025` quantile of exactly 500 raw bootstrap coefficients is `>0`. Coefficient nulls remain diagnostic.
- P3: both gains `>0`, augmented Brier `<=` baseline, and gain passes N1/N2/N3 plus carrier-matching N4 by `k<=4`.
- P4: exact accepted A5 two-carrier coefficient/gain, four controls, raw 21/30 direction and exact dominance conjunction; three single-view/fusion diagnostics remain report-only.
- P5: exact two amplitude records, both carriers, coefficient/gain `>0`; no nonprimary interval gate and no rescue.

