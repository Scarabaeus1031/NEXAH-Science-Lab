# Positive Controls

| # | Control | Required distinction | Result |
|---:|---|---|---|
| 1 | One state -> one blue point under declared map | State vs representation/view | PASS |
| 2 | Same state -> two valid views | Identity vs representation | PASS |
| 3 | Sequential timestamped states -> trajectory | Point vs ordered sequence | PASS |
| 4 | Same endpoint -> different trajectories | Endpoint vs path/history | PASS |
| 5 | Same geometric path -> different timing | Geometry vs parameterization | PASS |
| 6 | Stable readout -> fluctuating hidden state | Readout vs source state | PASS |
| 7 | Equal measurement -> different source histories | Value equality vs provenance/history | PASS |
| 8 | Evidence supports multiple explanations | Ambiguity -> abstain | PASS |
| 9 | Numeric threshold + declared policy | Measurement -> scoped decision | PASS |
| 10 | Numeric value without criterion | No normative decision | PASS |
| 11 | Return to prior state | State equality with retained history | PASS |
| 12 | Same coordinate, two provenance records | Coordinate equality vs record identity | PASS |

All controls are formal/documentary. No simulation, physical experiment,
implementation or new research was activated. “PASS” means the frozen type
composition represents the required distinction.
