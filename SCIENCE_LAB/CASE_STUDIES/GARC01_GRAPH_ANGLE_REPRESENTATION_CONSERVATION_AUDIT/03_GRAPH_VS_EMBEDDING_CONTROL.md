# Graph versus Embedding Control

## Explicit counterexample

Let the abstract graph be the three-leaf star:

```text
V={o,a,b,c}
E={{o,a},{o,b},{o,c}}
```

It has one degree-three vertex, three degree-one vertices, three edges, no cycles and the same path structure in every drawing.

Embedding 1:

```text
phi_1(o)=(0,0)
phi_1(a)=(1,0)
phi_1(b)=(0,1)
phi_1(c)=(-1,0)
```

The smaller pairwise angles at `o` are `90°`, `90°` and `180°`.

Embedding 2:

```text
phi_2(o)=(0,0)
phi_2(a)=(1,0)
phi_2(b)=(1,1)
phi_2(c)=(-1,1)
```

The smaller pairwise angles at `o` are `45°`, `90°` and `135°`.

## What survived

- vertex and edge identity;
- adjacency;
- degree/valence sequence `(3,1,1,1)`;
- path structure and graph distances;
- cycle structure: no cycles;
- connectedness and isomorphism class.

## What changed

- embedded directions;
- Euclidean edge lengths;
- local Euclidean angles;
- visible symmetry.

Therefore:

`SAME_GRAPH_CAN_HAVE_DIFFERENT_VISIBLE_ANGLES=YES`

`DIFFERENT_VISIBLE_ANGLES_REQUIRE_DIFFERENT_GRAPH=NO`

The converse also fails: different graphs can be drawn with some equal local angles. Angle coincidence alone does not establish graph identity.
