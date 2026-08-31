# 11 — Even / Odd Parity Control

For the tested regular polygons:

## Even `n = 4,6,8,10`

- each vertex has a diametrically opposite vertex, index offset `n/2`;
- `n/2` reflection axes pass through pairs of opposite vertices;
- `n/2` reflection axes pass through midpoints of pairs of opposite edges;
- the half-turn rotation is a symmetry.

## Odd `n = 3,5,7,9`

- no vertex is diametrically opposite another vertex;
- each of the `n` reflection axes passes through one vertex and the midpoint of the opposite edge;
- no half-turn is a rotational symmetry.

## What parity does not determine

Parity alone does not determine angle values, vertex count, symmetry-group order or approximation error; these depend on the actual `n`. All regular `n`-gons still have `n` rotations and `n` reflections.

```text
EVEN_ODD_STRUCTURAL_DIFFERENCES_SUPPORTED=YES
EVEN_ODD_SEMANTIC_MEANING=NOT_SUPPORTED
PARITY_EQUALS_METAPHYSICAL_DUALITY=NO
```

