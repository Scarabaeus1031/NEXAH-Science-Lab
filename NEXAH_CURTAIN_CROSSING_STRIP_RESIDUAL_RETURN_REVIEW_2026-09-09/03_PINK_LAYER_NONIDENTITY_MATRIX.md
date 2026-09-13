# Pink-Layer Nonidentity Matrix

`PINK_GATE_SURFACE_IN_STATE_SPACE != PINK_EVENT_STRIP_IN_TIME != PINK_HIGH_VALUE_REGION_IN_OVERLAY`

| layer | mathematical object | domain | units/coordinates | required binder |
|---|---|---|---|---|
| gate surface | level set `Γ={x:g(x)=0}` | state space | state coordinates; codimension | explicit `g`, frame, regularity and sign convention |
| crossing | root `t_k` of `g(x(t))` with direction/tangency rule | continuous time/path | time | trajectory, solver/samples, interpolation, tolerance |
| event strip | rendering or bit/window derived from `t_k` | time/index plot | time or bin index | deterministic map from crossing IDs to pixels/bins |
| high-value overlay | scalar/vector field region selected by threshold | projection/feature plane | declared feature axes | field definition, projection, threshold, legend |
| residual record | discrepancy from explicit reference | event/time/state/model space | type-dependent | reference, alignment, metric/wrap, uncertainty |

Pink is only a display attribute. It cannot carry identity across these types.

The only admissible linkage is a provenance-preserving morphism:

`STATE_SPACE_GATE → CROSSING_EVENT → TIME_STRIP → RESIDUAL_RECORD`,

where every arrow is an explicit function with source hash, parameters and loss/ambiguity record.

