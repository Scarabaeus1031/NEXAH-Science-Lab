# A0-BL-021 — 7×8 address grid versus 56 typed terminal classes

Date: `2026-10-10`

Status: `POST_RESULT_EXACT_CROSSWALK / NO_NEW_RUN / NO_NEW_STUDY`

## The exact observation

If boundary positions are numbered from one, the two attachment steps have the
address set

```text
A = {1,...,7} × {1,...,8}.
```

Every one of the `7 × 8 = 56` position pairs occurs in the frozen enumeration.
Thus `(1,1)` through `(7,8)` is a valid complete address grid for the two
successive boundary-slot choices.

The 100 histories are larger than this address grid because a radial seam can
admit two declared fresh-face orientations. The exact maps are therefore

```text
H --address--> A
H --quotient--> C

|H| = 100 histories
|A| = 56 two-step address cells
|C| = 56 typed terminal classes
```

where `C` is the quotient under the frozen exact typed equality.

## Why the two 56s are not yet one 7×8 class product

The observed cardinalities agree, but the maps do not induce a canonical
bijection `A ≅ C`:

- the 56 address cells contain `1` to `4` histories/classes;
- address-cell incidence degrees are: 20 cells of degree 1, 30 of degree 2,
  4 of degree 3 and 2 of degree 4;
- typed-class incidence degrees are: 26 classes represented in 1 cell, 21 in
  2 cells, 4 in 3 cells and 5 in 4 cells;
- some address cells lead to several typed classes;
- some typed classes are reached from several address cells.

Therefore the exact statement is:

> The run contains a complete `7×8` two-step address grid and, separately, 56
> typed terminal classes, connected by 100 oriented histories.

The equality `|A| = |C| = 56` is real. An identification of the two sets would
require an additional selector or invariant that is not present in the frozen
protocol.

## The exact 112-node meta-object

The same crosswalk defines a finite bipartite incidence graph

```text
Γ = (A ⊔ C, H).
```

Its exact ledger is:

```text
vertices: |A| + |C| = 56 + 56 = 112
edges:    |H| = 100
```

This is a real new bookkeeping connection exposed by the completed run. It is
not the original 112-Pascal-node open five-face carrier: the 112 vertices of
`Γ` are typed meta-objects, namely address cells and quotient classes. Any map
between these two 112-element carriers is a separate open construction.

## Interpretation

This supplies a sharper reading of the path-dependence result. The address
pair records *where* the two attachments occur. The typed class also records
*how* seam profile, orientation, Corner Flags and induced Pascal adjacency
survive the quotient. Position and terminal type are related, but neither is a
replacement for the other.

Studying `Γ` could ask whether a principled selector, orbit decomposition,
factorization or typed map to the 112-node Pascal preclosure carrier exists.
That is an explicit future question, not a conclusion of A0-BL-021 and not an
activated successor.

## Claim boundary

This crosswalk is a deterministic read of the frozen `PRIMARY_RESULT.json`.
It does not modify the preregistered result, create an eighth Pascal test,
establish a canonical `7×8` Family, identify the 56 terminal classes with the
7×8 cells, identify the 112-node incidence graph with the 112-node Pascal
carrier, or authorize a successor run.
