# Destruction Controls

Each requested collapse was tested and rejected as a general type identity.

| # | Candidate collapse | Result |
|---:|---|---|
| 1 | `ZERO = NULL` | `REJECTED`; numerical value and missing-value/set roles differ |
| 2 | `ZERO = ORIGIN` intrinsically | `REJECTED`; origin is selected in a frame |
| 3 | `NEGATIVE = LEFT` intrinsically | `REJECTED`; x-orientation reversal exchanges labels |
| 4 | `POSITIVE = RIGHT` intrinsically | `REJECTED`; x-orientation reversal exchanges labels |
| 5 | `UP = POSITIVE` universally | `REJECTED`; y-orientation is conventional |
| 6 | `DOWN = NEGATIVE` universally | `REJECTED`; y-orientation is conventional |
| 7 | `BOWL = NEGATIVE` | `REJECTED`; concavity and value sign are distinct |
| 8 | `CAP = POSITIVE` | `REJECTED`; concavity and value sign are distinct |
| 9 | `SIGN = DIRECTION` | `REJECTED`; sign is a classification, direction a frame role |
| 10 | `DIRECTION = AXIS` | `REJECTED`; an axis supports directions but is not one direction |
| 11 | `AXIS = FRAME` | `REJECTED`; a frame requires additional origin/basis data |
| 12 | `FRAME = VIEW` | `REJECTED`; a view represents from/through a frame |
| 13 | `RETURN = SIGN REVERSAL` | `REJECTED` generally; coincides only for registered PRR coordinate action |
| 14 | `RETURN = PATH REVERSAL` | `REJECTED`; endpoint map does not reverse a path |
| 15 | `RETURN = HISTORY RETURN` | `REJECTED`; history is not erased or recreated |
| 16 | `GEAR = DIMENSION` | `REJECTED`; gear is a mechanical component/selection role |
| 17 | `GEAR CHANGE = NEW SPACE` | `REJECTED`; transfer relation changes within the model |
| 18 | `ROTATION = TRANSLATION` | `REJECTED`; distinct transformations |
| 19 | `OUTWARD = FORWARD` | `REJECTED`; requires a declared frame and motion context |
| 20 | `INWARD = BACKWARD` | `REJECTED`; requires a declared frame and motion context |

`DESTRUCTION_CONTROLS=20_OF_20_COLLAPSES_REJECTED`

