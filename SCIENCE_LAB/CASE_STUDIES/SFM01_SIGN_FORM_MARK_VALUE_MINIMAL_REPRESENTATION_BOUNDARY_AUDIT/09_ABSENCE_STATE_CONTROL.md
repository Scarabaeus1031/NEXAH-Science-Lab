# 09 — Absence-State Control

GRB-01 requires the following states to remain distinguishable:

| State | Reduced classification |
|---|---|
| `ABSENCE_OF_MARK` | No relevant visible/physical occurrence recorded. |
| `ABSENCE_OF_MARKER` | No form/unit plays the specified marker role. |
| `ABSENCE_OF_FEATURE` | Domain analysis does not assign the feature. |
| `ABSENCE_OF_INFORMATION` | No relevant value/feature/interpretation is available in the bounded record. |
| `ABSENCE_OF_EVIDENCE` | Evidence layer does not attest the claim. |
| `ZERO_MARKING` | Domain-specific analysis of an unexpressed exponent in a contrast. |
| `CONTEXT_RECOVERED_INFORMATION` | Mapping/interpretation is available from context despite no overt marker. |
| `NOT_APPLICABLE` | The question does not apply to the construction/domain. |

No merge is safe across these states. They are state labels over object, role, mapping and evidence records rather than eight new core representation types.

`ABSENCE_OF_MARKER_EQUALS_ABSENCE_OF_INFORMATION=NO`
