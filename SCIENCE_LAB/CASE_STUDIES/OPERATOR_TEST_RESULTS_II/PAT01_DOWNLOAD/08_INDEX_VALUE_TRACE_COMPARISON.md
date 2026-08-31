# 08 — Prime Index, Value and Trace Spaces

| Coordinate system | Retains | Loses if used alone |
|---|---|---|
| Prime-index space `23→24→25→26→27` | anchor order, adjacency and number of anchors | prime values, gap sizes, composites and factorizations |
| Prime-value space `83→89→97→101→103` | anchor values and gaps by subtraction | explicit intermediate visitation; conventional prime indices unless external enumeration is supplied |
| Full trace space | every visited integer, order, gaps and intermediate counts | global prime-index labels unless primes below the window are also counted |

The normalized coordinate

```text
u(n)=(n-p_k)/(p_(k+1)-p_k)
```

maps every start anchor to 0 and every next anchor to 1. It permits intervals
of lengths 6, 8, 4 and 2 to be displayed on a common unit interval. This is a
valid representation change but adds no arithmetic relation: the absolute gap
must still be retained to invert `u` back to integer values.

## Neutral typed sequences

```text
83–89:   A X X X X X A
89–97:   A X X X X X X X A
97–101:  A X X X A
101–103: A X A
```

After semantic stripping, the structural differences are exactly gap length,
intermediate count, and the registered parity/factorization classes.
