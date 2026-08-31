# NVC-01 Compatibility

NVC-01 remains a closed reference artifact and is not edited or reopened.

| EVR-01 element | NVC-01 treatment |
|---|---|
| `ResidualRecord` | local documentary record shape; not a new Core Type |
| residual-kind values | local EVR-01 record values; not Operators or Core Types |
| `residual_present` | Boolean record field, not `NO_RESIDUAL` operator/kind |
| `observation` | recordable result; does not imply complete state or mechanism |
| `operator_or_execution` | preserves operator ≠ execution |
| `trace` | attested execution/state record only; not provenance or structural residue |
| `provenance` | source/lineage record; not trace |
| `orientation` | reference-dependent pose/direction field; not motion |
| `reversibility_status` | declared property/status; not executed return |
| `unresolved` | evidence/knowledge state; not a physical material or universal residual kind |

```text
STATE_NE_IDENTITY
TRACE_NE_PROVENANCE
EXECUTION_NE_OPERATOR
ORIENTATION_NE_MOTION
GENERATION_NE_TRANSFORMATION
PROJECT_NE_PROJECTION
DERIVATION_NE_TRANSFORMATION
CONSTRAINT_NE_FILTERING_EXECUTION
INVERSE_RELATION_NE_EXECUTED_RETURN
RETURN_NE_INVERSE

RESIDUAL = TYPED_OBSERVATION_OR_RESULT_RECORD_VALUE
RESIDUAL_AS_UNIVERSAL_OPERATOR = NO
REST_AS_CORE_OPERATOR = NO
STRUCTURAL_TRACE_NE_NVC_TRACE
NEW_NVC01_TYPE = NO
NEW_NVC01_OPERATOR = NO
NEW_VOCABULARY = NO
NEW_SEMANTICS = NO
NVC01_COMPATIBILITY = PASS_NO_CORE_CHANGE
```

`COMMON_RECORD_SHAPE_NE_COMMON_ONTOLOGY`.
