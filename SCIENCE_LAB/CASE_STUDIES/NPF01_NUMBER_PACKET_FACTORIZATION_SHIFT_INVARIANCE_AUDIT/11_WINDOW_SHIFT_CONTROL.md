# Window and Cut Classification

| Property | Classification | Reason |
|---|---|---|
| Parity of a fixed integer | `INTEGER_INTRINSIC` | Independent of display packet |
| Primality of a fixed integer | `INTEGER_INTRINSIC` | Independent of display packet |
| Prime factorization | `INTEGER_INTRINSIC` | Unique up to factor order |
| Prime index | `INTEGER_INTRINSIC_GIVEN_STANDARD_ORDER` | Uses the standard ascending prime sequence |
| Packet position | `PACKET_DEPENDENT` | Changes when the packet changes |
| Decimal cut position | `REPRESENTATION_DEPENDENT` | Requires an explicit segmentation rule |
| Consecutive-neighbor role | `WINDOW_DEPENDENT` | Depends on admitted neighboring nodes |
| “Prime-composite-square” triple | `PACKET_DEPENDENT` | True for B, not shift-invariant under the null |
| E/F or G/H family membership | `POST_HOC_OR_UNDERDEFINED` | No independent generator supplied |
| Ratio of two fixed nonzero integers | `RELATION_INTRINSIC_TO_ORDERED_PAIR` | Exact once the pair and order are fixed |

`PACKET_DEPENDENT_PROPERTIES_FOUND=YES`

`WINDOW_DEPENDENT_PROPERTIES_FOUND=YES`

`INTEGER_INTRINSIC_PROPERTIES_FOUND=YES`

