# V and Y Junction Control

Let `a` be one anchor and let

```text
R1=(a,v1), R2=(a,v2), R3=(a,v3)
```

be three distinct declared rays.

The pair objects are

```text
V12={R1,R2}
V23={R2,R3}
V31={R3,R1}.
```

The full local junction is

```text
Y={R1,R2,R3}.
```

Thus a degree-three junction contains three unordered two-ray selections, while remaining distinct from each selection.

`Y_CONTAINS_THREE_V_PAIRS=YES`

`Y_EQUALS_ANY_SINGLE_V_PAIR=NO`

`V_EQUALS_ANGLE=NO`

`Y_EQUALS_TRIANGLE=NO`

`Y_EQUALS_DEGREE_3_JUNCTION=CONDITIONAL_GRAPH_ROLE`

Angles `theta_12`, `theta_23` and `theta_31` require embedded nonzero vectors and a metric. Neither the V-pair identity nor graph valence fixes their values.

A triangle appears only if three suitable vertices and three connecting edges/segments are separately admitted. Three common-origin rays alone do not supply that cycle.
