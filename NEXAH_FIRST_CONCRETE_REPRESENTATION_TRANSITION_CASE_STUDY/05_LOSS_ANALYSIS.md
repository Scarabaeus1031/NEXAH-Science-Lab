# Loss Analysis

## Observed or definitionally established losses

| Transition | Loss | Criterion / evidence |
|---|---|---|
| T01 | protocol metadata is not recoverable from one generated sample record alone | R1 does not contain the complete ten-family protocol or decision rules |
| T04/T05 | absolute coordinate origin and global scale | normalized geometry omits source mean vector and RMS; multiple translated/scaled inputs map to the same normalized array |
| T06/T07 | within-cluster continuous geometry | cluster/aligned labels do not encode source coordinates |
| T07 | source-state identity | mean accuracy falls to `0.7895645327`; 20 dominant collision pairs across 20 cells |
| T08/T09 | chronology in the count/certificate projection | count matrices are invariant under distinct sequences having identical adjacent-pair totals |
| T09 relative to baseline path | transition support and weights | mean edge recall `0.6080952381`, precision `0.7321428571`, probability MAE `0.1356209074`; C1–C6 exact preservation `0/20` |
| certificate projections | detail specific to each certificate | C0 loses labels/edges/counts; C1 loses multiplicity; C3 loses count scale/gaps; C4 loses within-bin differences; C5/C6 lose chronology and absolute row totals after probability normalization |
| T10/T11 | individual-cell detail in aggregate fields | means and rates do not identify every contributing witness, although witnesses remain elsewhere in the full result artifact |
| T12 | numerical detail in category/disposition | categorical interpretation is many-to-one over aggregate values |

## Potential losses, not asserted as observed

- T03 could create boundary sensitivity through the repeated first predecessor, but no separate boundary-effect estimate exists.
- Floating normalization could be numerically unstable near zero RMS; the runner rejects values below `1e-12`, and no selected faithful cell was untestable.
- Aggregation may obscure heterogeneous family mechanisms; the per-cell records are retained, but no causal attribution was preregistered.

Dimension increase at T03 is not itself evidence of preservation or loss. In this case the current observation is retained exactly, yet the changed metric geometry materially alters a later decoder.

`LOSS_CRITERIA_EXPLICIT = YES`
