# A0 X20 Dodeca Gate Comparator — Engineering Result

Date: `2026-10-15`  
Authority: `OWNER_AUTHORIZED_A0_ENGINEERING_DERIVATION`  
Identity: reuses `A0-BL-023`, `SCC-003` and the existing D/E dodecahedral carrier vocabulary  
Lab status: `NOT_A_LAB_RUN / NO_STUDY_ACTIVATION`  
Navigator status: `NO_NEW_IDENTITY / NO_CANONICAL_X20_CHANGE`  
Publication: `NOT_AUTHORIZED`

## Question

What follows if the proposed `D1..D12` and `E1..E12` carriers are made
explicit as two dodecahedral face sets, four of five corresponding Pentagon
positions are identified, and each of the five possible open positions is
tested independently?

The construction is evaluated both as:

1. a finite `24 -> 20` seam-and-Return candidate; and
2. a graph comparator against the already frozen twenty-node Q106 interface.

It is not treated as a recovery of the historical `X20=C5 x P4` adjacency.

## Declared construction

Each dodecahedral face carrier is represented by its face-adjacency graph,
which is the icosahedral graph:

```text
12 vertices · 30 edges · degree 5 at every vertex.
```

The numbered address convention is:

```text
D1 / E1       north pole
D2..D6        upper pentagonal ring
D7..D11       lower pentagonal ring
D12 / E12     south pole
```

The five candidate gates are the paired upper-ring addresses
`D2/E2` through `D6/E6`. For gate `g`, that pair remains separate and the
other four corresponding D/E pairs are identified.

## Execution

```bash
node A0_BOOK/a0-x20-dodeca-gate-comparator-tests.cjs --write
```

Result:

```text
PASS_NEGATIVE_Q106_MATCH_ALL_GATES_TIED
11 PASS / 0 FAIL
5 gate candidates / 0 Q106 matches
```

Two independent executions were byte-identical to the written machine result:

```text
SHA-256  20ff5e87cbe4568b02fd9fe8a4087c151fee3d595f6ef2c8a11c9de6d8c1e38e
```

Runner: `A0_BOOK/a0-x20-dodeca-gate-comparator-tests.cjs`  
Machine result:
`A0_BOOK/results/a0-x20-dodeca-gate-comparator-result-2026-10-15.json`

## Result A — the quotient is exact

Every candidate produces the same fibre profile:

```text
24 source addresses
16 singleton quotient classes
4 two-address D/E quotient classes
20 quotient vertices total.
```

The four glued classes require one conditional D/E residual bit for exact
Return. The sixteen singleton classes require no residual bit. This is an
explicit, minimal and useful zipper/Return interpretation of the four seams.

## Result B — the five gates are tied

All five choices have the identical simple-graph signature:

```text
vertices       20
edges          57
degree profile 5^16, 8^2, 9^2
doubled seams  3 edges of multiplicity 2 before simplification
fibre profile  1^16, 2^4
```

Declared C5 rotations provide explicit graph isomorphisms from every choice to
every other choice. Marking one gate leaves only the identity and one
reflection as its D5 stabilizer. Neither the quotient cardinality, the
dodecahedral adjacency nor `LRRL` selects a preferred opening.

`LRRL` returns at all five openings:

```text
g -> g-1 -> g -> g+1 -> g  (mod 5).
```

It is therefore a valid local Return word, not a gate-selection law.

## Result C — the natural geometric graph is not Q106

The frozen Q106 target interface has:

```text
20 vertices
20 edges
degree profile 1^5, 2^10, 3^5.
```

The new geometric comparator has twenty vertices but 57 edges and degree
profile `5^16,8^2,9^2`. Edge count and degree sequence alone reject graph
isomorphism for all five gates. No enumeration of the previously known 24
D5-equivariant charts is needed.

The simple quotient is also necessarily non-planar because
`57 > 3*20-6 = 54`. This does not invalidate it as an abstract adjacency
graph, but it rules out reading the quotient itself as a planar surface graph.

## Interpretation

The two requested operations are now separated cleanly:

- **Construction succeeds:** two twelve-address dodecahedral face carriers,
  four typed seams and one open pair give a fully explicit twenty-class
  quotient with an exact conditional Return payload.
- **Selection fails:** all five open gates are symmetry-equivalent.
- **Q106 comparison is negative:** full dodecahedral face adjacency is not the
  sparse Q106 interface.

This is useful rather than disappointing. It says that a future X20/Q106
bridge cannot consist merely of gluing complete dodecahedral face-adjacency
graphs. It requires an independently motivated **sparse edge-selection
operator** over the twenty quotient classes.

## Next bounded test

Freeze a source-derived sparse rule before consulting Q106. The rule must:

1. act on the twenty quotient classes defined here;
2. preserve edge types and the four conditional D/E Return bits;
3. break or explain the five-way gate tie without choosing by target fit;
4. produce its own edge list before Q106 comparison;
5. then be tested against the target's `20` edges and `1^5,2^10,3^5` degree
   profile.

Until that rule exists, this object remains an A0 dodecahedral seam comparator,
not canonical X20, not an admitted Q106 intertwiner and not evidence for a
physical, Riemann, Ihara or resonance model.
