# Formal Pipeline

## Domain

`Omega=[-2,2]x[-2,2]`, primary grid `n=201`, inclusive endpoints and spacing
`h=4/(n-1)=0.02`. Row index maps to increasing `y`; column index maps to
increasing `x`.

## Analytic family

For an ordered seed set `S={(a_k,b_k)}`:

```text
F_S(x,y) = - product_k ((x-a_k)^2 + (y-b_k)^2)
N(F) = F / max_grid(abs(F))
```

All source fields except amplitude class A use `N(F_S)`. There is no randomness.

## Maps

- `T_diff`: second-order centered finite differences in the interior and
  second-order one-sided differences at boundaries, using physical spacing `h`.
  Retain `dx,dy,dxx,dyy,dxy` as full rasters.
- `T_crit`: an interior cell is a maximum candidate iff it is not below any of
  its eight neighbors, is strictly above at least one, `||grad||_2 <= 0.02`, and
  both eigenvalues of the symmetric numerical Hessian are `< -1e-8`.
- `T_part`: assign every grid cell to the nearest detected maximum in Euclidean
  physical coordinates. Exact-distance ties go to lexicographically smallest
  critical ID.
- `T_graph`: scan horizontal and vertical raster neighbors. Unequal IDs generate
  a canonical undirected edge. Retain both binary edges and per-edge boundary-
  contact counts.

Critical candidates are mapped one-to-one to declared analytic seeds only after
detection, with maximum distance `1.5h`; otherwise the fixture precondition
fails. IDs are assigned by declared seed order: `S0`, `S1`, ... .

## Boundary and ordering

Critical detection excludes the outer grid ring. Partitioning includes it.
Arrays are row-major. JSON keys and graph nodes are lexicographically sorted;
edges are two-item sorted arrays. No ordering-dependent scientific comparison is
allowed.

