# Invertibility Analysis

| Transition | Classification | Criterion |
|---|---|---|
| T01 R0→R1 | MANY_TO_ONE | one generated instance does not recover the full protocol/model configuration uniquely |
| T02 R1→R2 | EXACTLY_INVERTIBLE | selected package is elementwise identical to R1's observations, labels and indices |
| T03 R1→R3 | EXACTLY_INVERTIBLE | project the first two feature columns and retain labels/indices; this reconstructs R1 exactly |
| T04 R2→R4 | MANY_TO_ONE | source mean and RMS are not part of R4; translations and positive global scalings collapse |
| T05 R3→R5 | MANY_TO_ONE | same omitted normalization parameters in four dimensions |
| T06 R4→R6 | MANY_TO_ONE | cluster labels/medoid indices cannot reconstruct continuous normalized coordinates |
| T07 R5→R7 | MANY_TO_ONE | same; observed state collisions further demonstrate non-unique semantic mapping |
| T08 R6→R8 | MANY_TO_ONE | transition-count/certificate projection omits sample chronology and geometry |
| T09 R7→R9 | MANY_TO_ONE | same projection loss |
| T10/T11 → R10 | MANY_TO_ONE | aggregate means/rates do not reconstruct all cell records |
| T12 R10→R11 | MANY_TO_ONE | threshold classes/disposition do not recover the numerical aggregate |

Two qualifications matter:

1. T03 is exactly invertible with respect to the current-observation source despite increasing dimension and changing geometry. Its inverse is the explicit projection onto the first two columns.
2. The full `fidelity_results.json` retains sample correspondence and detailed witnesses beyond the narrower R8/R9 projections. The projection is many-to-one; the evidence file is not claimed to have deleted every witness.

No new reconstruction run was needed: T03's inverse follows directly from the frozen operator, and the source-valued first columns are part of every delay input hash computation.

`INVERTIBILITY_CLASSIFIED = YES`
