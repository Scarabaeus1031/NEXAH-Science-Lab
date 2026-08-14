# Collision and Information-Loss Ledger

Collision means two distinct frozen source states produced exactly equal
certificate payloads. Counts use only pairs for which a certificate applies.

| Certificate | Collisions | Applicable pairs | Interpretation |
|---|---:|---:|---|
| C0 exact state | 0 | 3 | discriminated all pairs |
| C1 distance order | 1 | 2 | reflection collision |
| C2 adjacency | 1 | 3 | reflection collision |
| C3 orientation | 0 | 2 | discriminated both applicable pairs |
| C4 rank/degree order | 0 | 2 | discriminated both applicable pairs |
| C5 connectivity | 3 | 3 | collided on every pair; deliberately coarse |

The F2 reflection changed orientation while C1, C2, and C5 remained unchanged.
The F3 edge replacement changed adjacency while C5 remained unchanged. The F1
middle-value swap also retained C5. Thus certificate robustness did not imply
state identity or unique recoverability.

| Loss map | Destroyed relation | Primary status | Recovery error |
|---|---|---|---|
| signed square | sign / choice of preimage | `UNIDENTIFIABLE` | null |
| x projection | all y coordinates | `INFORMATION_LOST` | null |
| integer quantization | sub-integer coordinates | `INFORMATION_LOST` | null |
| edge deletion | registered adjacency | `INFORMATION_LOST` | null |

False recoveries: **0**. C3 and C4 combined preservation on relevant positive
controls with zero observed matched-pair collisions, but the fixture set is too
small and designed to justify a general high-discrimination claim.
