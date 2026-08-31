# Equivalence-return Control

Define orientation equivalence modulo full turns:

```text
theta ~ phi iff theta-phi=2*pi*k for some integer k.
```

Then `theta0` and `theta0+2*pi` belong to the same equivalence class but are not equal real-number representatives.

Componentwise:

| Field | Finding |
|---|---|
| representative equality | no |
| equivalence-class equality | yes |
| orientation state under quotient | returned/equivalent |
| rotation event occurred | yes in a registered execution |
| history equality with no-event record | no |

The equivalence relation must be named. A full-turn return under this quotient does not mean no rotation occurred.

`EQUIVALENCE_RETURN_CONTROL_PASSED=YES`

`EQUIVALENT_STATE_EQUALS_IDENTICAL_REPRESENTATIVE=NO`

`FULL_ROTATION_RETURN_EQUALS_NO_ROTATION_OCCURRED=NO`
