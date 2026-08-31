# Null / Unknown / Absent Model

RID-01 prohibits untyped JSON `null` in canonical records. Meaningful values use a tagged union:

| State | Encoding | Meaning |
|---|---|---|
| value, including zero | `{state: VALUE, value: 0}` | present value; zero remains data |
| semantic null | `{state: VALUE_NULL, reason: ...}` | defined null/empty outcome |
| unknown | `{state: UNKNOWN, reason: ...}` | value exists or may exist but is unknown |
| not applicable | `{state: NOT_APPLICABLE}` | field concept does not apply |
| unresolved | `{state: UNRESOLVED, reason: ...}` | inquiry exists but is not resolved |
| redacted | `{state: REDACTED, reason: ...}` | value withheld |
| field absent | property omitted | optional property was not supplied |

Omission is permitted only for fields declared optional by the schema. Required scientific/provenance fields cannot use omission to hide unknownness. Canonical JSON never emits a property with raw `null`.

`ZERO_NULL_ABSENT_UNKNOWN_SEPARATED=YES`

