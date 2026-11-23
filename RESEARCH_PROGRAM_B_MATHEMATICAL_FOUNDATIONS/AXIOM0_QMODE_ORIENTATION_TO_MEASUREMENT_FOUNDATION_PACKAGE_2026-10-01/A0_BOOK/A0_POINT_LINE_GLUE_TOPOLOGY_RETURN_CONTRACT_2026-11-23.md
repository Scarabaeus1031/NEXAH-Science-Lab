# A0 Point–Line–Glue–Topology–Return Contract

**Status:** source-bound formal/engineering view
**Existing identity:** `ART:A0:MATHEMATICAL_JOINTS`
**Host:** `A0_BOUNDARY_GRAPH_DEMONSTRATOR.html#point-line-glue-topology-return`
**Date:** 2026-11-23

## Typed route

```text
DOT → COLON → LINE → SURFACE → GLUE → TOPOLOGY → LOCAL RETURN
```

The route is a construction and reading view, not a chain of topological isomorphisms.

| Stage | Contract |
| --- | --- |
| `DOT` | `SOURCE_POINT`; not `DECIMAL_POINT` or `PRODUCT_DOT` |
| `COLON` | `OPEN_TYPED_JOINT / NO GLUING SELECTED`; not division, ratio, equality or topology |
| `LINE` | interval with two endpoints |
| `SURFACE` | strip/chart carrier with explicit boundary |
| `GLUE` | selected edge-pairing contract |
| `TOPOLOGY` | global surface record; quotient only when a pairing is selected; boundary count and orientability retained |
| `RETURN` | interior chart `φ:U⊂S→V⊂ℝ²`, or boundary chart into the closed half-plane `ℍ²`; global surface witness retained |

## Surface contracts

| Mode | Pairing | Boundary | Orientable |
| --- | --- | ---: | --- |
| Open strip | none | 1 | yes |
| Torus | `(0,t)~(1,t)` and `(s,0)~(s,1)` | 0 | yes |
| Möbius | `(0,t)~(1,1−t)`; the remaining edge pair forms one boundary | 1 | no |
| Klein | `(0,t)~(1,1−t)` and `(s,0)~(s,1)` | 0 | no |

## Claim boundary

- `:` is local NEXAH interface notation. It is not introduced as standard topology notation.
- A quotient topology appears only after an explicit pairing has been selected; `OPEN` retains the unpaired strip as the control surface.
- The unpaired rectangle/strip has one connected boundary component. It is not the older open-cylinder carrier `S¹×[0,1]`, which already contains a periodic identification and has two boundary components.
- The local Euclidean return does not globally flatten the surface and does not erase its glue, orientability or boundary record.
- The route does not assert that every topology is generated from a point in a theorem-level sense.
- The route supplies no Riemann-hypothesis proof, no physical topology and no new canonical identity or graph relation.

## Primecube address and dot-role binding

The existing Number View Suite port supplies the retained source fixture

```text
661 ↔ [0,5,5] ↔ PC1111:N0661.
```

`POINT` reads that held record as an addressed source point. It does not merge the Primecube roles `CENTER_DOT`, `DECIMAL_POINT` and `PRODUCT_DOT`: those remain, respectively, a selected grid cell, a declared scale change and multiplication. `SOURCE_POINT` is a fourth typed view role, not a new numerical operator.

## B1–B6 companion ledger

```text
B1 TORUS · B2 MÖBIUS · B3 SEAM · B4 KLEIN · B5 ROOT SPACE · B6 LOCAL RETURN
```

This is a typed comparison and return ledger, not a transformation chain.

| Station | Type | Contract |
| --- | --- | --- |
| `B1` | global surface | torus, `∂=0`, orientable |
| `B2` | global surface | Möbius strip, `∂=1`, non-orientable |
| `B3` | interface | cut/glue seam; no surface identity of its own |
| `B4` | global surface | Klein bottle, `∂=0`, non-orientable; readable as two Möbius bands glued along their boundary circles |
| `B5` | discrete graph witness | existing `Q3→Q4`, `8→16` Root Space; not a surface, manifold, Root Ruler or Root Shrinking metric |
| `B6` | chart return | local interior/half-plane calculation while retaining the selected global surface and source-record witness |

The Root Ruler metric `Δk=√(k+1)−√k`, the Q3/Q4 Root Space graph and the Primecube Critical-Line winding gate remain three different objects. B1–B6 connects their reading and return boundaries; it does not identify them or claim that Root Space generates surface topology.

## Verification

Run:

```sh
node a0-point-line-topology-return-tests.cjs
```

Expected model result: `PASS_TYPED_POINT_LINE_GLUE_TOPOLOGY_RETURN`.
