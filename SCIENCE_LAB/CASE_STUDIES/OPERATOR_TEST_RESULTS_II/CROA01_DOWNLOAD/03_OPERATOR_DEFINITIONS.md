# 03 — Operator Definitions

| ID | Operator | Typed requirement | Preserves | Does not imply |
|---|---|---|---|---|
| O1 | REFLECT | one state/geometry → its image under one fixed mirror map | mirror incidence/distance to fixed axis | rotation, arithmetic relation |
| O8 | ROTATE | one geometry → image under fixed angle | metric shape under rigid rotation | reflection, number relation |
| O2 | BRANCH | one predecessor → at least two addressable successors | predecessor provenance and successor identity | convergence |
| O3 | TRANSLATE | `x→x+c` with one fixed displacement | differences/spacing | multiplication |
| O4 | REPEAT/SCALE | `x→kx` under one fixed generator | proportional rule | stream or physical flow |
| O5 | CONVERGE | at least two distinguishable inputs → one receiving state | input provenance if explicitly retained | branch, physical delta |
| O6 | RETURN | path endpoint returns to a predeclared reference class | stated invariant/reference class | visual closure or reset |
| O7 | TRACE | transitions → ordered retained markers | transition provenance | state, return, direction |

`ROTATE` is added only because GPT-01 already froze it; it is explicitly not
collapsed into `REFLECT`.
