# State versus Observable

Let a system state be `x in X`. An observable definition may be modeled as a declared quantity function

```text
q:X -> Q
```

or as a quantity operationalized through an observation map. Either way, `q` is not the complete state and `q(x)` is not an executed measurement record.

Distinct observables can be evaluated against the same state. Conversely, different states can share one observable value because `q` need not be injective.

Example:

```text
x1 != x2 but q(x1)=q(x2).
```

This is ordinary partial observability, not state identity.

`STATE_EQUALS_OBSERVABLE=NO`

`STATE_EQUALS_MEASUREMENT=NO`

`STATE_EQUALS_READOUT=NO`

`SAME_OBSERVABLE_VALUE_IMPLIES_SAME_STATE=NO_IN_GENERAL`

`SAME_STATE_CAN_SUPPORT_DIFFERENT_OBSERVABLES=YES`

The observable’s name, displayed glyph or numerical value cannot reconstruct all unobserved state components.
