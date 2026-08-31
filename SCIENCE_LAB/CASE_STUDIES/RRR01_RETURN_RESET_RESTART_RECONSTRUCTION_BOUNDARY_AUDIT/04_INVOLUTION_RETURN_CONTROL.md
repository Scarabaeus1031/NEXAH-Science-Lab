# Involution Return Control

Use the frozen PRR-01 map

```text
J_R(d)=R²/d,  d>0, R>0.
```

Then

```text
J_R(J_R(d))
=R²/(R²/d)
=d.
```

Thus `J_R` is its own functional inverse on the declared positive domain. Register two distinct applications:

```text
d --J_R/e1--> R²/d --J_R/e2--> d.
```

Componentwise result:

| Field | Return? |
|---|---:|
| functional value | yes |
| inverse relation | yes, for this map/domain |
| state value | yes |
| event identity | no; `e1 != e2` |
| history | no; `[e1,e2] != []` |
| provenance erasure | no |

This particular map is an inverse and yields state return, but it does not make the general words RETURN and INVERSE identical.

`PRR_INVOLUTION_CONTROL_PASSED=YES`

`FUNCTIONAL_RETURN=YES`

`FUNCTIONAL_INVERSE=YES`

`STATE_VALUE_RETURN=YES`
