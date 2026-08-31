# Type assessment

| Requested record | Assessment | Representation |
|---|---|---|
| ClosedCurve | COMPOSITION_OF_EXISTING_TYPES_SUFFICIENT | Ordered geometry/trajectory plus closure criterion |
| ReferencePoint | EXISTING_TYPE_SUFFICIENT | Typed point/anchor in frame |
| Orientation | EXISTING_TYPE_SUFFICIENT | Frame plus traversal-order metadata |
| WindingMeasurement | DERIVED_RECORD_SUFFICIENT | Value, method, curve/ref IDs, status, uncertainty |
| TransformRule | EXISTING_TYPE_SUFFICIENT | Operation rule, domain, reference mapping |
| QuantizationRule | EXISTING_TYPE_SUFFICIENT | Representation rule and parameters |
| WindingStatus | DERIVED_RECORD_SUFFICIENT | VALID / UNDEFINED / UNRESOLVED / LOST |
| WindingComparison | DERIVED_RECORD_SUFFICIENT | Source/result values and relation |
| RoundtripRecord | COMPOSITION_OF_EXISTING_TYPES_SUFFICIENT | History, reconstruction, comparison, provenance |
| LossRecord | EXISTING_TYPE_SUFFICIENT | Lost/introduced/unresolved fields |

A software convenience structure could be useful but is not a primitive and is not authorized. Existing RID/OLS composition is sufficient.

NEW_OLS_PRIMITIVE_REQUIRED=NO  
RID_SCHEMA_GAP_FOUND=NO
