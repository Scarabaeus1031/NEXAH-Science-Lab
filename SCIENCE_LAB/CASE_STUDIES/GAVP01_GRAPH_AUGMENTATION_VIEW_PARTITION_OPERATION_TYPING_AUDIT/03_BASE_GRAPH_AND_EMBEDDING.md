# Base Graph and Embedding

Use the neutral triangle graph

```text
G=(V,E)
V={A,B,P}
E={AP,PB,AB}.
```

Its degree sequence is `(2,2,2)`, it is connected, and it has one three-edge cycle.

Register a Euclidean embedding

```text
E1:V -> R²
A=(-3,0), B=(4,0), P=(0,3).
```

The coordinates are a convenient nondegenerate realization, not graph identity. The registered Euclidean frame and metric permit line, angle and perpendicular constructions.

Dependencies:

```text
G
 -> E1
 -> frame + metric
 -> geometric construction/relations
 -> optional observation/readout/view.
```

`GRAPH_EQUALS_EMBEDDING=NO`

`A_B_P_H_G_D_E_V_SEMANTICS=NEUTRAL_IDENTIFIERS_ONLY`
