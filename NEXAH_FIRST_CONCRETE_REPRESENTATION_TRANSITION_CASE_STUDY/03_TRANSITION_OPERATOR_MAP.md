# Transition Operator Map

| ID | Transition | Actual operator | Decomposition / parameters |
|---|---|---|---|
| T01 | R0 → R1 | synthetic model instantiation | repeat walk; repeat each label for dwell 12; select prototype; add deterministic sinusoidal jitter 0.025 |
| T02 | R1 → R2 | baseline feature selection/package | `(x, labels, indices)` unchanged |
| T03 | R1 → R3 | one-step delay embedding | `previous = vstack(x[0], x[:-1])`; `column_stack(x, previous)` |
| T04 | R2 → R4 | global normalization | subtract column mean; divide all coordinates by one global RMS |
| T05 | R3 → R5 | same global normalization | same formula in four-dimensional delay space |
| T06 | R4 → R6 | deterministic decode and oracle alignment | farthest-first deterministic k-medoids with `k=4`; medoid updates; overlap-maximizing permutation; sample correspondence |
| T07 | R5 → R7 | same composite decode/alignment | identical algorithm and parameters, different input geometry |
| T08 | R6 → R8 | transition and certificate projection | adjacent aligned-label counts; oracle counts; support/probabilities/components/ranks/bins; fidelity comparison |
| T09 | R7 → R9 | same transition/certificate projection | identical definitions applied to delay-derived sequence |
| T10 | R8 → R10 | baseline contribution to comparison | exact certificate comparisons and fidelity aggregation across 20 systems |
| T11 | R9 → R10 | delay contribution to comparison | compare delay certificates with paired baseline; aggregate fidelity |
| T12 | R10 → R11 | registered classification/interpretation | frozen HIGH/MEDIUM/LOW thresholds, gates, association rule and bounded report interpretation |

T06 and T07 are composite. Decoding is graph-blind; alignment occurs afterward using latent labels. Combining them without this decomposition would hide the oracle correspondence step.

T08 and T09 describe the mathematical projection used for transition/certificate analysis. The full result file separately retains sample correspondences and other witnesses, so loss from this projection must not be misdescribed as deletion from the full evidence artifact.

`TRANSITIONS_IDENTIFIED = 12`
