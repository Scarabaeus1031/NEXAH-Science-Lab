# Boundary / Aperture Control

Let valid internal states be `S={a,b,c}`, with one admissible boundary opening `A` connecting `c` to external valid state `d`. Declare transitions `a->b`, `b->c`, `c->d` through A, and optionally `d->c` through A.

| Attempt | Classification |
|---|---|
| `a->b` | `VALID_INTERNAL_TRANSITION` |
| `c->d` through A | `VALID_BOUNDARY_CROSSING` |
| `b->d` outside A | `INVALID_BOUNDARY_CROSSING` |
| transition with no declared rule | `UNDEFINED` |
| `d->c` through declared return edge | valid boundary return |

A boundary return is an executed transition from an external to an internal valid state. A reset is explicit field reinitialization. Equal resulting state values do not collapse their events or histories.

`BOUNDARY_RETURN_DISTINCT_FROM_RESET=YES`.

No portal, wormhole, timeshift or physical aperture is asserted.

