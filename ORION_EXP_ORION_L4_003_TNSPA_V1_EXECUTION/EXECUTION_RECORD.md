# L4.003 TNSPA-v1 execution record

Reviewed hash: `288b50e7d28eb78e9fb07a7748b2ef18f99f92415d402409d2f6c2883a4970ec` — verified  
Lock before implementation/result: **YES**  
Result known at lock time: **NO**  
Review state retained: `CRITICAL 0 / MAJOR 0 / MINOR 3`

The authentic L4.001 artifacts were not regenerated or modified. The encoder retained exactly 1,399 triple-joint query IDs and generated 21 relations per representation/state. The blind observer sealed all TNSPA values and cell decompositions before nulls, R3 verification, Jaccard and comparison.

## Primary observation

| Representation | strict cells | tie cells | I_r | full-tie states |
|---|---:|---:|---:|---:|
| R0 | 28,912 | 467 | 0.9841042922 | 20 |
| R1 | 28,912 | 467 | 0.9841042922 | 20 |
| R2 | 24,408 | 4,971 | 0.8307975084 | 216 |

| Pair | TNSPA | same strict | tie/tie | opposite strict | one-sided tie/strict |
|---|---:|---:|---:|---:|---:|
| R0-R1 | 0.9841042922 | 28,912 | 467 | 0 | 0 |
| R0-R2 | 0.3345246605 | 19,570 | 67 | 4,438 | 5,304 |
| R1-R2 | 0.3345246605 | 19,570 | 67 | 4,438 | 5,304 |

`TNSPA_min=0.3345246605`; the absolute `0.60` gate fails for both graph pairs.

All three observed values exceed their respective 99% mismatch-null quantiles with `p=0.0001`. Significance does not override the effect-size failure.

All three tie-controls and all algebraic fixtures pass exactly.

R3 still returns `UNDEFINED` with zero ranks and exposes neither x/y, scores nor source ranks. However its authentic input contains readable `SEED-...-STATE-...` query IDs. This violates the current no-correspondence-metadata gate; R3 validation is therefore false and the protocol classification is `INVALID_EXPERIMENT`.

Primary result hash: `9e2961fa8ab830279405133dff1495813bc49ef3fc473e6f7232a2fef4d66b83`  
Replay result hash: `9e2961fa8ab830279405133dff1495813bc49ef3fc473e6f7232a2fef4d66b83`  
Replay identical: **YES**

