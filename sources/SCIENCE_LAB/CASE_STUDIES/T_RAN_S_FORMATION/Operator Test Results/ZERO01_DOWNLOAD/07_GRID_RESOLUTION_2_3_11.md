# Grid Resolution Control

The carrier is the normalized signed interval. An `n×n` display uses horizontal cell centers as quantization representatives; rows duplicate the same signed value.

| Grid | explicit zero column | max error | mean error | redundant row multiplicity |
|---|---|---:|---:|---:|
| 2×2 | NO | 0.500000 | 0.250025 | 2 |
| 3×3 | YES | 0.333333 | 0.166683 | 3 |
| 11×11 | YES | 0.090909 | 0.045459 | 11 |

The 3×3 grid is the smallest listed grid with an explicit center cell. The 11×11 grid improves precision. All retain left/right order away from the even-grid zero tie. Grid size changes resolution, not the carrier.
