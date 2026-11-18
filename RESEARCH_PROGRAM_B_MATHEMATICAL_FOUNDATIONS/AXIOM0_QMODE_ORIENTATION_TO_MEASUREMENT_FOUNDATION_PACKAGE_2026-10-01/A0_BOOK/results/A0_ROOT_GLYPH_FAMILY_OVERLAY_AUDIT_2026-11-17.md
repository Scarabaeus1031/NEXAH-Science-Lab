# A0 Root-Glyph / Family overlay audit

Date: 2026-11-17
Disposition: source audit and bounded overlay contract; no new identity or relation

## Short answer

The seven-root substrate is already in A0. It was not removed:

- four positive scalar roots: `√2`, `√3`, `√5`, `√7`;
- three declared principal quaternion roots: `√i`, `√j`, `√k`;
- all `C(7,2)=21` pairwise links are already generated and typed as six
  macro, three micro and twelve cross-domain comparisons.

The requested compass placement is not yet the source contract. It is a new
display layout over the existing seven nodes:

| display direction | existing node | status |
|---|---|---|
| north | `ROOT_3 / √3` | existing node; new compass position |
| south | `ROOT_7 / √7` | existing node; new compass position |
| west | `ROOT_5 / √5` | existing node; new compass position |
| east | `ROOT_2 / √2` | existing node; new compass position |
| inner ring | `ROOT_I`, `ROOT_J`, `ROOT_K` | existing typed quaternion roots |

Therefore “Root 7 unten” is not taken away from A0. Root 7 remains present in
the Root7/Q4 instrument, the positive-root family and the seven-root mycelium.
Only the south-cardinal placement is new.

## Existing source contracts

### Seven-root mycelium

Canonical implementation surface:

- `A0_SPIN_TO_BLOOM_MEASUREMENT.html#rootRatioMycelium`
- `a0-spin-to-bloom-measurement.js`
- `a0-spin-to-bloom-measurement-ui.js`

The current model already enforces the important type boundary:

- macro–macro: scalar-root ratio;
- micro–micro: quaternion-axis comparator;
- macro–micro: norm comparison only;
- only macro links may be sent through the declared radicand-to-carrier
  adapter;
- micro and cross-domain links fail closed for scalar-carrier connection.

The present circular renderer distributes all seven nodes uniformly by array
index. It does **not** encode the requested north/south/east/west compass.

### Root7/Q4

The Root7 coupling remains independently present in the Orientation Bench.
Its existing bit assignment is
`b0→√2/x`, `b1→√3/y`, `b2→√5/z`, `b3→√7/w`.
This is a four-channel address contract, not the proposed compass layout.

### Exact `2+3=5` scalar identity

A0 already records
`(√2)² + (√3)² = (√5)²` as an exact scalar identity while explicitly
rejecting an automatic Root→Graph coupling. This can support a visible
`√2–√3–√5` right-triangle guide, but not a new physical or topological claim.

### `4+3`

Two separate `4+3` readings exist and must not be merged:

1. the root view has four macro plus three micro nodes;
2. the method paper has the prime grouping `2,3,5,7 | 11,13,17`.

The method paper explicitly says that the prime group is not automatically the
seven Families and that the proposed `4:3:1:1` rhythm has no specified time
law. The root view likewise has no derived `4:3` timing law.

## Root pentagon disposition

No existing A0 source contract was found for a pentagon whose defining
incidence is “`√3` plus `√k`, with a `√5` triangle add-on.” The ingredients
exist, but the proposed assembly remains an overlay candidate:

- `√3` and `√5` are positive scalar roots;
- `√k` is a declared principal quaternion root with unit norm;
- a `√3↔√k` edge is therefore a cross-domain **norm comparator**, not scalar
  division or a pentagon side identity;
- the `√2–√3–√5` triangle is exact as scalar arithmetic;
- a pentagon requires an explicit vertex order, edge set, metric and Return
  rule before it can be tested as geometry.

Recommended drawing convention: solid green for scalar identities, purple for
quaternion nodes, pale/dashed for typed cross-domain comparators, and no filled
pentagonal face until its incidence and metric are declared.

## F-family overlay

There is no canonical `F0` Family in the A0 Family model. `F1–F7` are
functional apertures, not seven root labels. Occurrences such as `F0` in
addresses or animation frames are local view states and must not be promoted
to a Family.

| Family | canonical aperture | role on the proposed root overlay |
|---|---|---|
| F1 | Observation / Record | render the held root record and glyph positions |
| F2 | Address / Boundary | declare compass directions, rings and permitted domains |
| F3 | Transition / Operator | HOLD until a root-to-root operation is declared |
| F4 | Phase / Drift | HOLD unless rotation, winding or phase is made explicit |
| F5 | Connectivity / Topology | show the existing 21 typed links and selected subgraphs |
| F6 | Synchronization / Control | filter macro/micro/cross views; do not invent coupling |
| F7 | Validation / Governance | expose type checks, negative controls and claim ceiling |

This is an aperture overlay over one existing record. It is not a bijection
`ROOT_n ↔ F_n` and not a new Family taxonomy.

## Recommended viewer layers

1. `ROOT RECORD` — the existing seven nodes and their source types.
2. `COMPASS VIEW` — `√3 N`, `√7 S`, `√5 W`, `√2 E`; display-only.
3. `INNER QUATERNION` — `√i`, `√j`, `√k` on the inner ring.
4. `TYPED LINKS` — existing macro, micro and cross-domain edges, filterable.
5. `SCALAR TRIANGLE` — optional exact `√2–√3–√5` guide.
6. `PENTAGON CANDIDATE` — OFF/HOLD until incidence and metric are supplied.
7. `F1–F7 APERTURES` — an audit/readout layer, not a root relabeling.

## Authority and graph effect

- identity reuse: `ART:A0:MATHEMATICAL_JOINTS`,
  `MOD:ORIENTATION_DEMONSTRATORS`;
- new canonical IDs: none;
- relation changes: none;
- source graph effect: none, because this audit only matches existing source
  contracts and specifies a non-authoritative view overlay;
- study activation, finding promotion and publication authorization: none.
