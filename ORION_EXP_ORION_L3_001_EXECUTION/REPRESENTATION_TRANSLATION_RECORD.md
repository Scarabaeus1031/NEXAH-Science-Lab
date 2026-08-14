# EXP-ORION-L3-001 — Representation Translation Record

| Representation | Generated object | What survived | What changed or was lost |
|---|---|---|---|
| R0 | 2,001 saved source rows; 1,501 post-transient states | full locked source identity/order | nothing at source level |
| R1 | 1,501 invertible scaled coordinates | state, flow law, topology under pullback metric | raw coordinates and Euclidean distances |
| R2 | 1,501 oriented polyline vertices/tangents | successor order and local direction robustly | timestamps, intersample path, speed |
| R3 | two z-only collision views | z=27 | x/y, sign(x), identity, full direction |
| R4 | 1,501 nodes, 1,500 directed transitions, 4,539 recurrence edges | successor and approved mutual-neighbor relations | coordinates, timestamps, equations |
| R5 | 64 sample-estimated vectors | local forward direction robustly | exact vector field identity and off-support values |
| R6 | 30,172 render records across layouts/palettes | typed graph incidence | layout, color, and unique-state semantics |

## Central chains

- C02, `R0→R1→R2→R4`: the directed successor relation remained INVARIANT. Numerical coordinates did not need to remain identical.
- C03, `R0→R1→R2→R4`: mutual-8NN recurrence remained INVARIANT only under the approved pullback metric; raw R1 metric changed it materially.
- C05, `R0→R1→R2→R5`: forward local-flow direction remained ROBUST, not exact; the estimator remained distinct from the true field.

Different layouts preserved the same graph, different coordinates preserved the same dynamics under transport, and raw metric/color changes remained representation-dependent.

