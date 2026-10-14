# A0-BL-021 — Audit and interpretation

Date: `2026-10-10`

Status: `AUDIT_PASS / BOUNDED_PATH_DEPENDENCE`

## Lock and replay

- the pre-execution lock passed for every frozen file;
- the primary run and unchanged local replay are byte-identical;
- scientific result SHA-256:
  `e8952baf391f430a6b02d7301461d8392d55bb24f85bb3f8e7415af77dfe4705`;
- the independent result parser passed every schema, scope, count, control,
  partition and witness check.

## Enumeration audit

The frozen five-face boundary contains five base edges and two radial edges.
A base edge has one compatible fresh side; a radial edge has two. Therefore the
first extension count is

```text
5*1 + 2*2 = 9.
```

After a base attachment the boundary has four base and four radial edges,
giving `4+2*4=12` second moves. After a radial attachment it has six base and
two radial edges, giving `6+2*2=10` second moves. There are five base first
moves and four radial first moves, hence

```text
5*12 + 4*10 = 100
```

declared seven-face histories. This independently matches the runner.

Each full-side attachment identifies seven Pascal nodes of a fresh 28-node
face, so every history has

```text
112 + 2*(28-7) = 154
```

nodes. Equal cardinality is therefore a design invariant, not evidence of
confluence.

## Explicit nonisomorphism witness

The result supplies histories `H011` and `H008`.

Both have:

- seven faces;
- nine coarse boundary edges;
- 154 Pascal nodes;
- one connected component;
- the same Pascal weight multiset and seam-class-size multiset.

They differ in two independently checkable typed invariants:

1. `H011` has one cyclic `radial -> radial` boundary transition, whereas
   `H008` has none;
2. the expanded directed Pascal quotients contain respectively `258` and
   `264` distinct directed edges.

An isomorphism preserving the oriented boundary profiles and directed Pascal
adjacency cannot identify these states. The separate `audit_witness.py`
verifies this certificate without importing or rerunning the scientific
runner.

## Interpretation

The primary hypothesis of one terminal typed class is rejected for the
declared `f=5 -> 7` history class. The terminal states split into `56` exact
typed classes with class sizes from one to four histories.

The justified result is:

```text
PATH_DEPENDENT_WITH_WITNESS
```

This is a bounded negative confluence result and a positive detection of
history-sensitive boundary structure. It does not establish that every
possible Pascal-face growth grammar is path dependent.

## Audit limitation

The post-result witness audit independently verifies the decisive
nonisomorphism certificate. It does not independently reimplement the full
100-history enumeration or the exact count of 56 terminal classes. Those
counts have `R2_LOCAL_REPLAY`, not independent replication status.
