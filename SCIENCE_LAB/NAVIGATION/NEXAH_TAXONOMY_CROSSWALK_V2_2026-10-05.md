# NEXAH Taxonomy Crosswalk v2

Date: `2026-10-05`

Status: `ROUTING_BASELINE / NAMESPACED / NON-IDENTITY-PRESERVING`

## 1. Decision

The October Connection Families and the September HTML-Lab shelves are two
different coordinate systems. Their repeated `F1`, `F2`, … labels are not
shared identifiers and must never be joined without a namespace.

```text
CF:*   relation families used by the Family Connection Map v2
HL:*   functional shelves used by the historical HTML-Lab router
3D:*   frozen historical 3D constellations
SUBJ:* reader-oriented subject entrances
MOD:*  stable module-family identifiers
ART:*  physical artifacts or custody objects
```

The crosswalk below is a navigation aid. It is not a mathematical
equivalence, a mechanism identity or a promotion of evidence.

## 2. Canonical Connection Families (`CF`)

| ID | Primary display name | Question answered |
|---|---|---|
| `CF:F1` | Observation / Record | What was observed, selected and recorded? |
| `CF:F2` | Address / Boundary | Where is the item, cut or interface declared? |
| `CF:F3` | Transition / Operator | What typed action changes or transports state? |
| `CF:F4` | Phase / Drift | What changes with phase, delay, rhythm or time? |
| `CF:F5` | Connectivity / Topology | Which adjacency, orbit, seam or return path is preserved? |
| `CF:F6` | Synchronization / Control | Which clocks, controls or comparison frames are coordinated? |
| `CF:F7` | Validation / Governance | Which record, replay, residual and claim ceiling limits the result? |

`CF` is the relation layer used for cross-module links. It is not the shelf
structure of the catalog.

## 3. Historical HTML-Lab shelves (`HL`)

| ID | Shelf name | Catalog function |
|---|---|---|
| `HL:F1` | Observation / Selection / Cut / Record / Return | measurement and comparison instruments |
| `HL:F2` | Projection / Shadow / Mask / Visibility | observer-relative and inside/outside views |
| `HL:F3` | Carrier / Address / Grid / CRT | persistent-address and carrier structures |
| `HL:F4` | Frame / Tessarec / Root Space / Green Bridge | frame binding and higher-dimensional carriers |
| `HL:F5` | Time / Phase / Rhythm / Five-H | phase and timing instruments |
| `HL:F6` | Number / Prime / Euler / Fibonacci / Mirror | discrete and arithmetic test surfaces |
| `HL:F7` | Runtime / Receipts / Comparison Infrastructure | shared execution and validation infrastructure |
| `HL:F8` | Human Instruments / Games / Cultural Orientation | explanatory and experiential entrances |

`HL` is retained for provenance and functional browsing. It is not the
canonical relation vocabulary for new links.

## 4. Directed routing crosswalk

| HTML shelf | Primary `CF` routes | Supporting `CF` routes | Boundary |
|---|---|---|---|
| `HL:F1` Observation / Cut / Return | `CF:F1` Observation / Record | `CF:F2` Address / Boundary; `CF:F7` Validation / Governance | A cut or return is not automatically a boundary theorem or validation result. |
| `HL:F2` Projection / Shadow / Visibility | `CF:F1` Observation / Record; `CF:F5` Connectivity / Topology | `CF:F2` Address / Boundary; `CF:F7` Validation / Governance | A second view is not a second object, and visual complementarity is not mechanism identity. |
| `HL:F3` Carrier / Address / Grid / CRT | `CF:F2` Address / Boundary | `CF:F1` Observation / Record; `CF:F7` Validation / Governance | Address persistence does not by itself prove physical persistence. |
| `HL:F4` Frame / Tessarec / Root Space | `CF:F2` Address / Boundary; `CF:F5` Connectivity / Topology | `CF:F1` Observation / Record; `CF:F7` Validation / Governance | A 4D or sign-state carrier is a representation unless an owning record establishes more. |
| `HL:F5` Time / Phase / Rhythm / Five-H | `CF:F4` Phase / Drift | `CF:F1` Observation / Record; `CF:F6` Synchronization / Control; `CF:F7` Validation / Governance | Shared timing vocabulary does not imply synchronized mechanism. |
| `HL:F6` Number / Prime / Euler / Mirror | `CF:F2` Address / Boundary; `CF:F3` Transition / Operator | `CF:F5` Connectivity / Topology; `CF:F7` Validation / Governance | Numerical resemblance is not operator equivalence; exact tests stay attached to their contracts. |
| `HL:F7` Runtime / Receipts / Comparison | `CF:F3` Transition / Operator; `CF:F6` Synchronization / Control; `CF:F7` Validation / Governance | `CF:F1` Observation / Record | Infrastructure can transport evidence but does not create scientific evidence. |
| `HL:F8` Human Instruments / Games | context-dependent; normally begins at `CF:F1` | any named family declared by the owning module | This is a Human entrance, not a scientific classification. |

The mapping is deliberately many-to-many. Interfaces should display the
family name first and the namespaced code second.

## 5. Frequently confused terms

### Inside / Outside

Inside/outside belongs primarily to the historical visibility shelf
`HL:F2`. In the Connection Map it normally routes through:

```text
CF:F1 Observation / Record
  -> CF:F2 Address / Boundary
  -> CF:F7 Validation / Governance
```

It is therefore not identical to `CF:F2`; it is an observer-relative view
whose boundary and record must be declared.

### Tessarec / LOKI / MIWA

```text
MOD:OBSERVATORY_MIWA
  contains view: LOKI / Green Bridge
  bridges to: MOD:TESSAREC

MOD:TESSAREC
  contains carrier: Root Space 8 -> 16
  contains observer surface: Q-degree x iota / Pearl
```

LOKI is initially a registered subview, not a standalone master module. MIWA
and Tessarec overlap through frame binding and sign-state projection, but they
remain distinct modules with distinct current surfaces and records.

### F5

```text
HL:F5 = Time / Phase / Rhythm / Five-H
CF:F5 = Connectivity / Topology
```

These are unrelated identifiers. A Five-H module normally maps first to
`CF:F4`, not `CF:F5`.

### F7

```text
HL:F7 = runtime and comparison infrastructure
CF:F7 = validation and governance relation
```

They often meet, but infrastructure is not governance and a receipt is not a
claim decision.

## 6. 3D constellation boundary

`3D:C-01` through `3D:C-12` remain frozen archive entrances. They may be
linked to a `MOD:*` record only when custody locator, viewer, evidence class
and semantic ceiling are explicit. A name match alone is insufficient.

## 7. UI and data rules

1. Store full namespaced IDs; never persist a bare `F2` or `F5`.
2. Show a human-readable name before the code.
3. Keep shelf membership (`HL`) separate from module relations (`CF`).
4. Model LOKI and similar views as subviews unless they have an independent
   owning record and current master.
5. Mark bridge relations as `method`, `open` or `non-identity` unless an exact
   or empirical record supports a stronger type.
6. A route may aid discovery without changing evidence status.
7. The Family Connection Map remains seven families; navigation shelves stay
   an independent eight-shelf catalog layer.

## 8. Consequence for the Master Navigator

The Master Navigator should filter by both layers:

- **What kind of page is this?** -> `HL` shelf and surface role;
- **How is it connected?** -> `CF` relation family;
- **What project owns it?** -> `MOD` module family;
- **What is frozen history?** -> `3D` constellation or `ART` custody record.

This separation closes the naming collision without discarding either the
older catalog work or the newer connection architecture.
