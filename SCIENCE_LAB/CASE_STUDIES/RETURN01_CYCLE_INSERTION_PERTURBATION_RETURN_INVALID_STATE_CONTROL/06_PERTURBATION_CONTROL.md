# Perturbation Control

Use a generic declared evolution `x_(n+1)=F(x_n)` and comparison state `(coordinate,residual)`. A perturbation record supplies `delta_n`; no physical cause is inferred.

| Case | Later relation to X0 | Status |
|---|---|---|
| `delta_n=0`, cycle revisits all declared fields | exact equality | `EXACT_STATE_RETURN` |
| coordinate returns but residual remains nonzero | coordinate only | `COORDINATE_RETURN_ONLY` |
| declared equivalence ignores a nonzero residual | same equivalence class, unequal state | `EQUIVALENCE_CLASS_RETURN` |
| metric distance is at most epsilon | tolerant neighborhood | `APPROXIMATE_RETURN` |
| residual persists outside every declared return criterion | no relation satisfied | `NO_RETURN` |
| F, delta, state space or criterion missing | cannot assess | `UNDEFINED` |

A later rule may explicitly cancel or clear a residual, so an exact return after perturbation is possible. It is not guaranteed. Crossing a previously occupied coordinate does not prove exact state, causal reversal or erased history.

`INSERTION_DISTINCT_FROM_PERTURBATION=YES`.

