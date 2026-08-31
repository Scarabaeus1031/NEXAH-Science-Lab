# I / J / L Role Audit

## Test result

The labels `i`, `j` and `l` can be placed beside rays or paths in a drawing, but the frozen record supplies no stable, exclusive typed mapping that improves on `RayId`, `EdgeId` or `PathId`. The labels are also highly overloaded: `i` is standard complex notation, `j` may be an index or quaternion basis label, and lowercase `l` is visually ambiguous with `1` and `I`.

They therefore remain expression-layer shorthand rather than interface types.

| Label | Proposed role | Result | Reason |
|---|---|---|---|
| `i` | first directed local relation/ray | `C_EXPRESSION_ONLY` | no stable exclusive referent; mathematical overload |
| `j` | second directed local relation/ray | `C_EXPRESSION_ONLY` | no stable exclusive referent; quaternion suggestion must remain quarantined |
| `l` | line/trace/embedded path | `C_EXPRESSION_ONLY` | line, trace and path are themselves distinct types |

`I_EQUALS_COMPLEX_UNIT=NO_UNLESS_FORMALLY_REQUIRED`

`J_EQUALS_QUATERNION_UNIT=NO`

`L_EQUALS_DIMENSION=NO`

Neutral identifiers preserve the complete type chain, so the shorthand adds no formal content.
