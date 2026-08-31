# Zero / Null / Reference Audit

| Candidate | Type | Relation to numerical zero |
|---|---|---|
| Numerical zero `0` | scalar value in a declared number system | itself |
| Coordinate origin `O` | point selected for zero coordinates | may have coordinate tuple `(0,...,0)` |
| Reference value `r` | chosen comparison value | may equal 0, but need not |
| Empty set `∅` | set with no elements | not numerical zero |
| Null/missing value | computing/data-state sentinel | not numerical zero |
| Zero vector `0_V` | additive identity in a vector space | type-dependent relation; not automatically the scalar 0 |

Consequences:

- `NUMERIC_ZERO_EQUALS_EMPTY_SET=NO`
- `NUMERIC_ZERO_EQUALS_NULL_VALUE=NO`
- `NUMERIC_ZERO_EQUALS_ZERO_VECTOR=TYPE_DEPENDENT`
- `ORIGIN_COORDINATES_CAN_BE_ZERO=YES`
- `ORIGIN_IS_INTRINSIC=NO_IN_GENERAL`
- `REFERENCE_VALUE_CAN_BE_ZERO=YES`
- `REFERENCE_VALUE_MUST_BE_ZERO=NO`
- `ZERO_EQUALS_REFERENCE=CONDITIONAL`

Translating an origin from `O` to `O+a` changes coordinate values by a declared translation but does not change the underlying point solely by relabeling it. Thus zero coordinates are a frame assignment, not an intrinsic identity of a general point.

