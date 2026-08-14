# Case D — Final Negative-History Test

## Evidence-first reconstruction

The frozen Study-3 implementation and output support reproducible execution. They do not support the strong claim that the exact v0.7 hierarchy is decoder-independent: Study-3 binary support is `MEDIUM/MEDIUM`, its delay preservation is `0/20`, mean delay aligned-state accuracy is approximately `0.7896`, dominant collision pairs total 20, and mean edge recall is approximately `0.6081`. The broader robustness/discrimination pattern remains partial, synthetic, and implementation-qualified.

The aggregate comparison spans multiple nonidentical pipelines. Its common boundary and inverse are therefore unresolved.

## V3 scientific-account comparison

V3 represents execution as `REPRODUCED`, reproducibility as `REPRODUCIBLE`, overall claim support as `MIXED`, the strong hierarchy claim as `REJECTED`, and the broader claim as `PARTIAL`. This is substantively faithful to the evidence and demonstrates that reproduction does not imply claim truth.

## Blocking lineage defect

The V2 prior record is `RLV2.CASE_D.DELAY_HIERARCHY_FAILURE.R1`, with claim IDs:

- `D.CLAIM.EXECUTED`;
- `D.CLAIM.HIERARCHY_REJECTED`;
- `D.CLAIM.BROADER_PATTERN`.

V3 points to that record but changes every claim ID to `D.H.EXEC`, `D.H.HIERARCHY`, and `D.H.BROAD`. None of the three prior IDs is retained or targeted by a relation. V3 instead creates a new local `D.H.HIERARCHY` revision 1 and relates local revision 2 to that recreated entry. Thus the original rejected claim remains readable in the referenced V2 file, but its claim identity does not survive and the refined claim is not explicitly connected to the actual prior claim ID.

The V3 record ID also changes while its documentation describes `record_id` as stable. A prior-record pointer preserves discoverability, but it is not equivalent to stable record/claim identity.

Scientific reconstruction therefore agrees, while the required append-preserving identity test is only partial.

`CASE_D_AGREEMENT = SUBSTANTIVE_AGREEMENT`  
`NEGATIVE_HISTORY_PRESERVED = YES`  
`KNOWN_LINEAGE_RESET_PREVENTED = NO`
