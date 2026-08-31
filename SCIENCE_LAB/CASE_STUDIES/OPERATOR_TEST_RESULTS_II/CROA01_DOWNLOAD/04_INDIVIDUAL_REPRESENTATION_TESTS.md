# 04 — Individual Representation Tests

## R1 — A / 1 / mirror

No font, handwriting, reflection axis or paired frozen geometry is supplied.
Selecting these now would be post-hoc. `R1_A1_REFLECTION = UNDERDEFINED`.

## R2 — 2 / 3 / 5 triangle

`{2,3,5}` as integers and as labels are distinct from a constructed triangle.
The numbers do not intrinsically create edges, angles, branch or convergence.
A triangle exists only after assigning labels to vertices:
`INTRODUCED_BY_REPRESENTATION = YES`.

## R3 — 3 / 7

Two labels alone specify no O1–O8 relation. No sum, difference, product,
quotient, power, modular or prime-gap search is allowed. Result: `UNDERDEFINED`.

## R4 — 0 / 6 / 9

GPT-01 supplies one representation-specific operator:
`ROTATE_180(G6)=G9` within its registered tolerance. Rotation is not reflection.
No role for 0 is independently defined. Arithmetic implication: none.

## R5 — 11 / 22 / 33

Two local arithmetic descriptions are exact:

```text
f(n)=11n, n∈{1,2,3}: 11,22,33
T(x)=x+11: 11→22→33
```

The repeated identical digits are decimal-representation facts. Neither
arithmetic generator operationalizes `STREAM`.

## R6 — DELTA

The declared topology `{x1,x2,x3}→y` instantiates O5 CONVERGE by construction.
It has three distinguishable inputs and one receiving state. This gives no
permission to reinterpret R5 as three physical streams.

## Cross-representation result

Each well-defined operator occurs in only one representation: ROTATE in R4,
TRANSLATE and REPEAT/SCALE in R5, and CONVERGE in R6. R1 reflection and R3 are
underdefined. Consequently there is no independently repeated typed operator.
