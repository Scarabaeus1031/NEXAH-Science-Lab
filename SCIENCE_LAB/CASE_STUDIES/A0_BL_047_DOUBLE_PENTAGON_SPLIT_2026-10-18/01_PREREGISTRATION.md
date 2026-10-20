# A0-BL-047 — Frozen preregistration

Date: `2026-10-18`  
Status: `DESIGN_FROZEN / ADMITTED / ACTIVE_PENDING_LOCK`

## Typed carrier and extension

The shared `4+1` carrier is the labelled cycle

```text
K = z0 — z1 — z2 — z3 — s — z0
```

where `z0..z3` are four differentiated zones and `s` is one seam/binder. The
labels express role and provenance; they do not make `s` a universal centre.

A valid `5+1` hexagonal extension does not merely append a sixth node. For one
selected carrier edge `e={u,v}`, branch `X` replaces `e` by
`{u,x_X},{x_X,v}`. This edge subdivision has six vertices, six edges and exact
degree two at every vertex. Contracting `x_X` returns `K` exactly.

The test enumerates all five selectors independently for typed branches `A`
and `B`, and all twenty ordered pairs with distinct selected edges. No visual
edge or orientation is privileged.

## Frozen gates

1. `G1 SOURCE`: exact source hashes agree.
2. `G2 BASE`: `K` is connected C5 with roles `4+1` and no collapsed labels.
3. `G3 EXTENSION`: all ten branch/edge variants are connected C6 graphs.
4. `G4 RETURN`: contraction of the added degree-two node returns labelled `K`
   exactly for every variant.
5. `G5 PAIR`: all twenty distinct-edge pairs share exactly five base vertices
   and three unchanged base edges; each union has seven vertices and nine
   edges and stays connected.
6. `G6 CORRESPONDENCE`: every abstract C6 pair has twelve isomorphisms. The
   shared D5 carrier narrows an undirected selected-edge match to two maps, but
   only an independently supplied edge orientation reduces it to one.
7. `G7 CONTROLS`: isolated append, leaf append and triangle/chord append do not
   produce a C6.
8. `G8 INFORMATION`: forgetting branch and edge selector creates one ten-item
   fibre over `K`; exact Return requires the typed `(branch,edge)` residual.

The positive class requires all eight gates. It establishes a typed finite
extension family and exact contraction Return while retaining the
noncanonical cross-map. It does not authorize choosing one historical pair.

## STOP and claim ceiling

Stop after one Primary and one Replay. Do not search visual alignments, fit a
preferred edge, add geometry, import hub dynamics or call two views two
carriers without distinct typed nodes and selectors.

No Pascal-coefficient intertwiner, physical pyramid, resonance, universal
`4+1`/`5+1` law, historical encoding, novelty, utility or publication follows.

