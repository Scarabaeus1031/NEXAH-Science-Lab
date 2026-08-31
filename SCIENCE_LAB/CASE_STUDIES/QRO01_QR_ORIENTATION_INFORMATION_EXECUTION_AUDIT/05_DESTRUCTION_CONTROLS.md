# QRO-01 — Destruction Controls

| Control | Operation | Result |
|---:|---|---|
| 1 | Remove reference/orientation handling | Arbitrary rotated/skewed presentation is not invariant without finder/reference recovery or equivalent compensation. Decode reliability fails or becomes underdefined. |
| 2 | Preserve binary values but permute positions | Payload is not preserved in general; spatial arrangement is part of the code. |
| 3 | Preserve visible matrix but remove the encoding specification | Intrinsic semantics cannot be recovered; only an uninterpreted spatial binary representation remains. |
| 4 | Decode harmless text without execution environment | Text is recovered; execution does not occur. |
| 5 | Provide an execution environment but no executable/dispatch instruction | Environment existence alone does not create an execution event. |
| 6 | Store identical QR content in two files/prints | Representation content may match while instance ID, carrier, trace and provenance differ. |

All controls preserve the frozen distinctions. None supports hidden topology or intrinsic binary semantics.
